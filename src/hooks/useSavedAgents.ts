import { useState, useCallback } from 'react'
import type { SavedAgent } from '../types'
import { loadAgentsFromStorage, saveAgentsToStorage, clearAgentsFromStorage } from '../utils/storage'

interface UseSavedAgentsReturn {
  savedAgents: SavedAgent[]
  saveAgent: (agent: Omit<SavedAgent, 'id' | 'createdAt'>) => void
  deleteAgent: (id: string) => void
  clearAllAgents: () => void
  loadAgent: (agent: SavedAgent) => void
}

interface AgentConfigCallbacks {
  setProfile: (id: string) => void
  setSkills: (ids: string[]) => void
  setLayers: (ids: string[]) => void
  setProvider: (p: string) => void
  setName: (n: string) => void
}

export function useSavedAgents(callbacks: AgentConfigCallbacks): UseSavedAgentsReturn {
  const [savedAgents, setSavedAgents] = useState<SavedAgent[]>(() => loadAgentsFromStorage())

  const saveAgent = useCallback((agentData: Omit<SavedAgent, 'id' | 'createdAt'>) => {
    const newAgent: SavedAgent = {
      ...agentData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }
    setSavedAgents(prev => {
      const updated = [...prev, newAgent]
      saveAgentsToStorage(updated)
      return updated
    })
  }, [])

  const deleteAgent = useCallback((id: string) => {
    setSavedAgents(prev => {
      const updated = prev.filter(a => a.id !== id)
      saveAgentsToStorage(updated)
      return updated
    })
  }, [])

  const clearAllAgents = useCallback(() => {
    setSavedAgents([])
    clearAgentsFromStorage()
  }, [])

  const loadAgent = useCallback((agent: SavedAgent) => {
    callbacks.setProfile(agent.profileId || '')
    callbacks.setSkills(agent.skillIds || [])
    callbacks.setLayers([...(agent.layerIds || [])])
    callbacks.setProvider(agent.provider || '')
    callbacks.setName(agent.name)
  }, [callbacks])

  return { savedAgents, saveAgent, deleteAgent, clearAllAgents, loadAgent }
}
