export type TransactionType = 'PURCHASE' | 'SELL'

export interface Transaction {
  id: string
  stockId: string
  quantity: number
  unitPrice: number
  date: Date
  type: TransactionType
}

export type AddTransaction = Omit<Transaction, 'id'>
