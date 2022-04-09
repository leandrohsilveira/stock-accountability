import {
  addDoc,
  collection,
  doc,
  Firestore,
  getDoc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  where,
  type FirestoreDataConverter,
} from 'firebase/firestore'
import type { FirebaseRef } from './firebase'

export interface StoreQuery {
  field: string
  op: '<' | '<=' | '==' | '!=' | '>=' | '>'
  value: unknown
}

export interface StoreCollection<T> {
  findAll(...queries: StoreQuery[]): Promise<T[]>
  findById(id: string): Promise<T>
  create(data: T): Promise<void>
  update(id: string, data: T): Promise<void>
}

export class FireStoreCollection<T> implements StoreCollection<T> {
  constructor(
    firebase: FirebaseRef,
    private name: string,
    private converter: FirestoreDataConverter<T>
  ) {
    this.store = getFirestore(firebase.app)
  }

  private store: Firestore

  async findAll(...queries: StoreQuery[]) {
    const snap = await getDocs(
      query(
        this.getCollection(),
        ...queries.map(({ field, op, value }) => where(field, op, value))
      ).withConverter(this.converter)
    )
    return snap.docs.map((ref) => ref.data())
  }

  async findById(id: string) {
    const snap = await getDoc(
      doc(this.getCollection(), id).withConverter(this.converter)
    )
    if (snap.exists()) return snap.data()
    throw new Error(`Entity with id ${id} does not exists`)
  }

  async create(data: T) {
    await addDoc(this.getCollection().withConverter(this.converter), data)
  }

  async update(id: string, data: T) {
    await setDoc(doc(this.getCollection(), id), data)
  }

  private getCollection() {
    return collection(this.store, this.name)
  }
}
