import { createClient } from "@/lib/supabase/server"
import { AdminHeader } from "@/components/admin-header"
import { ArticlesTable } from "@/components/articles-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default async function AdminArticlesPage() {
  const supabase = await createClient()

  // Fetch all articles with pagination
  const { data: articles, error } = await supabase
    .from("news_articles")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50)

  if (error) {
    console.error("Error fetching articles:", error)
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-card-foreground">Articles Management</h1>
            <p className="text-muted-foreground">Manage and moderate news articles</p>
          </div>
          <Button asChild>
            <Link href="/admin/articles/new" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Article
            </Link>
          </Button>
        </div>

        <ArticlesTable articles={articles || []} />
      </div>
    </div>
  )
}
