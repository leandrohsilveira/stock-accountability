import {
  I18nStore,
  createImperativeTranslator as _createImperativeTranslator,
} from '@i18nlite/core'
import { makeI18n } from '@i18nlite/svelte'

export type Languages = 'pt-br'

export const languages: Languages[] = ['pt-br']

export const store = new I18nStore<Languages>(languages[0])

export const { useLanguage, useTranslate } = makeI18n(store)

export function createImperativeTranslator<
  Literals extends Record<string, string>
>(literals: Record<Languages, Literals>) {
  return _createImperativeTranslator(store, literals)
}
