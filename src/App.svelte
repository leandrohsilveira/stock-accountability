<script lang="ts">
  import { Col, Container, Row } from 'sveltestrap'
  import { stockStore } from './domain/stock/stock.store'
  import StockList from './domain/stock/StockList.svelte'
  import { transactionStore } from './domain/transaction/transaction.store'
  import TransactionTable from './domain/transaction/TransactionTable.svelte'

  let stockId: string | undefined = undefined
</script>

<Container fluid>
  <Row>
    <Col xs="12" md="6" lg="3">
      <StockList items={$stockStore} bind:selected={stockId} />
    </Col>
    <Col>
      <h2>Movimentações</h2>
      <TransactionTable items={$transactionStore} {stockId} />
    </Col>
  </Row>
</Container>
