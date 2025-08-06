export interface FileUploadService {
  upload: (fileName: string, fileContent: Buffer) => Promise<string>
  delete: (s3Key: string) => Promise<void>
  getDownloadUrl: (s3Key: string, expiresIn?: number) => Promise<string>
}
