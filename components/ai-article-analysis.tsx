"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, TrendingUp, TrendingDown, Minus, AlertCircle } from "lucide-react"

interface ArticleAnalysis {
  sentiment: string
  confidence: number
  implications: string
  sectors: string[]
  marketImpact: string
  summary: string
  riskLevel: string
}

interface AIArticleAnalysisProps {
  articleId: string
  title: string
  content: string
  category: string
}

export function AIArticleAnalysis({ articleId, title, content, category }: AIArticleAnalysisProps) {
  const [analysis, setAnalysis] = useState<ArticleAnalysis | null>(null)
  const [loading, setLoading] = useState(false)

  const analyzeArticle = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/ai/analyze-news", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          articleId,
          title,
          content,
          category,
        }),
      })
      const data = await response.json()
      setAnalysis(data)
    } catch (error) {
      console.error("Error analyzing article:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    analyzeArticle()
  }, [articleId])

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment?.toLowerCase()) {
      case "bullish":
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case "bearish":
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return <Minus className="h-4 w-4 text-gray-600" />
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment?.toLowerCase()) {
      case "bullish":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "bearish":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk?.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  if (loading) {
    return (
      <Card className="border-blue-200 dark:border-blue-800">
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Analyzing with AI...</span>
        </CardContent>
      </Card>
    )
  }

  if (!analysis) {
    return (
      <Card className="border-gray-200 dark:border-gray-800">
        <CardContent className="flex items-center justify-center py-8 text-gray-500 dark:text-gray-400">
          <AlertCircle className="h-5 w-5 mr-2" />
          AI analysis unavailable
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-blue-200 dark:border-blue-800">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
          <Brain className="h-5 w-5" />
          AI Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Sentiment and Risk */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {getSentimentIcon(analysis.sentiment)}
            <Badge className={getSentimentColor(analysis.sentiment)}>
              {analysis.sentiment} ({Math.round(analysis.confidence * 100)}%)
            </Badge>
          </div>
          <Badge className={getRiskColor(analysis.riskLevel)}>{analysis.riskLevel} risk</Badge>
        </div>

        {/* Summary */}
        <div>
          <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100 mb-2">AI Summary</h4>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{analysis.summary}</p>
        </div>

        {/* Market Impact */}
        <div>
          <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100 mb-2">Market Impact</h4>
          <p className="text-sm text-gray-700 dark:text-gray-300">{analysis.marketImpact}</p>
        </div>

        {/* Affected Sectors */}
        {analysis.sectors && analysis.sectors.length > 0 && (
          <div>
            <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100 mb-2">Affected Sectors</h4>
            <div className="flex flex-wrap gap-1">
              {analysis.sectors.map((sector, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {sector}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Key Implications */}
        <div>
          <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100 mb-2">Key Implications</h4>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{analysis.implications}</p>
        </div>
      </CardContent>
    </Card>
  )
}
