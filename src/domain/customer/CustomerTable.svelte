<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  import { Button, Icon, Table } from 'sveltestrap'
  import type { Customer } from './Customer'

  export let showId = false
  export let items: Customer[] = []

  $: cols = showId ? 4 : 3

  const dispatch = createEventDispatcher<{ view: string; edit: Customer }>()

  function handleViewClick(id: string) {
    dispatch('view', id)
  }

  function handleEditClick(edit: Customer) {
    dispatch('edit', edit)
  }
</script>

<Table responsive striped>
  <thead>
    <tr>
      {#if showId}
        <th>ID</th>
      {/if}
      <th>Nome</th>
      <th>CPF/CNPJ</th>
      <th>#</th>
    </tr>
  </thead>
  <tbody>
    {#if items.length === 0}
      <tr><td colspan={cols}>Nenhum cliente cadastrado</td></tr>
    {/if}
    {#each items as item (item.id)}
      <tr>
        {#if showId}
          <th>{item.id}</th>
        {/if}
        <td>{item.name}</td>
        <td>{item.document ?? ''}</td>
        <td style="width: 100px">
          <Button
            size="sm"
            color="link"
            tabindex={1}
            on:click={() => handleViewClick(item.id)}
          >
            <Icon name="eye-fill" />
          </Button>
          <Button
            tabindex={2}
            size="sm"
            color="link"
            on:click={() => handleEditClick(item)}
          >
            <Icon name="pencil" />
          </Button>
        </td>
      </tr>
    {/each}
  </tbody>
</Table>
