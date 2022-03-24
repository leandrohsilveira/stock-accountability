<script lang="ts">
  import { Card, CardBody } from 'sveltestrap'

  import Page from '../components/Page.svelte'
  import { useTranslate } from '../config'
  import { loadCustomers } from '../domain/customer/customer.store'
  import type { StorageKey } from '../domain/maintenance/Maintenance'
  import { storageKeyStore } from '../domain/maintenance/maintenance.store'
  import StorageKeyDetail from '../domain/maintenance/StorageKeyDetail.svelte'
  import StorageKeyTable from '../domain/maintenance/StorageKeyTable.svelte'

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
    <CardBody>
      <StorageKeyTable items={$storageKeyStore} bind:view={viewKey} />
    </CardBody>
  </Card>
</Page>
<StorageKeyDetail bind:item={viewKey} />
