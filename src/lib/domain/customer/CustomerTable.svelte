<script lang="ts">
  import { useTranslate } from '$lib/config'
  import { createEventDispatcher } from 'svelte'
  import type { Customer } from './Customer'
  import i18n from './CustomerTable.i18n.json'

  export let showId = false
  export let items: Customer[] = []

  $: cols = showId ? 4 : 3

  const t = useTranslate(i18n)
  const dispatch = createEventDispatcher<{ view: string; edit: Customer }>()

  function handleViewClick(id: string) {
    dispatch('view', id)
  }

  function handleEditClick(edit: Customer) {
    dispatch('edit', edit)
  }
</script>

<table>
  <thead>
    <tr>
      <th>#</th>
      {#if showId}
        <th>{$t('id')}</th>
      {/if}
      <th>{$t('name')}</th>
      <th>{$t('document')}</th>
    </tr>
  </thead>
  <tbody>
    {#if items.length === 0}
      <tr><td colspan={cols}>{$t('noClientRegistered')}</td></tr>
    {/if}
    {#each items as item (item.id)}
      <tr>
        <td style="width: 100px">
          <button
            class="btn btn-sm btn-link primary"
            tabindex={1}
            on:click={() => handleViewClick(item.id)}
          >
            V
          </button>
          <button
            class="btn btn-sm btn-link default"
            tabindex={2}
            on:click={() => handleEditClick(item)}
          >
            E
          </button>
        </td>
        {#if showId}
          <th>{item.id}</th>
        {/if}
        <td>{item.name}</td>
        <td>{item.document ?? ''}</td>
      </tr>
    {/each}
  </tbody>
</table>
