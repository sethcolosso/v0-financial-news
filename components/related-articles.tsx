"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, Clock } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface RelatedArticlesProps {
  articles: any[]
}

export function RelatedArticles({ articles }: RelatedArticlesProps) {
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

  if (articles.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Related Articles</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {articles.map((article) => (
          <Link key={article.id} href={`/article/${article.id}`}>
            <div className="group space-y-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
              {article.image_url && (
                <div className="relative aspect-video overflow-hidden rounded-md">
                  <Image
                    src={article.image_url || "/placeholder.svg"}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Badge className={getCategoryColor(article.category)} variant="secondary">
                  {article.category.toUpperCase()}
                </Badge>

                <h3 className="font-medium text-sm text-card-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {article.title}
                </h3>

                <p className="text-xs text-muted-foreground line-clamp-2">{article.summary}</p>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDistanceToNow(new Date(article.published_at), { addSuffix: true })}
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {article.view_count.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}
