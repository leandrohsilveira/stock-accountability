export interface Stock {
  id: string
  name: string
  customerId: string
}

export interface EditStock {
  previousName: string
  newName: string
}
