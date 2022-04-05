<script lang="ts">
  import '../app.css'
  import Layout from '$lib/domain/layout/Layout.svelte'
  import Messages from '$lib/domain/message/Messages.svelte'
  import { messageStore } from '$lib/domain/message/message.store'
  import { getAuthStoreInstance } from '$lib/domain/auth/auth.store'

  const authStore = getAuthStoreInstance()
  const isLoggedIn = authStore.isLoggedIn

  function handleLogout() {
    authStore.logout()
  }
</script>

<Layout isLoggedIn={$isLoggedIn} user={$authStore} on:logout={handleLogout}>
  <slot />
</Layout>

<Messages messages={$messageStore} />
