export type TransactionType = 'PURCHASE' | 'SELL'

export interface Transaction {
  id: string
  stockId: string
  customerId: string
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

export type SubmitTransaction = Omit<Transaction, 'id'>

export type Summary = {
  year: number
  stockId: string
  customerId: string
  amount: number
  averageCost: number
  accruedCost: number
  totalProfit: number
}

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
  previous?: ComputedTransaction | Summary
) {
  const prevAccruedCost = previous?.accruedCost ?? 0
  switch (transaction.type) {
    case 'PURCHASE':
      return prevAccruedCost + transaction.quantity * transaction.unitPrice
    case 'SELL':
      return prevAccruedCost - transaction.quantity * previous.averageCost
    default:
      throw new Error(`Unrecognized transaction type "${transaction.type}"`)
  }
}

export function isComputedTransaction(
  transaction: Transaction
): transaction is ComputedTransaction {
  return (
    'total' in transaction &&
    'amount' in transaction &&
    'averageCost' in transaction &&
    'accruedCost' in transaction
  )
}
