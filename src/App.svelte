<script lang="ts">
  import { Col, Container, Row } from 'sveltestrap'
  import {
    addSuccessMessage,
    messageStore,
  } from './domain/message/message.store'
  import Messages from './domain/message/Messages.svelte'
  import { stockStore } from './domain/stock/stock.store'
  import StockList from './domain/stock/StockList.svelte'
  import type { AddTransaction } from './domain/transaction/Transaction'
  import {
    addTransaction,
    computedTransactionStore,
  } from './domain/transaction/transaction.store'
  import TransactionForm from './domain/transaction/TransactionForm.svelte'
  import TransactionTable from './domain/transaction/TransactionTable.svelte'

  let addTransactionStockId: string | undefined = undefined
  let stockId: string | undefined = undefined

  function handleAddTransaction(event: CustomEvent<string>) {
    addTransactionStockId = event.detail
    stockId = event.detail
  }

  function handleAddTransactionSubmit(event: CustomEvent<AddTransaction>) {
    addTransaction(event.detail)
    addSuccessMessage('Movimentação adicionada com sucesso')
  }
</script>

<Container fluid>
  <Row>
    <Col xs="12" md="6" lg="3">
      <StockList
        items={$stockStore}
        bind:selected={stockId}
        on:addTransaction={handleAddTransaction}
      />
    </Col>
    <Col>
      <h2>Movimentações</h2>
      <TransactionTable items={$computedTransactionStore} {stockId} />
    </Col>
  </Row>
</Container>
<TransactionForm
  bind:stockId={addTransactionStockId}
  on:addTransaction={handleAddTransactionSubmit}
/>
<Messages messages={$messageStore} />
