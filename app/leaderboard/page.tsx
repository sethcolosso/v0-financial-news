import { createClient } from "@/lib/supabase/server"
import { LeaderboardHeader } from "@/components/leaderboard-header"
import { LeaderboardTabs } from "@/components/leaderboard-tabs"

export default async function LeaderboardPage() {
  const supabase = await createClient()

  // Fetch top users by points
  const { data: topByPoints } = await supabase
    .from("user_points")
    .select(`
      *,
      profiles (
        username,
        display_name,
        avatar_url
      )
    `)
    .order("points", { ascending: false })
    .limit(50)

  // Fetch top users by level
  const { data: topByLevel } = await supabase
    .from("user_points")
    .select(`
      *,
      profiles (
        username,
        display_name,
        avatar_url
      )
    `)
    .order("level", { ascending: false })
    .order("points", { ascending: false })
    .limit(50)

  // Fetch top users by streak
  const { data: topByStreak } = await supabase
    .from("user_points")
    .select(`
      *,
      profiles (
        username,
        display_name,
        avatar_url
      )
    `)
    .order("streak_days", { ascending: false })
    .order("points", { ascending: false })
    .limit(50)

  // Get current user's position if authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let userRanking = null
  if (user) {
    const { data: userPoints } = await supabase.from("user_points").select("*").eq("user_id", user.id).single()

    if (userPoints) {
      // Calculate user's rank by points
      const { count: usersAbove } = await supabase
        .from("user_points")
        .select("*", { count: "exact" })
        .gt("points", userPoints.points)

      userRanking = {
        ...userPoints,
        rank: (usersAbove || 0) + 1,
      }
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <LeaderboardHeader userRanking={userRanking} />
      <div className="container mx-auto px-4 py-8">
        <LeaderboardTabs
          topByPoints={topByPoints || []}
          topByLevel={topByLevel || []}
          topByStreak={topByStreak || []}
          currentUser={user}
        />
      </div>
    </div>
  )
}
