<script context="module" lang="ts">
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
  import { getAuthStoreInstance } from '$lib/domain/auth/auth.store'
  import { goto } from '$app/navigation'
  import Login from '$lib/domain/auth/Login.svelte'
  import { onMount } from 'svelte'
  import { ROUTES } from '$lib/router'

  export let href: string

  const authStore = getAuthStoreInstance()
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
