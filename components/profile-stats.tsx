"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Trophy, Star, Target } from "lucide-react"

interface ProfileStatsProps {
  userPoints: any
  achievements: any[]
}

export function ProfileStats({ userPoints, achievements }: ProfileStatsProps) {
  const currentLevel = userPoints?.level || 1
  const currentPoints = userPoints?.points || 0
  const pointsForNextLevel = currentLevel * 100 // Simple calculation
  const progressToNextLevel = ((currentPoints % 100) / 100) * 100

  const recentAchievements = achievements?.slice(0, 3) || []

  return (
    <div className="space-y-6">
      {/* Level and Points */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-primary" />
            Level & Points
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">{currentLevel}</div>
            <div className="text-sm text-muted-foreground">Current Level</div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress to Level {currentLevel + 1}</span>
              <span>{currentPoints % 100}/100</span>
            </div>
            <Progress value={progressToNextLevel} className="h-2" />
          </div>

          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-xl font-semibold text-card-foreground">{currentPoints.toLocaleString()}</div>
              <div className="text-xs text-muted-foreground">Total Points</div>
            </div>
            <div>
              <div className="text-xl font-semibold text-card-foreground">{userPoints?.streak_days || 0}</div>
              <div className="text-xs text-muted-foreground">Day Streak</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Recent Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentAchievements.length > 0 ? (
            <div className="space-y-3">
              {recentAchievements.map((userAchievement: any) => (
                <div key={userAchievement.id} className="flex items-center gap-3">
                  <div className="text-2xl">{userAchievement.achievements.icon || "🏆"}</div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{userAchievement.achievements.name}</div>
                    <div className="text-xs text-muted-foreground">{userAchievement.achievements.description}</div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {userAchievement.achievements.category}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <Trophy className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No achievements yet</p>
              <p className="text-xs text-muted-foreground">Start reading articles to earn your first achievement!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Activity Stats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold text-card-foreground">0</div>
              <div className="text-xs text-muted-foreground">Articles Read</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-card-foreground">0</div>
              <div className="text-xs text-muted-foreground">Comments Posted</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-card-foreground">0</div>
              <div className="text-xs text-muted-foreground">Articles Liked</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-card-foreground">0</div>
              <div className="text-xs text-muted-foreground">Bookmarks</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
