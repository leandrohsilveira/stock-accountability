<script lang="ts">
  import { Table } from 'sveltestrap'
  import CurrencyText from '../../components/CurrencyText.svelte'
  import type { ComputedTransaction } from './Transaction'
  import TransactionAmountChange from './TransactionAmountChange.svelte'

  export let stockId: string | undefined = undefined
  export let items: ComputedTransaction[] = []

  $: filtered = filter(items, stockId)

  function filter(
    collection: ComputedTransaction[],
    search: string | undefined
  ) {
    if (stockId) return collection.filter((item) => item.stockId === search)
    return collection
  }
</script>

<Table responsive striped>
  <thead>
    <tr>
      <th>Data</th>
      <th>ID da Ação</th>
      <th>Operação</th>
      <th>Quantidade</th>
      <th>Preço</th>
      <th>Valor total</th>
      <th>Custo acumulado</th>
      <th>Custo médio</th>
      <th>Lucro</th>
    </tr>
  </thead>
  <tbody>
    {#if filtered.length === 0}
      <tr><td colspan="9">Nenhuma movimentação encontrada</td></tr>
    {/if}
    {#each filtered as transaction (transaction.id)}
      <tr>
        <td>{transaction.date.toLocaleDateString('pt-br')}</td>
        <td>{transaction.stockId}</td>
        <td>{transaction.type}</td>
        <td><TransactionAmountChange value={transaction} /></td>
        <td><CurrencyText value={transaction.unitPrice} /></td>
        <td><CurrencyText value={transaction.total} /></td>
        <td><CurrencyText value={transaction.accruedCost} /></td>
        <td><CurrencyText value={transaction.averageCost} /></td>
        <td><CurrencyText value={transaction.profit} /></td>
      </tr>
    {/each}
  </tbody>
</Table>
