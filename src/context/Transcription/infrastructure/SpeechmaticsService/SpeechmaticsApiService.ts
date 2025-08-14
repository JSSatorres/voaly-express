import { injectable } from 'tsyringe'
import { TranscriptionProcessorService } from '../../domain/TranscriptionProcessorService'
import { BatchClient } from '@speechmatics/batch-client'
import { openAsBlob } from 'node:fs'

@injectable()
export class SpeechmaticsService implements TranscriptionProcessorService {
  private readonly client: BatchClient

  constructor () {
    const apiKey = process.env.SPEECHMATICS_API_KEY ?? ''

    if (!apiKey) {
      throw new Error('SPEECHMATICS_API_KEY environment variable is required')
    }
    this.client = new BatchClient({ apiKey, appId: 'vocali-app' })
  }

  async transcribeRawAudio (fileContent: Buffer, filename: string): Promise<string> {
    const fs = await import('fs/promises')
    const tmp = await import('os')
    const path = await import('path')
    const tmpDir = tmp.tmpdir()
    const tmpFile = path.join(tmpDir, `${Date.now()}-${filename}`)
    await fs.writeFile(tmpFile, fileContent)
    const blob = await openAsBlob(tmpFile)
    const file = new File([blob], filename)

    const response = await this.client.transcribe(
      file,
      {
        transcription_config: {
          language: 'es',
          diarization: 'speaker'
        }
      },
      'json-v2'
    )

    await fs.unlink(tmpFile)

    if (typeof response === 'string') {
      return response
    }

    if (

      response &&
      typeof response === 'object' &&
      Array.isArray((response as any).results)
    ) {
      const text = ((response as any).results as any[])
        .filter((r: any) => r.type === 'word')
        .map((r: any) => r.alternatives?.[0]?.content)
        .join(' ')

      console.log('[DEBUG] Extracted text:', text)
      return text !== '' ? text : ''
    }

    throw new Error('Unexpected response format from Speechmatics')
  }
}
