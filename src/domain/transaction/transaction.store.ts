import { writable } from 'svelte/store'
import type { Transaction, TransactionType } from './Transaction'
import transactions from './transactions.json'

export const transactionStore = writable<Transaction[]>(
  transactions.map((transaction) => ({
    ...transaction,
    date: new Date(transaction.date),
    type: transaction.type as TransactionType,
  }))
)
