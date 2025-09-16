"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Users, MessageCircle, FileText, TrendingUp } from "lucide-react"

interface CommunityStatsProps {
  totalUsers: number
  totalComments: number
  totalArticles: number
}

export function CommunityStats({ totalUsers, totalComments, totalArticles }: CommunityStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{totalUsers.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Members</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-secondary/10 rounded-lg">
              <MessageCircle className="h-6 w-6 text-secondary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{totalComments.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Comments</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <FileText className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">{totalArticles.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">Articles</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-card-foreground">+24%</p>
              <p className="text-sm text-muted-foreground">Growth</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
