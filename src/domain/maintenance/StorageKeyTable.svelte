<script lang="ts">
  import { Button, Icon, Table } from 'sveltestrap'
  import { useTranslate } from '../../config'
  import { groupStorageKeys, StorageKey } from './Maintenance'
  import i18n from './StorageKeyTable.i18n.json'

  export let view: StorageKey | undefined = undefined
  export let items: StorageKey[] = []

  $: grouped = groupStorageKeys(items)

  const t = useTranslate(i18n)

  function handleViewClick(key: StorageKey) {
    view = key
  }
</script>

<Table borderless responsive>
  <thead>
    <tr>
      <th style="min-width: 30px; max-width: 30px;">#</th>
      <th style="min-width: 600px;">{$t('key')}</th>
      <th style="min-width: 100px; max-width: 100px;">{$t('entity')}</th>
      <th style="min-width: 350px; max-width: 350px;">{$t('customerId')}</th>
      <th style="min-width: 50px; max-width: 50px;">{$t('year')}</th>
    </tr>
  </thead>
  <tbody>
    {#if grouped.length === 0}
      <tr>
        <td colspan="5">{$t('noEntityFound')}</td>
      </tr>
    {/if}
    {#each grouped as group (group.customerId)}
      {#if group.customerId}
        <tr class="group">
          <th class="customer" colspan="5">
            {$t('customer')}: {group.customerId}
          </th>
        </tr>
      {/if}
      {#each group.years as item (item.year)}
        {#if typeof item.year === 'number'}
          <tr class="group">
            <th class="year" colspan="5">{$t('year')}: {item.year}</th>
          </tr>
        {/if}
        {#each item.entities as entity (entity.key)}
          <tr>
            <td>
              <Button
                size="sm"
                color="link"
                on:click={() => handleViewClick(entity)}
              >
                <Icon name="eye-fill" />
              </Button>
            </td>
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
