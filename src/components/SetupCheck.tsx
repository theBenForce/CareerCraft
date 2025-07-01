'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface SetupCheckProps {
  children: React.ReactNode
}

export default function SetupCheck({ children }: SetupCheckProps) {
  const [setupNeeded, setSetupNeeded] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkSetup = async () => {
      try {
        const response = await fetch('/api/setup')
        const data = await response.json()

        if (data.setupNeeded) {
          router.push('/setup')
          return
        }

        setSetupNeeded(false)
      } catch (error) {
        console.error('Error checking setup status:', error)
        setSetupNeeded(false)
      } finally {
        setLoading(false)
      }
    }

    checkSetup()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (setupNeeded === null) {
    return null
  }

  return <>{children}</>
}
