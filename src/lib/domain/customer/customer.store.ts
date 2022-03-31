import { writable } from 'svelte/store'
import { createImperativeTranslator } from '$lib/config'
import {
  create,
  findById,
  PersistentStorage,
  unique,
  update,
} from '$lib/util/storage'
import type { Customer, SubmitCustomer } from './Customer'
import i18n from './customer.store.i18n.json'

const t = createImperativeTranslator(i18n)

export const customerStorage = new PersistentStorage<Customer>('customers')

export const customerStore = writable<Customer[]>([])

export function addCustomer(customer: SubmitCustomer) {
  customerStore.update((customers) =>
    customerStorage.persist(
      create(
        customer,
        customers,
        unique(
          { ...customer, id: undefined },
          customers,
          'document',
          t('thereIsAlreadyCustomerWithProvidedDocument')
        )
      ),
      []
    )
  )
}

export function updateCustomer(id: string, customer: SubmitCustomer) {
  customerStore.update((customers) =>
    customerStorage.persist(
      update(
        id,
        customer,
        customers,
        unique(
          { id, ...customer },
          customers,
          'document',
          t('thereIsAnotherCustomerWithProvidedDocument')
        )
      ),
      []
    )
  )
}

export function findCustomerById(id: string) {
  return findById(id, customerStorage.restore([]))
}

export function loadCustomers() {
  const customers = customerStorage.restore([])
  if (customers) customerStore.set(customers)
}