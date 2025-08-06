import { InvalidArgumentError } from './InvalidArgumentError'

type Primitives = String | string | number | Boolean | boolean | Date

export abstract class ValueObject<T extends Primitives> {
  readonly value: T

  constructor (value: T) {
    this.value = value
    this.ensureValueIsDefined(value)
  }

  private ensureValueIsDefined (value: T): void {
    if (value === null || value === undefined) {
      throw new InvalidArgumentError('Value must be defined')
    }
  }

  equals (other: ValueObject<T>): boolean {
    return other.constructor.name === this.constructor.name && other.value === this.value
  }

  toString (): string {
    if (this.value instanceof Date) {
      return this.value.toISOString()
    }
    return String(this.value)
  }
}
