import { PersistentStorage } from '../../util/storage'

export const availableYearsStorage = new PersistentStorage<number, [string]>(
  'years#{0}',
  {
    beforePersist: (years) => [...new Set(years)].sort(),
  }
)
