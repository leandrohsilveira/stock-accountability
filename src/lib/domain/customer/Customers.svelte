<script lang="ts">
  import IconAdd from '$lib/icons/add.svg?component'
  import Card from '$lib/components/Card.svelte'
  import Page from '$lib/components/Page.svelte'
  import { useTranslate } from '$lib/config'
  import type { Customer, SubmitCustomer } from '$lib/domain/customer/Customer'
  import CustomerForm from '$lib/domain/customer/CustomerForm.svelte'
  import CustomerTable from '$lib/domain/customer/CustomerTable.svelte'
  import {
    addErrorMessage,
    addSuccessMessage,
  } from '$lib/domain/message/message.store'
  import { createEventDispatcher } from 'svelte'
  import { getCustomerServiceInstance } from './CustomerService'

  const customerService = getCustomerServiceInstance()

  const dispatch = createEventDispatcher<{ view: string }>()

  const t = useTranslate({
    'pt-br': {
      addCustomer: 'Adicionar cliente',
      addCustomerSuccessful: 'Cliente adicionado com sucesso',
      customers: 'Clientes',
      updateCustomerSuccessful: 'Cliente atualizado com sucesso',
    },
  })

  let edit: Customer | undefined = undefined
  let adding = false

  $: customers$ = customerService.findAll()

  function handleAddClick() {
    adding = true
  }

  function handleViewClick(e: CustomEvent<string>) {
    dispatch('view', e.detail)
  }

  function handleEditClick(e: CustomEvent<Customer>) {
    edit = e.detail
  }

  async function handleSubmit(e: CustomEvent<SubmitCustomer>) {
    try {
      if (edit) {
        await customerService.update(edit.id, e.detail)
        addSuccessMessage($t('updateCustomerSuccessful'))
      } else {
        await customerService.create(e.detail)
        addSuccessMessage($t('addCustomerSuccessful'))
      }
      customers$ = customerService.findAll()
    } catch (e) {
      addErrorMessage(e.message)
    }
  }
</script>

<Page title={$t('customers')}>
  <Card>
    <div class="flex flex-col gap-6">
      <div>
        <button
          class="btn btn-full btn-icon primary"
          tabindex={1}
          on:click={handleAddClick}
        >
          <IconAdd class="icon icon-fill" />
          {$t('addCustomer')}
        </button>
      </div>
      {#await customers$ then customers}
        <CustomerTable
          items={customers}
          on:view={handleViewClick}
          on:edit={handleEditClick}
        />
      {/await}
    </div>
  </Card>
</Page>
<CustomerForm bind:edit bind:open={adding} on:submit={handleSubmit} />
