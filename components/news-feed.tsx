"use client"

import { useState } from "react"
import { NewsCard } from "@/components/news-card"
import { CategoryFilter } from "@/components/category-filter"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

// Mock data for demonstration
const mockArticles = [
  {
    id: "1",
    title: "Federal Reserve Signals Potential Rate Cuts Amid Economic Uncertainty",
    summary:
      "The Federal Reserve hints at possible interest rate reductions as economic indicators show mixed signals for the coming quarter.",
    content: "Full article content here...",
    source_name: "Financial Times",
    author: "Sarah Johnson",
    category: "economics",
    published_at: "2024-01-15T10:30:00Z",
    image_url: "/federal-reserve-building.png",
    is_featured: true,
    is_breaking: false,
    view_count: 1250,
    sentiment: "neutral",
    importance_score: 85,
  },
  {
    id: "2",
    title: "Tech Stocks Rally as AI Investment Surge Continues",
    summary:
      "Major technology companies see significant gains as artificial intelligence investments drive market optimism.",
    content: "Full article content here...",
    source_name: "Bloomberg",
    author: "Michael Chen",
    category: "stocks",
    published_at: "2024-01-15T09:15:00Z",
    image_url: "/tech-stocks-chart.png",
    is_featured: false,
    is_breaking: true,
    view_count: 890,
    sentiment: "positive",
    importance_score: 78,
  },
  {
    id: "3",
    title: "Bitcoin Volatility Increases as Regulatory Clarity Emerges",
    summary:
      "Cryptocurrency markets experience heightened volatility following new regulatory guidelines from major economies.",
    content: "Full article content here...",
    source_name: "CoinDesk",
    author: "Alex Rodriguez",
    category: "crypto",
    published_at: "2024-01-15T08:45:00Z",
    image_url: "/bitcoin-chart-volatility.jpg",
    is_featured: false,
    is_breaking: false,
    view_count: 2100,
    sentiment: "negative",
    importance_score: 72,
  },
  {
    id: "4",
    title: "Oil Prices Surge on Middle East Supply Concerns",
    summary: "Crude oil futures jump 5% as geopolitical tensions raise concerns about supply chain disruptions.",
    content: "Full article content here...",
    source_name: "Reuters",
    author: "Emma Thompson",
    category: "commodities",
    published_at: "2024-01-15T07:20:00Z",
    image_url: "/oil-prices-chart.png",
    is_featured: false,
    is_breaking: false,
    view_count: 675,
    sentiment: "negative",
    importance_score: 80,
  },
]

export function NewsFeed() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [articles, setArticles] = useState(mockArticles)
  const [isLoading, setIsLoading] = useState(false)

  const filteredArticles = articles.filter(
    (article) => selectedCategory === "all" || article.category === selectedCategory,
  )

  const handleRefresh = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
  }

  return (
    <div className="space-y-6">
      {/* Filter and Controls */}
      <div className="flex items-center justify-between">
        <CategoryFilter selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Featured Article */}
      {filteredArticles.find((article) => article.is_featured) && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 text-card-foreground">Featured Story</h2>
          <NewsCard article={filteredArticles.find((article) => article.is_featured)!} variant="featured" />
        </div>
      )}

      {/* Article Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-card-foreground">Latest News</h2>
        <div className="grid gap-4">
          {filteredArticles
            .filter((article) => !article.is_featured)
            .map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
        </div>
      </div>

      {filteredArticles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No articles found for the selected category.</p>
        </div>
      )}
    </div>
  )
}
