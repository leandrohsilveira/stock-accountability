import { derived } from 'svelte/store'
import type { EditStock, Stock } from './Stock'
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

export function editStock(stock: EditStock) {
  transactionStore.update((transactions) => {
    if (transactions.some((transaction) => transaction.stockId === stock.newId))
      throw new Error('Já existe uma ação com esse ID')
    return transactions.map((transaction) => {
      if (transaction.stockId === stock.previousId)
        return {
          ...transaction,
          stockId: stock.newId,
        }
      return transaction
    })
  })
}
