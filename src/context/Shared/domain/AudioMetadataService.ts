export interface AudioMetadataService {
  extractMetadata: (filename: string, fileContent: Buffer) => Promise<{
    duration: string
    fileSize: string
  }>
}
