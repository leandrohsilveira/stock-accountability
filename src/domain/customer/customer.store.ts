import { derived, writable } from 'svelte/store'
import {
  create,
  findById,
  PersistentStorage,
  unique,
  update,
} from '../../util/storage'
import type { Customer, SubmitCustomer } from './Customer'

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
          'Já existe um cliente cadastrado com o CPF/CNPJ informado!'
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
          'Já existe um outro cliente cadastrado com o CPF/CNPJ informado!'
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
