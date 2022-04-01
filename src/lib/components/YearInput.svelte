<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import InputContainer from './InputContainer.svelte'
  import InputGroup from './InputGroup.svelte'
  import AngleLeftIcon from '$lib/icons/angle-left.svg?component'
  import AngleRightIcon from '$lib/icons/angle-right.svg?component'

  export let tabindex: number
  export let value: number

  const dispatch = createEventDispatcher<{ change: number }>()

  function handleChange() {
    dispatch('change', value)
  }

  function handleNextClick() {
    dispatch('change', value + 1)
  }

  function handlePreviousClick() {
    dispatch('change', value - 1)
  }
</script>

<form
  on:submit|preventDefault={handleChange}
  class="year-input flex flex-row justify-center text-center"
>
  <InputContainer label="Ano" labelFor="year">
    <InputGroup>
      <button
        slot="before"
        class="btn btn-fit btn-link default"
        type="button"
        {tabindex}
        on:click={handlePreviousClick}
      >
        <AngleLeftIcon class="icon icon-sm icon-fill" />
      </button>
      <input
        class="input text-center w-[120px]"
        {tabindex}
        name="year"
        type="number"
        bind:value
        on:change={handleChange}
      />
      <button
        slot="after"
        class="btn btn-fit btn-link default"
        type="button"
        {tabindex}
        on:click={handleNextClick}
      >
        <AngleRightIcon class="icon icon-sm icon-fill" />
      </button>
    </InputGroup>
  </InputContainer>
  <button type="submit" hidden />
</form>
