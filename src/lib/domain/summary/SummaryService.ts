import type { PersistentStorage } from '$lib/util/storage'
import type { AvailableYearsService } from '../availableYear/AvailableYearsService'
import type { Summary } from './Summary'

export class SummaryService {
  constructor(
    private storage: PersistentStorage<Summary, [string, number]>,
    private availableYearsService: AvailableYearsService
  ) {}

  async findAll(customerId: string, year: number) {
    return this.storage.restore([customerId, year])
  }

  async save(customerId: string, year: number, summaries: Summary[]) {
    await this.availableYearsService.create(customerId, year)
    this.storage.persist(summaries, [customerId, year])
  }

  async findAllPreviousYear(customerId: string, currentYear: number) {
    const previousYear = currentYear - 1
    let previousSummaries = await this.findAll(customerId, previousYear)
    if (!previousSummaries.length) {
      const availableYears = await this.availableYearsService.findAllPrevious(
        customerId,
        previousYear
      )
      if (availableYears.length) {
        const latest = availableYears[availableYears.length - 1]
        if (currentYear > latest)
          previousSummaries = await this.findAll(customerId, latest)
      }
    }
    return previousSummaries.map((summary) => ({
      ...summary,
      year: previousYear,
      totalProfit: 0,
    }))
  }
}
