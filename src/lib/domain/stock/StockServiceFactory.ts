import { FireStoreCollection, FireStoreRef } from '$lib/config'
import { SingletonFactory, type Factory } from '$lib/util/di'
import type { CustomerService } from '../customer/CustomerService'
import { StockConverter, StockService } from './StockService'

export class StockServiceFactory extends SingletonFactory<StockService> {
  constructor(
    private customerServiceFactory: Factory<CustomerService>,
    private fireStoreFactory: Factory<FireStoreRef>
  ) {
    super()
  }

  protected create(): StockService {
    return new StockService(
      this.customerServiceFactory.get(),
      new FireStoreCollection(
        this.fireStoreFactory.get(),
        'stocks',
        new StockConverter(this.customerServiceFactory.get())
      )
    )
  }
}
