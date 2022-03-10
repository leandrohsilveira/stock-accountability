<script lang="ts">
  import { Input } from 'sveltestrap'
  import { formatNumber, parseNumber } from './formatNumber'

  export let name: string | undefined = undefined
  export let value: number
  export let precision = 2
  export let thousandsSeparator = '.'
  export let decimalSeparator = ','
  let formatted = formatNumber(
    value,
    precision,
    thousandsSeparator,
    decimalSeparator
  )

  function handleChange({ target }: Event) {
    const input = target as HTMLInputElement
    const inputValue = input.value
    value = parseNumber(inputValue ?? formatNumber(0, precision), precision)
    formatted = formatNumber(
      value,
      precision,
      thousandsSeparator,
      decimalSeparator
    )

    input.value = formatted
  }
</script>

<Input {name} on:input={handleChange} value={formatted} />
