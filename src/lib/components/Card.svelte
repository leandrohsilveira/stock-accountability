<script lang="ts">
  export let noPadding = false
</script>

<div
  class="w-full rounded border border-gray-200 shadow-lg bg-white"
  class:p-5={!noPadding}
>
  <slot />
</div>
