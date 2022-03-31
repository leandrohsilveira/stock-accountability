<script lang="ts">
  import IconAdd from '$lib/icons/add.svg?component'
  import Card from '$lib/components/Card.svelte'
  import Page from '$lib/components/Page.svelte'
  import { useTranslate } from '$lib/config'
  import type { Customer, SubmitCustomer } from '$lib/domain/customer/Customer'
  import {
    addCustomer,
    customerStore,
    loadCustomers,
    updateCustomer,
  } from '$lib/domain/customer/customer.store'
  import CustomerForm from '$lib/domain/customer/CustomerForm.svelte'
  import CustomerTable from '$lib/domain/customer/CustomerTable.svelte'
  import {
    addErrorMessage,
    addSuccessMessage,
  } from '$lib/domain/message/message.store'
  import { createEventDispatcher } from 'svelte'

  let edit: Customer | undefined = undefined
  let adding = false

  const dispatch = createEventDispatcher<{ view: string }>()

  const t = useTranslate({
    'pt-br': {
      addCustomer: 'Adicionar cliente',
      addCustomerSuccessful: 'Cliente adicionado com sucesso',
      customers: 'Clientes',
      updateCustomerSuccessful: 'Cliente atualizado com sucesso',
    },
  })

  $: {
    loadCustomers()
  }

  function handleAddClick() {
    adding = true
  }

  function handleViewClick(e: CustomEvent<string>) {
    dispatch('view', e.detail)
  }

  function handleEditClick(e: CustomEvent<Customer>) {
    edit = e.detail
  }

  function handleSubmit(e: CustomEvent<SubmitCustomer>) {
    try {
      if (edit) {
        updateCustomer(edit.id, e.detail)
        addSuccessMessage($t('updateCustomerSuccessful'))
      } else {
        addCustomer(e.detail)
        addSuccessMessage($t('addCustomerSuccessful'))
      }
    } catch (e) {
      addErrorMessage(e.message)
    }
  }
</script>

<Page title={$t('customers')}>
  <button
    class="btn btn-full btn-icon primary"
    tabindex={1}
    on:click={handleAddClick}
  >
    <IconAdd class="icon icon-fill" />
    {$t('addCustomer')}
  </button>
  <div class="mt-2">
    <Card>
      <CustomerTable
        items={$customerStore}
        on:view={handleViewClick}
        on:edit={handleEditClick}
      />
    </Card>
  </div>
</Page>
<CustomerForm bind:edit bind:open={adding} on:submit={handleSubmit} />
