export interface Customer {
  id: string
  name: string
  document?: string
}

export type SubmitCustomer = Omit<Customer, 'id'>
