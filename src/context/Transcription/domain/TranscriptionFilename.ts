import { StringValueObject } from '../../Shared/domain/value-object/StringValueObject'
import { InvalidArgumentError } from '../../Shared/domain/value-object/InvalidArgumentError'

export class TranscriptionFilename extends StringValueObject {
  constructor (value: string) {
    super(value)
    this.ensureIsValid(value)
  }

  private ensureIsValid (value: string): void {
    if (value.length === 0) {
      throw new InvalidArgumentError('Filename cannot be empty')
    }

    const allowedExtensions = ['.mp3', '.wav', '.m4a', '.mp4']
    const hasValidExtension = allowedExtensions.some(ext =>
      value.toLowerCase().endsWith(ext)
    )

    if (!hasValidExtension) {
      throw new InvalidArgumentError(`Filename must have one of these extensions: ${allowedExtensions.join(', ')}`)
    }
  }
}
