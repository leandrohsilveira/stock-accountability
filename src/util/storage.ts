import { format } from './string'
import { generateUniqueUUID } from './uuid'

type PersistentStorageConfig<T> = {
  beforePersist: (input: T[]) => T[]
  restoreParser: (input: T) => T
}

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

export function remove<T extends Entity>(id: string, collection: T[]) {
  const index = collection.findIndex((e) => e.id === id)
  if (index >= 0) {
    const result = [...collection]
    result.splice(index)
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

export class PersistentStorage<T, K extends Array<unknown> = []> {
  constructor(
    private keyTemplate: string,
    private config?: Partial<PersistentStorageConfig<T>>
  ) {}

  restore<R = T>(key: K): R[] {
    const raw: T[] = JSON.parse(
      window.localStorage.getItem(this.getKey(key)) ?? '[]'
    )
    return raw.map(this.restoreParser.bind(this))
  }

  persist(data: T[], key: K): T[] {
    window.localStorage.setItem(
      this.getKey(key),
      JSON.stringify(this.beforePersist(data))
    )
    return data
  }

  private getKey(key: K) {
    return format(this.keyTemplate, ...key)
  }

  private beforePersist(input: T[]) {
    return typeof this.config?.beforePersist === 'function'
      ? this.config.beforePersist(input)
      : input
  }

  private restoreParser(input: T) {
    return typeof this.config?.restoreParser === 'function'
      ? this.config.restoreParser(input)
      : input
  }
}
