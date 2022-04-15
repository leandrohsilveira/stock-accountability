import { PersistentStorage } from '$lib/util/storage'

let instance: AvailableYearsService | undefined = undefined

export class AvailableYearsService {
  constructor(private storage: PersistentStorage<number, [string]>) {}

  async findAll(customerId: string) {
    return this.storage.restore([customerId])
  }

  async findAllPrevious(customerId: string, refYear: number) {
    const years = await this.findAll(customerId)
    return years.filter((year) => year < refYear)
  }

  async create(customerId: string, year: number) {
    return this.storage.persist(
      [...(await this.findAll(customerId)), year],
      [customerId]
    )
  }
}

export function setAvailableYearsServiceInstance(
  newInstance: AvailableYearsService
) {
  instance = newInstance
}

export function getAvailableYearsServiceInstance() {
  if (instance === undefined)
    setAvailableYearsServiceInstance(
      new AvailableYearsService(
        new PersistentStorage<number, [string]>('years#{0}', {
          beforePersist: (years) => [...new Set(years)].sort(),
        })
      )
    )
  return instance
}
