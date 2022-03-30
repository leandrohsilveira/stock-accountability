import { lastItem } from '$lib/util/array'
import { toDate } from '$lib/util/date'
import { findBy } from '$lib/util/storage'
import type { Summary } from '$lib/domain/summary/Summary'

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

export function computeTransactions(
  transactions: Transaction[],
  previousSummaries: Summary[]
) {
  const sortedTransactions = transactions.sort(
    (a, b) => toDate(a.date).getTime() - toDate(b.date).getTime()
  )

  const computedTransactions: ComputedTransaction[] = []
  sortedTransactions.forEach((transaction) => {
    const previousTransactionsOfStock = computedTransactions.filter(
      ({ stockId }) => stockId === transaction.stockId
    )
    const previousTransaction =
      lastItem(previousTransactionsOfStock) ??
      findBy(previousSummaries, 'stockId', transaction.stockId)
    const total = transaction.quantity * transaction.unitPrice
    const amount = calculate(
      previousTransaction?.amount ?? 0,
      transaction.quantity,
      transaction.type
    )
    const accruedCost = computeAccruedCost(transaction, previousTransaction)
    const averageCost = amount > 0 ? accruedCost / amount : 0
    computedTransactions.push({
      ...transaction,
      total,
      amount,
      accruedCost,
      averageCost,
      profit:
        transaction.type === 'SELL'
          ? total -
            (previousTransaction?.averageCost ?? 0) * transaction.quantity
          : undefined,
    })
  })
  return computedTransactions
}
