<script lang="ts">
  import Card from '$lib/components/Card.svelte'
  import AddIcon from '$lib/icons/add.svg?component'
  import PencilIcon from '$lib/icons/pencil.svg?component'
  import CheckIcon from '$lib/icons/check.svg?component'
  import CrossCircleIcon from '$lib/icons/cross-circle.svg?component'
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
  <Card noPadding>
    <ul class="list">
      <li>
        <input
          {tabindex}
          class="input"
          type="search"
          placeholder={$t('findStock')}
          bind:this={filterInput}
          bind:value={filter}
        />
      </li>
      {#if !filter && items.length === 0}
        <button disabled>
          {$t('noStockFoundTypeAnIdToAddNewTransaction')}
        </button>
      {/if}
      {#each filtered as item}
        {#if editing === item.id}
          <li>
            <form on:submit={handleSaveStock}>
              <InputGroup --addon-after-width="70px">
                <input
                  {tabindex}
                  class="input"
                  type="text"
                  bind:this={inputEditStock}
                  bind:value={newStockId}
                />
                <div slot="after" class="flex">
                  <button
                    class="btn btn-fit btn-link primary"
                    {tabindex}
                    type="submit"
                    on:click={handleSaveStock}
                  >
                    <CheckIcon class="icon-sm icon-fill icon-rounded" />
                  </button>
                  <button
                    class="btn btn-fit btn-link default"
                    {tabindex}
                    on:click={handleCancelEditStock}
                  >
                    <CrossCircleIcon class="icon-sm icon-fill" />
                  </button>
                </div>
              </InputGroup>
            </form>
          </li>
        {:else}
          <button
            {tabindex}
            class="flex justify-between items-center"
            class:selected={selected === item.id}
            on:click={() => handleFilterTransactions(item.id)}
          >
            <p>{item.id}</p>
            <div class="flex flex-row">
              <button
                class="btn btn-fit btn-link primary"
                {tabindex}
                on:click={(e) => handleAddTransaction(e, item.id)}
              >
                <AddIcon class="icon-sm icon-fill" />
              </button>
              <button
                class="btn btn-fit btn-link default"
                on:click={(e) => handleEditStock(e, item.id)}
              >
                <PencilIcon class="icon-sm icon-fill" />
              </button>
            </div>
          </button>
        {/if}
      {/each}
      {#if filter}
        <button
          {tabindex}
          class="flex items-center gap-2"
          on:click={handleAddStockWithTransaction}
        >
          <AddIcon class="icon-sm icon-fill" />
          {$t('addStock', filter.toUpperCase())}
        </button>
      {/if}
    </ul>
  </Card>
</div>
