import { StringValueObject } from '../../Shared/domain/value-object/StringValueObject'
import { InvalidArgumentError } from '../../Shared/domain/value-object/InvalidArgumentError'

export class TranscriptionFileSize extends StringValueObject {
  constructor (value: string) {
    super(value)
    this.ensureIsValid(value)
  }

  private ensureIsValid (value: string): void {
    const fileSizeRegex = /^\d+(\.\d+)?\s+(KB|MB|GB)$/

    if (!fileSizeRegex.test(value)) {
      throw new InvalidArgumentError('File size must be in format "12.5 MB", "1.2 GB", etc.')
    }

    const sizeInBytes = this.calculateBytes(value)
    const maxSizeInBytes = 20 * 1024 * 1024 // 20MB

    if (sizeInBytes > maxSizeInBytes) {
      throw new InvalidArgumentError('File size cannot exceed 20 MB')
    }
  }

  private calculateBytes (value: string): number {
    const match = value.match(/^(\d+(?:\.\d+)?)\s+(KB|MB|GB)$/)
    if (match === null) return 0

    const size = parseFloat(match[1])
    const unit = match[2]

    switch (unit) {
      case 'KB':
        return size * 1024
      case 'MB':
        return size * 1024 * 1024
      case 'GB':
        return size * 1024 * 1024 * 1024
      default:
        return 0
    }
  }

  toBytes (): number {
    return this.calculateBytes(this.value)
  }
}
