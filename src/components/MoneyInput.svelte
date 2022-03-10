<script lang="ts">
  import { Input } from 'sveltestrap'
  import { formatNumber, parseNumber } from './formatNumber'

  export let name: string | undefined = undefined
  export let tabindex: number | undefined = undefined
  export let value: number | undefined
  export let precision = 2
  export let thousandsSeparator = '.'
  export let decimalSeparator = ','

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

<Input {name} {tabindex} on:input={handleChange} value={formatted} />
