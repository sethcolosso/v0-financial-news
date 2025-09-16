import { createClient } from "@/lib/supabase/server"
import { CommunityHeader } from "@/components/community-header"
import { CommunityStats } from "@/components/community-stats"
import { TopContributors } from "@/components/top-contributors"
import { RecentDiscussions } from "@/components/recent-discussions"

export default async function CommunityPage() {
  const supabase = await createClient()

  // Fetch community stats
  const { data: totalUsers } = await supabase.from("profiles").select("id", { count: "exact" })

  const { data: totalComments } = await supabase.from("comments").select("id", { count: "exact" })

  const { data: totalArticles } = await supabase.from("news_articles").select("id", { count: "exact" })

  // Fetch top contributors
  const { data: topContributors } = await supabase
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
    .limit(10)

  // Fetch recent discussions (articles with most recent comments)
  const { data: recentDiscussions } = await supabase
    .from("news_articles")
    .select(`
      *,
      comments (
        id,
        created_at,
        profiles (
          username,
          display_name
        )
      )
    `)
    .order("created_at", { ascending: false })
    .limit(10)

  return (
    <div className="min-h-screen bg-background">
      <CommunityHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <main className="lg:col-span-3">
            <CommunityStats
              totalUsers={totalUsers?.length || 0}
              totalComments={totalComments?.length || 0}
              totalArticles={totalArticles?.length || 0}
            />
            <RecentDiscussions discussions={recentDiscussions || []} />
          </main>
          <aside className="lg:col-span-1">
            <TopContributors contributors={topContributors || []} />
          </aside>
        </div>
      </div>
    </div>
  )
}
