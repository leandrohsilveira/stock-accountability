import generateUUID from 'uuid-random'

export function generateUniqueUUID<T>(collection: T[], idField: keyof T) {
  let uuid: string
  do {
    uuid = generateUUID()
  } while (collection.some((item) => String(item[idField]) === uuid))
  return uuid
}
