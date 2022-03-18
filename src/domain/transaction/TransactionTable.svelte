<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  import {
    Button,
    Col,
    Form,
    FormGroup,
    Icon,
    Input,
    Label,
    Row,
    Table,
  } from 'sveltestrap'
  import CurrencyText from '../../components/CurrencyText.svelte'
  import {
    ComputedTransaction,
    isComputedTransaction,
    Transaction,
  } from './Transaction'
  import TransactionAmountChange from './TransactionAmountChange.svelte'

  export let tabindex: number
  export let stockId: string | undefined = undefined
  export let items: (ComputedTransaction | Transaction)[] = []
  export let computed = false
  export let showId = false

  let month: number | null = null
  let type: string | null = null

  const dispatch = createEventDispatcher<{ edit: Transaction }>()

  $: filtered = filter(items, stockId, month, type)
  $: cols = computed ? (showId ? 11 : 10) : showId ? 7 : 6

  function filter(
    collection: (ComputedTransaction | Transaction)[],
    search: string | undefined,
    _month: number | null,
    _type: string | null
  ) {
    if (stockId || _month !== undefined)
      return collection.filter(
        (item) =>
          (!stockId || item.stockId === search) &&
          (_month === null || item.date.getMonth() === _month) &&
          (_type === null || item.type === _type)
      )
    return collection
  }

  function handleEditTransaction(transaction: Transaction) {
    dispatch('edit', transaction)
  }
</script>

<Form inline>
  <Row>
    <Col xs="6" sm="4" lg="3" xl="2">
      <FormGroup>
        <Label for="month">Mês</Label>
        <Input {tabindex} type="select" name="month" bind:value={month}>
          <option value={null}>O ano todo</option>
          <option value={0}>Janeiro</option>
          <option value={1}>Fevereiro</option>
          <option value={2}>Março</option>
          <option value={3}>Abril</option>
          <option value={4}>Maio</option>
          <option value={5}>Junho</option>
          <option value={6}>Julho</option>
          <option value={7}>Agosto</option>
          <option value={8}>Setembro</option>
          <option value={9}>Outubro</option>
          <option value={10}>Novembro</option>
          <option value={11}>Dezembro</option>
        </Input>
      </FormGroup>
    </Col>
    <Col xs="6" sm="4" lg="3" xl="2">
      <FormGroup>
        <Label for="type">Operação</Label>
        <Input {tabindex} type="select" name="type" bind:value={type}>
          <option value={null}>Todas</option>
          <option value="PURCHASE">Compra</option>
          <option value="SELL">Venda</option>
        </Input>
      </FormGroup>
    </Col>
  </Row>
</Form>

<Table responsive striped>
  <thead>
    <tr>
      {#if showId}
        <th>ID</th>
      {/if}
      <th>Data</th>
      <th>ID da Ação</th>
      <th>Operação</th>
      <th>Preço</th>
      <th>Quantidade</th>
      {#if computed}
        <th>Valor total</th>
        <th>Custo acumulado</th>
        <th>Custo médio</th>
        <th>Lucro</th>
      {/if}
      <th>#</th>
    </tr>
  </thead>
  <tbody>
    {#if filtered.length === 0}
      <tr><td colspan={cols}>Nenhuma movimentação encontrada</td></tr>
    {/if}
    {#each filtered as transaction (transaction.id)}
      <tr>
        {#if showId}
          <th>{transaction.id}</th>
        {/if}
        <td>{transaction.date.toLocaleDateString('pt-br')}</td>
        <td>{transaction.stockId}</td>
        <td>{transaction.type}</td>
        <td><CurrencyText value={transaction.unitPrice} /></td>
        {#if computed && isComputedTransaction(transaction)}
          <td width="150"><TransactionAmountChange value={transaction} /></td>
          <td><CurrencyText value={transaction.total} /></td>
          <td><CurrencyText value={transaction.accruedCost} /></td>
          <td><CurrencyText value={transaction.averageCost} /></td>
          <td><CurrencyText value={transaction.profit} /></td>
        {:else}
          <td colspan={computed ? 5 : 1}>{transaction.quantity}</td>
        {/if}
        <td width="50">
          <Button
            size="sm"
            color="link"
            {tabindex}
            on:click={() => handleEditTransaction(transaction)}
          >
            <Icon name="pencil" />
          </Button>
        </td>
      </tr>
    {/each}
  </tbody>
</Table>
