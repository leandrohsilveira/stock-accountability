<script lang="ts">
  import { Button, Icon, Table } from 'sveltestrap'
  import { groupStorageKeys, StorageKey } from './Maintenance'

  export let view: StorageKey | undefined = undefined
  export let items: StorageKey[] = []

  $: grouped = groupStorageKeys(items)

  function handleViewClick(key: StorageKey) {
    view = key
  }
</script>

<Table responsive>
  <thead>
    <tr>
      <th style="min-width: 600px;">Chave</th>
      <th style="min-width: 100px; max-width: 100px;">Entidade</th>
      <th style="min-width: 350px; max-width: 350px;">ID do cliente</th>
      <th style="min-width: 50px; max-width: 50px;">Ano</th>
      <th style="min-width: 30px; max-width: 30px;">#</th>
    </tr>
  </thead>
  <tbody>
    {#each grouped as group (group.customerId)}
      {#if group.customerId}
        <tr class="group">
          <th class="customer" colspan="5">Cliente: {group.customerId}</th>
        </tr>
      {/if}
      {#each group.years as item (item.year)}
        {#if typeof item.year === 'number'}
          <tr class="group">
            <th class="year" colspan="5">Ano: {item.year}</th>
          </tr>
        {/if}
        {#each item.entities as entity (entity.key)}
          <tr>
            <td
              class="customer"
              class:entity={typeof entity.year === 'number'}
              class:year={group.customerId}
            >
              {entity.key}
            </td>
            <td>{entity.entity}</td>
            <td>{entity.customerId ?? ''}</td>
            <td>{entity.year ?? ''}</td>
            <td>
              <Button
                size="sm"
                color="link"
                on:click={() => handleViewClick(entity)}
              >
                <Icon name="eye-fill" />
              </Button>
            </td>
          </tr>
        {/each}
      {/each}
    {/each}
  </tbody>
</Table>

<style>
  .group {
    background-color: #ddd;
  }
  .customer {
    padding-left: 10px;
  }
  .customer.year,
  .year {
    padding-left: 30px;
  }
  .customer.entity.year,
  .entity {
    padding-left: 50px;
  }
</style>
