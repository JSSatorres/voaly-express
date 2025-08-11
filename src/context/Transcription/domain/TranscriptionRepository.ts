import { Transcription } from './Transcription'
import { TranscriptionId } from './TranscriptionId'

export interface TranscriptionRepository {
  save: (transcription: Transcription) => Promise<void>
  download: (id: TranscriptionId) => Promise<Transcription | null>
  searchAll: (trasncriptionUserId: string) => Promise<Transcription[]>
  delete: (id: string) => Promise<void>
}
