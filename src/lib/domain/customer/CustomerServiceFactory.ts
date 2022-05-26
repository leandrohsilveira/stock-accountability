import { FireStoreCollection, FireStoreRef } from '$lib/config'
import { SingletonFactory, type Factory } from '$lib/util/di'
import type { AuthReadable } from '../auth/auth.store'
import { customerConverter, CustomerService } from './CustomerService'

export class CustomerServiceFactory extends SingletonFactory<CustomerService> {
  constructor(
    private authFactory: Factory<AuthReadable>,
    private fireStoreFactory: Factory<FireStoreRef>
  ) {
    super()
  }

  protected create(): CustomerService {
    return new CustomerService(
      this.authFactory.get(),
      new FireStoreCollection(
        this.fireStoreFactory.get(),
        'customers',
        customerConverter
      )
    )
  }
}
