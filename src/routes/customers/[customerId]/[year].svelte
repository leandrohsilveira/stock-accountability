<script context="module" lang="ts">
  import type { Load } from '@sveltejs/kit'

  export const load: Load = ({ params }) => ({
    props: {
      customerId: params.customerId,
      year: Number(params.year),
    },
  })
</script>

<script lang="ts">
  import CustomerTransactions from '$lib/domain/transaction/CustomerTransactions.svelte'

  export let customerId: string
  export let year: number
</script>

<CustomerTransactions {year} {customerId} />
