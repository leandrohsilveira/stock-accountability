<script lang="ts">
  import Layout from './components/Layout.svelte'
  import { messageStore } from './domain/message/message.store'
  import Messages from './domain/message/Messages.svelte'
  import Customers from './pages/Customers.svelte'
  import CustomerTransactions from './pages/CustomerTransactions.svelte'
  import Maintenance from './pages/Maintenance.svelte'
  import appNavigator from './routes'
  import BrowserRouter from './util/router/BrowserRouter.svelte'
  import RequireMatch from './util/router/RequireMatch.svelte'
  import Route from './util/router/Route.svelte'

  let year = new Date().getFullYear() - 1

  function handleViewCustomer(e: CustomEvent<string>) {
    appNavigator.handlers.customerTransactions({
      customerId: e.detail,
      year,
    })
  }

  function handleChangeYear(e: CustomEvent<number>, customerId: string) {
    year = e.detail
    appNavigator.handlers.customerTransactions({
      customerId,
      year,
    })
  }

  function handleNoMatch() {
    appNavigator.handlers.customers()
  }
</script>

<BrowserRouter>
  <Layout>
    <RequireMatch on:noMatch={handleNoMatch}>
      <Route path={appNavigator.routes.customers} exact>
        <Customers on:view={handleViewCustomer} />
      </Route>
      <Route path={appNavigator.routes.customerTransactions} let:params>
        <CustomerTransactions
          customerId={params.customerId}
          year={Number(params.year)}
          on:back={() => appNavigator.handlers.customers()}
          on:changeYear={(e) => handleChangeYear(e, params.customerId)}
        />
      </Route>
      <Route path={appNavigator.routes.maintenance} exact>
        <Maintenance />
      </Route>
    </RequireMatch>
  </Layout>
</BrowserRouter>

<Messages messages={$messageStore} />
