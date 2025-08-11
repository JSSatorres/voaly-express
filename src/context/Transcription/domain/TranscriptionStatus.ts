import { StringValueObject } from '../../Shared/domain/value-object/StringValueObject'
import { InvalidArgumentError } from '../../Shared/domain/value-object/InvalidArgumentError'

export class TranscriptionStatus extends StringValueObject {
  private static readonly VALID_STATUSES = ['pending', 'processing', 'completed', 'failed']

  constructor (value: string) {
    super(value)
    this.ensureIsValid(value)
  }

  private ensureIsValid (value: string): void {
    if (!TranscriptionStatus.VALID_STATUSES.includes(value)) {
      throw new InvalidArgumentError(
        `Status must be one of: ${TranscriptionStatus.VALID_STATUSES.join(', ')}`
      )
    }
  }

  static pending (): TranscriptionStatus {
    return new TranscriptionStatus('pending')
  }

  static processing (): TranscriptionStatus {
    return new TranscriptionStatus('processing')
  }

  static completed (): TranscriptionStatus {
    return new TranscriptionStatus('completed')
  }

  static failed (): TranscriptionStatus {
    return new TranscriptionStatus('failed')
  }

  isPending (): boolean {
    return this.value === 'pending'
  }

  isProcessing (): boolean {
    return this.value === 'processing'
  }

  isCompleted (): boolean {
    return this.value === 'completed'
  }

  isFailed (): boolean {
    return this.value === 'failed'
  }
}
