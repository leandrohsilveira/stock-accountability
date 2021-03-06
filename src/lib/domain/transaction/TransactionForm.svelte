<script lang="ts">
  import InputContainer from '$lib/components/InputContainer.svelte'
  import Modal from '$lib/components/Modal.svelte'

  import { useTranslate } from '$lib/config'
  import MoneyInput from '$lib/components/MoneyInput.svelte'
  import { toDate, toISODateString } from '$lib/util/date'
  import {
    all,
    fixedYear,
    isValid,
    messages,
    min,
    required,
  } from '$lib/util/validate'
  import { createEventDispatcher } from 'svelte'
  import type {
    SubmitTransaction,
    Transaction,
    TransactionType,
  } from './Transaction'
  import i18n from './TransactionForm.i18n.json'
  import type { Stock } from '../stock/Stock'

  export let tabindex: number
  export let customerId: string
  export let edit: Transaction | undefined = undefined
  export let stock: Stock | string | undefined = undefined
  export let year: number = new Date().getFullYear()
  export let editStockId = false

  let date: Date | string | undefined
  let quantity: number | undefined
  let unitPrice: number | undefined
  let type: TransactionType | undefined
  let addMore = false
  let dirty: Partial<Record<keyof SubmitTransaction, boolean>> = {}
  let stockNameInput: HTMLInputElement
  let dateInput: HTMLInputElement

  const dispatcher = createEventDispatcher<{ submit: SubmitTransaction }>()

  $: stockName = typeof stock === 'string' ? stock : stock?.name
  $: stockNameErrors = messages(all(required())(stockName))
  $: dateErrors = messages(all(required(), fixedYear(year))(date))
  $: quantityErrors = messages(all(required(), min(1))(quantity))
  $: unitPriceErrors = messages(all(required(), min(0.01))(unitPrice))
  $: typeErrors = messages(all(required())(type))
  $: valid = isValid(dateErrors, quantityErrors, unitPriceErrors, typeErrors)
  $: isOpen = stock !== undefined

  const t = useTranslate(i18n)

  function focus() {
    if (editStockId) stockNameInput.focus()
    else dateInput.focus()
  }

  function clear() {
    edit = undefined
    date = undefined
    quantity = undefined
    unitPrice = undefined
    type = undefined
    dirty = {}
  }

  function close() {
    stock = undefined
    addMore = false
  }

  function save() {
    if (valid) {
      dispatcher('submit', {
        date: toDate(date),
        customerId,
        quantity,
        unitPrice,
        stock,
        type,
      })
      return true
    }
    return false
  }

  function handleSubmit(e: Event) {
    e.preventDefault()
    if (save()) {
      if (addMore) {
        clear()
        focus()
      } else {
        close()
      }
    }
  }

  function handleOpen() {
    date = toISODateString(edit?.date)
    quantity = edit?.quantity
    unitPrice = edit?.unitPrice
    type = edit?.type
    focus()
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape') close()
  }
</script>

<Modal {isOpen} on:open={handleOpen} on:close={clear} --modal-width="500px">
  <h4 slot="header">Adicionar movimentação</h4>
  <form
    class="flex flex-col gap-6"
    on:keydown={handleKeyDown}
    on:submit={handleSubmit}
  >
    <InputContainer
      labelFor="stockName"
      label={$t('stockName')}
      errors={dirty.stock && stockNameErrors}
    >
      <input
        {tabindex}
        class="input"
        id="stockName"
        name="stockName"
        type="text"
        disabled={!editStockId}
        placeholder={$t('stockName.placeholder')}
        bind:this={stockNameInput}
        bind:value={stockName}
        on:input={() => (dirty = { ...dirty, stock: true })}
      />
    </InputContainer>
    <InputContainer
      labelFor="date"
      label={$t('date')}
      errors={dirty.date && dateErrors}
    >
      <input
        {tabindex}
        class="input"
        id="date"
        name="date"
        type="date"
        placeholder={$t('date.placeholder')}
        bind:this={dateInput}
        bind:value={date}
        on:input={() => (dirty = { ...dirty, date: true })}
      />
    </InputContainer>
    <InputContainer
      labelFor="type"
      label={$t('type')}
      errors={dirty.type && typeErrors}
    >
      <select
        {tabindex}
        class="input"
        id="type"
        name="type"
        type="select"
        placeholder={$t('type.placeholder')}
        bind:value={type}
        on:input={() => (dirty = { ...dirty, type: true })}
      >
        <option value="PURCHASE">{$t('PURCHASE')}</option>
        <option value="SELL">{$t('SELL')}</option>
      </select>
    </InputContainer>
    <InputContainer
      labelFor="quantity"
      label={$t('quantity')}
      errors={dirty.quantity && quantityErrors}
    >
      <input
        {tabindex}
        class="input"
        id="quantity"
        name="quantity"
        type="number"
        placeholder={$t('quantity.placeholder')}
        bind:value={quantity}
        on:input={() => (dirty = { ...dirty, quantity: true })}
      />
    </InputContainer>
    <InputContainer
      labelFor="unitPrice"
      label={$t('unitPrice')}
      errors={dirty.unitPrice && unitPriceErrors}
    >
      <MoneyInput
        {tabindex}
        id="unitPrice"
        name="unitPrice"
        placeholder={$t('unitPrice.placeholder')}
        bind:value={unitPrice}
        on:input={() => (dirty = { ...dirty, unitPrice: true })}
      />
    </InputContainer>
    <div class="checkbox">
      <input
        {tabindex}
        id="addNew"
        name="addNew"
        type="checkbox"
        bind:checked={addMore}
      />
      <label for="addNew" class="label">{$t('continue')}</label>
    </div>
    <div class="flex flex-row-reverse gap-2">
      <button
        {tabindex}
        class="btn btn-full primary"
        type="submit"
        disabled={!valid}
        on:click={handleSubmit}
      >
        {$t('save')}
      </button>
      <button {tabindex} class="btn btn-outline default" on:click={close}>
        {$t('cancel')}
      </button>
    </div>
  </form>
</Modal>
