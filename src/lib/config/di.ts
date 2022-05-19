import { AuthFactory } from '$lib/domain/auth/AuthModule'
import { AvailableYearsServiceFactory } from '$lib/domain/availableYear/AvailableYearsModule'
import { CustomerServiceFactory } from '$lib/domain/customer/CustomerModule'
import { StockServiceFactory } from '$lib/domain/stock/StockModule'
import { SummaryServiceFactory } from '$lib/domain/summary/SummaryModule'
import { TransactionServiceFactory } from '$lib/domain/transaction/TransactionModule'
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
