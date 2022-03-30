<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import InputContainer from './InputContainer.svelte'
  import InputGroup from './InputGroup.svelte'

  export let tabindex: number
  export let value: number

  const dispatch = createEventDispatcher<{ change: number }>()

  function handleInput(e: Event) {
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

<div class="year-input flex flex-row justify-center">
  <InputContainer label="Ano" labelFor="year">
    <InputGroup>
      <button
        class="btn btn-sm btn-outline pr-1"
        {tabindex}
        on:click={handlePreviousClick}
      >
        {'<'}
      </button>
      <input
        class="input"
        {tabindex}
        name="year"
        type="number"
        {value}
        on:input={handleInput}
      />
      <button
        class="btn btn-sm btn-outline pl-1"
        {tabindex}
        on:click={handleNextClick}
      >
        {'>'}
      </button>
    </InputGroup>
  </InputContainer>
</div>

<style>
  .year-input > :global(*) {
    width: 180px;
  }
</style>
