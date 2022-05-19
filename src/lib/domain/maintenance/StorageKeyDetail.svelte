<script lang="ts">
  import Modal from '$lib/components/Modal.svelte'
  import { useTranslate } from '$lib/config'
  import {
    availableYearsServiceFactory,
    summaryServiceFactory,
  } from '$lib/config/di'
  import SummaryTable from '$lib/domain/summary/SummaryTable.svelte'
  import type { StorageKey } from './Maintenance'
  import i18n from './StorageKeyDetail.i18n.json'
  import YearTable from './YearTable.svelte'

  const summaryService = summaryServiceFactory.get()
  const availableYearsService = availableYearsServiceFactory.get()

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
