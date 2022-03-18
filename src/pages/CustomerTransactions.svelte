<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { Card, CardBody, CardHeader, Col, Row } from 'sveltestrap'
  import NumberChange from '../components/NumberChange.svelte'
  import Page from '../components/Page.svelte'
  import YearInput from '../components/YearInput.svelte'
  import { findCustomerById } from '../domain/customer/customer.store'
  import {
    addErrorMessage,
    addSuccessMessage,
  } from '../domain/message/message.store'
  import type { EditStock } from '../domain/stock/Stock'
  import { editStock, stockStore } from '../domain/stock/stock.store'
  import StockList from '../domain/stock/StockList.svelte'
  import SummaryChangeTable from '../domain/summary/SummaryChangeTable.svelte'
  import SummaryTable from '../domain/summary/SummaryTable.svelte'
  import type {
    SubmitTransaction,
    Transaction,
  } from '../domain/transaction/Transaction'
  import {
    addTransaction,
    computedTransactionStore,
    deleteTransaction,
    loadTransactions,
    previousSummaryStore,
    summaryStore,
    updateTransaction,
  } from '../domain/transaction/transaction.store'
  import TransactionForm from '../domain/transaction/TransactionForm.svelte'
  import TransactionTable from '../domain/transaction/TransactionTable.svelte'

  export let customerId: string
  export let year: number

  let transactionToEdit: Transaction | undefined = undefined
  let addTransactionStockId: string | undefined = undefined
  let stockId: string | undefined = undefined

  const dispatch = createEventDispatcher<{
    back: undefined
    changeYear: number
  }>()

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
        addSuccessMessage('Movimentação atualizada com sucesso')
      } else {
        addTransaction(event.detail)
        addSuccessMessage('Movimentação adicionada com sucesso')
        stockId = event.detail.stockId
      }
    } catch (e) {
      addErrorMessage(e.message)
    }
  }

  function handleDeleteTransaction(event: CustomEvent<Transaction>) {
    try {
      deleteTransaction(event.detail.id)
      addSuccessMessage('Movimentação excluída com sucesso')
    } catch (e) {
      addErrorMessage(e.message)
    }
  }

  function handleEditStock(event: CustomEvent<EditStock>) {
    try {
      editStock(event.detail)
      addSuccessMessage('Ação renomeada com sucesso')
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
  title={`Movimentações de ${customer.name}`}
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
