import { createImperativeTranslator } from '$lib/config'
import { availableYearsStorage } from '$lib/domain/availableYear/availableYear.store'
import { updateSummaries, type Summary } from '$lib/domain/summary/Summary'
import {
  findPreviousSummary,
  summaryStorage,
} from '$lib/domain/summary/summary.store'
import { toDate } from '$lib/util/date'
import { create, PersistentStorage, remove, update } from '$lib/util/storage'
import { derived, writable } from 'svelte/store'
import {
  computeTransactions,
  type ComputedTransaction,
  type SubmitTransaction,
  type Transaction,
} from './Transaction'
import i18n from './transaction.store.i18n.json'

type Data = {
  customerId?: string
  year?: number
  availableYears: number[]
  previousSummaries: Summary[]
  summaries: Summary[]
  transactions: Transaction[]
  computedTransactions: ComputedTransaction[]
}

const t = createImperativeTranslator(i18n)

export const transactionStorage = new PersistentStorage<
  Transaction,
  [string, number]
>('transactions#{0}#{1}', {
  restoreParser: (transaction) => ({
    ...transaction,
    date: toDate(transaction.date),
  }),
})

const dataStore = writable<Data>({
  previousSummaries: [],
  transactions: [],
  summaries: [],
  computedTransactions: [],
  availableYears: [],
})

export const previousSummaryStore = derived(
  dataStore,
  (data) => data.previousSummaries
)

export const availableYearsStore = derived(
  dataStore,
  (data) => data.availableYears
)

export const transactionStore = derived(dataStore, (data) => data.transactions)

export const computedTransactionStore = derived(
  dataStore,
  (data) => data.computedTransactions
)

export const summaryStore = derived(dataStore, (data) => data.summaries)

export function loadTransactions(customerId: string, year: number) {
  dataStore.set(restoreData(customerId, year))
}

export function addTransaction(transaction: SubmitTransaction) {
  dataStore.update((data) => {
    const transactions = transactionStorage.persist(
      create(transaction, data.transactions),
      [data.customerId, data.year]
    )
    return computeData(transactions, data)
  })
}

export function updateTransaction(id: string, transaction: SubmitTransaction) {
  dataStore.update((data) => {
    const transactions = transactionStorage.persist(
      update(id, transaction, data.transactions),
      [data.customerId, data.year]
    )
    return computeData(transactions, data)
  })
}

export function deleteTransaction(id: string) {
  dataStore.update((data) => {
    const transactions = transactionStorage.persist(
      remove(id, data.transactions),
      [data.customerId, data.year]
    )
    return computeData(transactions, data)
  })
}

export function updateStockId(previousStockId: string, stockId: string) {
  dataStore.update((data) => {
    if (checkForStockId(data.customerId, data.availableYears, stockId))
      throw new Error(t('thereIsAlreadyStockWithProvidedId'))

    data.availableYears.forEach((year) => {
      const transactions = transactionStorage.persist(
        transactionStorage
          .restore([data.customerId, year])
          .map((transaction) => {
            if (transaction.stockId === previousStockId) {
              return {
                ...transaction,
                stockId,
              }
            }
            return transaction
          }),
        [data.customerId, year]
      )
      const previousSummaries = summaryStorage.restore([
        data.customerId,
        year - 1,
      ])
      const computedTransactions = computeTransactions(
        transactions,
        previousSummaries
      )
      summaryStorage.persist(
        updateSummaries(year, computedTransactions, previousSummaries),
        [data.customerId, year]
      )
    })
    return restoreData(data.customerId, data.year)
  })
}

function restoreData(customerId: string, year: number): Data {
  const transactions = transactionStorage.restore([customerId, year])
  const previousSummaries = findPreviousSummary(customerId, year)
  const summaries = summaryStorage.restore([customerId, year])
  const computedTransactions = computeTransactions(
    transactions,
    previousSummaries
  )
  const availableYears = availableYearsStorage.restore([customerId])
  return {
    customerId,
    year,
    transactions,
    previousSummaries,
    summaries: summaries.length ? summaries : previousSummaries,
    computedTransactions,
    availableYears,
  }
}

function computeData(transactions: Transaction[], data: Data) {
  const computedTransactions = computeTransactions(
    transactions,
    data.previousSummaries
  )
  const summaries = summaryStorage.persist(
    updateSummaries(data.year, computedTransactions, data.previousSummaries),
    [data.customerId, data.year]
  )
  const availableYears = availableYearsStorage.persist(
    [...data.availableYears, data.year],
    [data.customerId]
  )
  updateNextYears(data.customerId, data.year)
  return {
    ...data,
    transactions,
    computedTransactions,
    summaries,
    availableYears,
  }
}

function checkForStockId(
  customerId: string,
  availableYears: number[],
  stockId: string
) {
  return availableYears.some((year) =>
    transactionStorage
      .restore([customerId, year])
      .some((transaction) => transaction.stockId === stockId)
  )
}

function updateNextYears(customerId: string, fromYear: number) {
  const availableYears = availableYearsStorage.restore([customerId])
  const index = availableYears.indexOf(fromYear)
  if (index >= 0)
    availableYears.slice(index).forEach((year) => {
      const transactions = transactionStorage.restore([customerId, year])
      const previousSummaries = findPreviousSummary(customerId, year)
      const computedTransactions = computeTransactions(
        transactions,
        previousSummaries
      )
      summaryStorage.persist(
        updateSummaries(year, computedTransactions, previousSummaries),
        [customerId, year]
      )
    })
}
