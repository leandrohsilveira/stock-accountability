import { SingletonFactory } from '$lib/util/di'
import { PersistentStorage } from '$lib/util/storage'
import { AvailableYearsService } from './AvailableYearsService'

export class AvailableYearsServiceFactory extends SingletonFactory<AvailableYearsService> {
  protected create(): AvailableYearsService {
    return new AvailableYearsService(
      new PersistentStorage<number, [string]>('years#{0}', {
        beforePersist: (years) => [...new Set(years)].sort(),
      })
    )
  }
}
