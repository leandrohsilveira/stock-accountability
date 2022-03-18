<script lang="ts">
  import { formatNumber } from '../util/number'

  export let value: number | undefined
  export let currency = 'R$'

  $: formatted = value !== undefined ? `${currency} ${formatNumber(value)}` : ''
</script>

{formatted}
