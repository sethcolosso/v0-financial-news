"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Lock, CheckCircle } from "lucide-react"

interface AchievementsListProps {
  userAchievements: any[]
  allAchievements: any[]
  activityStats: any[]
}

export function AchievementsList({ userAchievements, allAchievements, activityStats }: AchievementsListProps) {
  const earnedAchievementIds = new Set(userAchievements.map((ua) => ua.achievement_id))

  // Calculate progress for each achievement
  const getAchievementProgress = (achievement: any) => {
    const activityCounts = activityStats.reduce(
      (acc, activity) => {
        acc[activity.activity_type] = (acc[activity.activity_type] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    let currentProgress = 0
    switch (achievement.action_required) {
      case "read_articles":
        currentProgress = activityCounts.read_article || 0
        break
      case "post_comments":
        currentProgress = activityCounts.post_comment || 0
        break
      case "like_articles":
        currentProgress = activityCounts.like_article || 0
        break
      case "bookmark_articles":
        currentProgress = activityCounts.bookmark_article || 0
        break
      default:
        currentProgress = 0
    }

    return Math.min(currentProgress, achievement.threshold)
  }

  const categories = ["all", "reading", "social", "engagement", "organization", "streak", "points"]

  const getAchievementsByCategory = (category: string) => {
    return allAchievements.filter((achievement) => category === "all" || achievement.category === category)
  }

  const AchievementCard = ({ achievement }: { achievement: any }) => {
    const isEarned = earnedAchievementIds.has(achievement.id)
    const progress = getAchievementProgress(achievement)
    const progressPercentage = (progress / achievement.threshold) * 100

    return (
      <Card className={`transition-all duration-200 ${isEarned ? "bg-primary/5 border-primary/20" : ""}`}>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div
              className={`text-4xl p-3 rounded-lg ${isEarned ? "bg-primary/10" : "bg-muted/50 grayscale opacity-50"}`}
            >
              {achievement.icon}
            </div>
            <div className="flex-1 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className={`font-semibold text-lg ${isEarned ? "text-primary" : "text-card-foreground"}`}>
                  {achievement.name}
                </h3>
                {isEarned ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <Lock className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
              <p className="text-muted-foreground">{achievement.description}</p>

              <div className="flex items-center justify-between">
                <Badge variant={isEarned ? "default" : "secondary"} className="capitalize">
                  {achievement.category}
                </Badge>
                {achievement.points_required > 0 && (
                  <Badge variant="outline">{achievement.points_required} points required</Badge>
                )}
              </div>

              {!isEarned && achievement.threshold > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>
                      {progress}/{achievement.threshold}
                    </span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          Achievements ({userAchievements.length}/{allAchievements.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            {categories.map((category) => (
              <TabsTrigger key={category} value={category} className="capitalize">
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent key={category} value={category} className="space-y-4">
              {getAchievementsByCategory(category).map((achievement) => (
                <AchievementCard key={achievement.id} achievement={achievement} />
              ))}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}
