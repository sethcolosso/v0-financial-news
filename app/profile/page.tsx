import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ProfileHeader } from "@/components/profile-header"
import { ProfileStats } from "@/components/profile-stats"
import { ProfileActivity } from "@/components/profile-activity"
import { ProfileSettings } from "@/components/profile-settings"

export default async function ProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  // Fetch user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Fetch user points
  const { data: userPoints } = await supabase.from("user_points").select("*").eq("user_id", user.id).single()

  // Fetch user achievements
  const { data: userAchievements } = await supabase
    .from("user_achievements")
    .select("*, achievements(*)")
    .eq("user_id", user.id)

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <ProfileHeader user={user} profile={profile} />
            <ProfileActivity userId={user.id} />
          </div>
          <div className="space-y-8">
            <ProfileStats userPoints={userPoints} achievements={userAchievements} />
            <ProfileSettings user={user} profile={profile} />
          </div>
        </div>
      </div>
    </div>
  )
}
