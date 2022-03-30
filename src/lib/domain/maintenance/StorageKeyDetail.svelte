<script lang="ts">
  import { useTranslate } from '$lib/config'
  import { availableYearsStorage } from '$lib/domain/availableYear/availableYear.store'
  import { customerStorage } from '$lib/domain/customer/customer.store'
  import CustomerTable from '$lib/domain/customer/CustomerTable.svelte'
  import { summaryStorage } from '$lib/domain/summary/summary.store'
  import SummaryTable from '$lib/domain/summary/SummaryTable.svelte'
  import { transactionStorage } from '$lib/domain/transaction/transaction.store'
  import TransactionTable from '$lib/domain/transaction/TransactionTable.svelte'
  import { Modal, ModalBody, ModalHeader } from 'sveltestrap'
  import type { StorageKey } from './Maintenance'
  import i18n from './StorageKeyDetail.i18n.json'
  import YearTable from './YearTable.svelte'

  export let item: StorageKey | undefined

  $: isOpen = item !== undefined
  $: transactions =
    item?.entity === 'transactions'
      ? transactionStorage.restore([item.customerId, item.year])
      : []
  $: summaries =
    item?.entity === 'summaries'
      ? summaryStorage.restore([item.customerId, item.year])
      : []
  $: availableYears =
    item?.entity === 'years'
      ? availableYearsStorage.restore([item.customerId])
      : []
  $: customers = item?.entity === 'customers' ? customerStorage.restore([]) : []

  const t = useTranslate(i18n)

  function close() {
    item = undefined
  }
</script>

<Modal size="lg" bind:isOpen>
  <ModalHeader toggle={close}>{$t('key')}: {item.key}</ModalHeader>
  <ModalBody>
    {#if item?.entity === 'transactions'}
      <TransactionTable showId tabindex={1} items={transactions} />
    {/if}
    {#if item?.entity === 'customers'}
      <CustomerTable showId items={customers} />
    {/if}
    {#if item?.entity === 'years'}
      <YearTable years={availableYears} />
    {/if}
    {#if item?.entity === 'summaries'}
      <SummaryTable items={summaries} showYear showCustomerId showProfit />
    {/if}
  </ModalBody>
</Modal>
