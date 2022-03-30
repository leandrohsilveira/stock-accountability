<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  export let title: string
  export let back = false

  const dispatch = createEventDispatcher<{ back: undefined }>()

  function handleBackClick() {
    dispatch('back')
  }
</script>

<svelte:head>
  <title>StockAcc - {title}</title>
</svelte:head>

<div class="container">
  <h3
    class="text-2xl mb-3 p-1 border-b-1 border-gray-400 flex flex-row justify-start items-center"
  >
    {#if back}
      <button class="btn btn-sm btn-link default" on:click={handleBackClick}>
        {'<'}
      </button>
    {/if}
    {title}
  </h3>
  <slot />
</div>
