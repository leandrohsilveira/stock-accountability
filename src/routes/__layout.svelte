<script lang="ts">
  import { authFactory } from '$lib/config/di'
  import Layout from '$lib/domain/layout/Layout.svelte'
  import { messageStore } from '$lib/domain/message/message.store'
  import Messages from '$lib/domain/message/Messages.svelte'
  import '../app.css'

  const authStore = authFactory.get()
  const isLoggedIn = authStore.isLoggedIn

  function handleLogout() {
    authStore.logout()
  }
</script>

<Layout isLoggedIn={$isLoggedIn} user={$authStore} on:logout={handleLogout}>
  <slot />
</Layout>

<Messages messages={$messageStore} />
