<script lang="ts">
  import { Icon } from 'sveltestrap'

  import type { Color } from 'sveltestrap/src/shared'
  import TextColor from '../../components/TextColor.svelte'

  import {
    calculate,
    ComputedTransaction,
    TransactionType,
  } from './Transaction'

  export let value: Pick<ComputedTransaction, 'amount' | 'quantity' | 'type'>

  $: color = computeColor(value.type)
  $: symbol = computeSymbol(value.type)
  $: previousAmount = calculate(value.amount, -value.quantity, value.type)

  function computeColor(type: TransactionType): Color {
    switch (type) {
      case 'PURCHASE':
        return 'info'
      case 'SELL':
        return 'danger'
      default:
        return 'dark'
    }
  }

  function computeSymbol(type: TransactionType) {
    switch (type) {
      case 'PURCHASE':
        return '+'
      case 'SELL':
        return '-'
      default:
        return ''
    }
  }
</script>

<div class="host">
  <span class="number change">({symbol}{value.quantity})</span>
  <span class="number right">{previousAmount}</span>
  <div class="arrow">
    <TextColor {color}><Icon name="arrow-right-short" /></TextColor>
  </div>
  <span class="number">{value.amount}</span>
</div>

<style>
  .host {
    display: flex;
    justify-content: center;
  }

  .number {
    flex: 3;
    white-space: nowrap;
  }

  .number.change {
    flex: 1;
  }

  .number.right {
    text-align: right;
  }

  .arrow {
    width: 16px;
  }
</style>
