<script context="module" lang="ts">
  import { useModule } from '$lib/config/di'
  import { AvailableYearsModule } from '../availableYear/AvailableYearsModule'
  import { SummaryModule } from '../summary/SummaryModule'

  useModule(AvailableYearsModule)
  useModule(SummaryModule)
</script>

<script lang="ts">
  import Modal from '$lib/components/Modal.svelte'
  import { useTranslate } from '$lib/config'
  import { getInstance } from '$lib/config/di'
  import SummaryTable from '$lib/domain/summary/SummaryTable.svelte'
  import { AvailableYearsService } from '../availableYear/AvailableYearsService'
  import { SummaryService } from '../summary/SummaryService'
  import type { StorageKey } from './Maintenance'
  import i18n from './StorageKeyDetail.i18n.json'
  import YearTable from './YearTable.svelte'

  const summaryService = getInstance(SummaryService)
  const availableYearsService = getInstance(AvailableYearsService)

  export let item: StorageKey | undefined = undefined

  $: isOpen = item !== undefined
  $: data$ = Promise.all([
    item?.entity === 'summaries'
      ? summaryService.findAll(item.customerId, item.year)
      : Promise.resolve([]),
    item?.entity === 'years'
      ? availableYearsService.findAll(item.customerId)
      : Promise.resolve([]),
  ])

  const t = useTranslate(i18n)

  function close() {
    item = undefined
  }
</script>

<Modal bind:isOpen on:close={close}>
  <h5 slot="header">{$t('key')}: {item.key}</h5>
  {#await data$ then [summaries, availableYears]}
    {#if item?.entity === 'years'}
      <YearTable years={availableYears} />
    {/if}
    {#if item?.entity === 'summaries'}
      <SummaryTable items={summaries} showYear showCustomerId showProfit />
    {/if}
  {/await}
  <div slot="footer" class="flex flex-row-reverse">
    <button class="btn btn-full default" type="button" on:click={close}>
      Close
    </button>
  </div>
</Modal>
