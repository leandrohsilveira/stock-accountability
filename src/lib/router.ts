export const ROUTES = {
  customers: () => '/',
  maintenance: () => '/maintenance',
  transactionsOfCustomer: (customerId: string, year: number) =>
    `/customers/${customerId}/${year}`,
}

export const MENU_ROUTES = {
  customers: ROUTES.customers(),
  maintenance: ROUTES.maintenance(),
}
