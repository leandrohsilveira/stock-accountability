<script lang="ts">
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

<div class="flex justify-center">
  <span class="number change">({symbol}{value.quantity})</span>
  <span class="number text-right">{previousAmount}</span>
  <div
    class="arrow"
    class:text-green-600={previousAmount < value.quantity}
    class:text-red-500={previousAmount > value.quantity}
    class:text-gray-700={previousAmount === value.quantity}
  >
    {'>'}
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
