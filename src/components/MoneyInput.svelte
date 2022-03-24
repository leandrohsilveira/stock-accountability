<script lang="ts">
  import { Input, InputGroup, InputGroupText } from 'sveltestrap'
  import { formatNumber, parseNumber } from '../util/number'

  export let value: number | undefined
  export let name: string | undefined = undefined
  export let tabindex: number | undefined = undefined
  export let valid: boolean | undefined = undefined
  export let invalid: boolean | undefined = undefined
  export let feedback: string | string[] | undefined = undefined
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
  <InputGroupText>{currency}</InputGroupText>
  <Input
    {name}
    {tabindex}
    {valid}
    {invalid}
    {feedback}
    {placeholder}
    on:input={handleChange}
    value={formatted}
  />
</InputGroup>
