import { browser } from '$app/env'
import type { FirebaseRef } from '$lib/config'
import {
  getAuth,
  signInWithRedirect,
  type Auth,
  type AuthProvider,
} from 'firebase/auth'
import {
  derived,
  writable,
  type Readable,
  type Subscriber,
  type Unsubscriber,
  type Writable,
} from 'svelte/store'
import type { User } from './User'

export interface AuthReadable extends Readable<User> {
  user: User | undefined
  loading: Readable<boolean>
  isLoggedIn: Readable<boolean>
  getToken(refresh?: boolean): Promise<string>
  beginLogin(): Promise<void>
  logout(): Promise<void>
}

export class FirebaseAuthReadable implements AuthReadable {
  constructor(private firebase: FirebaseRef, private provider: AuthProvider) {
    this.loading = writable(browser)
    this.isLoggedIn = derived(this, (value) => value !== undefined)
  }

  loading: Writable<boolean>
  isLoggedIn: Readable<boolean>

  private _auth: Auth | undefined

  get user(): User | undefined {
    if (this.auth?.currentUser) {
      return {
        id: this.auth.currentUser.uid,
        name: this.auth.currentUser.displayName,
        email: this.auth.currentUser.email,
        photoUrl: this.auth.currentUser.photoURL,
      }
    }
  }

  private get auth() {
    if (this._auth === undefined && browser)
      this._auth = getAuth(this.firebase.app)
    return this._auth
  }

  getToken(refresh = false): Promise<string | undefined> {
    return (
      this.auth.currentUser?.getIdToken(refresh) ?? Promise.resolve(undefined)
    )
  }

  async beginLogin() {
    this.loading.set(true)
    await signInWithRedirect(this.auth, this.provider)
  }

  async logout() {
    this.loading.set(true)
    await this.auth.signOut()
  }

  subscribe(run: Subscriber<User | undefined>): Unsubscriber {
    run(this.user)
    if (browser)
      return this.auth.onAuthStateChanged(
        () => {
          run(this.user)
          this.loading.set(false)
        },
        (err) => {
          console.error(err)
          this.loading.set(false)
        }
      )
    return () => {
      //
    }
  }
}
