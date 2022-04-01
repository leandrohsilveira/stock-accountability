<script lang="ts">
  import Card from '$lib/components/Card.svelte'
  import Page from '$lib/components/Page.svelte'
  import { useTranslate } from '$lib/config'
  import { loadCustomers } from '$lib/domain/customer/customer.store'
  import type { StorageKey } from '$lib/domain/maintenance/Maintenance'
  import { storageKeyStore } from '$lib/domain/maintenance/maintenance.store'
  import StorageKeyDetail from '$lib/domain/maintenance/StorageKeyDetail.svelte'
  import StorageKeyTable from '$lib/domain/maintenance/StorageKeyTable.svelte'

  const t = useTranslate({
    'pt-br': {
      maintenanceView: 'Visão de manutenção',
    },
  })

  let viewKey: StorageKey | undefined = undefined

  $: {
    loadCustomers()
  }
</script>

<Page title={$t('maintenanceView')}>
  <Card>
    <StorageKeyTable items={$storageKeyStore} bind:view={viewKey} />
  </Card>
</Page>
<StorageKeyDetail bind:item={viewKey} />
