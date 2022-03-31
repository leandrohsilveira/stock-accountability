<script lang="ts">
  import { useTranslate } from '$lib/config'

  import { MENU_ROUTES } from '$lib/router'
  import i18n from './Layout.i18n.json'

  const t = useTranslate(i18n)

  export let path: string
</script>

<div
  class="w-full p-4 bg-white flex justify-center gap-5 flex-col sm:flex-row sm:justify-start items-center shadow-lg"
>
  <div class="w-fit mb-2">
    <a
      class="text-2xl font-extrabold text-violet-500"
      href={MENU_ROUTES.customers}
    >
      Stock Accounting
    </a>
  </div>
  <div class="w-fit flex gap-3">
    <a
      href={MENU_ROUTES.customers}
      class:bg-violet-500={path === MENU_ROUTES.customers}
      class:text-white={path === MENU_ROUTES.customers}
      class:text-violet-500={path !== MENU_ROUTES.customers}
      class:hover:bg-gray-50={path !== MENU_ROUTES.customers}
      class="py-2 px-6 text-base font-medium transition-colors ease-in-out duration-500 rounded-full"
    >
      {$t('customers')}
    </a>
    <a
      href={MENU_ROUTES.maintenance}
      class:bg-violet-500={path === MENU_ROUTES.maintenance}
      class:text-white={path === MENU_ROUTES.maintenance}
      class:text-violet-500={path !== MENU_ROUTES.maintenance}
      class:hover:bg-gray-50={path !== MENU_ROUTES.maintenance}
      class="py-2 px-6 text-base font-medium transition-colors ease-in-out duration-500 rounded-full"
    >
      {$t('maintenance')}
    </a>
  </div>
</div>

<div class="mt-6 px-3 sm:px-6 flex justify-center items-center">
  <slot />
</div>
