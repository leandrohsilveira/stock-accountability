import { derived, writable } from 'svelte/store'
import { lastItem } from '../../util/array'
import { toDate } from '../../util/date'
import { create, findBy, update } from '../../util/storage'
import {
  calculate,
  computeAccruedCost,
  ComputedTransaction,
  SubmitTransaction,
  Summary,
  Transaction,
} from './Transaction'

type Data = {
  customerId?: string
  year?: number
  availableYears: number[]
  previousSummaries: Summary[]
  summaries: Summary[]
  transactions: Transaction[]
  computedTransactions: ComputedTransaction[]
}

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
    const transactions = persist(
      data.customerId,
      data.year,
      create(transaction, data.transactions)
    )
    const computedTransactions = computeTransactions(
      transactions,
      data.previousSummaries
    )
    const summaries = persistSummaries(
      data.customerId,
      data.year,
      updateSummaries(data.year, computedTransactions, data.previousSummaries)
    )
    const availableYears = persistAvailableYear(data.customerId, data.year)
    updateNextYears(data.customerId, data.year)
    return {
      ...data,
      transactions,
      computedTransactions,
      summaries,
      availableYears,
    }
  })
}

export function updateTransaction(id: string, transaction: SubmitTransaction) {
  dataStore.update((data) => {
    const transactions = persist(
      data.customerId,
      data.year,
      update(id, transaction, data.transactions)
    )
    const computedTransactions = computeTransactions(
      transactions,
      data.previousSummaries
    )
    const summaries = persistSummaries(
      data.customerId,
      data.year,
      updateSummaries(data.year, computedTransactions, data.previousSummaries)
    )
    const availableYears = persistAvailableYear(data.customerId, data.year)
    updateNextYears(data.customerId, data.year)
    return {
      ...data,
      transactions,
      computedTransactions,
      summaries,
      availableYears,
    }
  })
}

export function updateStockId(previousStockId: string, stockId: string) {
  dataStore.update((data) => {
    if (checkForStockId(data.customerId, data.availableYears, stockId))
      throw new Error('Já existe uma ação com o ID informado!')

    data.availableYears.forEach((year) => {
      const transactions = persist(
        data.customerId,
        year,
        restoreTransactions(data.customerId, year).map((transaction) => {
          if (transaction.stockId === previousStockId) {
            return {
              ...transaction,
              stockId,
            }
          }
          return transaction
        })
      )
      const previousSummaries = restoreSummaries(data.customerId, year - 1)
      const computedTransactions = computeTransactions(
        transactions,
        previousSummaries
      )
      persistSummaries(
        data.customerId,
        year,
        updateSummaries(year, computedTransactions, previousSummaries)
      )
    })
    return restoreData(data.customerId, data.year)
  })
}

