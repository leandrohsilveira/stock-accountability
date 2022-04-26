<script context="module" lang="ts">
  import { AuthModule } from '$lib/domain/auth/AuthModule'

  useModule(AuthModule)
</script>

<script lang="ts">
  import { browser } from '$app/env'

  import { goto } from '$app/navigation'
  import { page } from '$app/stores'
  import { getInstance, useModule } from '$lib/config/di'
  import type { AuthReadable } from './auth.store'
  import { AuthReadableToken } from './AuthModule'

  const authStore: AuthReadable = getInstance(AuthReadableToken)
  const isLoggedIn = authStore.isLoggedIn
  const loading = authStore.loading

  $: if (browser && !$loading && !$isLoggedIn) {
    goto(`/login?href=${$page.url.pathname}`)
  }
</script>

{#if $isLoggedIn}
  <slot />
{/if}
