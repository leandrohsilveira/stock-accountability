<script lang="ts">
  import { browser } from '$app/env'
  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import { authFactory } from '$lib/config/di'

  const authStore = authFactory.get()
  const isLoggedIn = authStore.isLoggedIn
  const loading = authStore.loading

  $: if (browser && !$loading && !$isLoggedIn) {
    goto(`/login?href=${$page.url.pathname}`)
  }
</script>

{#if $isLoggedIn}
  <slot />
{/if}
