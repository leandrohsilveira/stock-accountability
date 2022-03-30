<script lang="ts">
  import { useTranslate } from '$lib/config'
  import MoneyInput from '$lib/domain/components/MoneyInput.svelte'
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
  import {
    Button,
    Form,
    FormGroup,
    Input,
    Label,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
  } from 'sveltestrap'
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
  <ModalHeader toggle={close}>Adicionar movimentação</ModalHeader>
  <ModalBody>
    <div on:keydown={handleKeyDown}>
      <Form on:submit={handleSubmit}>
        <FormGroup>
          <Label for="stockId">{$t('stockId')}</Label>
          <Input
            {tabindex}
            name="stockId"
            type="text"
            feedback={stockIdErrors}
            invalid={dirty.stockId && stockIdErrors.length > 0}
            disabled={!editStockId}
            placeholder={$t('stockId.placeholder')}
            bind:inner={stockIdInput}
            bind:value={stockId}
            on:input={() => (dirty = { ...dirty, stockId: true })}
          />
        </FormGroup>
        <FormGroup>
          <Label for="date">{$t('date')}</Label>
          <Input
            {tabindex}
            name="date"
            type="date"
            feedback={dateErrors}
            invalid={dirty.date && dateErrors.length > 0}
            placeholder={$t('date.placeholder')}
            bind:inner={dateInput}
            bind:value={date}
            on:input={() => (dirty = { ...dirty, date: true })}
          />
        </FormGroup>
        <FormGroup>
          <Label for="type">{$t('type')}</Label>
          <Input
            {tabindex}
            name="type"
            type="select"
            feedback={typeErrors}
            invalid={dirty.type && typeErrors.length > 0}
            placeholder={$t('type.placeholder')}
            bind:value={type}
            on:input={() => (dirty = { ...dirty, type: true })}
          >
            <option value="PURCHASE">{$t('PURCHASE')}</option>
            <option value="SELL">{$t('SELL')}</option>
          </Input>
        </FormGroup>
        <FormGroup>
          <Label for="quantity">{$t('quantity')}</Label>
          <Input
            {tabindex}
            name="quantity"
            type="number"
            feedback={quantityErrors}
            invalid={dirty.quantity && quantityErrors.length > 0}
            placeholder={$t('quantity.placeholder')}
            bind:value={quantity}
            on:input={() => (dirty = { ...dirty, quantity: true })}
          />
        </FormGroup>
        <FormGroup>
          <Label for="unitPrice">{$t('unitPrice')}</Label>
          <MoneyInput
            {tabindex}
            name="unitPrice"
            feedback={unitPriceErrors}
            invalid={dirty.unitPrice && unitPriceErrors.length > 0}
            placeholder={$t('unitPrice.placeholder')}
            bind:value={unitPrice}
            on:input={() => (dirty = { ...dirty, unitPrice: true })}
          />
        </FormGroup>
        <FormGroup>
          <Input
            {tabindex}
            type="checkbox"
            name="addNew"
            label={$t('continue')}
            bind:checked={addMore}
          />
        </FormGroup>
        <button type="submit" hidden />
      </Form>
    </div>
  </ModalBody>
  <ModalFooter>
    <Button {tabindex} outline on:click={close}>{$t('cancel')}</Button>
    <Button
      {tabindex}
      color="primary"
      disabled={!valid}
      on:click={handleSubmit}
    >
      {$t('save')}
    </Button>
  </ModalFooter>
</Modal>
