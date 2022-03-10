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
  import type { AddTransaction, TransactionType } from './Transaction'

  export let stockId: string

  let date: Date | string
  let quantity: number
  let unitPrice: number
  let type: TransactionType
  let dateInput: HTMLInputElement

  const dispatcher = createEventDispatcher<{ addTransaction: AddTransaction }>()

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
    dispatcher('addTransaction', {
      date: toDate(date),
      quantity,
      unitPrice,
      stockId,
      type,
    })
  }

  function handleSubmit(e: Event) {
    save(e)
    close()
  }

  function handleSaveAndNew(e: Event) {
    save(e)
    clear()
    dateInput.focus()
  }

  function handleOpen() {
    dateInput.focus()
  }
</script>

<Modal {isOpen} on:open={handleOpen} on:close={clear}>
  <ModalHeader toggle={close}>Adicionar movimentação</ModalHeader>
  <ModalBody>
    <Form on:submit={handleSubmit}>
      <FormGroup>
        <Label for="stockId">ID da Ação</Label>
        <Input name="stockId" type="text" disabled value={stockId} />
      </FormGroup>
      <FormGroup>
        <Label for="date">Data</Label>
        <Input
          bind:inner={dateInput}
          tabindex={1}
          name="date"
          type="date"
          bind:value={date}
        />
      </FormGroup>
      <FormGroup>
        <Label for="type">Tipo da operação</Label>
        <Input tabindex={2} name="type" type="select" bind:value={type}>
          <option value="PURCHASE">Compra</option>
          <option value="SELL">Venda</option>
        </Input>
      </FormGroup>
      <FormGroup>
        <Label for="quantity">Quantidade</Label>
        <Input
          tabindex={3}
          name="quantity"
          type="number"
          bind:value={quantity}
        />
      </FormGroup>
      <FormGroup>
        <Label for="unitPrice">Preço unitário</Label>
        <MoneyInput tabindex={4} name="unitPrice" bind:value={unitPrice} />
      </FormGroup>
      <button type="submit" hidden />
    </Form>
  </ModalBody>
  <ModalFooter>
    <Button tabindex={5} color="primary" on:click={handleSubmit}>Salvar</Button>
    <Button tabindex={6} color="primary" outline on:click={handleSaveAndNew}>
      Salvar e Novo
    </Button>
  </ModalFooter>
</Modal>
