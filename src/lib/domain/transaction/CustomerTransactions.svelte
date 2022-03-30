<script lang="ts">
  import { useTranslate } from '$lib/config'
  import NumberChange from '$lib/domain/components/NumberChange.svelte'
  import Page from '$lib/domain/components/Page.svelte'
  import YearInput from '$lib/domain/components/YearInput.svelte'
  import { findCustomerById } from '$lib/domain/customer/customer.store'
  import {
    addErrorMessage,
    addSuccessMessage,
  } from '$lib/domain/message/message.store'
  import type { EditStock } from '$lib/domain/stock/Stock'
  import { editStock, stockStore } from '$lib/domain/stock/stock.store'
  import StockList from '$lib/domain/stock/StockList.svelte'
  import SummaryChangeTable from '$lib/domain/summary/SummaryChangeTable.svelte'
  import type {
    SubmitTransaction,
    Transaction,
  } from '$lib/domain/transaction/Transaction'
  import {
    addTransaction,
    computedTransactionStore,
    deleteTransaction,
    loadTransactions,
    previousSummaryStore,
    summaryStore,
    updateTransaction,
  } from '$lib/domain/transaction/transaction.store'
  import TransactionDeleteDialog from '$lib/domain/transaction/TransactionDeleteDialog.svelte'
  import TransactionForm from '$lib/domain/transaction/TransactionForm.svelte'
  import TransactionTable from '$lib/domain/transaction/TransactionTable.svelte'
  import { createEventDispatcher } from 'svelte'
  import { Card, CardBody, Col, Row } from 'sveltestrap'

  export let customerId: string
  export let year: number

  let transactionToEdit: Transaction | undefined = undefined
  let transactionToDelete: Transaction | undefined = undefined
  let addTransactionStockId: string | undefined = undefined
  let stockId: string | undefined = undefined

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
      transactionOfCustomer: 'Movimentações de {0}',
    },
  })

  $: customer = findCustomerById(customerId)

  $: {
    loadTransactions(customerId, year)
  }

  function handleChangeYear(e: CustomEvent<number>) {
    year = e.detail
    dispatch('changeYear', year)
  }

  function handleAddTransaction(event: CustomEvent<string>) {
    addTransactionStockId = event.detail
    stockId = event.detail
  }

  function handleAddStockWithTransaction(event: CustomEvent<string>) {
    addTransactionStockId = event.detail
  }

  function handleSubmitTransaction(event: CustomEvent<SubmitTransaction>) {
    try {
      if (transactionToEdit) {
        updateTransaction(transactionToEdit.id, event.detail)
        addSuccessMessage($t('updateTransactionSuccessful'))
      } else {
        addTransaction(event.detail)
        addSuccessMessage($t('addTransactionSuccessful'))
        stockId = event.detail.stockId
      }
    } catch (e) {
      addErrorMessage(e.message)
    }
  }

  function handleDeleteTransaction(event: CustomEvent<Transaction>) {
    transactionToDelete = event.detail
  }

  function handleConfirmTransactionDelete(event: CustomEvent<Transaction>) {
    try {
      deleteTransaction(event.detail.id)
      addSuccessMessage($t('deleteTransactionSuccessful'))
    } catch (e) {
      addErrorMessage(e.message)
    }
  }

  function handleEditStock(event: CustomEvent<EditStock>) {
    try {
      editStock(event.detail)
      addSuccessMessage($t('stockRenameSuccessful'))
    } catch (error) {
      addErrorMessage(error.message)
    }
  }

  function handleEditTransaction(event: CustomEvent<Transaction>) {
    transactionToEdit = event.detail
  }

  function handleBackClick() {
    dispatch('back')
  }
</script>

<Page
  title={$t('transactionOfCustomer', customer.name)}
  back
  on:back={handleBackClick}
>
  <Row>
    <Col>
      <YearInput tabindex={3} value={year} on:change={handleChangeYear} />
    </Col>
  </Row>
  <Row>
    <Col class="mt-3" md="12" lg="3">
      <StockList
        tabindex={2}
        items={$stockStore}
        bind:selected={stockId}
        on:addTransaction={handleAddTransaction}
        on:addStockWithTransaction={handleAddStockWithTransaction}
        on:editStock={handleEditStock}
      />
    </Col>
    <Col class="mt-3" md="12" lg="9">
      <Row>
        <Col>
          <Card>
            <CardBody>
              <strong><NumberChange start={year - 1} end={year} /></strong>
              <SummaryChangeTable
                previousSummaries={$previousSummaryStore}
                currentSummaries={$summaryStore}
              />
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row class="mt-3">
        <Col>
          <Card>
            <CardBody>
              <h4>Movimentações</h4>
              <TransactionTable
                tabindex={4}
                items={$computedTransactionStore}
                {stockId}
                computed
                on:edit={handleEditTransaction}
                on:delete={handleDeleteTransaction}
              />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Col>
  </Row>
</Page>
<TransactionForm
  {customerId}
  {year}
  tabindex={3}
  bind:edit={transactionToEdit}
  bind:stockId={addTransactionStockId}
  on:submit={handleSubmitTransaction}
/>
<TransactionDeleteDialog
  bind:transaction={transactionToDelete}
  on:confirm={handleConfirmTransactionDelete}
/>
