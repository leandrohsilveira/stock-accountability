<script lang="ts">
  import { createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher<{ open: void; close: void }>()

  export let isOpen = false

  function mount(node) {
    setTimeout(() => dispatch('open'))
    return {
      destroy: () => dispatch('close'),
    }
  }
</script>

<div class="flex justify-center items-center" class:overlay={isOpen}>
  {#if isOpen}
    <div use:mount class="modal bg-white rounded w-[95%]">
      {#if $$slots.header}
        <div class="w-full p-6 border-b border-default-lighter">
          <slot name="header" />
        </div>
      {/if}
      <div class="w-full p-6">
        <slot />
      </div>
      {#if $$slots.footer}
        <div class="w-full p-6">
          <slot name="footer" />
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .modal {
    max-width: var(--modal-width, 768px);
  }
</style>
