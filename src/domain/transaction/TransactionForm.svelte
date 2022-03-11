<script lang="ts">
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
  import MoneyInput from '../../components/MoneyInput.svelte'
  import { toDate } from '../../util/date'
  import { all, isValid, min, required, messages } from '../../util/validate'
  import type { AddTransaction, TransactionType } from './Transaction'

  export let stockId: string

  let date: Date | string
  let quantity: number
  let unitPrice: number
  let type: TransactionType
  let dateInput: HTMLInputElement
  const dirty: Partial<Record<keyof AddTransaction, boolean>> = {}

  const dispatcher = createEventDispatcher<{ addTransaction: AddTransaction }>()

  $: dateErrors = messages(all(required())(date))
  $: quantityErrors = messages(all(required(), min(1))(quantity))
  $: unitPriceErrors = messages(all(required(), min(0.01))(unitPrice))
  $: typeErrors = messages(all(required())(type))
  $: valid = isValid(dateErrors, quantityErrors, unitPriceErrors, typeErrors)
  $: isOpen = stockId !== undefined

  function clear() {
    date = undefined
    quantity = undefined
    unitPrice = undefined
    type = undefined
  }

  function close() {
    stockId = undefined
  }

  function save(e: Event) {
    e.preventDefault()
    if (valid) {
      dispatcher('addTransaction', {
        date: toDate(date),
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
    if (save(e)) close()
  }

  function handleSaveAndNew(e: Event) {
    if (save(e)) {
      clear()
      dateInput.focus()
    }
  }

  function handleOpen() {
    dateInput.focus()
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
          <Label for="stockId">ID da Ação</Label>
          <Input name="stockId" type="text" disabled value={stockId} />
        </FormGroup>
        <FormGroup>
          <Label for="date">Data</Label>
          <Input
            tabindex={1}
            name="date"
            type="date"
            feedback={dateErrors}
            invalid={dateErrors.length > 0}
            bind:inner={dateInput}
            bind:value={date}
            on:input={() => (dirty.date = true)}
          />
        </FormGroup>
        <FormGroup>
          <Label for="type">Tipo da operação</Label>
          <Input
            tabindex={1}
            name="type"
            type="select"
            feedback={typeErrors}
            invalid={typeErrors.length > 0}
            bind:value={type}
            on:input={() => (dirty.type = true)}
          >
            <option value="PURCHASE">Compra</option>
            <option value="SELL">Venda</option>
          </Input>
        </FormGroup>
        <FormGroup>
          <Label for="quantity">Quantidade</Label>
          <Input
            tabindex={1}
            name="quantity"
            type="number"
            feedback={quantityErrors}
            invalid={quantityErrors.length > 0}
            bind:value={quantity}
            on:input={() => (dirty.quantity = true)}
          />
        </FormGroup>
        <FormGroup>
          <Label for="unitPrice">Preço unitário</Label>
          <MoneyInput
            tabindex={1}
            feedback={unitPriceErrors}
            invalid={unitPriceErrors.length > 0}
            name="unitPrice"
            bind:value={unitPrice}
            on:input={() => (dirty.unitPrice = true)}
          />
        </FormGroup>
        <button type="submit" hidden />
      </Form>
    </div>
  </ModalBody>
  <ModalFooter>
    <Button
      tabindex={1}
      color="primary"
      disabled={!valid}
      on:click={handleSubmit}
    >
      Salvar
    </Button>
    <Button
      tabindex={1}
      color="primary"
      disabled={!valid}
      outline
      on:click={handleSaveAndNew}
    >
      Salvar e Novo
    </Button>
  </ModalFooter>
</Modal>
