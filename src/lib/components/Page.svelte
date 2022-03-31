<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import ArrowLeftIcon from '$lib/icons/arrow-left.svg?component'

  export let title: string
  export let back = false

  const dispatch = createEventDispatcher<{ back: undefined }>()

  function handleBackClick() {
    dispatch('back')
  }
</script>

<svelte:head>
  <title>Stock Accounting - {title}</title>
</svelte:head>

<div class="container">
  <h3
    class="mb-3 p-1 border-b-1 border-default-light flex flex-row justify-start items-center gap-3"
  >
    {#if back}
      <button class="btn btn-fit btn-link primary" on:click={handleBackClick}>
        <ArrowLeftIcon class="icon icon-fill" />
      </button>
    {/if}
    {title}
  </h3>
  <slot />
</div>
