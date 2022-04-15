export interface FirebaseProperties {
  apiKey: string
  authDomain: string
  projectId: string
  storageBucket: string
  messagingSenderId: string
  appId: string
  measurementId: string
}

export interface Properties {
  firebase: FirebaseProperties
}

export const properties: Properties = {
  firebase: {
    apiKey: to(import.meta.env.VITE_FIREBASE_API_KEY, String),
    authDomain: to(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN, String),
    projectId: to(import.meta.env.VITE_FIREBASE_PROJECT_ID, String),
    storageBucket: to(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET, String),
    messagingSenderId: to(
      import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      String
    ),
    appId: to(import.meta.env.VITE_FIREBASE_APP_ID, String),
    measurementId: to(import.meta.env.VITE_FIREBASE_MEASUREMENT_ID, String),
  },
}

function to<T>(val: string | boolean, parser: (val: unknown) => T) {
  return val ? parser(val) : undefined
}
