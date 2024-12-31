'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

export default function FireworkLauncher() {
  const [launchedFireworks, setLaunchedFireworks] = useState(0)

  const launchFirework = () => {
    setLaunchedFireworks((prev) => prev + 1)
    const event = new CustomEvent('launchFirework')
    window.dispatchEvent(event)
  }

  return (
    <div className="text-center">
      <Button 
        onClick={launchFirework} 
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full text-lg transition duration-300 ease-in-out transform hover:scale-105"
      >
        發射煙火
      </Button>
      <p className="mt-4 text-lg">已發射: {launchedFireworks}</p>
    </div>
  )
}

