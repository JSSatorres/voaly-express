import { APIGatewayProxyEvent } from 'aws-lambda'
import { injectable } from 'tsyringe'
import * as parser from 'lambda-multipart-parser'
import { FileParserService } from '../../domain/FileParserService'

@injectable()
export class LambdaMultipartParser implements FileParserService {
  async parseFromEvent (event: APIGatewayProxyEvent): Promise<{
    filename: string
    fileContent: Buffer
    mimeType: string
  }> {
    try {
      const parsed = await parser.parse(event)
      console.log('Resultado del parseo:', parsed)
      const file = parsed.files?.[0]

      if (!file) {
        throw new Error('No file provided')
      }

      return {
        filename: file.filename ?? 'unknown',
        fileContent: file.content,
        mimeType: file.contentType ?? 'application/octet-stream'
      }
    } catch (error) {
      console.error('Error al parsear multipart:', error)
      throw new Error('No se pudo parsear el archivo multipart')
    }
  }

  async parseMultipart (): Promise<any> {
    throw new Error('parseMultipart not implemented. Use parseFromEvent instead.')
  }
}
