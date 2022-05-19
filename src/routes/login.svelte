<script context="module" lang="ts">
  import { goto } from '$app/navigation'
  import { authFactory } from '$lib/config/di'
  import Login from '$lib/domain/auth/Login.svelte'
  import { ROUTES } from '$lib/router'
  import type { Load } from '@sveltejs/kit'

  export const load: Load = ({ url }) => {
    return {
      props: {
        href: url.searchParams.get('href'),
      },
    }
  }
</script>

<script lang="ts">
  export let href: string

  const authStore = authFactory.get()
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
