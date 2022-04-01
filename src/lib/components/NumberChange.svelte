<script lang="ts">
  import CurrencyText from './CurrencyText.svelte'
  import CaretRightIcon from '$lib/icons/caret-right.svg?component'

  export let start: number
  export let end: number
  export let currency = false
</script>

<div class="flex justify-center items-center">
  <span class="number text-right">
    {#if currency}
      <CurrencyText value={start} />
    {:else}
      {start}
    {/if}
  </span>
  <div
    class="arrow"
    class:fill-green-600={start < end}
    class:fill-danger-base={start > end}
    class:fill-default-darker={start === end}
  >
    <CaretRightIcon class="icon icon-sm" />
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
