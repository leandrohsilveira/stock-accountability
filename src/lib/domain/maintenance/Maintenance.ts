import { browser } from '$app/env'
import { compareStrings, multiCompare } from '$lib/util/compare'

export interface StorageKey {
  key: string
  entity: string
  customerId?: string
  year?: number
}

export interface StorageKeyGroupCustomerYear {
  entities: StorageKey[]
  year: number
}

export interface StorageKeyGroupCustomer {
  entity: string
  customerId?: string
  years: StorageKeyGroupCustomerYear[]
}

export function getStorageKeys(): string[] {
  const keys: string[] = []
  if (browser) {
    for (let i = 0; i < window.localStorage.length; i++) {
      keys.push(window.localStorage.key(i))
    }
  }
  return keys
}

export function computeStorageKeys(keys: string[]): StorageKey[] {
  return keys
    .map((key) => {
      const [entity, customerId, year] = key.split('#')
      switch (entity) {
        case 'customers':
          return {
            key,
            entity,
          }
        case 'years':
          return {
            key,
            entity,
            customerId,
          }
        case 'summaries':
        case 'transactions':
          return {
            key,
            entity,
            customerId,
            year: Number(year),
          }
        default:
          return {
            key,
            entity: 'unknown',
          }
      }
    })
    .sort(
      multiCompare(
        (a, b) => compareStrings(a.customerId ?? '', b.customerId ?? ''),
        (a, b) => (a.year ?? 0) - (b.year ?? 0),
        (a, b) => compareStrings(a.entity, b.entity)
      )
    )
}

export function groupStorageKeys(items: StorageKey[]) {
  const output: StorageKeyGroupCustomer[] = []
  items.forEach((item) => {
    const customerIndex = output.findIndex(
      (g) => g.customerId === item.customerId
    )
    if (customerIndex >= 0) {
      const yearIndex = output[customerIndex].years.findIndex(
        (y) => y.year === item.year
      )
      if (yearIndex >= 0)
        output[customerIndex].years[yearIndex].entities.push(item)
      else
        output[customerIndex].years.push({
          year: item.year,
          entities: [item],
        })
    } else {
      output.push({
        entity: item.entity,
        years: [
          {
            year: item.year,
            entities: [item],
          },
        ],
        customerId: item.customerId,
      })
    }
  })
  return output
}
