<div class="input-group relative">
  {#if $$slots.before}
    <div
      class="input-group-addon absolute inset-y-0 left-0 flex items-center addon-before"
    >
      <slot name="before" />
    </div>
  {/if}
  <div
    class="w-full input-container"
    class:before={$$slots.before}
    class:after={$$slots.after}
  >
    <slot />
  </div>
  {#if $$slots.after}
    <div
      class="input-group-addon absolute inset-y-0 right-0 flex items-center addon-after"
    >
      <slot name="after" />
    </div>
  {/if}
</div>

<style>
  .before > :global(select),
  .before > :global(input) {
    padding-left: var(--addon-before-width, 32px);
  }
  .after > :global(select),
  .after > :global(input) {
    padding-right: var(--addon-after-width, 32px);
  }
  .addon-before {
    width: var(--addon-before-width, 32px);
  }
  .addon-after {
    width: var(--addon-after-width, 32px);
  }
</style>
