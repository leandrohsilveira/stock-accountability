<script lang="ts">
  import Card from '$lib/components/Card.svelte'
  import NumberChange from '$lib/components/NumberChange.svelte'
  import Page from '$lib/components/Page.svelte'
  import YearInput from '$lib/components/YearInput.svelte'
  import { useTranslate } from '$lib/config'
  import {
    customerServiceFactory,
    stockServiceFactory,
    summaryServiceFactory,
    transactionServiceFactory,
  } from '$lib/config/di'
  import {
    addErrorMessage,
    addSuccessMessage,
  } from '$lib/domain/message/message.store'
  import type { EditStock, Stock } from '$lib/domain/stock/Stock'
  import StockList from '$lib/domain/stock/StockList.svelte'
  import SummaryChangeTable from '$lib/domain/summary/SummaryChangeTable.svelte'
  import type {
    SubmitTransaction,
    Transaction,
  } from '$lib/domain/transaction/Transaction'
  import TransactionDeleteDialog from '$lib/domain/transaction/TransactionDeleteDialog.svelte'
  import TransactionForm from '$lib/domain/transaction/TransactionForm.svelte'
  import TransactionTable from '$lib/domain/transaction/TransactionTable.svelte'
  import { createEventDispatcher, onMount } from 'svelte'
  import { on } from '../event/eventStore'

  const stockService = stockServiceFactory.get()
  const customerService = customerServiceFactory.get()
  const summaryService = summaryServiceFactory.get()
  const transactionService = transactionServiceFactory.get()

  const dispatch = createEventDispatcher<{
    back: undefined
    changeYear: number
  }>()

  const t = useTranslate({
    'pt-br': {
      addTransactionSuccessful: 'Movimentação adicionada com sucesso',
      updateTransactionSuccessful: 'Movimentação atualizada com sucesso',
      deleteTransactionSuccessful: 'Movimentação excluída com sucesso',
      stockRenameSuccessful: 'Ação renomeada com sucesso',
      transactionsOfCustomer: 'Movimentações de {0}',
      transactions: 'Movimentações',
    },
  })

  export let customerId: string
  export let year: number

  let transactionToEdit: Transaction | undefined = undefined
  let transactionToDelete: Transaction | undefined = undefined
  let transactionStock: Stock | string | undefined = undefined
  let stock: Stock | undefined = undefined

  $: data$ = Promise.all([
    transactionService.findAll(customerId, year),
    stockService.findAll(customerId),
    customerService.findById(customerId),
    summaryService.findAll(customerId, year),
    summaryService.findAllPreviousYear(customerId, year),
  ])

  onMount(() =>
    on('transactions', async () => {
      const [, , customer] = await data$
      data$ = Promise.all([
        transactionService.findAll(customerId, year),
        stockService.findAll(customerId),
        Promise.resolve(customer),
        summaryService.findAll(customerId, year),
        summaryService.findAllPreviousYear(customerId, year),
      ])
      await data$
    })
  )

  function handleChangeYear(e: CustomEvent<number>) {
    year = e.detail
    dispatch('changeYear', year)
  }

  function handleAddTransaction(event: CustomEvent<Stock>) {
    transactionStock = event.detail
    stock = event.detail
  }

  function handleAddStockWithTransaction(event: CustomEvent<string>) {
    transactionStock = event.detail
  }

  async function handleSubmitTransaction(
    event: CustomEvent<SubmitTransaction>
  ) {
    try {
      if (transactionToEdit) {
        await transactionService.update(transactionToEdit.id, event.detail)
        addSuccessMessage($t('updateTransactionSuccessful'))
      } else {
        await transactionService.create(event.detail)
        addSuccessMessage($t('addTransactionSuccessful'))
        stock = undefined
      }
    } catch (e) {
      addErrorMessage(e.message)
    }
  }

  function handleDeleteTransaction(event: CustomEvent<Transaction>) {
    transactionToDelete = event.detail
  }

  async function handleConfirmTransactionDelete(
    event: CustomEvent<Transaction>
  ) {
    try {
      await transactionService.delete(event.detail.id)
      addSuccessMessage($t('deleteTransactionSuccessful'))
    } catch (e) {
      addErrorMessage(e.message)
    }
  }

  async function handleEditStock(event: CustomEvent<EditStock>) {
    try {
      await stockService.update(event.detail)
      addSuccessMessage($t('stockRenameSuccessful'))
    } catch (error) {
      addErrorMessage(error.message)
    }
  }

  async function handleEditTransaction(event: CustomEvent<Transaction>) {
    const [, stocks] = await data$
    transactionStock = stocks.find((s) => s.id === event.detail.stockId)
    transactionToEdit = event.detail
  }

  function handleBackClick() {
    dispatch('back')
  }
</script>

{#await data$ then [transactions, stocks, customer, summaries, previousSummaries]}
  <Page
    title={$t('transactionsOfCustomer', customer?.name)}
    back
    on:back={handleBackClick}
  >
    <div class="flex justify-center">
      <YearInput tabindex={3} value={year} on:change={handleChangeYear} />
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 pt-3">
      <StockList
        tabindex={2}
        items={stocks}
        bind:selected={stock}
        on:addTransaction={handleAddTransaction}
        on:addStockWithTransaction={handleAddStockWithTransaction}
        on:editStock={handleEditStock}
      />
      <div class="lg:col-span-3 flex flex-col gap-6">
        <Card>
          <div class="flex flex-col justify-center gap-6">
            <strong class="text-primary-base">
              <NumberChange start={year - 1} end={year} />
            </strong>
            <SummaryChangeTable
              {stocks}
              {previousSummaries}
              currentSummaries={summaries.length
                ? summaries
                : previousSummaries}
            />
          </div>
        </Card>
        <Card>
          <div class="flex flex-col gap-6">
            <h4>{$t('transactions')}</h4>
            <TransactionTable
              tabindex={4}
              items={transactions}
              {stock}
              {stocks}
              computed
              on:edit={handleEditTransaction}
              on:delete={handleDeleteTransaction}
            />
          </div>
        </Card>
      </div>
    </div>
  </Page>
{/await}

<TransactionForm
  {customerId}
  {year}
  tabindex={3}
  bind:edit={transactionToEdit}
  bind:stock={transactionStock}
  on:submit={handleSubmitTransaction}
/>
<TransactionDeleteDialog
  bind:transaction={transactionToDelete}
  on:confirm={handleConfirmTransactionDelete}
/>
