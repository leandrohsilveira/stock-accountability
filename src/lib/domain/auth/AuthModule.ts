import { FirebaseModule, FirebaseRef } from '$lib/config'
import { useModule } from '$lib/config/di'
import { GoogleAuthProvider } from 'firebase/auth'
import type DIContainer from 'rsdi'
import { object, use } from 'rsdi'
import { FirebaseAuthReadable } from './auth.store'

export const AuthReadableToken = 'AuthReadable'

export class AuthModule {
  constructor(di: DIContainer) {
    useModule(FirebaseModule)
    di.add({
      AuthProvider: object(GoogleAuthProvider),
      [AuthReadableToken]: object(FirebaseAuthReadable).construct(
        use(FirebaseRef),
        use('AuthProvider')
      ),
    })
  }
}
