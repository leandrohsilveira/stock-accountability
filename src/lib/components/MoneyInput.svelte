<script lang="ts">
  import { formatNumber, parseNumber } from '$lib/util/number'
  import InputGroup from './InputGroup.svelte'

  export let value: number | undefined = undefined
  export let id: string | undefined = undefined
  export let name: string | undefined = undefined
  export let tabindex: number | undefined = undefined
  export let placeholder: string | undefined = undefined
  export let precision = 2
  export let thousandsSeparator = '.'
  export let decimalSeparator = ','
  export let currency = 'R$'

  $: formatted = formatNumber(
    value ?? 0,
    precision,
    thousandsSeparator,
    decimalSeparator
  )

  function handleChange({ target }: Event) {
    const input = target as HTMLInputElement
    value = parseNumber(input.value ?? formatNumber(0, precision), precision)
    input.value = formatNumber(
      value ?? 0,
      precision,
      thousandsSeparator,
      decimalSeparator
    )
  }
</script>

<InputGroup>
  <span slot="before" class="w-8 text-center text-sm">
    {currency}
  </span>
  <input
    class="input"
    type="text"
    {id}
    {name}
    {tabindex}
    {placeholder}
    on:input={handleChange}
    value={formatted}
  />
</InputGroup>
