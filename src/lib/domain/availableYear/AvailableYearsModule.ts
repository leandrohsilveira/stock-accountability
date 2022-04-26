import { PersistentStorage } from '$lib/util/storage'
import type DIContainer from 'rsdi'
import { factory, object } from 'rsdi'
import { AvailableYearsService } from './AvailableYearsService'

export class AvailableYearsModule {
  constructor(di: DIContainer) {
    di.add({
      AvailableYearsService: object(AvailableYearsService).construct(
        factory(
          () =>
            new PersistentStorage<number, [string]>('years#{0}', {
              beforePersist: (years) => [...new Set(years)].sort(),
            })
        )
      ),
    })
  }
}
