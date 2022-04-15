<script lang="ts">
  import { goto } from '$app/navigation'
  import Guard from '$lib/domain/auth/Guard.svelte'

  import Customers from '$lib/domain/customer/Customers.svelte'
  import { ROUTES } from '$lib/router'

  let year = new Date().getFullYear() - 1

  function handleView(event: CustomEvent<string>) {
    goto(ROUTES.transactionsOfCustomer(event.detail, year))
  }
</script>

<Guard>
  <Customers on:view={handleView} />
</Guard>
