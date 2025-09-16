"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calendar, Target, CheckCircle, Clock } from "lucide-react"

interface DailyChallengesProps {
  challenges: any[]
  progress: any[]
}

export function DailyChallenges({ challenges, progress }: DailyChallengesProps) {
  const getProgressForChallenge = (challengeId: string) => {
    return progress.find((p) => p.challenge_id === challengeId)
  }

  const getChallengeIcon = (type: string) => {
    switch (type) {
      case "read_articles":
        return "📚"
      case "post_comments":
        return "💬"
      case "like_articles":
        return "❤️"
      default:
        return "🎯"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Daily Challenges
          <Badge variant="secondary" className="ml-2">
            {new Date().toLocaleDateString()}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {challenges.length === 0 ? (
          <div className="text-center py-8">
            <Target className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">No challenges available today</p>
            <p className="text-sm text-muted-foreground">Check back tomorrow for new challenges!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {challenges.map((challenge) => {
              const userProgress = getProgressForChallenge(challenge.id)
              const currentProgress = userProgress?.current_progress || 0
              const isCompleted = userProgress?.is_completed || false
              const progressPercentage = (currentProgress / challenge.target_count) * 100

              return (
                <Card key={challenge.id} className={`${isCompleted ? "bg-green-50 dark:bg-green-900/20" : ""}`}>
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="text-2xl">{getChallengeIcon(challenge.challenge_type)}</div>
                        {isCompleted ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <Clock className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>

                      <div>
                        <h3 className="font-semibold text-card-foreground">{challenge.title}</h3>
                        <p className="text-sm text-muted-foreground">{challenge.description}</p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>
                            {currentProgress}/{challenge.target_count}
                          </span>
                        </div>
                        <Progress value={progressPercentage} className="h-2" />
                      </div>

                      <div className="flex items-center justify-between">
                        <Badge variant={isCompleted ? "default" : "secondary"}>+{challenge.points_reward} points</Badge>
                        {isCompleted && (
                          <Badge className="bg-green-500 text-white">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Completed
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
