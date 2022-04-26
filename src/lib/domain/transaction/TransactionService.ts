import type { StoreCollection } from '$lib/config'
import type {
  FirestoreDataConverter,
  QueryDocumentSnapshot,
} from 'firebase/firestore'
import type { Readable } from 'svelte/store'
import type { AvailableYearsService } from '../availableYear/AvailableYearsService'
import type { CustomerService } from '../customer/CustomerService'
import { notify } from '../event/eventStore'
import type { Stock } from '../stock/Stock'
import type { StockService } from '../stock/StockService'
import { updateSummaries } from '../summary/Summary'
import type { SummaryService } from '../summary/SummaryService'
import {
  computeTransactions,
  type SubmitTransaction,
  type Transaction,
} from './Transaction'

export class TransactionConverter
  implements FirestoreDataConverter<Transaction>
{
  constructor(
    private customerService: CustomerService,
    private stockService: StockService
  ) {}

  toFirestore(transaction: Transaction) {
    return {
      customer: this.customerService.ref(transaction.customerId),
      date: transaction.date,
      quantity: transaction.quantity,
      unitPrice: transaction.unitPrice,
      stock: this.stockService.ref(transaction.stockId),
      type: transaction.type,
      year: transaction.date.getFullYear(),
    }
  }

  fromFirestore(doc: QueryDocumentSnapshot): Transaction {
    const data = doc.data()
    return {
      id: doc.id,
      customerId: data.customer.id,
      date: data.date.toDate(),
      quantity: data.quantity,
      stockId: data.stock.id,
      type: data.type,
      unitPrice: data.unitPrice,
    }
  }
}

export class TransactionService {
  constructor(
    private customerService: CustomerService,
    private stockService: StockService,
    private summaryService: SummaryService,
    private availableYearsService: AvailableYearsService,
    private collection: StoreCollection<Transaction>
  ) {}

  syncChanges(customerId: string): Readable<void> {
    return {
      subscribe: (run) => {
        return this.collection
          .syncChanges({
            conditions: [
              {
                field: 'customer',
                op: '==',
                value: this.customerService.ref(customerId),
              },
            ],
            orders: [
              {
                field: 'date',
                direction: 'asc',
              },
            ],
          })
          .subscribe(async (changes) => {
            const availableYears = changes
              .reduce((acc, change) => {
                const year = change.data.date.getFullYear()
                if (acc.indexOf(year) < 0) return [...acc, year]
                return acc
              }, [] as number[])
              .sort()
            for (const year of availableYears) {
              await this.availableYearsService.create(customerId, year)
              await this.updateNextYears(customerId, year)
            }
            notify('transactions')
            run()
          })
      },
    }
  }

  async findAll(customerId: string, year: number) {
    const transactions = await this.collection.findAll({
      conditions: [
        {
          field: 'customer',
          op: '==',
          value: this.customerService.ref(customerId),
        },
        {
          field: 'year',
          op: '==',
          value: year,
        },
      ],
      orders: [
        {
          field: 'date',
          direction: 'asc',
        },
      ],
      fromCache: true,
    })
    return computeTransactions(
      transactions,
      await this.summaryService.findAllPreviousYear(customerId, year)
    )
  }

  async create({ stock, ...transaction }: SubmitTransaction) {
    const year = transaction.date.getFullYear()
    await this.availableYearsService.create(transaction.customerId, year)
    const stockRef = await this.createStockIfNecessary(
      stock,
      transaction.customerId
    )
    await this.collection.create({
      ...transaction,
      stockId: stockRef.id,
      id: undefined,
    })
  }

  async update(id: string, { stock, ...transaction }: SubmitTransaction) {
    const year = transaction.date.getFullYear()
    await this.availableYearsService.create(transaction.customerId, year)
    const stockRef = await this.createStockIfNecessary(
      stock,
      transaction.customerId
    )
    await this.collection.update(id, {
      ...transaction,
      stockId: stockRef.id,
      id,
    })
  }

  async delete(id: string) {
    await this.collection.delete(id)
  }

  private async createStockIfNecessary(
    stock: Stock | string,
    customerId: string
  ) {
    if (typeof stock === 'string') {
      await this.stockService.create({ id: undefined, name: stock, customerId })
      return await this.stockService.findByName(stock, customerId)
    }
    return stock
  }

  private async updateNextYears(customerId: string, fromYear: number) {
    const availableYears = await this.availableYearsService.findAll(customerId)
    const index = availableYears.indexOf(fromYear)
    if (index >= 0)
      for (const year of availableYears.slice(index)) {
        const transactions = await this.findAll(customerId, year)

        const previousSummaries = await this.summaryService.findAllPreviousYear(
          customerId,
          year
        )
        const computedTransactions = computeTransactions(
          transactions,
          previousSummaries
        )
        await this.summaryService.save(
          customerId,
          year,
          updateSummaries(year, computedTransactions, previousSummaries)
        )
      }
  }
}
