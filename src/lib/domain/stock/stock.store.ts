import {
  summaryStore,
  updateStockId,
} from '$lib/domain/transaction/transaction.store'
import { derived } from 'svelte/store'
import type { EditStock, Stock } from './Stock'

export const stockStore = derived(summaryStore, (summaries) =>
  summaries.map(
    (summary): Stock => ({
      id: summary.stockId,
      quantity: summary.amount,
    })
  )
)

export function editStock(stock: EditStock) {
  updateStockId(stock.previousId, stock.newId)
}
