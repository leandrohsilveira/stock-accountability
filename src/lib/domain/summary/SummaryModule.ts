import { SingletonFactory, type Factory } from '$lib/util/di'
import { PersistentStorage } from '$lib/util/storage'
import type { AvailableYearsService } from '../availableYear/AvailableYearsService'
import type { Summary } from './Summary'
import { SummaryService } from './SummaryService'

export class SummaryServiceFactory extends SingletonFactory<SummaryService> {
  constructor(private availableYearsService: Factory<AvailableYearsService>) {
    super()
  }

  protected create(): SummaryService {
    return new SummaryService(
      new PersistentStorage<Summary, [string, number]>('summaries#{0}#{1}'),
      this.availableYearsService.get()
    )
  }
}
