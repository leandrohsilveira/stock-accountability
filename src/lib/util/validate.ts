import { toDate } from './date'

type Input = string | number | Date | undefined

type Validator = (value: Input) => boolean

export type Error = {
  key: string
  message: string
}

export type ValidationFn = (value: Input) => Error[]

export type ValidationConfig = {
  error: Error
}

function validate(
  config: ValidationConfig,
  validator: Validator
): ValidationFn {
  return (value) => {
    if (!validator(value)) return [config.error]
    return []
  }
}

function isNumber(value: Input): value is number {
  return isNotNull(value) && typeof value === 'number' && !Number.isNaN(value)
}

function isNotNull(value: unknown) {
  return value !== null && value !== undefined && value !== ''
}

function optional(validator: Validator): Validator {
  return (value) => !isNotNull(value) || validator(value)
}

export function required(message = 'Campo obrigatório') {
  return validate({ error: { key: 'required', message } }, isNotNull)
}

export function min(
  minValue: number,
  message = `O valor deve ser maior ou igual a ${minValue}`
) {
  return validate(
    { error: { key: 'min', message } },
    optional((value) => isNumber(value) && value >= minValue)
  )
}

export function all(...validators: ValidationFn[]): ValidationFn {
  return (value) =>
    validators.reduce(
      (acc, validator) => [...acc, ...validator(value)],
      [] as Error[]
    )
}

export function fixedYear(
  year: number,
  message = `O ano preenchido deve ser igual a ${year}`
): ValidationFn {
  return validate(
    { error: { key: 'fixedYear', message } },
    optional((value) => toDate(value).getFullYear() === year)
  )
}

export function isValid<T>(...errors: T[][]) {
  return !errors.some((err) => err.length)
}

export function messages(errors: Error[]): string[] {
  return errors.map((error) => error.message)
}
