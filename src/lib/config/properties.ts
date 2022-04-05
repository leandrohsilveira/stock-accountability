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

export const properties = {
  firebase: {
    apiKey: 'AIzaSyBNaSmR2IbLlfpw8_GbqWvaIFDBgKfvll8',
    authDomain: 'stock-accounting-ac7ff.firebaseapp.com',
    projectId: 'stock-accounting-ac7ff',
    storageBucket: 'stock-accounting-ac7ff.appspot.com',
    messagingSenderId: '1040796570593',
    appId: '1:1040796570593:web:7ebcf6c62507e82694f8a0',
    measurementId: 'G-QYZ92D5LQ6',
  },
}
