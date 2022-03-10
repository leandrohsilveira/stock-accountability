import { derived, writable } from 'svelte/store'
import { toDate } from '../../util/date'
import { generateUniqueUUID } from '../../util/uuid'
import type {
  AddTransaction,
  Transaction,
  TransactionType,
} from './Transaction'

let selectedYear: number = new Date().getFullYear()

export const yearStore = writable(selectedYear)

export const transactionStore = writable<Transaction[]>([])

export const computedTransactionStore = derived(
  transactionStore,
  (transactions) =>
    [...transactions].sort(
      (a, b) => toDate(a.date).getTime() - toDate(b.date).getTime()
    )
)

yearStore.subscribe((year) => {
  selectedYear = year
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
    `transactions#${selectedYear}`,
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
