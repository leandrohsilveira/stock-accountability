<script lang="ts">
  import { Alert } from 'sveltestrap'
  import type { Color } from 'sveltestrap/src/shared'

  import type { Message, MessageType } from './Message'

  export let message: Message

  $: color = getColor(message.type)

  function getColor(type: MessageType): Color {
    switch (type) {
      case 'success':
        return 'success'
      case 'warning':
        return 'warning'
      case 'error':
        return 'danger'
      case 'info':
      default:
        return 'info'
    }
  }
</script>

<Alert {color} dismissible>
  {#if message.title}
    <h6>{message.title}</h6>
  {/if}
  {message.description}
</Alert>
