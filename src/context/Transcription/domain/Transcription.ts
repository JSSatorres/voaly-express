import { AggregateRoot } from '../../Shared/domain/AggregateRoot'
import { TranscriptionId } from './TranscriptionId'
import { TranscriptionFilename } from './TranscriptionFilename'
import { TranscriptionDuration } from './TranscriptionDuration'
import { TranscriptionFileSize } from './TranscriptionFileSize'
import { TranscriptionStatus } from './TranscriptionStatus'
import { TranscriptionText } from './TranscriptionText'
import { TranscriptionS3Key } from './TranscriptionS3Key'
import { TrasncriptionUserId } from './TrasncriptionUserId'

export class Transcription extends AggregateRoot {
  constructor (
    public readonly id: TranscriptionId,
    public readonly filename: TranscriptionFilename,
    public readonly duration: TranscriptionDuration,
    public readonly fileSize: TranscriptionFileSize,
    public readonly s3Key: TranscriptionS3Key,
    public readonly status: TranscriptionStatus,
    public readonly transcriptionText: TranscriptionText,
    public readonly trasncriptionUserId: TrasncriptionUserId,
    public readonly createdAt: Date
  ) {
    super()
  }

  static create (
    filename: TranscriptionFilename,
    duration: TranscriptionDuration,
    fileSize: TranscriptionFileSize,
    trasncriptionUserId: TrasncriptionUserId,
    s3Key: TranscriptionS3Key,
    transcriptionText: string = ''
  ): Transcription {
    const transcription = new Transcription(
      TranscriptionId.random(),
      filename,
      duration,
      fileSize,
      s3Key,
      TranscriptionStatus.pending(),
      new TranscriptionText(transcriptionText),
      trasncriptionUserId,
      new Date()
    )

    return transcription
  }

  toPrimitives (): any {
    return {
      id: this.id.value,
      filename: this.filename.value,
      duration: this.duration.value,
      fileSize: this.fileSize.value,
      s3Key: this.s3Key.value,
      status: this.status.value,
      transcriptionText: this.transcriptionText.value,
      createdAt: this.createdAt.toISOString()
    }
  }

  static fromPrimitives (plainData: {
    id: string
    filename: string
    duration: string
    fileSize: string
    s3Key: string
    status: string
    transcriptionText: string
    trasncriptionUserId: string
    createdAt: string
  }): Transcription {
    return new Transcription(
      new TranscriptionId(plainData.id),
      new TranscriptionFilename(plainData.filename),
      new TranscriptionDuration(plainData.duration),
      new TranscriptionFileSize(plainData.fileSize),
      new TranscriptionS3Key(plainData.s3Key),
      new TranscriptionStatus(plainData.status),
      new TranscriptionText(plainData.transcriptionText),
      new TrasncriptionUserId(plainData.trasncriptionUserId),
      new Date(plainData.createdAt)
    )
  }
}
