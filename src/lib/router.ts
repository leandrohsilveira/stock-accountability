export const ROUTES = {
  customers: () => '/customers',
  maintenance: () => '/maintenance',
  transactionsOfCustomer: (customerId: string, year: number) =>
    `/customers/${customerId}/transactions/${year}`,
}

export const MENU_ROUTES = {
  customers: ROUTES.customers(),
  maintenance: ROUTES.maintenance(),
}
