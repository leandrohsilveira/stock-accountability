<script lang="ts">
  import '../app.css'
  import Layout from '$lib/components/Layout.svelte'
  import Messages from '$lib/domain/message/Messages.svelte'
  import { messageStore } from '$lib/domain/message/message.store'
</script>

<Layout>
  <slot />
</Layout>

<Messages messages={$messageStore} />
