<script lang="ts">
  import {
    Badge,
    Button,
    Icon,
    Input,
    ListGroup,
    ListGroupItem,
  } from 'sveltestrap'
  import type { Stock } from './Stock'

  export let selected: string | undefined = undefined
  export let items: Stock[] = []
  let filter = ''

  $: filtered = items.filter(
    (item) => item.id.toUpperCase().indexOf(filter.toUpperCase()) >= 0
  )

  function handleAddStock() {}

  function handleAddTransaction(id: string) {}

  function handleFilterTransactions(id: string) {
    selected = selected !== id ? id : undefined
  }
</script>

<ListGroup>
  <ListGroupItem>
    <Input type="search" placeholder="Buscar" bind:value={filter} />
  </ListGroupItem>
  {#each filtered as item}
    <ListGroupItem
      action
      active={item.id === selected}
      on:click={() => handleFilterTransactions(item.id)}
    >
      <div class="acao">
        <div class="desc">
          <Badge>{item.quantity}</Badge>
          {item.id}
        </div>
        <div class="add">
          <Button
            size="sm"
            outline
            on:click={() => handleAddTransaction(item.id)}
          >
            <Icon name="plus-square" />
          </Button>
        </div>
      </div>
    </ListGroupItem>
  {/each}
  {#if filter}
    <ListGroupItem action on:click={handleAddStock}>
      <Icon name="plus-square" />
      Adicionar "{filter.toUpperCase()}"
    </ListGroupItem>
  {/if}
</ListGroup>

<style>
  .acao {
    display: flex;
    justify-content: space-between;
  }
</style>
