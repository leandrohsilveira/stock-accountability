<script lang="ts">
  import { useTranslate } from '$lib/config'
  import { createEventDispatcher, onMount } from 'svelte'
  import {
    Badge,
    Button,
    Form,
    Icon,
    Input,
    InputGroup,
    ListGroup,
    ListGroupItem,
  } from 'sveltestrap'
  import type { EditStock, Stock } from './Stock'
  import i18n from './StockList.i18n.json'

  export let tabindex: number
  export let selected: string | undefined = undefined
  export let items: Stock[] = []
  let filter = ''
  let editing: string | undefined = undefined
  let newStockId: string | undefined = undefined
  let inputEditStock: HTMLInputElement
  let filterInput: HTMLInputElement

  const dispatch = createEventDispatcher<{
    addTransaction: string
    addStockWithTransaction: string
    editStock: EditStock
  }>()

  $: filtered = items.filter(
    (item) => item.id.toUpperCase().indexOf(filter.toUpperCase()) >= 0
  )

  $: if (inputEditStock) {
    inputEditStock.focus()
  }

  const t = useTranslate(i18n)

  onMount(() => {
    filterInput.focus()
  })

  function handleAddTransaction(event: Event, stockId: string) {
    event.stopPropagation()
    dispatch('addTransaction', stockId)
  }

  function handleAddStockWithTransaction() {
    dispatch('addStockWithTransaction', filter.toUpperCase())
  }

  function handleFilterTransactions(stockId: string) {
    selected = selected !== stockId ? stockId : undefined
  }

  function handleEditStock(event: Event, stockId: string) {
    event.stopPropagation()
    editing = stockId
    newStockId = stockId
  }

  function handleSaveStock(event: Event) {
    event.stopPropagation()
    dispatch('editStock', {
      previousId: editing,
      newId: newStockId,
    })
    closeEditStock()
  }

  function handleCancelEditStock(event: Event) {
    event.stopPropagation()
    closeEditStock()
  }

  function closeEditStock() {
    editing = undefined
    newStockId = undefined
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      closeEditStock()
      selected = undefined
      filter = ''
      filterInput.focus()
    }
  }
</script>

<div on:keydown={handleKeyDown}>
  <ListGroup>
    <ListGroupItem>
      <Input
        {tabindex}
        type="search"
        placeholder={$t('findStock')}
        bind:inner={filterInput}
        bind:value={filter}
      />
    </ListGroupItem>
    {#if !filter && items.length === 0}
      <ListGroupItem disabled>
        {$t('noStockFoundTypeAnIdToAddNewTransaction')}
      </ListGroupItem>
    {/if}
    {#each filtered as item}
      {#if editing === item.id}
        <ListGroupItem>
          <Form on:submit={handleSaveStock}>
            <InputGroup>
              <Input
                {tabindex}
                type="text"
                bind:inner={inputEditStock}
                bind:value={newStockId}
              />
              <Button
                {tabindex}
                type="submit"
                color="primary"
                on:click={handleSaveStock}
              >
                <Icon name="check2" />
              </Button>
              <Button {tabindex} on:click={handleCancelEditStock}>
                <Icon name="x-circle" />
              </Button>
            </InputGroup>
          </Form>
        </ListGroupItem>
      {:else}
        <ListGroupItem
          action
          {tabindex}
          tag="button"
          active={item.id === selected}
          on:click={() => handleFilterTransactions(item.id)}
        >
          <div class="acao">
            <div class="desc">
              <Badge color={item.id === selected ? 'dark' : 'primary'}>
                {item.quantity}
              </Badge>
              {item.id}
            </div>
            <div class="add">
              <Button
                {tabindex}
                class={item.id === selected ? 'link-light' : 'link-primary'}
                size="sm"
                color="link"
                on:click={(e) => handleAddTransaction(e, item.id)}
              >
                <Icon name="plus-circle" />
              </Button>
              <Button
                class={item.id === selected ? 'link-light' : 'link-primary'}
                size="sm"
                color="link"
                on:click={(e) => handleEditStock(e, item.id)}
              >
                <Icon name="pencil" />
              </Button>
            </div>
          </div>
        </ListGroupItem>
      {/if}
    {/each}
    {#if filter}
      <ListGroupItem
        {tabindex}
        action
        tag="button"
        on:click={handleAddStockWithTransaction}
      >
        <Icon name="plus-circle" />
        {$t('addStock', filter.toUpperCase())}
      </ListGroupItem>
    {/if}
  </ListGroup>
</div>

<style>
  .acao {
    display: flex;
    justify-content: space-between;
  }

  :global(.btn.link-light:focus) {
    outline: 0;
    box-shadow: 0 0 0 0.25rem rgb(255 255 255 / 50%);
  }
</style>
