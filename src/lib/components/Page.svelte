<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import AngleLeftIcon from '$lib/icons/angle-left.svg?component'

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
    class="mb-3 p-1 border-b-1 border-gray-400 flex flex-row justify-start items-center gap-3"
  >
    {#if back}
      <button class="btn btn-fit btn-link default" on:click={handleBackClick}>
        <AngleLeftIcon class="icon icon-fill" />
      </button>
    {/if}
    {title}
  </h3>
  <slot />
</div>
