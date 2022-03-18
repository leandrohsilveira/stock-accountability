<script lang="ts">
  import { Icon } from 'sveltestrap'
  import type { Color } from 'sveltestrap/src/shared'
  import CurrencyText from './CurrencyText.svelte'

  import TextColor from './TextColor.svelte'

  export let start: number
  export let end: number
  export let currency = false

  let color: Color
  $: color = start > end ? 'danger' : start < end ? 'info' : 'dark'
</script>

<div class="host">
  <span class="number right">
    {#if currency}
      <CurrencyText value={start} />
    {:else}
      {start}
    {/if}
  </span>
  <div class="arrow">
    <TextColor {color}><Icon name="arrow-right-short" /></TextColor>
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
  .host {
    display: flex;
    justify-content: center;
  }

  .number {
    flex: 1;
    white-space: nowrap;
  }

  .number.right {
    text-align: right;
  }

  .arrow {
    width: 16px;
  }
</style>
