import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { SavedAgent } from '../../types'
import { loadAgentsFromStorage, saveAgentsToStorage } from '../../utils/storage'

interface AgentState {
  // Current draft selection
  profileId: string
  skillIds: string[]
  layerIds: string[]
  provider: string
  agentName: string
  
  // Saved list
  savedAgents: SavedAgent[]
}

const initialState: AgentState = {
  profileId: '',
  skillIds: [],
  layerIds: [],
  provider: '',
  agentName: '',
  savedAgents: loadAgentsFromStorage(),
}

const agentSlice = createSlice({
  name: 'agent',
  initialState,
  reducers: {
    setProfileId: (state, action: PayloadAction<string>) => {
      state.profileId = action.payload
    },
    setSkillIds: (state, action: PayloadAction<string[]>) => {
      state.skillIds = action.payload
    },
    setLayerIds: (state, action: PayloadAction<string[]>) => {
      state.layerIds = action.payload
    },
    setProvider: (state, action: PayloadAction<string>) => {
      state.provider = action.payload
    },
    setAgentName: (state, action: PayloadAction<string>) => {
      state.agentName = action.payload
    },
    
    // Draft actions (add/remove single item)
    toggleSkill: (state, action: PayloadAction<string>) => {
      const id = action.payload
      if (state.skillIds.includes(id)) {
        state.skillIds = state.skillIds.filter(s => s !== id)
      } else {
        state.skillIds = [...state.skillIds, id]
      }
    },
    toggleLayer: (state, action: PayloadAction<string>) => {
      const id = action.payload
      if (state.layerIds.includes(id)) {
        state.layerIds = state.layerIds.filter(l => l !== id)
      } else {
        state.layerIds = [...state.layerIds, id]
      }
    },

    // Saved list actions
    addSavedAgent: (state, action: PayloadAction<SavedAgent>) => {
      state.savedAgents.push(action.payload)
      saveAgentsToStorage(state.savedAgents)
    },
    deleteSavedAgent: (state, action: PayloadAction<string>) => {
      state.savedAgents = state.savedAgents.filter(a => a.id !== action.payload)
      saveAgentsToStorage(state.savedAgents)
    },
    clearSavedAgents: (state) => {
      state.savedAgents = []
      saveAgentsToStorage([])
    },
    loadAgentDraft: (state, action: PayloadAction<SavedAgent>) => {
      const agent = action.payload
      state.profileId = agent.profileId || ''
      state.skillIds = agent.skillIds || []
      state.layerIds = agent.layerIds || []
      state.provider = agent.provider || ''
      state.agentName = agent.name
    },
    resetDraft: (state) => {
      state.profileId = ''
      state.skillIds = []
      state.layerIds = []
      state.provider = ''
      state.agentName = ''
    }
  },
})

export const {
  setProfileId, setSkillIds, setLayerIds, setProvider, setAgentName,
  toggleSkill, toggleLayer, addSavedAgent, deleteSavedAgent,
  clearSavedAgents, loadAgentDraft, resetDraft
} = agentSlice.actions

export default agentSlice.reducer
