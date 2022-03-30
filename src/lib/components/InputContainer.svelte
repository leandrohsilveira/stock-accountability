<script lang="ts">
  export let label: string
  export let labelFor: string | undefined = undefined
  export let errors: string[] | undefined = undefined
  $: hasErrors = (errors?.length ?? 0) > 0
</script>

<div class="w-full field" class:error={hasErrors}>
  <label class="label" for={labelFor}>{label}</label>
  <slot />
  {#if hasErrors}
    {#each errors as error}
      <p class="mt-2 text-sm">{error}</p>
    {/each}
  {/if}
</div>
