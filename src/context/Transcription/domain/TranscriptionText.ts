import { StringValueObject } from '../../Shared/domain/value-object/StringValueObject'
import { InvalidArgumentError } from '../../Shared/domain/value-object/InvalidArgumentError'

export class TranscriptionText extends StringValueObject {
  constructor (value: string) {
    super(value)
    this.ensureIsValid(value)
  }

  private ensureIsValid (value: string): void {
    if (value.length > 50000) {
      throw new InvalidArgumentError('Transcription text cannot exceed 50,000 characters')
    }
  }

  getWordCount (): number {
    if (this.value.trim() === '') return 0
    return this.value.trim().split(/\s+/).length
  }

  getPreview (maxLength: number = 150): string {
    if (this.value.length <= maxLength) {
      return this.value
    }
    return this.value.substring(0, maxLength) + '...'
  }
}
