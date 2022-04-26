<script context="module" lang="ts">
  import type { Load } from '@sveltejs/kit'
  import { getInstance, useModule } from '$lib/config/di'
  import { TransactionModule } from '$lib/domain/transaction/TransactionModule'

  useModule(TransactionModule)

  export const load: Load = ({ params }) => ({
    props: {
      customerId: params.customerId,
      year: Number(params.year),
    },
  })
</script>

<script lang="ts">
  import CustomerTransactions from '$lib/domain/transaction/CustomerTransactions.svelte'
  import { goto } from '$app/navigation'
  import { ROUTES } from '$lib/router'
  import Guard from '$lib/domain/auth/Guard.svelte'
  import Synchronizer from '$lib/components/Synchronizer.svelte'
  import { TransactionService } from '$lib/domain/transaction/TransactionService'

  const transactionService = getInstance(TransactionService)

  export let customerId: string
  export let year: number

  function handleBack() {
    goto(ROUTES.customers())
  }

  function handleChangeYear(event: CustomEvent<number>) {
    goto(ROUTES.transactionsOfCustomer(customerId, event.detail))
  }
</script>

<Guard>
  <Synchronizer sync={() => transactionService.syncChanges(customerId)}>
    <CustomerTransactions
      {year}
      {customerId}
      on:back={handleBack}
      on:changeYear={handleChangeYear}
    />
  </Synchronizer>
</Guard>
