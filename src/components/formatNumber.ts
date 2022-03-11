function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !Number.isNaN(value)
}

function formatInteger(value: number, separator: string) {
  const valueStr = String(isNumber(value) ? value : 0)
  const digitsCount = valueStr.length
  const mod = digitsCount % 3
  const partsCount = (digitsCount - mod) / 3
  const start = valueStr.slice(0, mod)
  const end = valueStr.slice(mod)
  const parts = [start]
  for (let i = 0; i < partsCount; i++) {
    parts.push(end.slice(i * 3, (i + 1) * 3))
  }
  return parts.filter((part) => part !== '').join(separator)
}

export function formatNumber(
  value: number,
  precision = 2,
  thousandsSeparator = '.',
  decimalSeparator = ','
) {
  const [digits, decimals = ''] = value.toFixed(precision).split('.')
  const separatedDigits = formatInteger(Number(digits), thousandsSeparator)
  return `${separatedDigits}${decimalSeparator}${decimals}`
}

export function parseNumber(value: string, precision = 2) {
  const raw = value.replace(/\D/g, '').padStart(precision + 1, '0')
  const digits = raw.slice(0, raw.length - precision)
  const decimals = raw.slice(raw.length - precision)
  const result = Number(`${digits}.${decimals}`)
  return isNumber(result) ? result : 0
}
