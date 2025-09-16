import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ArticleContent } from "@/components/article-content"
import { ArticleComments } from "@/components/article-comments"
import { RelatedArticles } from "@/components/related-articles"
import { ArticleActions } from "@/components/article-actions"
import { AIArticleAnalysis } from "@/components/ai-article-analysis"

interface ArticlePageProps {
  params: Promise<{ id: string }>
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch article
  const { data: article, error } = await supabase.from("news_articles").select("*").eq("id", id).single()

  if (error || !article) {
    notFound()
  }

  // Increment view count
  await supabase
    .from("news_articles")
    .update({ view_count: article.view_count + 1 })
    .eq("id", id)

  // Get user if authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch user interactions if authenticated
  let userLike = null
  let userBookmark = null
  if (user) {
    const { data: like } = await supabase
      .from("user_likes")
      .select("id")
      .eq("user_id", user.id)
      .eq("article_id", id)
      .single()

    const { data: bookmark } = await supabase
      .from("user_bookmarks")
      .select("id")
      .eq("user_id", user.id)
      .eq("article_id", id)
      .single()

    userLike = like
    userBookmark = bookmark
  }

  // Fetch related articles
  const { data: relatedArticles } = await supabase
    .from("news_articles")
    .select("*")
    .eq("category", article.category)
    .neq("id", id)
    .order("published_at", { ascending: false })
    .limit(3)

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <main className="lg:col-span-3 space-y-6">
            <ArticleContent article={article} />
            <ArticleActions
              article={article}
              user={user}
              initialLiked={!!userLike}
              initialBookmarked={!!userBookmark}
            />
            <AIArticleAnalysis
              articleId={id}
              title={article.title}
              content={article.content}
              category={article.category}
            />
            <ArticleComments articleId={id} user={user} />
          </main>
          <aside className="lg:col-span-1">
            <RelatedArticles articles={relatedArticles || []} />
          </aside>
        </div>
      </div>
    </div>
  )
}
