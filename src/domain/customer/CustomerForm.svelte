<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import {
    Button,
    Form,
    FormGroup,
    Input,
    Label,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
  } from 'sveltestrap'
  import { useTranslate } from '../../config'
  import i18n from './CustomerForm.i18n.json'
  import { all, isValid, messages, required } from '../../util/validate'
  import type { SubmitCustomer, Customer } from './Customer'

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
    nameInputRef.focus()
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
  <ModalHeader toggle={close}>{$t('addClient')}</ModalHeader>
  <ModalBody>
    <Form on:submit={handleSubmit}>
      <FormGroup>
        <Label for="name">{$t('name')}:</Label>
        <Input
          tabindex={3}
          name="name"
          type="text"
          invalid={dirty.name && nameErrors.length > 0}
          feedback={nameErrors}
          bind:value={name}
          bind:inner={nameInputRef}
          on:blur={() => (dirty = { ...dirty, name: true })}
        />
      </FormGroup>
      <FormGroup>
        <Label for="document">{$t('document')}</Label>
        <Input tabindex={3} name="document" type="text" bind:value={document} />
      </FormGroup>
      <FormGroup>
        <Input
          tabindex={3}
          type="checkbox"
          name="addNew"
          label={$t('continue')}
          bind:checked={addMore}
        />
      </FormGroup>
      <button type="submit" hidden />
    </Form>
  </ModalBody>
  <ModalFooter>
    <Button tabindex={3} outline on:click={close}>{$t('cancel')}</Button>
    <Button
      tabindex={3}
      color="primary"
      disabled={!valid}
      on:click={handleSubmit}
    >
      {$t('save')}
    </Button>
  </ModalFooter>
</Modal>
