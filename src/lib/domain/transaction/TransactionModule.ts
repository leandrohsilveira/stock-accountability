import { FireStoreCollection, FireStoreModule, FireStoreRef } from '$lib/config'
import { useModule } from '$lib/config/di'
import type DIContainer from 'rsdi'
import { object, use } from 'rsdi'
import { AvailableYearsModule } from '../availableYear/AvailableYearsModule'
import { AvailableYearsService } from '../availableYear/AvailableYearsService'
import { CustomerModule } from '../customer/CustomerModule'
import { CustomerService } from '../customer/CustomerService'
import { StockModule } from '../stock/StockModule'
import { StockService } from '../stock/StockService'
import { SummaryModule } from '../summary/SummaryModule'
import { SummaryService } from '../summary/SummaryService'
import { TransactionConverter, TransactionService } from './TransactionService'

export class TransactionModule {
  constructor(di: DIContainer) {
    useModule(FireStoreModule)
    useModule(CustomerModule)
    useModule(StockModule)
    useModule(SummaryModule)
    useModule(AvailableYearsModule)

    di.add({
      TransactionConverter: object(TransactionConverter).construct(
        use(CustomerService),
        use(StockService)
      ),
      TransactionStoreCollection: object(FireStoreCollection).construct(
        use(FireStoreRef),
        'transactions',
        use(TransactionConverter)
      ),
      TransactionService: object(TransactionService).construct(
        use(CustomerService),
        use(StockService),
        use(SummaryService),
        use(AvailableYearsService),
        use('TransactionStoreCollection')
      ),
    })
  }
}
