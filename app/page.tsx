import { NewsHeader } from "@/components/news-header"
import { NewsFeed } from "@/components/news-feed"
import { BreakingNews } from "@/components/breaking-news"
import { TrendingSidebar } from "@/components/trending-sidebar"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <NewsHeader />
      <BreakingNews />
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <main className="lg:col-span-3">
            <NewsFeed />
          </main>
          <aside className="lg:col-span-1">
            <TrendingSidebar />
          </aside>
        </div>
      </div>
    </div>
  )
}
