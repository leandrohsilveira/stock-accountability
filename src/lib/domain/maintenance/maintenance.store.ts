import { derived } from 'svelte/store'
import { customerStore } from '$lib/domain/customer/customer.store'
import { availableYearsStore } from '$lib/domain/transaction/transaction.store'
import { computeStorageKeys, getStorageKeys } from './Maintenance'

export const storageKeyStore = derived(
  [customerStore, availableYearsStore],
  () => computeStorageKeys(getStorageKeys())
)
