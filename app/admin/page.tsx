import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AdminHeader } from "@/components/admin-header"
import { AdminStats } from "@/components/admin-stats"
import { RecentActivity } from "@/components/admin-recent-activity"
import { QuickActions } from "@/components/admin-quick-actions"

export default async function AdminDashboard() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  // For demo purposes, we'll assume any authenticated user can access admin
  // In production, you'd check for admin role/permissions

  // Fetch dashboard stats
  const { data: totalUsers } = await supabase.from("profiles").select("id", { count: "exact" })

  const { data: totalArticles } = await supabase.from("news_articles").select("id", { count: "exact" })

  const { data: totalComments } = await supabase.from("comments").select("id", { count: "exact" })

  const { data: totalLikes } = await supabase.from("user_likes").select("id", { count: "exact" })

  // Fetch recent articles
  const { data: recentArticles } = await supabase
    .from("news_articles")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5)

  // Fetch recent comments
  const { data: recentComments } = await supabase
    .from("comments")
    .select(`
      *,
      profiles (
        username,
        display_name
      ),
      news_articles (
        title
      )
    `)
    .order("created_at", { ascending: false })
    .limit(5)

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <main className="lg:col-span-3 space-y-8">
            <AdminStats
              totalUsers={totalUsers?.length || 0}
              totalArticles={totalArticles?.length || 0}
              totalComments={totalComments?.length || 0}
              totalLikes={totalLikes?.length || 0}
            />
            <RecentActivity recentArticles={recentArticles || []} recentComments={recentComments || []} />
          </main>
          <aside className="lg:col-span-1">
            <QuickActions />
          </aside>
        </div>
      </div>
    </div>
  )
}
