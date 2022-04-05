<script lang="ts">
  import Card from '$lib/components/Card.svelte'
  import Page from '$lib/components/Page.svelte'
  import { createEventDispatcher } from 'svelte'
  import GoogleIcon from '$lib/icons/google.svg?component'
  import { useTranslate } from '$lib/config'
  import i18n from './Login.i18n.json'

  const dispatch = createEventDispatcher<{ login: void }>()
  const t = useTranslate(i18n)

  export let loading = true

  function handleLogin() {
    dispatch('login')
  }
</script>

<div class="w-full px-3 sm:max-w-screen-sm">
  <Page title={$t('signIn')}>
    <Card>
      <div class="flex flex-col gap-3 items-center">
        <div>
          <button
            class="btn btn-full primary flex gap-3 items-center px-4"
            type="button"
            disabled={loading}
            on:click={handleLogin}
          >
            <span>{$t('signInWithGoogle')}</span>
            <GoogleIcon class="icon icon-fill" />
          </button>
        </div>
      </div>
    </Card>
  </Page>
</div>
