<script lang="ts">
  import InputGroup from '$lib/components/InputGroup.svelte'

  import { useTranslate } from '$lib/config'
  import { createEventDispatcher, onMount } from 'svelte'
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
  <ul>
    <li>
      <input
        {tabindex}
        type="search"
        placeholder={$t('findStock')}
        bind:this={filterInput}
        bind:value={filter}
      />
    </li>
    {#if !filter && items.length === 0}
      <li disabled>
        {$t('noStockFoundTypeAnIdToAddNewTransaction')}
      </li>
    {/if}
    {#each filtered as item}
      {#if editing === item.id}
        <li>
          <form on:submit={handleSaveStock}>
            <InputGroup>
              <input
                {tabindex}
                type="text"
                bind:this={inputEditStock}
                bind:value={newStockId}
              />
              <div slot="after">
                <button
                  class="btn btn-sm btn-link primary"
                  {tabindex}
                  type="submit"
                  on:click={handleSaveStock}
                >
                  S
                </button>
                <button
                  class="btn btn-sm btn-link default"
                  {tabindex}
                  on:click={handleCancelEditStock}
                >
                  C
                </button>
              </div>
            </InputGroup>
          </form>
        </li>
      {:else}
        <li {tabindex} on:click={() => handleFilterTransactions(item.id)}>
          <div class="flex justify-between">
            <p>{item.id}</p>
            <div class="flex flex-row">
              <button
                class="btn btn-sm btn-link primary"
                {tabindex}
                on:click={(e) => handleAddTransaction(e, item.id)}
              >
                +
              </button>
              <button
                class="btn btn-sm btn-link default"
                on:click={(e) => handleEditStock(e, item.id)}
              >
                E
              </button>
            </div>
          </div>
        </li>
      {/if}
    {/each}
    {#if filter}
      <li {tabindex} on:click={handleAddStockWithTransaction}>
        +
        {$t('addStock', filter.toUpperCase())}
      </li>
    {/if}
  </ul>
</div>
