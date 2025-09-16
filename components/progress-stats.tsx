"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Star, Activity } from "lucide-react"

interface ProgressStatsProps {
  userPoints: any
  activityStats: any[]
}

export function ProgressStats({ userPoints, activityStats }: ProgressStatsProps) {
  const currentLevel = userPoints?.level || 1
  const currentPoints = userPoints?.points || 0
  const streakDays = userPoints?.streak_days || 0

  // Calculate points needed for next level
  const pointsForNextLevel = currentLevel * 100
  const progressToNextLevel = ((currentPoints % 100) / 100) * 100

  // Calculate activity stats
  const activityCounts = activityStats.reduce(
    (acc, activity) => {
      acc[activity.activity_type] = (acc[activity.activity_type] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const totalActivities = Object.values(activityCounts).reduce((sum, count) => sum + count, 0)

  return (
    <div className="space-y-6">
      {/* Level Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-primary" />
            Level Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">{currentLevel}</div>
            <Badge variant="secondary">Current Level</Badge>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress to Level {currentLevel + 1}</span>
              <span>{currentPoints % 100}/100</span>
            </div>
            <Progress value={progressToNextLevel} className="h-3" />
          </div>

          <div className="text-center">
            <div className="text-2xl font-semibold text-card-foreground">{currentPoints.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Total Points</div>
          </div>
        </CardContent>
      </Card>

      {/* Activity Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Activity Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-xl font-semibold text-card-foreground">{activityCounts.read_article || 0}</div>
              <div className="text-xs text-muted-foreground">Articles Read</div>
            </div>
            <div>
              <div className="text-xl font-semibold text-card-foreground">{activityCounts.post_comment || 0}</div>
              <div className="text-xs text-muted-foreground">Comments Posted</div>
            </div>
            <div>
              <div className="text-xl font-semibold text-card-foreground">{activityCounts.like_article || 0}</div>
              <div className="text-xs text-muted-foreground">Articles Liked</div>
            </div>
            <div>
              <div className="text-xl font-semibold text-card-foreground">{activityCounts.bookmark_article || 0}</div>
              <div className="text-xs text-muted-foreground">Bookmarks</div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Activities</span>
              <Badge variant="outline">{totalActivities}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Streak Counter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Reading Streak
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div>
            <div className="text-4xl font-bold text-orange-500 mb-2">🔥</div>
            <div className="text-3xl font-bold text-card-foreground">{streakDays}</div>
            <div className="text-sm text-muted-foreground">Days in a row</div>
          </div>

          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Next milestone</div>
            <div className="flex items-center justify-center gap-2">
              {streakDays < 7 ? (
                <Badge variant="outline">7 days streak</Badge>
              ) : streakDays < 30 ? (
                <Badge variant="outline">30 days streak</Badge>
              ) : streakDays < 100 ? (
                <Badge variant="outline">100 days streak</Badge>
              ) : (
                <Badge className="bg-gold text-gold-foreground">Legend Status!</Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
