import { NextResponse } from "next/server"
import { fetchAllNews } from "@/lib/news-api"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    console.log("[v0] Starting news fetch...")

    // Fetch news from external APIs
    const newsArticles = await fetchAllNews()

    console.log("[v0] Fetched articles count:", newsArticles.length)

    if (newsArticles.length === 0) {
      return NextResponse.json({ articles: [], message: "No news available" })
    }

    // Store in database for caching and future reference
    const supabase = await createClient()

    for (const article of newsArticles.slice(0, 20)) {
      // Limit to 20 articles
      const { error } = await supabase.from("news_articles").upsert(
        {
          title: article.title,
          content: article.content,
          summary: article.summary,
          source_url: article.source_url,
          source_name: article.source_name,
          author: article.author,
          category: article.category,
          published_at: article.published_at,
          image_url: article.image_url,
          sentiment: article.sentiment,
          importance_score: article.importance_score,
          scraped_at: new Date().toISOString(),
        },
        {
          onConflict: "source_url",
          ignoreDuplicates: true,
        },
      )

      if (error) {
        console.error("Error storing article:", error)
      }
    }

    console.log("[v0] Successfully processed news articles")
    return NextResponse.json({ articles: newsArticles })
  } catch (error) {
    console.error("Error in news API:", error)
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 })
  }
}
