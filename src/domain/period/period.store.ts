import { writable } from 'svelte/store'
import type { Period } from './Period'

export const periodRef: { current: Period } = {
  current: {
    year: new Date().getFullYear(),
  },
}

export const periodStore = writable(periodRef.current)

periodStore.subscribe((period) => {
  periodRef.current = period
})

export function changeYear(year: number) {
  periodStore.update((period) => ({
    ...period,
    year,
  }))
}
