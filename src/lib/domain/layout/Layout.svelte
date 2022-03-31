<script lang="ts">
  import { useTranslate } from '$lib/config'
  import { MENU_ROUTES } from '$lib/router'
  import i18n from './Layout.i18n.json'
  import MenuOption from './MenuOption.svelte'

  const t = useTranslate(i18n)
</script>

<div
  class="w-full p-4 bg-white flex justify-center gap-5 flex-col sm:flex-row sm:justify-start items-center shadow-lg"
>
  <a class="h-fit w-fit mb-2" href={MENU_ROUTES.customers}>
    <img
      class="h-fit w-full sm:h-8 sm:w-fit mt-0 sm:mt-3"
      src="/logo.png"
      alt="Stock Accounting Logo"
    />
  </a>
  <div class="w-fit flex gap-3">
    <MenuOption href={MENU_ROUTES.customers}>
      {$t('customers')}
    </MenuOption>
    <MenuOption href={MENU_ROUTES.maintenance}>
      {$t('maintenance')}
    </MenuOption>
  </div>
</div>

<div class="mt-6 px-3 sm:px-6 flex justify-center items-center">
  <slot />
</div>
