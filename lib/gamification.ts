import { createClient } from "@/lib/supabase/client"

export async function trackUserActivity(userId: string, activityType: string, targetId?: string, pointsEarned = 0) {
  const supabase = createClient()

  try {
    // Record the activity
    const { error: activityError } = await supabase.from("user_activity").insert({
      user_id: userId,
      activity_type: activityType,
      target_id: targetId,
      points_earned: pointsEarned,
    })

    if (activityError) throw activityError

    // Update user points
    const { data: currentPoints, error: pointsError } = await supabase
      .from("user_points")
      .select("*")
      .eq("user_id", userId)
      .single()

    if (pointsError && pointsError.code !== "PGRST116") throw pointsError

    const newPoints = (currentPoints?.points || 0) + pointsEarned
    const newLevel = Math.floor(newPoints / 100) + 1

    if (currentPoints) {
      // Update existing record
      await supabase
        .from("user_points")
        .update({
          points: newPoints,
          level: newLevel,
          last_activity: new Date().toISOString(),
        })
        .eq("user_id", userId)
    } else {
      // Create new record
      await supabase.from("user_points").insert({
        user_id: userId,
        points: newPoints,
        level: newLevel,
        streak_days: 1,
        last_activity: new Date().toISOString(),
      })
    }

    // Check for new achievements
    await checkAchievements(userId, activityType)

    // Update daily challenge progress
    await updateDailyChallengeProgress(userId, activityType)

    return { success: true }
  } catch (error) {
    console.error("Error tracking user activity:", error)
    return { success: false, error }
  }
}

export async function checkAchievements(userId: string, activityType: string) {
  const supabase = createClient()

  try {
    // Get user's activity counts
    const { data: activities } = await supabase.from("user_activity").select("*").eq("user_id", userId)

    if (!activities) return

    const activityCounts = activities.reduce(
      (acc, activity) => {
        acc[activity.activity_type] = (acc[activity.activity_type] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    // Get user's current points
    const { data: userPoints } = await supabase.from("user_points").select("*").eq("user_id", userId).single()

    // Get all achievements
    const { data: achievements } = await supabase.from("achievements").select("*").eq("is_active", true)

    if (!achievements) return

    // Get user's current achievements
    const { data: userAchievements } = await supabase
      .from("user_achievements")
      .select("achievement_id")
      .eq("user_id", userId)

    const earnedAchievementIds = new Set(userAchievements?.map((ua) => ua.achievement_id) || [])

    // Check each achievement
    for (const achievement of achievements) {
      if (earnedAchievementIds.has(achievement.id)) continue

      let isEarned = false

      switch (achievement.action_required) {
        case "read_articles":
          isEarned = (activityCounts.read_article || 0) >= achievement.threshold
          break
        case "post_comments":
          isEarned = (activityCounts.post_comment || 0) >= achievement.threshold
          break
        case "like_articles":
          isEarned = (activityCounts.like_article || 0) >= achievement.threshold
          break
        case "bookmark_articles":
          isEarned = (activityCounts.bookmark_article || 0) >= achievement.threshold
          break
        case "streak_days":
          isEarned = (userPoints?.streak_days || 0) >= achievement.threshold
          break
        case "total_points":
          isEarned = (userPoints?.points || 0) >= achievement.points_required
          break
      }

      if (isEarned) {
        // Award the achievement
        await supabase.from("user_achievements").insert({
          user_id: userId,
          achievement_id: achievement.id,
        })
      }
    }
  } catch (error) {
    console.error("Error checking achievements:", error)
  }
}

export async function updateDailyChallengeProgress(userId: string, activityType: string) {
  const supabase = createClient()
  const today = new Date().toISOString().split("T")[0]

  try {
    // Get today's challenges
    const { data: challenges } = await supabase
      .from("daily_challenges")
      .select("*")
      .eq("date", today)
      .eq("is_active", true)

    if (!challenges) return

    for (const challenge of challenges) {
      if (challenge.challenge_type === activityType) {
        // Get or create progress record
        const { data: progress } = await supabase
          .from("user_daily_progress")
          .select("*")
          .eq("user_id", userId)
          .eq("challenge_id", challenge.id)
          .eq("date", today)
          .single()

        if (progress) {
          // Update existing progress
          const newProgress = progress.current_progress + 1
          const isCompleted = newProgress >= challenge.target_count

          await supabase
            .from("user_daily_progress")
            .update({
              current_progress: newProgress,
              is_completed: isCompleted,
              completed_at: isCompleted ? new Date().toISOString() : null,
            })
            .eq("id", progress.id)

          // Award points if completed
          if (isCompleted && !progress.is_completed) {
            await trackUserActivity(userId, "complete_daily_challenge", challenge.id, challenge.points_reward)
          }
        } else {
          // Create new progress record
          const isCompleted = 1 >= challenge.target_count

          await supabase.from("user_daily_progress").insert({
            user_id: userId,
            challenge_id: challenge.id,
            current_progress: 1,
            is_completed: isCompleted,
            completed_at: isCompleted ? new Date().toISOString() : null,
            date: today,
          })

          // Award points if completed
          if (isCompleted) {
            await trackUserActivity(userId, "complete_daily_challenge", challenge.id, challenge.points_reward)
          }
        }
      }
    }
  } catch (error) {
    console.error("Error updating daily challenge progress:", error)
  }
}
