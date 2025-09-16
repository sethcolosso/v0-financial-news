"use client"

import { Trophy, Star, Flame, Target } from "lucide-react"

interface AchievementsHeaderProps {
  userPoints: any
}

export function AchievementsHeader({ userPoints }: AchievementsHeaderProps) {
  const currentLevel = userPoints?.level || 1
  const currentPoints = userPoints?.points || 0
  const streakDays = userPoints?.streak_days || 0

  return (
    <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Trophy className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-card-foreground">Achievements & Rewards</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Track your progress, unlock achievements, and climb the leaderboards as you engage with financial news.
          </p>

          <div className="flex items-center justify-center gap-8 mt-8">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-primary mb-1">
                <Star className="h-6 w-6" />
                <span className="text-3xl font-bold">{currentLevel}</span>
              </div>
              <p className="text-sm text-muted-foreground">Current Level</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-primary mb-1">
                <Target className="h-6 w-6" />
                <span className="text-3xl font-bold">{currentPoints.toLocaleString()}</span>
              </div>
              <p className="text-sm text-muted-foreground">Total Points</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-primary mb-1">
                <Flame className="h-6 w-6" />
                <span className="text-3xl font-bold">{streakDays}</span>
              </div>
              <p className="text-sm text-muted-foreground">Day Streak</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
