import {
  FireStoreCollection,
  getFirebaseInstance,
  getFireStoreInstance,
  type StoreCollection,
} from '$lib/config'
import type {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
} from 'firebase/firestore'
import {
  getCustomerServiceInstance,
  type CustomerService,
} from '../customer/CustomerService'
import type { EditStock, Stock } from './Stock'

let instance: StockService | undefined = undefined

class StockConverter implements FirestoreDataConverter<Stock> {
  constructor(private customerService: CustomerService) {}
  fromFirestore(snapshot: QueryDocumentSnapshot<DocumentData>): Stock {
    const data = snapshot.data()
    return {
      id: snapshot.id,
      name: data.name,
      customerId: data.customer.id,
    }
  }

  toFirestore(modelObject: Stock): DocumentData {
    return {
      id: modelObject.id,
      name: modelObject.name,
      customer: this.customerService.ref(modelObject.customerId),
    }
  }
}

export class StockService {
  constructor(
    private customerService: CustomerService,
    private collection: StoreCollection<Stock>
  ) {}

  ref(id: string) {
    return this.collection.ref(id)
  }

  async findAll(customerId: string) {
    return await this.collection.findAll({
      conditions: [
        {
          field: 'customer',
          op: '==',
          value: this.customerService.ref(customerId),
        },
      ],
      orders: [
        {
          field: 'name',
          direction: 'asc',
        },
      ],
    })
  }

  async findByName(name: string, customerId: string) {
    const stocks = await this.collection.findAll({
      conditions: [
        {
          field: 'name',
          op: '==',
          value: name,
        },
        {
          field: 'customer',
          op: '==',
          value: this.customerService.ref(customerId),
        },
      ],
    })
    return stocks[0]
  }

  async create(stock: Stock) {
    await this.collection.create({
      ...stock,
    })
  }

  async update(stock: EditStock) {
    await this.collection.patch(stock.previousName, {
      name: stock.newName,
    })
  }
}

export function setStockServiceInstance(service: StockService) {
  instance = service
}

export function getStockServiceInstance() {
  if (instance === undefined)
    setStockServiceInstance(
      new StockService(
        getCustomerServiceInstance(),
        new FireStoreCollection(
          getFireStoreInstance(),
          'stocks',
          new StockConverter(getCustomerServiceInstance())
        )
      )
    )
  return instance
}
