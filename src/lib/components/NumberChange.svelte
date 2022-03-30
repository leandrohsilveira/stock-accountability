<script lang="ts">
  import CurrencyText from './CurrencyText.svelte'

  export let start: number
  export let end: number
  export let currency = false
</script>

<div class="flex justify-center">
  <span class="number text-right">
    {#if currency}
      <CurrencyText value={start} />
    {:else}
      {start}
    {/if}
  </span>
  <div
    class="arrow"
    class:text-green-600={start < end}
    class:text-red-500={start > end}
    class:text-gray-700={start === end}
  >
    {'>'}
  </div>
  <span class="number">
    {#if currency}
      <CurrencyText value={end} />
    {:else}
      {end}
    {/if}
  </span>
</div>

<style>
  .number {
    flex: 1;
    white-space: nowrap;
  }

  .arrow {
    width: 16px;
  }
</style>
