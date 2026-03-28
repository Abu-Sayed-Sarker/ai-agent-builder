import { useState, useEffect, useCallback } from 'react'
import type { AgentData } from '../types'

interface UseAgentDataReturn {
  data: AgentData | null
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useAgentData(): UseAgentDataReturn {
  const [data, setData] = useState<AgentData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/data.json')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const jsonData: AgentData = await response.json()
      setData(jsonData)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to fetch agent data'
      console.error('Error fetching data:', err)
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch: fetchData }
}
