<script lang="ts">
  import { Modal, ModalBody, ModalHeader } from 'sveltestrap'
  import { restoreCustomers } from '../customer/customer.store'
  import CustomerTable from '../customer/CustomerTable.svelte'
  import SummaryTable from '../transaction/SummaryTable.svelte'
  import {
    restoreAvailableYears,
    restoreSummaries,
    restoreTransactions,
  } from '../transaction/transaction.store'
  import TransactionTable from '../transaction/TransactionTable.svelte'

  import type { StorageKey } from './Maintenance'
  import YearTable from './YearTable.svelte'
  export let item: StorageKey | undefined

  $: isOpen = item !== undefined
  $: transactions =
    item?.entity === 'transactions'
      ? restoreTransactions(item.customerId, item.year)
      : []
  $: summaries =
    item?.entity === 'summaries'
      ? restoreSummaries(item.customerId, item.year)
      : []
  $: availableYears =
    item?.entity === 'years' ? restoreAvailableYears(item.customerId) : []
  $: customers = item?.entity === 'customers' ? restoreCustomers() : []

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
