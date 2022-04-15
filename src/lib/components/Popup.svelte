<script lang="ts">
  export let isOpen = false

  $: classes = ['popup', $$restProps.class ?? ''].join(' ')

  function toggle() {
    isOpen = !isOpen
  }
</script>

<div class={classes} class:popup-open={isOpen}>
  <button class="popup-btn" on:click={toggle}>
    <slot />
  </button>

  <div class="popup-options" on:click={toggle}>
    <slot name="popup" />
  </div>
</div>
{#if isOpen}
  <div class="popup-overlay" on:click={toggle} />
{/if}
