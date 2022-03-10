<script lang="ts">
  import { Column, Table } from 'sveltestrap'
  import CurrencyText from '../../components/CurrencyText.svelte'
  import type { Transaction } from './Transaction'

  export let stockId: string | undefined = undefined
  export let items: Transaction[] = []

  $: filtered = filter(items, stockId)

  function filter(collection: Transaction[], search: string | undefined) {
    if (stockId) return collection.filter(({ id }) => id === search)
    return collection
  }
</script>

<Table rows={filtered} let:row responsive striped>
  <Column header="Data">{row.date.toLocaleDateString('pt-br')}</Column>
  <Column header="ID">{row.id}</Column>
  <Column header="Operação">{row.type}</Column>
  <Column header="Qtd">{row.quantity}</Column>
  <Column header="Valor"><CurrencyText value={row.unitPrice} /></Column>
  <Column header="Total">
    <CurrencyText value={row.unitPrice * row.quantity} />
  </Column>
</Table>
