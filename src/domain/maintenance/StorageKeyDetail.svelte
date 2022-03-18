<script lang="ts">
  import { Modal, ModalBody, ModalHeader } from 'sveltestrap'
  import { availableYearsStorage } from '../availableYear/availableYear.store'
  import { customerStorage } from '../customer/customer.store'
  import CustomerTable from '../customer/CustomerTable.svelte'
  import { summaryStorage } from '../summary/summary.store'
  import SummaryTable from '../summary/SummaryTable.svelte'
  import { transactionStorage } from '../transaction/transaction.store'
  import TransactionTable from '../transaction/TransactionTable.svelte'
  import type { StorageKey } from './Maintenance'
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

  function close() {
    item = undefined
  }
</script>

<Modal size="lg" bind:isOpen>
  <ModalHeader toggle={close}>Chave: {item.key}</ModalHeader>
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
