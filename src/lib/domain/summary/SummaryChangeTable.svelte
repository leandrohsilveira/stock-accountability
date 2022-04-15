<script lang="ts">
  import { useTranslate } from '$lib/config'
  import CurrencyText from '$lib/components/CurrencyText.svelte'
  import NumberChange from '$lib/components/NumberChange.svelte'
  import { mergeSummaries, type Summary } from './Summary'
  import i18n from './SummaryChangeTable.i18n.json'
  import type { Stock } from '../stock/Stock'
  import StockRef from '../stock/StockRef.svelte'

  export let stocks: Stock[]
  export let previousSummaries: Summary[]
  export let currentSummaries: Summary[]
  export let stockId: string | undefined = undefined

  $: summaries = mergeSummaries(previousSummaries, currentSummaries).filter(
    (item) => stockId === undefined || item.stockId === stockId
  )

  const t = useTranslate(i18n)
</script>

<div class="table-responsive">
  <table class="stripped">
    <thead>
      <tr>
        <th>{$t('stockId')}</th>
        <th class="text-center">{$t('amount')}</th>
        <th class="text-center">{$t('accruedCost')}</th>
        <th class="text-center">{$t('averageCost')}</th>
        <th>{$t('totalProfit')}</th>
      </tr>
    </thead>
    <tbody>
      {#if !summaries.length}
        <tr>
          <td colspan="5">{$t('noRecordMessage')}</td>
        </tr>
      {/if}
      {#each summaries as item (item.stockId)}
        <tr>
          <td><StockRef id={item.stockId} {stocks} /></td>
          <td>
            <NumberChange
              start={item.previousAmount}
              end={item.currentAmount}
            />
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
  </table>
</div>
