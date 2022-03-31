<script lang="ts">
  import { useTranslate } from '$lib/config'
  import CurrencyText from '$lib/components/CurrencyText.svelte'
  import type { Summary } from './Summary'
  import i18n from './SummaryTable.i18n.json'

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

  const t = useTranslate(i18n)
</script>

<div class="table-responsive">
  <table>
    <thead>
      <tr>
        {#if showYear}
          <th>{$t('year')}</th>
        {/if}
        {#if showCustomerId}
          <th>{$t('customerId')}</th>
        {/if}
        <th>{$t('stockId')}</th>
        <th>{$t('amount')}</th>
        <th>{$t('accruedCost')}</th>
        <th>{$t('averageCost')}</th>
        {#if showProfit}
          <th>{$t('totalProfit')}</th>
        {/if}
      </tr>
    </thead>
    <tbody>
      {#if !filtered.length}
        <tr>
          <td colspan={cols}>{$t('noRecordMessage')}</td>
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
  </table>
</div>
