<script lang="ts">
  import InputContainer from '$lib/components/InputContainer.svelte'
  import Modal from '$lib/components/Modal.svelte'
  import { useTranslate } from '$lib/config'
  import { all, isValid, messages, required } from '$lib/util/validate'
  import { createEventDispatcher } from 'svelte'
  import type { Customer, SubmitCustomer } from './Customer'
  import i18n from './CustomerForm.i18n.json'

  export let open = false
  export let edit: Customer | undefined = undefined

  let name: string
  let document: string
  let addMore = false
  let dirty: Partial<Record<keyof SubmitCustomer, boolean>> = {}

  let nameInputRef: HTMLInputElement

  $: nameErrors = messages(all(required())(name))
  $: valid = isValid(nameErrors)
  $: if (edit) {
    open = true
  }

  const t = useTranslate(i18n)
  const dispatch = createEventDispatcher<{ submit: SubmitCustomer }>()

  function handleOpen() {
    nameInputRef?.focus()
    name = edit?.name
    document = edit?.document
  }

  function save() {
    if (valid) {
      dispatch('submit', {
        name,
        document: document ? document : undefined,
      })
      return true
    }
    return false
  }

  function close() {
    edit = undefined
    addMore = false
    open = false
  }

  function clear() {
    edit = undefined
    name = undefined
    document = undefined
    dirty = {}
  }

  function handleSubmit(e: Event) {
    e.preventDefault()
    if (save()) {
      if (addMore) {
        clear()
        nameInputRef.focus()
      } else close()
    }
  }
</script>

<Modal bind:isOpen={open} on:open={handleOpen} on:close={clear}>
  <h3 slot="header">{$t('addClient')}</h3>
  <form on:submit={handleSubmit}>
    <InputContainer
      label={$t('name')}
      labelFor="name"
      errors={dirty.name && nameErrors}
    >
      <input
        class="input"
        tabindex={3}
        name="name"
        type="text"
        bind:value={name}
        bind:this={nameInputRef}
        on:blur={() => (dirty = { ...dirty, name: true })}
      />
    </InputContainer>
    <InputContainer label={$t('document')} labelFor="document">
      <input
        class="input"
        tabindex={3}
        id="document"
        name="document"
        type="text"
        bind:value={document}
      />
    </InputContainer>
    <InputContainer label={$t('continue')} labelFor="addNew">
      <input
        tabindex={3}
        type="checkbox"
        id="addNew"
        name="addNew"
        bind:checked={addMore}
      />
    </InputContainer>
    <div class="w-full p-6 flex flex-row-reverse gap-2">
      <button
        class="btn btn-full primary"
        type="submit"
        tabindex={3}
        disabled={!valid}
        on:click={handleSubmit}
      >
        {$t('save')}
      </button>
      <button class="btn btn-outline default" tabindex={3} on:click={close}>
        {$t('cancel')}
      </button>
    </div>
  </form>
</Modal>
