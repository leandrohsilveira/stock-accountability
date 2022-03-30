<script lang="ts">
  import type { Message } from './Message'
  export let message: Message
</script>

<div class={`alert ${message.type}`}>
  {#if message.title}
    <h6 class="alert-title">{message.title}</h6>
  {/if}
  <p class="alert-description">{message.description}</p>
</div>
