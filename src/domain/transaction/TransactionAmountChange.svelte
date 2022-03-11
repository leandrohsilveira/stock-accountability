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

<span class="spacing">({symbol}{value.quantity})</span>
<span class="spacing right">{previousAmount}</span>
<TextColor {color}><Icon name="arrow-right-short" /></TextColor>
<span class="spacing">{value.amount}</span>

<style>
  .spacing {
    display: inline-block;
    width: 30px;
  }

  .spacing.right {
    text-align: right;
  }
</style>
