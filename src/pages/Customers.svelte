<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { Button, Icon } from 'sveltestrap'
  import Page from '../components/Page.svelte'
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
        addSuccessMessage('Cliente atualizado com sucesso')
      } else {
        addCustomer(e.detail)
        addSuccessMessage('Cliente adicionado com sucesso')
      }
    } catch (e) {
      addErrorMessage(e.message)
    }
  }
</script>

<Page title="Clientes">
  <Button class="mb-2" color="primary" tabindex={1} on:click={handleAddClick}>
    <Icon name="plus-circle" />
    Adicionar cliente
  </Button>
  <CustomerTable
    items={$customerStore}
    on:view={handleViewClick}
    on:edit={handleEditClick}
  />
</Page>
<CustomerForm bind:edit bind:open={adding} on:submit={handleSubmit} />
