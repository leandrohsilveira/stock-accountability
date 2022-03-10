<script lang="ts">
  import { createEventDispatcher } from 'svelte'

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

  const dispatcher = createEventDispatcher<{ addTransaction: string }>()

  $: filtered = items.filter(
    (item) => item.id.toUpperCase().indexOf(filter.toUpperCase()) >= 0
  )

  function handleAddTransaction(e: MouseEvent, id: string) {
    e.stopPropagation()
    dispatcher('addTransaction', id)
  }

  function handleFilterTransactions(id: string) {
    selected = selected !== id ? id : undefined
  }
</script>

<ListGroup>
  <ListGroupItem>
    <Input type="search" placeholder="Encontrar ação" bind:value={filter} />
  </ListGroupItem>
  {#if !filter && items.length === 0}
    <ListGroupItem disabled>
      Nenhuma ação encontrada, preencha um ID de Ação acima para adicionar uma
      movimentação
    </ListGroupItem>
  {/if}
  {#each filtered as item}
    <ListGroupItem
      action
      active={item.id === selected}
      on:click={() => handleFilterTransactions(item.id)}
    >
      <div class="acao">
        <div class="desc">
          <Badge color={item.id === selected ? 'dark' : 'primary'}
            >{item.quantity}</Badge
          >
          {item.id}
        </div>
        <div class="add">
          <Button
            size="sm"
            color={item.id === selected ? 'light' : 'primary'}
            outline
            on:click={(e) => handleAddTransaction(e, item.id)}
          >
            <Icon name="plus-square" />
          </Button>
        </div>
      </div>
    </ListGroupItem>
  {/each}
  {#if filter}
    <ListGroupItem action on:click={(e) => handleAddTransaction(e, filter)}>
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
