import type { StoreCollection } from '$lib/config'
import type {
  FirestoreDataConverter,
  QueryDocumentSnapshot,
} from 'firebase/firestore'
import type { AuthReadable } from '../auth/auth.store'
import type { Customer, SubmitCustomer } from './Customer'

export const customerConverter: FirestoreDataConverter<Customer> = {
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

  ref(id: string): unknown {
    return this.collection.ref(id)
  }

  findAll() {
    return this.collection.findAll({
      conditions: [
        {
          field: 'userId',
          op: '==',
          value: this.auth.user.id,
        },
      ],
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
