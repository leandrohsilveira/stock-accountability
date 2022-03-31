<script context="module" lang="ts">
  import type { Load } from '@sveltejs/kit'

  export const load: Load = ({ url }) => ({
    props: {
      path: url.pathname,
    },
  })
</script>

<script lang="ts">
  import '../app.css'
  import Layout from '$lib/domain/layout/Layout.svelte'
  import Messages from '$lib/domain/message/Messages.svelte'
  import { messageStore } from '$lib/domain/message/message.store'

  export let path: string
</script>

<Layout {path}>
  <slot />
</Layout>

<Messages messages={$messageStore} />
