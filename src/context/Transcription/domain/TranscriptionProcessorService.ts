export interface TranscriptionProcessorService {
  transcribeRawAudio: (fileContent: Buffer, filename: string) => Promise<string>
}
