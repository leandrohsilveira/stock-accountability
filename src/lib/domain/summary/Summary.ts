import type { ComputedTransaction } from '$lib/domain/transaction/Transaction'
import { findBy } from '$lib/util/storage'

export interface Summary {
  year: number
  stockId: string
  customerId: string
  amount: number
  averageCost: number
  accruedCost: number
  totalProfit: number
}

export interface MergedSummary {
  stockId: string
  previousAmount: number
  currentAmount: number
  previousAccruedCost: number
  currentAccruedCost: number
  previousAverageCost: number
  currentAverageCost: number
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

export function toMergedSummary(
  previous: Summary | undefined,
  current: Summary | undefined
): MergedSummary {
  return {
    stockId: current?.stockId ?? previous?.stockId ?? '',
    totalProfit: current?.totalProfit ?? 0,
    currentAmount: current?.amount ?? 0,
    currentAccruedCost: current?.accruedCost ?? 0,
    currentAverageCost: current?.averageCost ?? 0,
    previousAmount: previous?.amount ?? 0,
    previousAccruedCost: previous?.accruedCost ?? 0,
    previousAverageCost: previous?.averageCost ?? 0,
  }
}

export function mergeSummaries(
  previousSummaries: Summary[],
  currentSummaries: Summary[]
) {
  const stocks = new Set<string>()
  previousSummaries.forEach((item) => stocks.add(item.stockId))
  currentSummaries.forEach((item) => stocks.add(item.stockId))
  return [...stocks.values()].map((stock) =>
    toMergedSummary(
      findBy(previousSummaries, 'stockId', stock),
      findBy(currentSummaries, 'stockId', stock)
    )
  )
}
