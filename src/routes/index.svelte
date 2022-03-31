<script lang="ts">
  import { goto } from '$app/navigation'

  import Customers from '$lib/domain/customer/Customers.svelte'
  import { ROUTES } from '$lib/router'

  let year = new Date().getFullYear()

  function handleView(event: CustomEvent<string>) {
    goto(ROUTES.transactionsOfCustomer(event.detail, year))
  }
</script>

<Customers on:view={handleView} />
