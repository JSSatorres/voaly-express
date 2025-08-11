import { StringValueObject } from '../../Shared/domain/value-object/StringValueObject'
export class TrasncriptionUserId extends StringValueObject {
  constructor (value: string) {
    super(value)
    this.ensureIsValid(value)
  }

  private ensureIsValid (value: string): void {
    if (value.length === 0) {
      throw new Error('User ID cannot be empty')
    }
  }
}
