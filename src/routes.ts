import { createNavigator, PathParams } from './util/router'

export type AppNavigator = {
  home(): void
  customers(): void
  customerTransactions(pathParams: PathParams<'customerId' | 'year'>): void
  maintenance(): void
}

const appNavigator = createNavigator<AppNavigator>({
  home: '/',
  customers: '/customers',
  customerTransactions: '/customers/{customerId}/transactions/{year}',
  maintenance: '/maintenance',
})

export default appNavigator
