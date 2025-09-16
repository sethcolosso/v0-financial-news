"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X, Star, Flame } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface AchievementNotificationProps {
  achievement?: {
    id: string
    name: string
    description: string
    icon: string
    category: string
    points_required: number
  }
  levelUp?: {
    newLevel: number
    pointsEarned: number
  }
  streakMilestone?: {
    days: number
    pointsEarned: number
  }
  onDismiss: () => void
}

export function AchievementNotification({
  achievement,
  levelUp,
  streakMilestone,
  onDismiss,
}: AchievementNotificationProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onDismiss, 300)
    }, 5000)

    return () => clearTimeout(timer)
  }, [onDismiss])

  const handleDismiss = () => {
    setIsVisible(false)
    setTimeout(onDismiss, 300)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -100, scale: 0.8 }}
          className="fixed top-4 right-4 z-50 w-96"
        >
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="text-3xl">
                  {achievement && achievement.icon}
                  {levelUp && <Star className="h-8 w-8 text-yellow-500" />}
                  {streakMilestone && <Flame className="h-8 w-8 text-orange-500" />}
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-primary">
                      {achievement && "Achievement Unlocked!"}
                      {levelUp && "Level Up!"}
                      {streakMilestone && "Streak Milestone!"}
                    </h3>
                    <Button variant="ghost" size="sm" onClick={handleDismiss} className="h-6 w-6 p-0">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div>
                    {achievement && (
                      <>
                        <p className="font-medium text-card-foreground">{achievement.name}</p>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary" className="capitalize">
                            {achievement.category}
                          </Badge>
                          {achievement.points_required > 0 && (
                            <Badge variant="outline">+{achievement.points_required} points</Badge>
                          )}
                        </div>
                      </>
                    )}

                    {levelUp && (
                      <>
                        <p className="font-medium text-card-foreground">
                          Congratulations! You've reached Level {levelUp.newLevel}
                        </p>
                        <p className="text-sm text-muted-foreground">Keep reading to unlock more achievements!</p>
                        <Badge variant="outline" className="mt-2">
                          +{levelUp.pointsEarned} points earned
                        </Badge>
                      </>
                    )}

                    {streakMilestone && (
                      <>
                        <p className="font-medium text-card-foreground">
                          Amazing! {streakMilestone.days} days reading streak!
                        </p>
                        <p className="text-sm text-muted-foreground">You're on fire! Keep the momentum going.</p>
                        <Badge variant="outline" className="mt-2">
                          +{streakMilestone.pointsEarned} bonus points
                        </Badge>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
