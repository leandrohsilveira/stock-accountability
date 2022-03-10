export function toDate(input: string | number | Date) {
  if (input instanceof Date) return input
  else if (typeof input === 'number') return toDate(new Date().toISOString())
  const [date] = input.split('T')
  return new Date(`${date}T00:00:00`)
}
