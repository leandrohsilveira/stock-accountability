<script lang="ts">
  import { onMount } from 'svelte'
  import type { Readable } from 'svelte/store'

  export let sync: () => Readable<any>
  let done = false

  onMount(() => {
    return sync().subscribe(() => (done = true))
  })
</script>

{#if !done}
  <div>Synchronizing...</div>
{:else}
  <slot />
{/if}
