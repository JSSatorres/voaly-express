import { StringValueObject } from '../../Shared/domain/value-object/StringValueObject'
import { InvalidArgumentError } from '../../Shared/domain/value-object/InvalidArgumentError'

export class TranscriptionDuration extends StringValueObject {
  constructor (value: string) {
    super(value)
    this.ensureIsValid(value)
  }

  private ensureIsValid (value: string): void {
    // Format: MM:SS or HH:MM:SS
    const durationRegex = /^(\d{1,2}:)?[0-5]?\d:[0-5]\d$/

    if (!durationRegex.test(value)) {
      throw new InvalidArgumentError('Duration must be in format MM:SS or HH:MM:SS')
    }
  }

  toSeconds (): number {
    const parts = this.value.split(':').map(Number)

    if (parts.length === 2) {
      // MM:SS format
      return parts[0] * 60 + parts[1]
    } else if (parts.length === 3) {
      // HH:MM:SS format
      return parts[0] * 3600 + parts[1] * 60 + parts[2]
    }

    return 0
  }
}
