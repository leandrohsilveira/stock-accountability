<script lang="ts">
  import Card from '$lib/components/Card.svelte'
  import Page from '$lib/components/Page.svelte'
  import { useTranslate } from '$lib/config'
  import {
    computeStorageKeys,
    getStorageKeys,
    type StorageKey,
  } from '$lib/domain/maintenance/Maintenance'
  import StorageKeyDetail from '$lib/domain/maintenance/StorageKeyDetail.svelte'
  import StorageKeyTable from '$lib/domain/maintenance/StorageKeyTable.svelte'

  const t = useTranslate({
    'pt-br': {
      maintenanceView: 'Visão de manutenção',
    },
  })

  let viewKey: StorageKey | undefined = undefined

  $: keys = computeStorageKeys(getStorageKeys())
</script>

<Page title={$t('maintenanceView')}>
  <Card>
    <StorageKeyTable items={keys} bind:view={viewKey} />
  </Card>
</Page>
<StorageKeyDetail bind:item={viewKey} />
