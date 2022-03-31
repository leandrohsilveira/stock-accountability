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

  export let tabindex: number
  export let customerId: string
  export let edit: Transaction | undefined = undefined
  export let stockId: string | undefined = undefined
  export let year: number = new Date().getFullYear()
  export let editStockId = false

  let date: Date | string | undefined
  let quantity: number | undefined
  let unitPrice: number | undefined
  let type: TransactionType | undefined
  let addMore = false
  let dirty: Partial<Record<keyof SubmitTransaction, boolean>> = {}
  let stockIdInput: HTMLInputElement
  let dateInput: HTMLInputElement

  const dispatcher = createEventDispatcher<{ submit: SubmitTransaction }>()

  $: stockIdErrors = messages(all(required())(stockId))
  $: dateErrors = messages(all(required(), fixedYear(year))(date))
  $: quantityErrors = messages(all(required(), min(1))(quantity))
  $: unitPriceErrors = messages(all(required(), min(0.01))(unitPrice))
  $: typeErrors = messages(all(required())(type))
  $: valid = isValid(dateErrors, quantityErrors, unitPriceErrors, typeErrors)
  $: isOpen = stockId !== undefined

  $: if (edit) {
    stockId = edit.stockId
  }

  const t = useTranslate(i18n)

  function focus() {
    if (editStockId) stockIdInput.focus()
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
    stockId = undefined
    addMore = false
  }

  function save() {
    if (valid) {
      dispatcher('submit', {
        date: toDate(date),
        customerId,
        quantity,
        unitPrice,
        stockId,
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

<Modal {isOpen} on:open={handleOpen} on:close={clear}>
  <div slot="header">Adicionar movimentação</div>
  <div on:keydown={handleKeyDown}>
    <form on:submit={handleSubmit}>
      <InputContainer
        labelFor="stockId"
        label={$t('stockId')}
        errors={dirty.stockId && stockIdErrors}
      >
        <input
          {tabindex}
          id="stockId"
          name="stockId"
          type="text"
          disabled={!editStockId}
          placeholder={$t('stockId.placeholder')}
          bind:this={stockIdInput}
          bind:value={stockId}
          on:input={() => (dirty = { ...dirty, stockId: true })}
        />
      </InputContainer>
      <InputContainer
        labelFor="date"
        label={$t('date')}
        errors={dirty.date && dateErrors}
      >
        <input
          {tabindex}
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
      <InputContainer labelFor="addNew" label={$t('continue')}>
        <input
          {tabindex}
          id="addNew"
          name="addNew"
          type="checkbox"
          bind:checked={addMore}
        />
      </InputContainer>
      <div class="mt-6 flex flex-row-reverse gap-2">
        <button
          {tabindex}
          type="submit"
          disabled={!valid}
          on:click={handleSubmit}
        >
          {$t('save')}
        </button>
        <button {tabindex} on:click={close}>{$t('cancel')}</button>
      </div>
    </form>
  </div>
</Modal>
