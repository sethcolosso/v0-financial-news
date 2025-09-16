"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, Bookmark, Share2, MessageCircle, Eye, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface Article {
  id: string
  title: string
  summary: string
  source_name: string
  author: string
  category: string
  published_at: string
  image_url?: string
  is_featured: boolean
  is_breaking: boolean
  view_count: number
  sentiment: "positive" | "negative" | "neutral"
  importance_score: number
}

interface NewsCardProps {
  article: Article
  variant?: "default" | "featured"
}

export function NewsCard({ article, variant = "default" }: NewsCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 100) + 10)

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1))
  }

  const getSentimentIcon = () => {
    switch (article.sentiment) {
      case "positive":
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case "negative":
        return <TrendingDown className="h-4 w-4 text-red-500" />
      default:
        return <Minus className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      stocks: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      crypto: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      forex: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      commodities: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      economics: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      markets: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
      analysis: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
    }
    return colors[category as keyof typeof colors] || colors.markets
  }

  const isFeatured = variant === "featured"

  return (
    <Card
      className={`group hover:shadow-lg transition-all duration-200 hover:border-primary/50 ${
        isFeatured ? "border-primary/20" : ""
      }`}
    >
      <div className={`${isFeatured ? "md:flex" : ""}`}>
        {article.image_url && (
          <div className={`relative overflow-hidden ${isFeatured ? "md:w-1/2" : "w-full h-48"}`}>
            <Image
              src={article.image_url || "/placeholder.svg"}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-200"
            />
            {article.is_breaking && <Badge className="absolute top-3 left-3 bg-red-500 text-white">BREAKING NEWS</Badge>}
            <div className="absolute top-3 right-3 flex items-center gap-1">{getSentimentIcon()}</div>
          </div>
        )}

        <div className={isFeatured ? "md:w-1/2" : "w-full"}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between mb-2">
              <Badge className={getCategoryColor(article.category)}>{article.category.toUpperCase()}</Badge>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Eye className="h-3 w-3" />
                {article.view_count.toLocaleString()}
              </div>
            </div>

            <Link href={`/article/${article.id}`}>
              <h3
                className={`font-bold text-card-foreground hover:text-primary transition-colors line-clamp-2 ${
                  isFeatured ? "text-xl" : "text-lg"
                }`}
              >
                {article.title}
              </h3>
            </Link>

            <p className={`text-muted-foreground line-clamp-2 ${isFeatured ? "text-base" : "text-sm"}`}>
              {article.summary}
            </p>
          </CardHeader>

          <CardContent className="pt-0">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
              <div className="flex items-center gap-2">
                <span className="font-medium">{article.source_name}</span>
                <span>•</span>
                <span>{article.author}</span>
              </div>
              <span>{formatDistanceToNow(new Date(article.published_at), { addSuffix: true })}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLike}
                  className={`h-8 px-2 ${isLiked ? "text-red-500" : ""}`}
                >
                  <Heart className={`h-4 w-4 mr-1 ${isLiked ? "fill-current" : ""}`} />
                  {likeCount}
                </Button>

                <Button variant="ghost" size="sm" className="h-8 px-2">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  {Math.floor(Math.random() * 20) + 1}
                </Button>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className={`h-8 w-8 p-0 ${isBookmarked ? "text-primary" : ""}`}
                >
                  <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
                </Button>

                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </div>
      </div>
    </Card>
  )
}
