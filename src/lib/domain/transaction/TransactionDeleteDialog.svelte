<script lang="ts">
  import Modal from '$lib/components/Modal.svelte'

  import { useTranslate } from '$lib/config'
  import { createEventDispatcher } from 'svelte'
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
  <div slot="header">{$t('deleteTransaction')}</div>
  {$t(
    'confirmMessage',
    transaction.stockId,
    transaction.date.toLocaleDateString()
  )}
  <div slot="footer">
    <button on:click={close}>{$t('cancel')}</button>
    <button on:click={handleConfirm}>{$t('delete')}</button>
  </div>
</Modal>
