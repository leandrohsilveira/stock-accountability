import { FireStoreCollection, FireStoreModule, FireStoreRef } from '$lib/config'
import { useModule } from '$lib/config/di'
import type DIContainer from 'rsdi'
import { object, use } from 'rsdi'
import { CustomerModule } from '../customer/CustomerModule'
import { CustomerService } from '../customer/CustomerService'
import { StockConverter, StockService } from './StockService'

export class StockModule {
  constructor(di: DIContainer) {
    useModule(FireStoreModule)
    useModule(CustomerModule)

    di.add({
      StockConverter: object(StockConverter).construct(use(CustomerService)),
      StockStoreCollection: object(FireStoreCollection).construct(
        use(FireStoreRef),
        'stocks',
        use(StockConverter)
      ),
      StockService: object(StockService).construct(
        use(CustomerService),
        use('StockStoreCollection')
      ),
    })
  }
}
