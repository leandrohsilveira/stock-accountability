export type TransactionType = 'PURCHASE' | 'SELL'

export interface Transaction {
  id: string
  quantity: number
  unitPrice: number
  date: Date
  type: TransactionType
}
