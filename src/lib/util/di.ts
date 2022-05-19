export interface Factory<T> {
  get(): T
}

export abstract class SingletonFactory<T> implements Factory<T> {
  private instance: T | undefined = undefined

  get(): T {
    if (this.instance === undefined) this.instance = this.create()
    return this.instance
  }

  protected abstract create(): T
}
