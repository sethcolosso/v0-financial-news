"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle } from "lucide-react"

const breakingNewsItems = [
  "Federal Reserve announces 0.25% interest rate cut",
  "Tesla stock surges 12% after Q3 earnings beat expectations",
  "Bitcoin reaches new all-time high of $75,000",
  "Major tech stocks rally as inflation data shows cooling trend",
]

export function BreakingNews() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % breakingNewsItems.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-accent text-accent-foreground py-2 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 flex-shrink-0">
            <AlertTriangle className="h-4 w-4" />
            <Badge variant="secondary" className="bg-accent-foreground text-accent">
              BREAKING
            </Badge>
          </div>
          <div className="flex-1 overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {breakingNewsItems.map((item, index) => (
                <div key={index} className="w-full flex-shrink-0">
                  <p className="text-sm font-medium truncate">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
