<script lang="ts">
  import { formatNumber } from '$lib/util/number'

  export let value: number | undefined
  export let currency = 'R$'

  $: formatted = value !== undefined ? `${currency} ${formatNumber(value)}` : ''
</script>

<div class="currency">{formatted}</div>

<style>
  .currency {
    white-space: nowrap;
  }
</style>
