export const ROUTES = {
  customers: () => '/',
  maintenance: () => '/maintenance',
  transactionsOfCustomer: (customerId: string, year: number) =>
    `/customers/${customerId}/${year}`,
}
