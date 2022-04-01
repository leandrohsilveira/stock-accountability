export function format(text: string, ...args: unknown[]) {
  return args.reduce<string>(
    (acc, arg, index) =>
      acc.replace(new RegExp(`\\{${index}\\}`, 'g'), String(arg)),
    text
  )
}
