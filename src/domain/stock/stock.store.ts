import { derived } from 'svelte/store'
import type { Stock } from './Stock'
import { transactionStore } from '../transaction/transaction.store'

export const stockStore = derived(transactionStore, (transactions) =>
  transactions.reduce((acc, transaction) => {
    const stock = acc.find(({ id }) => id === transaction.stockId)
    if (!stock)
      return [
        ...acc,
        {
          id: transaction.stockId,
          quantity: transaction.quantity, //TODO: somar
        },
      ]
    if (transaction.type === 'PURCHASE') stock.quantity += transaction.quantity
    else stock.quantity -= transaction.quantity
    return acc
  }, [] as Stock[])
)
