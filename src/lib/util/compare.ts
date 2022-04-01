type CompareFn<T = any> = (a: T, b: T) => number

export function compareStrings(a: string, b: string): number {
  if (a === b) return 0
  if (a > b) return 1
  else return -1
}

export function multiCompare(
  compare: CompareFn,
  ...other: CompareFn[]
): CompareFn {
  return (a, b) => {
    let index = -1
    let res: number
    let comparer = compare
    do {
      res = comparer(a, b)
      index++
    } while (res === 0 && (comparer = other[index]) !== undefined)
    return res
  }
}
