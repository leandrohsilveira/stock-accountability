import { useModule } from '$lib/config/di'
import { PersistentStorage } from '$lib/util/storage'
import type DIContainer from 'rsdi'
import { factory, object, use } from 'rsdi'
import { AvailableYearsModule } from '../availableYear/AvailableYearsModule'
import { AvailableYearsService } from '../availableYear/AvailableYearsService'
import type { Summary } from './Summary'
import { SummaryService } from './SummaryService'

export class SummaryModule {
  constructor(di: DIContainer) {
    useModule(AvailableYearsModule)
    di.add({
      SummaryService: object(SummaryService).construct(
        factory(
          () =>
            new PersistentStorage<Summary, [string, number]>(
              'summaries#{0}#{1}'
            )
        ),
        use(AvailableYearsService)
      ),
    })
  }
}
