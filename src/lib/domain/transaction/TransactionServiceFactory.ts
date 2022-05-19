import { FireStoreCollection, FireStoreRef } from '$lib/config'
import { SingletonFactory, type Factory } from '$lib/util/di'
import type { AvailableYearsService } from '../availableYear/AvailableYearsService'
import type { CustomerService } from '../customer/CustomerService'
import type { StockService } from '../stock/StockService'
import type { SummaryService } from '../summary/SummaryService'
import { TransactionConverter, TransactionService } from './TransactionService'

export class TransactionServiceFactory extends SingletonFactory<TransactionService> {
  constructor(
    private customerService: Factory<CustomerService>,
    private stockService: Factory<StockService>,
    private summaryService: Factory<SummaryService>,
    private availableYearsService: Factory<AvailableYearsService>,
    private fireStore: Factory<FireStoreRef>
  ) {
    super()
  }

  protected create(): TransactionService {
    return new TransactionService(
      this.customerService.get(),
      this.stockService.get(),
      this.summaryService.get(),
      this.availableYearsService.get(),
      new FireStoreCollection(
        this.fireStore.get(),
        'transactions',
        new TransactionConverter(
          this.customerService.get(),
          this.stockService.get()
        )
      )
    )
  }
}
