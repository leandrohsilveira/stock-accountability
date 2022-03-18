<script lang="ts">
  import { Table } from 'sveltestrap'
  import CurrencyText from '../../components/CurrencyText.svelte'
  import type { Summary } from './Summary'

  export let noRecordMessage = 'Nenhum registro encontrado'
  export let showProfit = false
  export let showYear = false
  export let showCustomerId = false
  export let stockId: string | undefined = undefined
  export let items: Summary[]

  $: filtered = items.filter((item) => !stockId || item.stockId === stockId)
  $: cols = [showProfit, showYear, showCustomerId].reduce(
    (acc, flag) => acc + (flag ? 1 : 0),
    4
  )
</script>

<Table responsive striped>
  <thead>
    <tr>
      {#if showYear}
        <th>Ano</th>
      {/if}
      {#if showCustomerId}
        <th>ID do cliente</th>
      {/if}
      <th>ID da ação</th>
      <th>Estoque</th>
      <th>Custo acumulado</th>
      <th>Custo médio</th>
      {#if showProfit}
        <th>Lucro total</th>
      {/if}
    </tr>
  </thead>
  <tbody>
    {#if !filtered.length}
      <tr>
        <td colspan={cols}>{noRecordMessage}</td>
      </tr>
    {/if}
    {#each filtered as item (item.stockId)}
      <tr>
        {#if showYear}
          <td>{item.year}</td>
        {/if}
        {#if showCustomerId}
          <td>{item.customerId}</td>
        {/if}
        <td>{item.stockId}</td>
        <td>{item.amount}</td>
        <td><CurrencyText value={item.accruedCost} /></td>
        <td><CurrencyText value={item.averageCost} /></td>
        {#if showProfit}
          <td><CurrencyText value={item.totalProfit} /></td>
        {/if}
      </tr>
    {/each}
  </tbody>
</Table>
