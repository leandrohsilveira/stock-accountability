import { initializeApp, type FirebaseApp } from 'firebase/app'
import { properties, type FirebaseProperties } from './properties'

export class FirebaseRef {
  constructor(properties: FirebaseProperties) {
    // Initialize Firebase
    this.app = initializeApp(properties)
  }

  app: FirebaseApp
}

let instance: FirebaseRef | undefined = undefined

export function setFirebaseInstance(ref: FirebaseRef) {
  instance = ref
}

export function getFirebaseInstance() {
  if (instance === undefined)
    setFirebaseInstance(new FirebaseRef(properties.firebase))
  return instance
}

// const analytics = getAnalytics(app);
