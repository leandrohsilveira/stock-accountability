<script lang="ts">
  import type { Message } from './Message'
  import MessageDisplay from './Message.svelte'

  export let messages: Message[] = []
</script>

<div
  class="fixed bottom-0 left-0 right-0 flex flex-col-reverse items-center justify-start"
>
  {#each messages as message}
    <MessageDisplay {message} />
  {/each}
</div>
