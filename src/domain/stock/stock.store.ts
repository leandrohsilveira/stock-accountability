import { derived } from 'svelte/store'
import type { EditStock, Stock } from './Stock'
import { summaryStore, updateStockId } from '../transaction/transaction.store'

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
