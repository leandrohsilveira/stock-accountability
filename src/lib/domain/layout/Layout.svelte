<script lang="ts">
  import Popup from '$lib/components/Popup.svelte'
  import { useTranslate } from '$lib/config'
  import { MENU_ROUTES } from '$lib/router'
  import { createEventDispatcher } from 'svelte'
  import type { User } from '../auth/User'
  import i18n from './Layout.i18n.json'
  import MenuOption from './MenuOption.svelte'

  const dispatch = createEventDispatcher<{ logout: void }>()

  export let isLoggedIn = false
  export let user: User | undefined = undefined

  const t = useTranslate(i18n)

  function handleLogoutClick() {
    dispatch('logout')
  }
</script>

<div
  class="w-full overflow-hidden p-4 bg-white flex justify-center gap-5 flex-col sm:flex-row sm:justify-between items-center shadow-lg"
>
  <a class="w-fit mb-2" href={MENU_ROUTES.customers}>
    <img
      class="w-72 sm:w-96 mt-0 sm:mt-3"
      src="/logo.png"
      alt="Stock Accounting Logo"
    />
  </a>
  {#if isLoggedIn}
    <div class="w-full flex items-center justify-between">
      <div class="w-fit flex items-center justify-center">
        <MenuOption href={MENU_ROUTES.customers}>
          {$t('customers')}
        </MenuOption>
        <MenuOption href={MENU_ROUTES.maintenance}>
          {$t('maintenance')}
        </MenuOption>
      </div>
      <Popup class="min-w-0">
        <img src={user.photoUrl} alt="Profile" class="w-10 rounded-full" />
        <span
          class="text-primary-base font-medium text-ellipsis whitespace-nowrap overflow-hidden mr-3"
        >
          {user.name}
        </span>
        <svelte:fragment slot="popup">
          <button type="button" on:click={handleLogoutClick}>Logout</button>
        </svelte:fragment>
      </Popup>
    </div>
  {/if}
</div>

<div class="mt-6 px-3 sm:px-6 flex justify-center items-center">
  <slot />
</div>
