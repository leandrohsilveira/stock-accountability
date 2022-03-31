<script lang="ts">
  import CaretRightIcon from '$lib/icons/caret-right.svg?component'
  import {
    calculate,
    type ComputedTransaction,
    type TransactionType,
  } from './Transaction'

  export let value: Pick<ComputedTransaction, 'amount' | 'quantity' | 'type'>

  $: symbol = computeSymbol(value.type)
  $: previousAmount = calculate(value.amount, -value.quantity, value.type)

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

<div class="flex justify-center items-center">
  <span class="number change">({symbol}{value.quantity})</span>
  <span class="number text-right">{previousAmount}</span>
  <div
    class="arrow"
    class:fill-green-600={previousAmount < value.quantity}
    class:fill-danger-base={previousAmount > value.quantity}
    class:fill-default-darker={previousAmount === value.quantity}
  >
    <CaretRightIcon class="icon icon-sm" />
  </div>
  <span class="number">{value.amount}</span>
</div>

<style>
  .number {
    flex: 3;
    white-space: nowrap;
  }

  .number.change {
    flex: 1;
  }

  .arrow {
    width: 16px;
  }
</style>
