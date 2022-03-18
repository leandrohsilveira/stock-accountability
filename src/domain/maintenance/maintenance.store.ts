import { derived } from 'svelte/store'
import { customerStore } from '../customer/customer.store'
import { availableYearsStore } from '../transaction/transaction.store'
import { computeStorageKeys, getStorageKeys } from './Maintenance'

export const storageKeyStore = derived(
  [customerStore, availableYearsStore],
  () => computeStorageKeys(getStorageKeys())
)
