import { injectable } from 'tsyringe'
import { AudioMetadataService } from '../../domain/AudioMetadataService'

@injectable()
export class BasicAudioMetadataService implements AudioMetadataService {
  async extractMetadata (filename: string, fileContent: Buffer): Promise<{ duration: string, fileSize: string }> {
    const fileSizeInBytes = fileContent.length
    const fileSize = this.formatFileSize(fileSizeInBytes)

    const duration = this.estimateDuration(fileSizeInBytes, filename)

    return {
      duration,
      fileSize
    }
  }

  private formatFileSize (bytes: number): string {
    if (bytes === 0) return '0 B'

    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    const size = (bytes / Math.pow(k, i)).toFixed(1)

    return `${size} ${sizes[i]}`
  }

  private estimateDuration (fileSizeInBytes: number, filename: string): string {
    const ext = filename.toLowerCase().split('.').pop()

    let bitrate = 128
    switch (ext) {
      case 'mp3': bitrate = 128; break
      case 'wav': bitrate = 1411; break
      case 'm4a': bitrate = 128; break
      case 'mp4': bitrate = 128; break
    }

    const fileSizeInBits = fileSizeInBytes * 8
    const bitrateInBitsPerSecond = bitrate * 1000
    const durationInSeconds = Math.floor(fileSizeInBits / bitrateInBitsPerSecond)

    return this.formatDuration(durationInSeconds)
  }

  private formatDuration (totalSeconds: number): string {
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    } else {
      return `${minutes}:${seconds.toString().padStart(2, '0')}`
    }
  }
}
