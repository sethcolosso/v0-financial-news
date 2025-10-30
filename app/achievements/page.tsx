import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AchievementsHeader } from "@/components/achievements-header"
import { AchievementsList } from "@/components/achievements-list"
import { DailyChallenges } from "@/components/daily-challenges"
import { ProgressStats } from "@/components/progress-stats"
export default async function AchievementsPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }
  const { data: userAchievements } = await supabase
    .from("user_achievements")
    .select(`
      *,
      achievements (*)
    `)
    .eq("user_id", user.id)
  const { data: allAchievements } = await supabase.from("achievements").select("*").eq("is_active", true)
  const { data: userPoints } = await supabase.from("user_points").select("*").eq("user_id", user.id).single()
  const { data: dailyChallenges } = await supabase
    .from("daily_challenges")
    .select("*")
    .eq("date", new Date().toISOString().split("T")[0])
    .eq("is_active", true)
  const { data: dailyProgress } = await supabase
    .from("user_daily_progress")
    .select("*")
    .eq("user_id", user.id)
    .eq("date", new Date().toISOString().split("T")[0])

  // Fetch user activity stats
  const { data: activityStats } = await supabase.from("user_activity").select("activity_type").eq("user_id", user.id)

  return (
    <div className="min-h-screen bg-background">
      <AchievementsHeader userPoints={userPoints} />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <main className="lg:col-span-3 space-y-8">
            <DailyChallenges challenges={dailyChallenges || []} progress={dailyProgress || []} />
            <AchievementsList
              userAchievements={userAchievements || []}
              allAchievements={allAchievements || []}
              activityStats={activityStats || []}
            />
          </main>
          <aside className="lg:col-span-1">
            <ProgressStats userPoints={userPoints} activityStats={activityStats || []} />
          </aside>
        </div>
      </div>
    </div>
  )
}
