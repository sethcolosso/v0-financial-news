"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Brain, TrendingUp, AlertTriangle, Lightbulb } from "lucide-react"

interface AIInsight {
  insights: string
}

export function AIInsightsPanel() {
  const [insights, setInsights] = useState<AIInsight | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchInsights = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/ai/market-insights")
      const data = await response.json()
      setInsights(data)
    } catch (error) {
      console.error("Error fetching AI insights:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInsights()
  }, [])

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
            <Brain className="h-5 w-5" />
            AI Market Insights
          </CardTitle>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            <Lightbulb className="h-3 w-3 mr-1" />
            Live Analysis
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : insights ? (
          <div className="space-y-3">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <div className="whitespace-pre-wrap text-sm leading-relaxed">{insights.insights}</div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400">
                <TrendingUp className="h-3 w-3" />
                Updated: {new Date().toLocaleTimeString()}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchInsights}
                className="text-blue-600 border-blue-200 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-800 dark:hover:bg-blue-950/20 bg-transparent"
              >
                Refresh
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
            <p>Unable to load market insights</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
