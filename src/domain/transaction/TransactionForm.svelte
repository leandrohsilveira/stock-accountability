<script lang="ts">
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
  import type { TransactionType } from './Transaction'

  export let stockId: string

  let date: Date
  let quantity: number
  let unitPrice: number
  let type: TransactionType

  $: open = stockId !== undefined

  function close() {
    stockId = undefined
  }

  function handleSubmit() {
    close()
  }
</script>

<Modal bind:open>
  <ModalHeader toggle={close}>Adicionar movimentação</ModalHeader>
  <ModalBody>
    <Form on:submit={handleSubmit}>
      <FormGroup>
        <Label for="id">ID</Label>
        <Input name="id" type="text" disabled value={stockId} />
      </FormGroup>
      <FormGroup>
        <Label for="date">Data</Label>
        <Input name="date" type="date" bind:value={date} />
      </FormGroup>
      <FormGroup>
        <Label for="quantity">Quantidade</Label>
        <Input name="quantity" type="number" bind:value={quantity} />
      </FormGroup>
      <FormGroup>
        <Label for="unitPrice">Quantidade</Label>
        <MoneyInput name="unitPrice" bind:value={unitPrice} />
      </FormGroup>
      <FormGroup>
        <Label for="type">Tipo da operação</Label>
        <Input name="type" type="select" bind:value={type}>
          <option value="PURCHASE">Compra</option>
          <option value="SELL">Venda</option>
        </Input>
      </FormGroup>
    </Form>
  </ModalBody>
  <ModalFooter>
    <Button color="primary" on:click={handleSubmit}>Salvar</Button>
  </ModalFooter>
</Modal>
