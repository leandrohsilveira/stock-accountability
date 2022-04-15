<script lang="ts">
  import type { Stock } from './Stock'

  export let stocks: Stock[]
  export let id: string

  $: name = stocks.find((stock) => stock.id === id)?.name
</script>

{name}
