export interface ProviderInfo {
  id: string
  label: string
  color: string
  icon: string
}

export const PROVIDERS: ProviderInfo[] = [
  { id: 'Gemini', label: 'Gemini', color: '#4285f4', icon: '✦' },
  { id: 'ChatGPT', label: 'ChatGPT', color: '#10a37f', icon: '◎' },
  { id: 'Claude', label: 'Claude', color: '#cc785c', icon: '◇' },
  { id: 'DeepSeek', label: 'DeepSeek', color: '#7c6bff', icon: '⬡' },
  { id: 'Kimi', label: 'Kimi', color: '#f97316', icon: '◈' },
]

export const CATEGORY_COLORS: Record<string, string> = {
  information: '#3b82f6',
  action: '#8b5cf6',
}

export const LAYER_TYPE_COLORS: Record<string, string> = {
  reasoning: '#06b6d4',
  personality: '#ec4899',
  context: '#f59e0b',
  formatting: '#10b981',
}
