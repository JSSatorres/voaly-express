import { injectable, inject } from 'tsyringe'
import { Transcription } from '../domain/Transcription'
import { TranscriptionFilename } from '../domain/TranscriptionFilename'
import { TranscriptionDuration } from '../domain/TranscriptionDuration'
import { TranscriptionFileSize } from '../domain/TranscriptionFileSize'
import { TranscriptionS3Key } from '../domain/TranscriptionS3Key'
import { TranscriptionRepository } from '../domain/TranscriptionRepository'
import { TranscriptionCreatorRequest } from './TranscriptionCreatorRequest'
import { FileUploadService } from '../../Shared/domain/FileUploadService'
import { AudioMetadataService } from '../../Shared/domain/AudioMetadataService'
import { TrasncriptionUserId } from '../domain/TrasncriptionUserId'
import { TranscriptionProcessorService } from '../domain/TranscriptionProcessorService'

@injectable()
export class TranscriptionCreator {
  constructor (
    @inject('TranscriptionRepository') private readonly repository: TranscriptionRepository,
    @inject('FileUploadService') private readonly fileUploadService: FileUploadService,
    @inject('AudioMetadataService') private readonly audioMetadataService: AudioMetadataService,
    @inject('TranscriptionProcessorService') private readonly transcriptionService: TranscriptionProcessorService
  ) {}

  async run (request: TranscriptionCreatorRequest): Promise<string> {
    const { duration, fileSize } = await this.audioMetadataService.extractMetadata(
      request.filename,
      request.fileContent
    )
    const baseName = request.filename.replace(/\.[^/.]+$/, '')
    const transcriptFilename = `${baseName}.txt`

    const transcriptText = await this.transcriptionService.transcribeRawAudio(
      request.fileContent,
      request.filename
    )

    const textBuffer = Buffer.from(transcriptText, 'utf-8')
    const s3Key = await this.fileUploadService.upload(transcriptFilename, textBuffer)

    const transcription = Transcription.create(
      new TranscriptionFilename(request.filename),
      new TranscriptionDuration(duration),
      new TranscriptionFileSize(fileSize),
      new TrasncriptionUserId(request.trasncriptionUserId),
      new TranscriptionS3Key(s3Key),
      transcriptText
    )

    await this.repository.save(transcription)

    return transcription.id.value
  }
}
