import 'reflect-metadata'
import { container, DependencyContainer } from 'tsyringe'

import { TranscriptionRepository } from '../../../Transcription/domain/TranscriptionRepository'
import { DynamoDBTranscriptionRepository } from '../../../Transcription/infrastructure/persistence/DynamoDBTranscriptionRepository'
import { FileUploadService } from '../../domain/FileUploadService'
import { S3FileUploadService } from '../FileUpload/S3FileUploadService'
import { AudioMetadataService } from '../../domain/AudioMetadataService'
import { BasicAudioMetadataService } from '../AudioMetadata/BasicAudioMetadataService'
import { FileParserService } from '../../domain/FileParserService'
import { LambdaMultipartParser } from '../FileParser/LambdaMultipartParser'
import { TranscriptionProcessorService } from '@/context/Transcription/domain/TranscriptionProcessorService'
import { SpeechmaticsService } from '@/context/Transcription/infrastructure/SpeechmaticsService/SpeechmaticsApiService'
import { TranscriptionLister } from '@/context/Transcription/application/TranscriptionLister'
import { TranscriptionDeleter } from '@/context/Transcription/application/TranscriptionDeleter'
import { TranscriptionDownloader } from '@/context/Transcription/application/TranscriptionDownloader'

container.register<TranscriptionRepository>('TranscriptionRepository', {
  useClass: DynamoDBTranscriptionRepository
})

// TODO: delete
container.register<TranscriptionProcessorService>(
  'TranscriptionProcessorService',
  { useClass: SpeechmaticsService }
)

container.register<FileUploadService>('FileUploadService', {
  useClass: S3FileUploadService
})

container.register<AudioMetadataService>('AudioMetadataService', {
  useClass: BasicAudioMetadataService
})

container.register<FileParserService>('FileParserService', {
  useClass: LambdaMultipartParser
})

container.register<TranscriptionLister>('TranscriptionLister', { useClass: TranscriptionLister })

container.register<TranscriptionDeleter>('TranscriptionDeleter', { useClass: TranscriptionDeleter })

container.register<TranscriptionDownloader>('TranscriptionDownloader', { useClass: TranscriptionDownloader })

export const getDIContainer = (): DependencyContainer => {
  return container
}
