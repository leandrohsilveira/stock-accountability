<script context="module" lang="ts">
  import { goto } from '$app/navigation'
  import Synchronizer from '$lib/components/Synchronizer.svelte'
  import { transactionServiceFactory } from '$lib/config/di'
  import Guard from '$lib/domain/auth/Guard.svelte'
  import CustomerTransactions from '$lib/domain/transaction/CustomerTransactions.svelte'
  import { ROUTES } from '$lib/router'
  import type { Load } from '@sveltejs/kit'

  export const load: Load = ({ params }) => ({
    props: {
      customerId: params.customerId,
      year: Number(params.year),
    },
  })
</script>

<script lang="ts">
  const transactionService = transactionServiceFactory.get()

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
