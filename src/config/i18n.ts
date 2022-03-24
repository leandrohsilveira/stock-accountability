import { I18nStore, Translator } from '@i18nlite/core'
import { makeI18n } from '@i18nlite/svelte'
import type { Unsubscriber } from 'svelte/store'

type ImperativeTranslator<T> = {
  t: Translator<T>
  unsubscribe: Unsubscriber
}

export type Languages = 'pt-br'

export const languages: Languages[] = ['pt-br']

export const store = new I18nStore<Languages>(languages[0])

export const { useLanguage, useTranslate } = makeI18n(store)

export function createImperativeTranslator<L extends Record<string, string>>(
  literals: Record<Languages, L>
): ImperativeTranslator<L> {
  const res = {
    t: undefined,
    unsubscribe: undefined,
  }
  res.unsubscribe = useTranslate(literals).subscribe((t) => (res.t = t))
  return res
}
