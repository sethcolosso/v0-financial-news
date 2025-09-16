"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { trackUserActivity } from "@/lib/gamification"

interface NotificationData {
  achievement?: any
  levelUp?: { newLevel: number; pointsEarned: number }
  streakMilestone?: { days: number; pointsEarned: number }
}

export function useGamification() {
  const [notification, setNotification] = useState<NotificationData | null>(null)
  const supabase = createClient()

  const trackActivity = async (activityType: string, targetId?: string, pointsEarned = 0) => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    // Get current user stats before tracking
    const { data: currentStats } = await supabase.from("user_points").select("*").eq("user_id", user.id).single()

    const currentLevel = currentStats?.level || 1
    const currentStreak = currentStats?.streak_days || 0

    // Track the activity
    const result = await trackUserActivity(user.id, activityType, targetId, pointsEarned)

    if (result.success) {
      // Check for level up
      const { data: newStats } = await supabase.from("user_points").select("*").eq("user_id", user.id).single()

      if (newStats && newStats.level > currentLevel) {
        setNotification({
          levelUp: {
            newLevel: newStats.level,
            pointsEarned: pointsEarned,
          },
        })
      }

      // Check for streak milestones
      if (newStats && newStats.streak_days > currentStreak) {
        const streakDays = newStats.streak_days
        if ([3, 7, 14, 30, 50, 100].includes(streakDays)) {
          setNotification({
            streakMilestone: {
              days: streakDays,
              pointsEarned: streakDays * 2, // Bonus points for streak
            },
          })
        }
      }

      // Check for new achievements
      const { data: recentAchievements } = await supabase
        .from("user_achievements")
        .select(`
          *,
          achievements (*)
        `)
        .eq("user_id", user.id)
        .gte("earned_at", new Date(Date.now() - 5000).toISOString()) // Last 5 seconds
        .order("earned_at", { ascending: false })
        .limit(1)

      if (recentAchievements && recentAchievements.length > 0) {
        setNotification({
          achievement: recentAchievements[0].achievements,
        })
      }
    }

    return result
  }

  const dismissNotification = () => {
    setNotification(null)
  }

  return {
    notification,
    trackActivity,
    dismissNotification,
  }
}
