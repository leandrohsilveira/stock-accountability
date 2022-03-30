import { PersistentStorage } from '$lib/util/storage'
import { availableYearsStorage } from '$lib/domain/availableYear/availableYear.store'
import type { Summary } from './Summary'

export const summaryStorage = new PersistentStorage<Summary, [string, number]>(
  'summaries#{0}#{1}'
)

export function findPreviousSummary(
  customerId: string,
  currentYear: number
): Summary[] {
  const previousYear = currentYear - 1
  let previousSummaries = summaryStorage.restore([customerId, previousYear])
  if (!previousSummaries.length) {
    const availableYears = availableYearsStorage
      .restore([customerId])
      .filter((year) => year < previousYear)
    if (availableYears.length) {
      const latest = availableYears[availableYears.length - 1]
      if (currentYear > latest)
        previousSummaries = summaryStorage.restore([customerId, latest])
    }
  }
  return previousSummaries.map((summary) => ({
    ...summary,
    year: previousYear,
    totalProfit: 0,
  }))
}
