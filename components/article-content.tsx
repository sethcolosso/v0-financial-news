"use client"

import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, Eye, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface ArticleContentProps {
  article: any
}

export function ArticleContent({ article }: ArticleContentProps) {
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

  return (
    <article className="space-y-6">
      {/* Article Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge className={getCategoryColor(article.category)}>{article.category.toUpperCase()}</Badge>
          {article.is_breaking && <Badge className="bg-red-500 text-white">BREAKING</Badge>}
          {article.is_featured && <Badge className="bg-primary text-primary-foreground">FEATURED</Badge>}
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-card-foreground leading-tight">{article.title}</h1>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="font-medium">{article.source_name}</span>
            {article.author && (
              <>
                <span>•</span>
                <span>By {article.author}</span>
              </>
            )}
            <span>•</span>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDistanceToNow(new Date(article.published_at), { addSuffix: true })}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {article.view_count.toLocaleString()} views
            </div>
            <div className="flex items-center gap-1">
              {getSentimentIcon()}
              <span className="capitalize">{article.sentiment}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Article Image */}
      {article.image_url && (
        <div className="relative aspect-video overflow-hidden rounded-lg">
          <Image
            src={article.image_url || "/placeholder.svg"}
            alt={article.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Article Summary */}
      {article.summary && (
        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-4">
            <p className="text-lg text-card-foreground font-medium leading-relaxed">{article.summary}</p>
          </CardContent>
        </Card>
      )}

      {/* AI Summary */}
      {article.ai_summary && (
        <Card className="bg-muted/50">
          <CardContent className="p-4">
            <h3 className="font-semibold text-card-foreground mb-2">AI Summary</h3>
            <p className="text-muted-foreground leading-relaxed">{article.ai_summary}</p>
          </CardContent>
        </Card>
      )}

      {/* Key Points */}
      {article.ai_key_points && article.ai_key_points.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-card-foreground mb-3">Key Points</h3>
            <ul className="space-y-2">
              {article.ai_key_points.map((point: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span className="text-muted-foreground">{point}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Article Content */}
      <div className="prose prose-lg max-w-none dark:prose-invert">
        <div className="text-card-foreground leading-relaxed whitespace-pre-wrap">{article.content}</div>
      </div>

      {/* Source Link */}
      {article.source_url && (
        <Card className="bg-muted/30">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">
              Read the original article at{" "}
              <a
                href={article.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                {article.source_name}
              </a>
            </p>
          </CardContent>
        </Card>
      )}
    </article>
  )
}
