<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { Button, FormGroup, Icon, Input, InputGroup } from 'sveltestrap'

  export let tabindex: number
  export let value: number

  const dispatch = createEventDispatcher<{ change: number }>()

  function handleInput(e: InputEvent) {
    value = (e.target as HTMLInputElement).valueAsNumber
    dispatch('change', value)
  }

  function handleNextClick() {
    value += 1
    dispatch('change', value)
  }

  function handlePreviousClick() {
    value -= 1
    dispatch('change', value)
  }
</script>

<div class="year-input">
  <FormGroup>
    <label class="label text-center" for="year">Ano</label>
    <InputGroup>
      <Button {tabindex} outline on:click={handlePreviousClick}>
        <Icon name="arrow-left-short" />
      </Button>
      <Input
        {tabindex}
        name="year"
        type="number"
        {value}
        on:input={handleInput}
      />
      <Button {tabindex} outline on:click={handleNextClick}>
        <Icon name="arrow-right-short" />
      </Button>
    </InputGroup>
  </FormGroup>
</div>

<style>
  .label {
    width: 100%;
  }
  .year-input {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
  .year-input > :global(*) {
    width: 180px;
  }
</style>
