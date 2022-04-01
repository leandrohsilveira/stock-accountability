<script lang="ts">
  import { formatNumber } from '$lib/util/number'

  export let value: number | undefined
  export let currency = 'R$'
  let formatted: string

  $: if (value !== undefined) {
    formatted =
      value >= 0
        ? `${currency} ${formatNumber(value)}`
        : `- ${currency} ${formatNumber(Math.abs(value))}`
  } else {
    formatted = ''
  }
</script>

<div class="currency" class:text-danger-base={value < 0}>{formatted}</div>

<style>
  .currency {
    white-space: nowrap;
  }
</style>
