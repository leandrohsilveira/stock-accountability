<script context="module" lang="ts">
  import type { ErrorLoad } from '@sveltejs/kit'

  export const load: ErrorLoad = ({ error, status }) => {
    return {
      props: {
        message: error.message,
        status,
      },
    }
  }
</script>

<script lang="ts">
  import Card from '$lib/components/Card.svelte'
  import Page from '$lib/components/Page.svelte'
  import ExclamationIcon from '$lib/icons/exclamation.svg?component'

  export let message: string
  export let status: number
</script>

<div class="w-full md:max-w-md">
  <Page title={`Error ${status}`}>
    <div slot="title" class="w-full flex items-center justify-center" let:title>
      <Card>
        <div class="w-full flex flex-col gap-6 items-center overflow-x-auto">
          <div class="icon-3xl">
            <ExclamationIcon class="icon-fill danger" />
          </div>
          <h2 class="text-danger-base">{title}</h2>
          <h5 class="text-danger-base">{message}</h5>
        </div>
      </Card>
    </div>
  </Page>
</div>
