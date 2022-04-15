export interface Customer {
  id: string
  name: string
  userId: string
  document?: string
}

export type SubmitCustomer = Omit<Customer, 'id' | 'userId'>
