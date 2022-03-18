import type { ComputedTransaction } from '../transaction/Transaction'

export interface Summary {
  year: number
  stockId: string
  customerId: string
  amount: number
  averageCost: number
  accruedCost: number
  totalProfit: number
}

export function updateSummaries(
  year: number,
  transactions: ComputedTransaction[],
  previousSummaries: Summary[]
) {
  return transactions.reduce(
    (acc, transaction) => {
      const result = [...acc]
      const index = result.findIndex(
        ({ stockId }) => stockId === transaction.stockId
      )
      const summary = {
        year: transaction.date.getFullYear(),
        accruedCost: transaction.accruedCost,
        amount: transaction.amount,
        stockId: transaction.stockId,
        customerId: transaction.customerId,
        averageCost: transaction.averageCost,
        totalProfit:
          (result[index]?.totalProfit ?? 0) + (transaction.profit ?? 0),
      }
      if (index >= 0) {
        result[index] = summary
      } else {
        result.push(summary)
      }
      return result
    },
    previousSummaries.map((summary) => ({
      ...summary,
      totalProfit: 0,
      year,
    }))
  )
}
