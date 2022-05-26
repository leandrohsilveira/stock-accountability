import { SingletonFactory, type Factory } from '$lib/util/di'
import { initializeApp, type FirebaseApp } from 'firebase/app'
import type { Properties } from './properties'

export class FirebaseRef {
  constructor({ firebase }: Properties) {
    // Initialize Firebase
    this.app = initializeApp(firebase)
  }

  app: FirebaseApp
}

// const analytics = getAnalytics(app);

export class FirebaseFactory extends SingletonFactory<FirebaseRef> {
  constructor(private propertiesFactory: Factory<Properties>) {
    super()
  }

  protected create(): FirebaseRef {
    return new FirebaseRef(this.propertiesFactory.get())
  }
}
