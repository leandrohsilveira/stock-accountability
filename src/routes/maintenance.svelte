<script lang="ts">
  import Guard from '$lib/domain/auth/Guard.svelte'

  import Maintenance from '$lib/domain/maintenance/Maintenance.svelte'
</script>

<Guard>
  <Maintenance />
</Guard>
