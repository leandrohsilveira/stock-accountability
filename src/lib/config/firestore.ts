import { browser } from '$app/env'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  enableIndexedDbPersistence,
  getDoc,
  getDocFromCache,
  getDocs,
  getDocsFromCache,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
  type DocumentReference,
  type Firestore,
  type FirestoreDataConverter,
  type UpdateData,
} from 'firebase/firestore'
import type DIContainer from 'rsdi'
import { object, use } from 'rsdi'
import type { Readable } from 'svelte/store'
import { useModule } from './di'
import { FirebaseModule, FirebaseRef } from './firebase'

export interface StoreQuery {
  conditions?: StoreQueryCondition[]
  orders?: StoreQueryOrder[]
  fromCache?: boolean
}

export interface StoreQueryOrder {
  field: string
  direction?: 'desc' | 'asc'
}

export interface StoreQueryCondition {
  field: string
  op: '<' | '<=' | '==' | '!=' | '>=' | '>'
  value: unknown
}

export interface SyncChange<T> {
  data: T
  change: 'added' | 'removed' | 'modified'
}

export interface StoreCollection<T, Ref = unknown> {
  ref(id: string): Ref
  syncChanges(query: StoreQuery): Readable<SyncChange<T>[]>
  findAll(query: StoreQuery): Promise<T[]>
  findById(id: string): Promise<T>
  create(data: T): Promise<void>
  update(id: string, data: T): Promise<void>
  delete(id: string): Promise<void>
  patch(id: string, data: UpdateData<T>): Promise<void>
}

export class FireStoreCollection<T>
  implements StoreCollection<T, DocumentReference<T>>
{
  constructor(
    private firestore: FireStoreRef,
    private name: string,
    private converter: FirestoreDataConverter<T>
  ) {}

  private get store() {
    return this.firestore.store
  }

  ref(id: string) {
    return doc(this.getCollection(), id).withConverter(this.converter)
  }

  syncChanges({
    conditions = [],
    orders = [],
  }: StoreQuery): Readable<SyncChange<T>[]> {
    const q = query(
      this.getCollection(),
      ...[
        ...conditions.map(({ field, op, value }) => where(field, op, value)),
        ...orders.map(({ field, direction }) => orderBy(field, direction)),
      ]
    ).withConverter(this.converter)

    return {
      subscribe(run) {
        return onSnapshot(q, (snap) =>
          run(
            snap
              .docChanges()
              .filter((change) => !change.doc.metadata.fromCache)
              .map((change) => ({
                data: change.doc.data(),
                change: change.type,
              }))
          )
        )
      },
    }
  }

  async findAll({ conditions = [], orders = [], fromCache }: StoreQuery) {
    const getter = fromCache ? getDocsFromCache : getDocs
    const snap = await getter(
      query(
        this.getCollection(),
        ...[
          ...conditions.map(({ field, op, value }) => where(field, op, value)),
          ...orders.map(({ field, direction }) => orderBy(field, direction)),
        ]
      ).withConverter(this.converter)
    )
    return snap.docs.map((ref) => ref.data())
  }

  async findById(id: string, fromCache = false) {
    const getter = fromCache ? getDocFromCache : getDoc
    const snap = await getter(this.ref(id))
    if (snap.exists()) return snap.data()
    throw new Error(`Entity with id ${id} does not exists`)
  }

  async create(data: T) {
    await addDoc(this.getCollection().withConverter(this.converter), data)
  }

  async update(id: string, data: T) {
    await setDoc(this.ref(id), data)
  }

  async delete(id: string) {
    await deleteDoc(this.ref(id))
  }

  async patch(id: string, data: UpdateData<T>) {
    updateDoc(this.ref(id), data)
  }

  private getCollection() {
    return collection(this.store, this.name)
  }
}

export class FireStoreRef {
  constructor(public firebaseRef: FirebaseRef) {
    this.store = getFirestore(firebaseRef.app)
    browser && enableIndexedDbPersistence(this.store)
  }

  store: Firestore
}

export class FireStoreModule {
  constructor(di: DIContainer) {
    useModule(FirebaseModule)
    di.add({
      FireStoreRef: object(FireStoreRef).construct(use(FirebaseRef)),
    })
  }
}
