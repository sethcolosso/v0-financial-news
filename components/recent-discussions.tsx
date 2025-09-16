"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageCircle, Eye } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface RecentDiscussionsProps {
  discussions: any[]
}

export function RecentDiscussions({ discussions }: RecentDiscussionsProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-primary" />
          Recent Discussions
        </CardTitle>
      </CardHeader>
      <CardContent>
        {discussions.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">No discussions yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {discussions.map((article) => {
              const commentCount = article.comments?.length || 0
              const lastComment = article.comments?.[0]

              return (
                <Link key={article.id} href={`/article/${article.id}`}>
                  <div className="group p-4 rounded-lg hover:bg-muted/50 transition-colors border">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge className={getCategoryColor(article.category)}>
                              {article.category.toUpperCase()}
                            </Badge>
                            {article.is_breaking && <Badge className="bg-red-500 text-white">BREAKING</Badge>}
                          </div>
                          <h3 className="font-medium text-card-foreground group-hover:text-primary transition-colors line-clamp-2">
                            {article.title}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-1">{article.summary}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <MessageCircle className="h-4 w-4" />
                            <span>{commentCount} comments</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            <span>{article.view_count.toLocaleString()} views</span>
                          </div>
                        </div>

                        {lastComment && (
                          <div className="flex items-center gap-2">
                            <Avatar className="h-5 w-5">
                              <AvatarImage src={lastComment.profiles?.avatar_url || "/placeholder.svg"} />
                              <AvatarFallback className="text-xs">
                                {getInitials(
                                  lastComment.profiles?.display_name || lastComment.profiles?.username || "U",
                                )}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs">
                              {formatDistanceToNow(new Date(lastComment.created_at), { addSuffix: true })}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
