import { derived, writable } from 'svelte/store'
import { lastItem } from '../../util/array'
import { toDate } from '../../util/date'
import { generateUniqueUUID } from '../../util/uuid'
import { periodRef, periodStore } from '../period/period.store'
import {
  AddTransaction,
  calculate,
  ComputedTransaction,
  computeAccruedCost,
  Transaction,
} from './Transaction'

export const transactionStore = writable<Transaction[]>([])

export const computedTransactionStore = derived(
  transactionStore,
  (transactions) => {
    const sortedTransactions = transactions.sort(
      (a, b) => toDate(a.date).getTime() - toDate(b.date).getTime()
    )

    const computedTransactions: ComputedTransaction[] = []
    sortedTransactions.forEach((transaction) => {
      const previousTransactionsOfStock = computedTransactions.filter(
        ({ stockId }) => stockId === transaction.stockId
      )
      const previousTransaction = lastItem(previousTransactionsOfStock)
      const total = transaction.quantity * transaction.unitPrice
      const amount = calculate(
        previousTransaction?.amount ?? 0,
        transaction.quantity,
        transaction.type
      )
      const accruedCost = computeAccruedCost(transaction, previousTransaction)
      const averageCost = accruedCost / amount
      computedTransactions.push({
        ...transaction,
        total,
        amount,
        accruedCost,
        averageCost,
        profit:
          transaction.type === 'SELL'
            ? total - averageCost * transaction.quantity
            : undefined,
      })
    })
    return computedTransactions
  }
)

periodStore.subscribe(({ year }) => {
  const json = window.localStorage.getItem(`transactions#${year}`)
  if (json)
    transactionStore.set(
      JSON.parse(json).map((transaction: Transaction) => ({
        ...transaction,
        date: toDate(transaction.date),
      }))
    )
})

transactionStore.subscribe((transactions) => {
  window.localStorage.setItem(
    `transactions#${periodRef.current.year}`,
    JSON.stringify(transactions)
  )
})

export function addTransaction(transaction: AddTransaction) {
  transactionStore.update((transactions) => [
    ...transactions,
    {
      ...transaction,
      id: generateUniqueUUID(transactions, 'id'),
    },
  ])
}
