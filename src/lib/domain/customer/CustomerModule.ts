import { FireStoreCollection, FireStoreModule, FireStoreRef } from '$lib/config'
import { useModule } from '$lib/config/di'
import type DIContainer from 'rsdi'
import { factory, object, use } from 'rsdi'
import { AuthModule } from '../auth/AuthModule'
import { customerConverter, CustomerService } from './CustomerService'

export class CustomerModule {
  constructor(di: DIContainer) {
    useModule(FireStoreModule)
    useModule(AuthModule)
    di.add({
      CustomerStoreCollection: object(FireStoreCollection).construct(
        use(FireStoreRef),
        'customers',
        factory(() => customerConverter)
      ),
      CustomerService: object(CustomerService).construct(
        use('AuthReadable'),
        use('CustomerStoreCollection')
      ),
    })
  }
}
