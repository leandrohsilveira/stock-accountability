<script lang="ts">
  import { useTranslate } from '$lib/config'
  import { createEventDispatcher } from 'svelte'
  import {
    Button,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
  } from 'sveltestrap'
  import type { Transaction } from './Transaction'
  import i18n from './TransactionDeleteDialog.i18n.json'

  export let transaction: Transaction | undefined = undefined

  $: isOpen = !!transaction

  const dispatch = createEventDispatcher<{ confirm: Transaction }>()
  const t = useTranslate(i18n)

  function handleConfirm() {
    dispatch('confirm', transaction)
  }

  function close() {
    transaction = undefined
  }
</script>

<Modal {isOpen}>
  <ModalHeader toggle={close}>{$t('deleteTransaction')}</ModalHeader>
  <ModalBody>
    {$t(
      'confirmMessage',
      transaction.stockId,
      transaction.date.toLocaleDateString()
    )}
  </ModalBody>
  <ModalFooter>
    <Button outline on:click={close}>{$t('cancel')}</Button>
    <Button color="danger" on:click={handleConfirm}>{$t('delete')}</Button>
  </ModalFooter>
</Modal>
