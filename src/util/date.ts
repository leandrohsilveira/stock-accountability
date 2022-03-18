export function toDate(input: string | number | Date): Date {
  if (input instanceof Date) return input
  else if (typeof input === 'number') return toDate(new Date().toISOString())
  const [date] = input.split('T')
  return new Date(`${date}T00:00:00`)
}

export function toISODateString(input: Date | number | string | undefined) {
  if (input) {
    const date = toDate(input)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return [year, month, day].join('-')
  }
  return undefined
}
