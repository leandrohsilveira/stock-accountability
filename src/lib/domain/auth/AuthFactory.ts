import type { FirebaseRef } from '$lib/config'
import { SingletonFactory, type Factory } from '$lib/util/di'
import { GoogleAuthProvider } from 'firebase/auth'
import { FirebaseAuthReadable, type AuthReadable } from './auth.store'

export class AuthFactory extends SingletonFactory<AuthReadable> {
  constructor(private firebaseFactory: Factory<FirebaseRef>) {
    super()
  }

  protected create(): AuthReadable {
    return new FirebaseAuthReadable(
      this.firebaseFactory.get(),
      new GoogleAuthProvider()
    )
  }
}
