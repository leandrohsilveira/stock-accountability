<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  import { Button, Container, Icon } from 'sveltestrap'

  export let title: string
  export let fluid = false
  export let back = false

  const dispatch = createEventDispatcher<{ back: undefined }>()

  function handleBackClick() {
    dispatch('back')
  }
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

<Container {fluid}>
  <h3 class="title mb-3 p-1">
    {#if back}
      <Button
        size="sm"
        class="link-dark"
        color="link"
        on:click={handleBackClick}
      >
        <Icon class="h3" name="arrow-left-short" />
      </Button>
    {/if}
    {title}
  </h3>
  <slot />
</Container>

<style>
  .title {
    border-bottom: 1px solid #ddd;
    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: center;
  }
</style>
