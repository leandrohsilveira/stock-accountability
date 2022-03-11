export interface Stock {
  id: string
  quantity: number
}

export interface EditStock {
  previousId: string
  newId: string
}
