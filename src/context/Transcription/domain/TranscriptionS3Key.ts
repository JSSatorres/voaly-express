import { StringValueObject } from '../../Shared/domain/value-object/StringValueObject'
import { InvalidArgumentError } from '../../Shared/domain/value-object/InvalidArgumentError'

export class TranscriptionS3Key extends StringValueObject {
  constructor (value: string) {
    super(value)
    this.ensureIsValid(value)
  }

  private ensureIsValid (value: string): void {
    if (value.length === 0) {
      throw new InvalidArgumentError('S3 key cannot be empty')
    }

    if (value.includes('//') || value.startsWith('/')) {
      throw new InvalidArgumentError('S3 key cannot start with / or contain //')
    }
  }

  getFileExtension (): string {
    const lastDot = this.value.lastIndexOf('.')
    return lastDot !== -1 ? this.value.substring(lastDot) : ''
  }

  getFileName (): string {
    const lastSlash = this.value.lastIndexOf('/')
    return lastSlash !== -1 ? this.value.substring(lastSlash + 1) : this.value
  }
}
