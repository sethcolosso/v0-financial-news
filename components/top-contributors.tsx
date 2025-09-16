"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trophy, Star, Crown } from "lucide-react"

interface TopContributorsProps {
  contributors: any[]
}

export function TopContributors({ contributors }: TopContributorsProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Crown className="h-4 w-4 text-yellow-500" />
      case 1:
        return <Trophy className="h-4 w-4 text-gray-400" />
      case 2:
        return <Star className="h-4 w-4 text-orange-500" />
      default:
        return <span className="text-sm font-bold text-muted-foreground">#{index + 1}</span>
    }
  }

  const getRankColor = (index: number) => {
    switch (index) {
      case 0:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case 1:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
      case 2:
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          Top Contributors
        </CardTitle>
      </CardHeader>
      <CardContent>
        {contributors.length === 0 ? (
          <div className="text-center py-8">
            <Trophy className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">No contributors yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {contributors.slice(0, 10).map((contributor, index) => (
              <div key={contributor.id} className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8">{getRankIcon(index)}</div>

                <Avatar className="h-10 w-10">
                  <AvatarImage src={contributor.profiles?.avatar_url || "/placeholder.svg"} />
                  <AvatarFallback>
                    {getInitials(contributor.profiles?.display_name || contributor.profiles?.username || "U")}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-card-foreground truncate">
                    {contributor.profiles?.display_name || contributor.profiles?.username}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={getRankColor(index)} variant="secondary">
                      Level {contributor.level}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{contributor.points.toLocaleString()} pts</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
