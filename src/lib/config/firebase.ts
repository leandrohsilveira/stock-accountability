import { initializeApp, type FirebaseApp } from 'firebase/app'
import type DIContainer from 'rsdi'
import { object, use } from 'rsdi'
import { useModule } from './di'
import {
  PropertiesToken,
  PropertiesModule,
  type Properties,
} from './properties'

export class FirebaseRef {
  constructor({ firebase }: Properties) {
    // Initialize Firebase
    this.app = initializeApp(firebase)
  }

  app: FirebaseApp
}

// const analytics = getAnalytics(app);

export class FirebaseModule {
  constructor(di: DIContainer) {
    useModule(PropertiesModule)
    di.add({
      FirebaseRef: object(FirebaseRef).construct(use(PropertiesToken)),
    })
  }
}