function restoreData(customerId: string, year: number): Data {
  const transactions = restoreTransactions(customerId, year)
  const previousSummaries = findPreviousSummary(customerId, year)
  const summaries = restoreSummaries(customerId, year)
  const computedTransactions = computeTransactions(
    transactions,
    previousSummaries
  )
  const availableYears = restoreAvailableYears(customerId)
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

export function restoreTransactions(
  customerId: string,
  year: number
): Transaction[] {
  return JSON.parse(
    window.localStorage.getItem(getTransactionsKey(customerId, year)) ?? '[]'
  ).map((transaction) => ({ ...transaction, date: toDate(transaction.date) }))
}

export function restoreSummaries(customerId: string, year: number): Summary[] {
  return JSON.parse(
    window.localStorage.getItem(getSummariesKey(customerId, year)) ?? '[]'
  )
}

export function restoreAvailableYears(customerId: string): number[] {
  return JSON.parse(
    window.localStorage.getItem(getAvailableYearsKey(customerId)) ?? '[]'
  )
}

function persist(
  customerId: string,
  year: number,
  transactions: Transaction[]
) {
  window.localStorage.setItem(
    getTransactionsKey(customerId, year),
    JSON.stringify(transactions)
  )
  return transactions
}

function persistSummaries(
  customerId: string,
  year: number,
  summaries: Summary[]
) {
  if (summaries.length) {
    window.localStorage.setItem(
      getSummariesKey(customerId, year),
      JSON.stringify(summaries)
    )
  }
  return summaries
}

function persistAvailableYear(customerId: string, year: number) {
  let availableYears = restoreAvailableYears(customerId)
  if (availableYears.indexOf(year) < 0) {
    availableYears = [...availableYears, year].sort()
    window.localStorage.setItem(
      getAvailableYearsKey(customerId),
      JSON.stringify(availableYears)
    )
  }
  return availableYears
}

function getAvailableYearsKey(customerId: string) {
  return `years#${customerId}`
}

function getSummariesKey(customerId: string, year: number) {
  return `summaries#${customerId}#${year}`
}

function getTransactionsKey(customerId: string, year: number) {
  return `transactions#${customerId}#${year}`
}

function computeTransactions(
  transactions: Transaction[],
  previousSummaries: Summary[]
) {
  const sortedTransactions = transactions.sort(
    (a, b) => toDate(a.date).getTime() - toDate(b.date).getTime()
  )

  const computedTransactions: ComputedTransaction[] = []
  sortedTransactions.forEach((transaction) => {
    const previousTransactionsOfStock = computedTransactions.filter(
      ({ stockId }) => stockId === transaction.stockId
    )
    const previousTransaction =
      lastItem(previousTransactionsOfStock) ??
      findBy(previousSummaries, 'stockId', transaction.stockId)
    const total = transaction.quantity * transaction.unitPrice
    const amount = calculate(
      previousTransaction?.amount ?? 0,
      transaction.quantity,
      transaction.type
    )
    const accruedCost = computeAccruedCost(transaction, previousTransaction)
    const averageCost = amount > 0 ? accruedCost / amount : 0
    computedTransactions.push({
      ...transaction,
      total,
      amount,
      accruedCost,
      averageCost,
      profit:
        transaction.type === 'SELL'
          ? total -
            (previousTransaction?.averageCost ?? 0) * transaction.quantity
          : undefined,
    })
  })
  return computedTransactions
}

function updateSummaries(
  year: number,
  transactions: ComputedTransaction[],
  previousSummaries: Summary[]
) {
  return transactions.reduce(
    (acc, transaction) => {
      const result = [...acc]
      const index = result.findIndex(
        ({ stockId }) => stockId === transaction.stockId
      )
      const summary = {
        year: transaction.date.getFullYear(),
        accruedCost: transaction.accruedCost,
        amount: transaction.amount,
        stockId: transaction.stockId,
        customerId: transaction.customerId,
        averageCost: transaction.averageCost,
        totalProfit:
          (result[index]?.totalProfit ?? 0) + (transaction.profit ?? 0),
      }
      if (index >= 0) {
        result[index] = summary
      } else {
        result.push(summary)
      }
      return result
    },
    previousSummaries.map((summary) => ({
      ...summary,
      totalProfit: 0,
      year,
    }))
  )
}

function checkForStockId(
  customerId: string,
  availableYears: number[],
  stockId: string
) {
  return availableYears.some((year) =>
    restoreTransactions(customerId, year).some(
      (transaction) => transaction.stockId === stockId
    )
  )
}

function updateNextYears(customerId: string, fromYear: number) {
  const availableYears = restoreAvailableYears(customerId)
  const index = availableYears.indexOf(fromYear)
  if (index >= 0)
    availableYears.slice(index).forEach((year) => {
      const transactions = restoreTransactions(customerId, year)
      const previousSummaries = findPreviousSummary(customerId, year)
      const computedTransactions = computeTransactions(
        transactions,
        previousSummaries
      )
      persistSummaries(
        customerId,
        year,
        updateSummaries(year, computedTransactions, previousSummaries)
      )
    })
}

function findPreviousSummary(
  customerId: string,
  currentYear: number
): Summary[] {
  const previousYear = currentYear - 1
  let previousSummaries = restoreSummaries(customerId, previousYear)
  if (!previousSummaries.length) {
    const availableYears = restoreAvailableYears(customerId).filter(
      (year) => year < previousYear
    )
    if (availableYears.length) {
      const latest = availableYears[availableYears.length - 1]
      if (currentYear > latest)
        previousSummaries = restoreSummaries(customerId, latest)
    }
  }
  return previousSummaries.map((summary) => ({
    ...summary,
    year: previousYear,
    totalProfit: 0,
  }))
}
