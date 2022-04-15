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
    close()
  }

  function close() {
    transaction = undefined
  }
</script>

<Modal {isOpen}>
  <h4 slot="header">{$t('deleteTransaction')}</h4>
  {$t(
    'confirmMessage',
    transaction.stockId,
    transaction.date.toLocaleDateString()
  )}
  <div slot="footer" class="flex flex-row-reverse gap-2">
    <button class="btn btn-full danger" on:click={handleConfirm}>
      {$t('delete')}
    </button>
    <button class="btn btn-outline default" on:click={close}>
      {$t('cancel')}
    </button>
  </div>
</Modal>
