import { derived, writable } from 'svelte/store'
import { create, findById, unique, update } from '../../util/storage'
import type { Customer, SubmitCustomer } from './Customer'

const CUSTOMER_KEY = 'customers'

export const customerStore = writable<Customer[]>([])

export function addCustomer(customer: SubmitCustomer) {
  customerStore.update((customers) =>
    persist(
      create(
        customer,
        customers,
        unique(
          { ...customer, id: undefined },
          customers,
          'document',
          'Já existe um cliente cadastrado com o CPF/CNPJ informado!'
        )
      )
    )
  )
}

export function updateCustomer(id: string, customer: SubmitCustomer) {
  customerStore.update((customers) =>
    persist(
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
      )
    )
  )
}

export function findCustomerById(id: string) {
  return derived(customerStore, (customers) => findById(id, customers))
}

export function loadCustomers() {
  const customers = restoreCustomers()
  if (customers) customerStore.set(customers)
}

export function restoreCustomers(): Customer[] {
  return JSON.parse(window.localStorage.getItem(CUSTOMER_KEY))
}

function persist(customers: Customer[]) {
  window.localStorage.setItem(CUSTOMER_KEY, JSON.stringify(customers))
  return customers
}
