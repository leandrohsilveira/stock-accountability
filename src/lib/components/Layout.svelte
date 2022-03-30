<script lang="ts">
  import { ROUTES } from '$lib/router'
</script>

<div
  class="w-full p-6 flex justify-start flex-col sm:flex-row sm:justify-between sm:items-center border-b-2 border-gray-100"
>
  <div class="w-fit">
    <a class="text-2xl" href={ROUTES.customers()}>Stock Accounting</a>
  </div>
  <div class="w-fit flex gap-6">
    <a
      href={ROUTES.customers()}
      class="text-base font-medium text-gray-500 hover:text-gray-900"
    >
      Customers
    </a>
    <a
      href={ROUTES.maintenance()}
      class="text-base font-medium text-gray-500 hover:text-gray-900"
    >
      Maintenance
    </a>
  </div>
  <div class="w-fit" />
</div>

<div class="mt-6 px-3 sm:px-6 flex justify-center items-center">
  <slot />
</div>
