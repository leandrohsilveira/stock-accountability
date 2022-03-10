<script lang="ts">
  import { Column, Row, Table } from 'sveltestrap'
  import CurrencyText from '../../components/CurrencyText.svelte'
  import type { Transaction } from './Transaction'

  export let stockId: string | undefined = undefined
  export let items: Transaction[] = []

  $: filtered = filter(items, stockId)

  function filter(collection: Transaction[], search: string | undefined) {
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
      <th>Qth</th>
      <th>Valor</th>
      <th>Total</th>
    </tr>
  </thead>
  <tbody>
    {#if filtered.length === 0}
      <tr><td colspan="6">Nenhuma movimentação encontrada</td></tr>
    {/if}
    {#each filtered as row (row.id)}
      <tr>
        <td>{row.date.toLocaleDateString('pt-br')}</td>
        <td>{row.stockId}</td>
        <td>{row.type}</td>
        <td>{row.quantity}</td>
        <td><CurrencyText value={row.unitPrice} /></td>
        <td><CurrencyText value={row.unitPrice * row.quantity} /></td>
      </tr>
    {/each}
  </tbody>
</Table>
