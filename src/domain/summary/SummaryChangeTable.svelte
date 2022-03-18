<script lang="ts">
  import { Table } from 'sveltestrap'
  import CurrencyText from '../../components/CurrencyText.svelte'
  import NumberChange from '../../components/NumberChange.svelte'

  import { mergeSummaries, Summary } from './Summary'

  export let previousSummaries: Summary[]
  export let currentSummaries: Summary[]
  export let stockId: string | undefined = undefined
  export let noRecordMessage = 'Nenhum registro encontrado'

  $: summaries = mergeSummaries(previousSummaries, currentSummaries).filter(
    (item) => stockId === undefined || item.stockId === stockId
  )
</script>

<Table borderless responsive striped>
  <thead>
    <tr>
      <th>ID da ação</th>
      <th class="text-center">Estoque</th>
      <th class="text-center">Custo acumulado</th>
      <th class="text-center">Custo médio</th>
      <th>Lucro total</th>
    </tr>
  </thead>
  <tbody>
    {#if !summaries.length}
      <tr>
        <td colspan="5">{noRecordMessage}</td>
      </tr>
    {/if}
    {#each summaries as item (item.stockId)}
      <tr>
        <td>{item.stockId}</td>
        <td>
          <NumberChange start={item.previousAmount} end={item.currentAmount} />
        </td>
        <td>
          <NumberChange
            start={item.previousAccruedCost}
            end={item.currentAccruedCost}
            currency
          />
        </td>
        <td>
          <NumberChange
            start={item.previousAverageCost}
            end={item.currentAverageCost}
            currency
          />
        </td>
        <td><CurrencyText value={item.totalProfit} /></td>
      </tr>
    {/each}
  </tbody>
</Table>
