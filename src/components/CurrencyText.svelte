<script lang="ts">
  import { formatNumber } from './formatNumber'

  export let value: number
  export let currency = 'R$'

  $: formatted = `${currency} ${formatNumber(value)}`
</script>

{formatted}
