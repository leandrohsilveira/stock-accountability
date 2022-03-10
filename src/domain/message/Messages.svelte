<script lang="ts">
  import { Container } from 'sveltestrap'
  import type { Message } from './Message'
  import MessageDisplay from './Message.svelte'

  export let messages: Message[] = []
</script>

<div class="fixed">
  <Container>
    {#each messages as message}
      <MessageDisplay {message} />
    {/each}
  </Container>
</div>

<style>
  .fixed {
    z-index: 2000;
    position: fixed;
    display: flex;
    flex-direction: column-reverse;
    bottom: 0;
    left: 0;
    right: 0;
  }
</style>
