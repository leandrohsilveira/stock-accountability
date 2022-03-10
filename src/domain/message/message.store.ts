import { writable } from 'svelte/store'
import type { Message, MessageType } from './Message'

export const messageStore = writable<Message[]>([])

function addMessage(type: MessageType, description: string, title?: string) {
  const message: Message = { type, description, title }

  messageStore.update((messages) => [...messages, message])

  setTimeout(
    () =>
      messageStore.update((messages) =>
        messages.filter((item) => item !== message)
      ),
    5000
  )
}

export function addSuccessMessage(description: string, title?: string) {
  addMessage('success', description, title)
}

export function addWarningMessage(description: string, title?: string) {
  addMessage('warning', description, title)
}

export function addInfoMessage(description: string, title?: string) {
  addMessage('info', description, title)
}

export function addErrorMessage(description: string, title?: string) {
  addMessage('error', description, title)
}
