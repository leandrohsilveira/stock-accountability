import type { Subscriber, Unsubscriber } from 'svelte/store'

export interface Event {
  name: string
}

const subscriptions: Record<string, Subscriber<Event>[]> = {}

export function on(name: string, subscriber: Subscriber<Event>): Unsubscriber {
  subscriptions[name] = [...(subscriptions[name] ?? []), subscriber]
  return () =>
    (subscriptions[name] = subscriptions[name].filter(
      (sub) => sub !== subscriber
    ))
}

export function notify(name: string) {
  subscriptions[name]?.forEach((subscriber) => subscriber({ name }))
}
