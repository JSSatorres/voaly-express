import { APIGatewayProxyEvent } from 'aws-lambda'

export interface FileParserService {
  parseFromEvent: (event: APIGatewayProxyEvent) => Promise<{
    filename: string
    fileContent: Buffer
    mimeType: string
  }>
}
