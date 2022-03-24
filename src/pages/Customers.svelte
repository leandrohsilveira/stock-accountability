<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { Button, Card, CardBody, Icon } from 'sveltestrap'
  import Page from '../components/Page.svelte'
  import { useTranslate } from '../config'
  import type { SubmitCustomer, Customer } from '../domain/customer/Customer'
  import {
    addCustomer,
    customerStore,
    loadCustomers,
    updateCustomer,
  } from '../domain/customer/customer.store'
  import CustomerForm from '../domain/customer/CustomerForm.svelte'
  import CustomerTable from '../domain/customer/CustomerTable.svelte'
  import {
    addErrorMessage,
    addSuccessMessage,
  } from '../domain/message/message.store'

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
  <Button color="primary" tabindex={1} on:click={handleAddClick}>
    <Icon name="plus-circle" />
    {$t('addCustomer')}
  </Button>
  <Card class="mt-3">
    <CardBody>
      <CustomerTable
        items={$customerStore}
        on:view={handleViewClick}
        on:edit={handleEditClick}
      />
    </CardBody>
  </Card>
</Page>
<CustomerForm bind:edit bind:open={adding} on:submit={handleSubmit} />
