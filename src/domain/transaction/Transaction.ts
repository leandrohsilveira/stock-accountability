export type TransactionType = 'PURCHASE' | 'SELL'

export interface Transaction {
  id: string
  stockId: string
  quantity: number
  unitPrice: number
  date: Date
  type: TransactionType
}

export interface ComputedTransaction extends Transaction {
  total: number
  amount: number
  averageCost: number
  accruedCost: number
  profit?: number
}

export type AddTransaction = Omit<Transaction, 'id'>

export function calculate(acc: number, value: number, type: TransactionType) {
  switch (type) {
    case 'SELL':
      return acc - value
    case 'PURCHASE':
    default:
      return acc + value
  }
}

export function computeAccruedCost(
  transaction: Transaction,
  previousTransaction?: ComputedTransaction
) {
  const previousSum = previousTransaction?.accruedCost ?? 0
  switch (transaction.type) {
    case 'PURCHASE':
      return previousSum + transaction.quantity * transaction.unitPrice
    case 'SELL':
      return (
        previousSum - transaction.quantity * previousTransaction.averageCost
      )
    default:
      throw new Error(`Unrecognized transaction type "${transaction.type}"`)
  }
}
