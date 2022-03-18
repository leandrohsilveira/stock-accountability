import { generateUniqueUUID } from './uuid'

type Entity = {
  id?: string
}

export function findBy<T, K extends keyof T>(
  collection: T[],
  field: K,
  key: T[K]
) {
  return collection.find((item) => item[field] === key)
}

export function findById<T extends Entity>(id: string, collection: T[]): T {
  return findBy(collection, 'id', id)
}

export function create<T extends Entity, D extends Omit<T, 'id'>>(
  data: D,
  collection: T[],
  validator?: () => string | undefined
) {
  validate(validator)
  return [
    ...collection,
    {
      id: generateUniqueUUID(collection, 'id'),
      ...data,
    },
  ]
}

export function update<T extends Entity, D extends Omit<T, 'id'>>(
  id: string,
  data: D,
  collection: T[],
  validator?: () => string | undefined
) {
  const index = collection.findIndex((e) => e.id === id)
  if (index >= 0) {
    validate(validator)
    const result = [...collection]
    result[index] = {
      ...result[index],
      ...data,
      id,
    }
    return result
  }
  throw new Error(`Registro com id "${id}" não encontrado`)
}

export function unique<T extends Entity>(
  data: T,
  collection: T[],
  field: keyof T,
  message: string
) {
  return () => {
    if (
      collection.some(
        (item) =>
          item.id !== data.id && data[field] && item[field] === data[field]
      )
    ) {
      return message
    }
  }
}

function validate(validator?: () => string) {
  if (validator) {
    const result = validator()
    if (result) throw new Error(result)
  }
}
