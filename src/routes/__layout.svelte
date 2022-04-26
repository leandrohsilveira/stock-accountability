<script context="module" lang="ts">
  import { useModule } from '$lib/config/di'
  import { AuthModule } from '$lib/domain/auth/AuthModule'

  useModule(AuthModule)
</script>

<script lang="ts">
  import '../app.css'
  import Layout from '$lib/domain/layout/Layout.svelte'
  import Messages from '$lib/domain/message/Messages.svelte'
  import { messageStore } from '$lib/domain/message/message.store'
  import { getInstance } from '$lib/config/di'
  import type { AuthReadable } from '$lib/domain/auth/auth.store'
  import { AuthReadableToken } from '$lib/domain/auth/AuthModule'

  const authStore: AuthReadable = getInstance(AuthReadableToken)
  const isLoggedIn = authStore.isLoggedIn

  function handleLogout() {
    authStore.logout()
  }
</script>

<Layout isLoggedIn={$isLoggedIn} user={$authStore} on:logout={handleLogout}>
  <slot />
</Layout>

<Messages messages={$messageStore} />
