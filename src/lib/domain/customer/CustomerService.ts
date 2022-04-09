import {
  getFirebaseInstance,
  FireStoreCollection,
  type StoreCollection,
} from '$lib/config'
import type {
  FirestoreDataConverter,
  QueryDocumentSnapshot,
} from 'firebase/firestore'
import { getAuthStoreInstance, type AuthReadable } from '../auth/auth.store'
import type { Customer, SubmitCustomer } from './Customer'

let instance: CustomerService | undefined = undefined

const converter: FirestoreDataConverter<Customer> = {
  toFirestore(customer: Customer) {
    return {
      name: customer.name,
      userId: customer.userId,
    }
  },
  fromFirestore(doc: QueryDocumentSnapshot): Customer {
    const data = doc.data()
    return {
      id: doc.id,
      name: data.name,
      userId: data.userId,
    }
  },
}

export class CustomerService {
  constructor(
    private auth: AuthReadable,
    private collection: StoreCollection<Customer>
  ) {}

  findAll() {
    return this.collection.findAll({
      field: 'userId',
      op: '==',
      value: this.auth.user.id,
    })
  }

  findById(id: string) {
    return this.collection.findById(id)
  }

  async create(customer: SubmitCustomer) {
    await this.collection.create({
      ...customer,
      userId: this.auth.user.id,
      id: undefined,
    })
  }

  async update(id: string, customer: SubmitCustomer) {
    await this.collection.update(id, {
      ...customer,
      userId: this.auth.user.id,
      id,
    })
  }
}

export function setCustomerServiceInstance(service: CustomerService) {
  instance = service
}

export function getCustomerServiceInstance() {
  if (instance === undefined)
    setCustomerServiceInstance(
      new CustomerService(
        getAuthStoreInstance(),
        new FireStoreCollection(getFirebaseInstance(), 'customers', converter)
      )
    )
  return instance
}
