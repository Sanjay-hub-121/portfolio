'use client'

import { useState, useEffect, useCallback } from 'react'

interface UseCrudOptions<T> {
  endpoint: string
  initialData?: T[]
}

interface UseCrudReturn<T> {
  data: T[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
  create: (payload: Omit<T, 'id'>) => Promise<T | null>
  update: (id: string, payload: Partial<T>) => Promise<T | null>
  remove: (id: string) => Promise<boolean>
}

export function useCrud<T extends { id: string }>({
  endpoint,
  initialData = [],
}: UseCrudOptions<T>): UseCrudReturn<T> {
  const [data, setData] = useState<T[]>(initialData)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await fetch(endpoint)
      if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`)
      const json = await res.json()
      setData(json)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data')
    } finally {
      setIsLoading(false)
    }
  }, [endpoint])

  useEffect(() => {
    refetch()
  }, [refetch])

  const create = async (payload: Omit<T, 'id'>): Promise<T | null> => {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error((await res.json()).error ?? 'Create failed')
      const item: T = await res.json()
      setData((prev) => [item, ...prev])
      return item
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Create failed')
      return null
    }
  }

  const update = async (id: string, payload: Partial<T>): Promise<T | null> => {
    try {
      const res = await fetch(`${endpoint}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error((await res.json()).error ?? 'Update failed')
      const item: T = await res.json()
      setData((prev) => prev.map((d) => (d.id === id ? item : d)))
      return item
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed')
      return null
    }
  }

  const remove = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`${endpoint}/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      setData((prev) => prev.filter((d) => d.id !== id))
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed')
      return false
    }
  }

  return { data, isLoading, error, refetch, create, update, remove }
}
