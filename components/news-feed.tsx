"use client"

import { useState, useEffect } from "react"
import { NewsCard } from "@/components/news-card"
import { CategoryFilter } from "@/components/category-filter"
import { Button } from "@/components/ui/button"
import { RefreshCw, Wifi, WifiOff } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface NewsArticle {
  id: string
  title: string
  summary: string
  content: string
  source_name: string
  author: string
  category: string
  published_at: string
  image_url?: string
  is_featured?: boolean
  is_breaking?: boolean
  view_count?: number
  sentiment?: string
  importance_score: number
}

export function NewsFeed() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isOnline, setIsOnline] = useState(true)

  const fetchNews = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/news")
      if (!response.ok) {
        throw new Error("Failed to fetch news")
      }

      const data = await response.json()
      setArticles(data.articles || [])
      setIsOnline(true)
    } catch (error) {
      console.error("Error fetching news:", error)
      setError("Failed to load news. Please check your connection and try again.")
      setIsOnline(false)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchNews()

    // Set up periodic refresh every 5 minutes
    const interval = setInterval(fetchNews, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const filteredArticles = articles.filter(
    (article) => selectedCategory === "all" || article.category === selectedCategory,
  )

  const handleRefresh = () => {
    fetchNews()
  }

  if (isLoading && articles.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-10 bg-muted animate-pulse rounded-md w-64"></div>
          <div className="h-10 bg-muted animate-pulse rounded-md w-24"></div>
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-32 bg-muted animate-pulse rounded-lg"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      {!isOnline && (
        <Alert variant="destructive">
          <WifiOff className="h-4 w-4" />
          <AlertDescription>Unable to connect to news sources. Showing cached articles.</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Filter and Controls */}
      <div className="flex items-center justify-between">
        <CategoryFilter selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
        <div className="flex items-center gap-2">
          {isOnline && <Wifi className="h-4 w-4 text-green-500" />}
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Featured Article */}
      {filteredArticles.find((article) => article.importance_score > 80) && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 text-card-foreground">Featured Story</h2>
          <NewsCard
            article={{
              ...filteredArticles.find((article) => article.importance_score > 80)!,
              is_featured: true,
            }}
            variant="featured"
          />
        </div>
      )}

      {/* Article Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-card-foreground">Latest News</h2>
        <div className="grid gap-4">
          {filteredArticles
            .filter((article) => article.importance_score <= 80)
            .map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
        </div>
      </div>

      {filteredArticles.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No articles found for the selected category.</p>
          <Button variant="outline" onClick={handleRefresh} className="mt-4 bg-transparent">
            Try Refreshing
          </Button>
        </div>
      )}
    </div>
  )
}
