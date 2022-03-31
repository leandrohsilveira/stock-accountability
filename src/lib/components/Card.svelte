<script lang="ts">
  export let noPadding = false
</script>

<div
  class="w-full rounded border border-default-lighter shadow-lg bg-white"
  class:p-5={!noPadding}
>
  <slot />
</div>
