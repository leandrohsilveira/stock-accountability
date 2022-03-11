<script lang="ts">
  import type { Color } from 'sveltestrap/src/shared'

  export let color: Color

  $: className = `text-${color}`
</script>

<span class={className}><slot /></span>
