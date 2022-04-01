export type MessageType = 'success' | 'warning' | 'info' | 'error'

export interface Message {
  type: MessageType
  description: string
  title?: string
}
