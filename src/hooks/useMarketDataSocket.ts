import { useEffect, useRef, useState } from 'react'

interface UseMarketDataSocketProps {
  enabled?: boolean
  onData?: (data: any) => void
  onError?: (error: any) => void
}

interface MarketDataService {
  ws: WebSocket | null
  isConnected: boolean
  reconnectAttempts: number
  maxReconnectAttempts: number
}

export function useMarketDataSocket({
  enabled = true,
  onData,
  onError
}: UseMarketDataSocketProps = {}) {
  const [isConnected, setIsConnected] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected')
  const serviceRef = useRef<MarketDataService>({
    ws: null,
    isConnected: false,
    reconnectAttempts: 0,
    maxReconnectAttempts: 5
  })

  const connect = () => {
    if (!enabled || serviceRef.current.ws?.readyState === WebSocket.OPEN) {
      return
    }

    try {
      setConnectionStatus('connecting')
      
      // Create WebSocket connection (fallback to polling if WebSocket fails)
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
      const wsUrl = `${protocol}//${window.location.host}/api/market-data/ws`
      
      serviceRef.current.ws = new WebSocket(wsUrl)

      serviceRef.current.ws.onopen = () => {
        console.log('WebSocket connected')
        setIsConnected(true)
        setConnectionStatus('connected')
        serviceRef.current.isConnected = true
        serviceRef.current.reconnectAttempts = 0

        // Subscribe to market data updates
        serviceRef.current.ws?.send(JSON.stringify({
          type: 'subscribe',
          channels: ['market-data', 'insights', 'trends']
        }))
      }

      serviceRef.current.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          onData?.(data)
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error)
        }
      }

      serviceRef.current.ws.onclose = (event) => {
        console.log('WebSocket closed:', event.code, event.reason)
        setIsConnected(false)
        serviceRef.current.isConnected = false
        
        if (event.code !== 1000 && serviceRef.current.reconnectAttempts < serviceRef.current.maxReconnectAttempts) {
          setConnectionStatus('connecting')
          setTimeout(() => {
            serviceRef.current.reconnectAttempts++
            connect()
          }, Math.pow(2, serviceRef.current.reconnectAttempts) * 1000) // Exponential backoff
        } else {
          setConnectionStatus('disconnected')
        }
      }

      serviceRef.current.ws.onerror = (error) => {
        console.error('WebSocket error:', error)
        setConnectionStatus('error')
        onError?.(error)
      }

    } catch (error) {
      console.error('Failed to create WebSocket connection:', error)
      setConnectionStatus('error')
      onError?.(error)
    }
  }

  const disconnect = () => {
    if (serviceRef.current.ws) {
      serviceRef.current.ws.close(1000, 'User disconnect')
      serviceRef.current.ws = null
    }
    setIsConnected(false)
    setConnectionStatus('disconnected')
  }

  const send = (data: any) => {
    if (serviceRef.current.ws?.readyState === WebSocket.OPEN) {
      serviceRef.current.ws.send(JSON.stringify(data))
    }
  }

  useEffect(() => {
    if (enabled) {
      connect()
    }

    return () => {
      disconnect()
    }
  }, [enabled])

  return {
    isConnected,
    connectionStatus,
    connect,
    disconnect,
    send
  }
}

// Hook for real-time market data with polling fallback
export function useRealTimeMarketData(userId?: string) {
  const [marketData, setMarketData] = useState<any>(null)
  const [insights, setInsights] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())

  // WebSocket connection
  const { isConnected, connectionStatus } = useMarketDataSocket({
    enabled: true,
    onData: (data) => {
      if (data.type === 'market-data') {
        setMarketData(data.payload)
        setLastUpdate(new Date())
      } else if (data.type === 'insights') {
        setInsights(data.payload)
      }
    },
    onError: (error) => {
      console.error('WebSocket error:', error)
      setError('WebSocket connection failed')
    }
  })

  // Polling fallback when WebSocket is not available
  useEffect(() => {
    if (!isConnected && connectionStatus !== 'connecting') {
      const fetchData = async () => {
        try {
          setError(null)
          
          // Fetch market data
          const marketResponse = await fetch('/api/market-data/live')
          if (marketResponse.ok) {
            const marketData = await marketResponse.json()
            setMarketData(marketData)
            setLastUpdate(new Date())
          }

          // Fetch insights
          const insightsResponse = await fetch('/api/insights/personalized', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, preferences: {} })
          })
          if (insightsResponse.ok) {
            const insightsData = await insightsResponse.json()
            setInsights(insightsData.insights)
          }

        } catch (error) {
          console.error('Failed to fetch data:', error)
          setError('Failed to fetch market data')
        } finally {
          setIsLoading(false)
        }
      }

      // Initial fetch
      fetchData()

      // Poll every 30 seconds when WebSocket is not connected
      const interval = setInterval(fetchData, 30000)
      return () => clearInterval(interval)
    } else {
      setIsLoading(false)
    }
  }, [isConnected, connectionStatus, userId])

  const refreshData = async () => {
    setIsLoading(true)
    try {
      const marketResponse = await fetch('/api/market-data/live')
      const insightsResponse = await fetch('/api/insights/personalized', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, preferences: {} })
      })

      if (marketResponse.ok) {
        const marketData = await marketResponse.json()
        setMarketData(marketData)
        setLastUpdate(new Date())
      }

      if (insightsResponse.ok) {
        const insightsData = await insightsResponse.json()
        setInsights(insightsData.insights)
      }
    } catch (error) {
      setError('Failed to refresh data')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    marketData,
    insights,
    isLoading,
    error,
    lastUpdate,
    isConnected,
    connectionStatus,
    refreshData
  }
}
