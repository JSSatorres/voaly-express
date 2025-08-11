import { Uuid } from '../../Shared/domain/value-object/Uuid'

export class TranscriptionId {
  readonly value: string

  constructor (value: string) {
    this.value = value
  }

  static random (): TranscriptionId {
    return new TranscriptionId(Uuid.random().value)
  }
}
