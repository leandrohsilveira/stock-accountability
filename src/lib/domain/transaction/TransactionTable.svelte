<script lang="ts">
  import InputContainer from '$lib/components/InputContainer.svelte'

  import { useTranslate } from '$lib/config'
  import CurrencyText from '$lib/components/CurrencyText.svelte'
  import { createEventDispatcher } from 'svelte'
  import {
    isComputedTransaction,
    type ComputedTransaction,
    type Transaction,
  } from './Transaction'
  import TransactionAmountChange from './TransactionAmountChange.svelte'
  import i18n from './TransactionTable.i18n.json'

  export let tabindex: number
  export let stockId: string | undefined = undefined
  export let items: (ComputedTransaction | Transaction)[] = []
  export let computed = false
  export let showId = false

  let month: number | null = null
  let type: string | null = null

  const dispatch = createEventDispatcher<{
    edit: Transaction
    delete: Transaction
  }>()

  $: filtered = filter(items, stockId, month, type)
  $: cols = computed ? (showId ? 11 : 10) : showId ? 7 : 6

  const t = useTranslate(i18n)

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

  function handleDeleteTransaction(transaction: Transaction) {
    dispatch('delete', transaction)
  }
</script>

<form>
  <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5">
    <InputContainer labelFor="month" label={$t('month')}>
      <select
        {tabindex}
        type="select"
        name="month"
        placeholder={$t('month.placeholder')}
        bind:value={month}
      >
        <option value={null}>{$t('theEntireYear')}</option>
        <option value={0}>{$t('january')}</option>
        <option value={1}>{$t('february')}</option>
        <option value={2}>{$t('march')}</option>
        <option value={3}>{$t('april')}</option>
        <option value={4}>{$t('may')}</option>
        <option value={5}>{$t('june')}</option>
        <option value={6}>{$t('july')}</option>
        <option value={7}>{$t('august')}</option>
        <option value={8}>{$t('september')}</option>
        <option value={9}>{$t('october')}</option>
        <option value={10}>{$t('november')}</option>
        <option value={11}>{$t('december')}</option>
      </select>
    </InputContainer>
    <InputContainer labelFor="type" label={$t('operation')}>
      <select
        {tabindex}
        type="select"
        name="type"
        placeholder={$t('operation.placeholder')}
        bind:value={type}
      >
        <option value={null}>{$t('all')}</option>
        <option value="PURCHASE">{$t('PURCHASE')}</option>
        <option value="SELL">{$t('SELL')}</option>
      </select>
    </InputContainer>
  </div>
</form>

<table>
  <thead>
    <tr>
      <th>#</th>
      {#if showId}
        <th>{$t('id')}</th>
      {/if}
      <th>{$t('date')}</th>
      <th>{$t('stock')}</th>
      <th>{$t('operation')}</th>
      <th>{$t('price')}</th>
      <th>{$t('quantity')}</th>
      {#if computed}
        <th>{$t('totalValue')}</th>
        <th>{$t('accruedCost')}</th>
        <th>{$t('averageCost')}</th>
        <th>{$t('profit')}</th>
      {/if}
    </tr>
  </thead>
  <tbody>
    {#if filtered.length === 0}
      <tr><td colspan={cols}>{$t('noTransactionFound')}</td></tr>
    {/if}
    {#each filtered as transaction (transaction.id)}
      <tr>
        <td width="100">
          <button
            class="btn btn-sm btn-link primary"
            {tabindex}
            on:click={() => handleEditTransaction(transaction)}
          >
            E
          </button>
          <button
            class="btn btn-sm btn-link default"
            on:click={() => handleDeleteTransaction(transaction)}
          >
            x
          </button>
        </td>
        {#if showId}
          <th>{transaction.id}</th>
        {/if}
        <td>{transaction.date.toLocaleDateString('pt-br')}</td>
        <td>{transaction.stockId}</td>
        <td>{$t(transaction.type)}</td>
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
      </tr>
    {/each}
  </tbody>
</table>
