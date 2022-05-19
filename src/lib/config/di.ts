import { AuthFactory } from '$lib/domain/auth/AuthFactory'
import { AvailableYearsServiceFactory } from '$lib/domain/availableYear/AvailableYearsServiceFactory'
import { CustomerServiceFactory } from '$lib/domain/customer/CustomerServiceFactory'
import { StockServiceFactory } from '$lib/domain/stock/StockServiceFactory'
import { SummaryServiceFactory } from '$lib/domain/summary/SummaryServiceFactory'
import { TransactionServiceFactory } from '$lib/domain/transaction/TransactionServiceFactory'
import { FirebaseFactory } from './firebase'
import { FireStoreFactory } from './firestore'
import { PropertiesFactory } from './properties'

export const propertiesFactory = new PropertiesFactory()
export const firebaseFactory = new FirebaseFactory(propertiesFactory)
export const fireStoreFactory = new FireStoreFactory(firebaseFactory)
export const authFactory = new AuthFactory(firebaseFactory)
export const availableYearsServiceFactory = new AvailableYearsServiceFactory()
export const customerServiceFactory = new CustomerServiceFactory(
  authFactory,
  fireStoreFactory
)
export const stockServiceFactory = new StockServiceFactory(
  customerServiceFactory,
  fireStoreFactory
)
export const summaryServiceFactory = new SummaryServiceFactory(
  availableYearsServiceFactory
)
export const transactionServiceFactory = new TransactionServiceFactory(
  customerServiceFactory,
  stockServiceFactory,
  summaryServiceFactory,
  availableYearsServiceFactory,
  fireStoreFactory
)
