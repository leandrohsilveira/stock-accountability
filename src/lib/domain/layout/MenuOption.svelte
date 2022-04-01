<script lang="ts">
  import { page } from '$app/stores'

  export let href: string
  export let exact = false

  $: active = exact
    ? $page.url.pathname === href
    : $page.url.pathname.startsWith(href)
</script>

<a
  {href}
  class:bg-primary-base={active}
  class:text-white={active}
  class:text-primary-base={!active}
  class:hover:bg-default-lightest={!active}
  class="py-2 px-6 text-base font-medium transition-colors ease-in-out duration-500 rounded-full"
>
  <slot />
</a>
