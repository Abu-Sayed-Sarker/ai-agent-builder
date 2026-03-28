import type { SavedAgent } from '../types'

const STORAGE_KEY = 'ai_agent_builder_saved_agents'

export function loadAgentsFromStorage(): SavedAgent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as SavedAgent[]
  } catch {
    return []
  }
}

export function saveAgentsToStorage(agents: SavedAgent[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(agents))
}

export function clearAgentsFromStorage(): void {
  localStorage.removeItem(STORAGE_KEY)
}
