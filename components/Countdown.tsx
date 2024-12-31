'use client'

import { useState, useEffect } from 'react'

interface CountdownProps {
  targetDate: string
}

export default function Countdown({ targetDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime()
      const target = new Date(targetDate).getTime()
      const difference = target - now

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        })
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [targetDate])

  return (
    <div className="text-center mb-12">
      <h2 className="text-2xl md:text-3xl font-semibold mb-4">倒計時</h2>
      <div className="flex justify-center space-x-4">
        {Object.entries(timeLeft).map(([key, value]) => (
          <div key={key} className="bg-gray-800 rounded-lg p-4 w-24">
            <div className="text-3xl md:text-4xl font-bold">{value}</div>
            <div className="text-sm uppercase">{key}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

