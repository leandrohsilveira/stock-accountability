<script context="module" lang="ts">
  import type { Load } from '@sveltejs/kit'
  import { useModule } from '$lib/config/di'
  import { AuthModule } from '$lib/domain/auth/AuthModule'

  useModule(AuthModule)

  export const load: Load = ({ url }) => {
    return {
      props: {
        href: url.searchParams.get('href'),
      },
    }
  }
</script>

<script lang="ts">
  import type { AuthReadable } from '$lib/domain/auth/auth.store'
  import { AuthReadableToken } from '$lib/domain/auth/AuthModule'
  import { goto } from '$app/navigation'
  import Login from '$lib/domain/auth/Login.svelte'
  import { getInstance } from '$lib/config/di'
  import { ROUTES } from '$lib/router'

  export let href: string

  const authStore: AuthReadable = getInstance(AuthReadableToken)
  const isLoggedIn = authStore.isLoggedIn
  const loading = authStore.loading

  $: if (!$loading && $isLoggedIn) {
    goto(href ?? ROUTES.customers())
  }

  function handleLogin() {
    authStore.beginLogin()
  }
</script>

{#if !$isLoggedIn}
  <Login loading={$loading} on:login={handleLogin} />
{/if}
