"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Heart, MessageCircle, Bookmark } from "lucide-react"

interface ProfileActivityProps {
  userId: string
}

export function ProfileActivity({ userId }: ProfileActivityProps) {
  // Mock activity data - in real app, fetch from database
  const activities = [
    {
      id: "1",
      type: "comment",
      title: "Commented on 'Federal Reserve Rate Decision'",
      time: "2 hours ago",
      icon: MessageCircle,
    },
    {
      id: "2",
      type: "like",
      title: "Liked 'Tech Stocks Rally Continues'",
      time: "4 hours ago",
      icon: Heart,
    },
    {
      id: "3",
      type: "bookmark",
      title: "Bookmarked 'Bitcoin Market Analysis'",
      time: "1 day ago",
      icon: Bookmark,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length > 0 ? (
          <div className="space-y-4">
            {activities.map((activity) => {
              const IconComponent = activity.icon
              return (
                <div key={activity.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <IconComponent className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-card-foreground">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {activity.type}
                  </Badge>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No recent activity</p>
            <p className="text-xs text-muted-foreground">Start engaging with articles to see your activity here!</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
