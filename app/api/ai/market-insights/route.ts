import { generateText } from "ai"
import { xai } from "@ai-sdk/xai"
import type { NextRequest } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()

    const { data: articles, error } = await supabase
      .from("news_articles")
      .select("title, category, ai_sentiment, ai_market_impact, created_at")
      .gte("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .order("created_at", { ascending: false })
      .limit(20)

    if (error || !articles?.length) {
      return Response.json({ insights: "No recent articles available for analysis" })
    }

    const articlesText = articles
      .map((article) => `${article.title} (${article.category}) - Sentiment: ${article.ai_sentiment || "unknown"}`)
      .join("\n")

    const result = await generateText({
      model: xai("grok-4", {
        apiKey: process.env.XAI_API_KEY,
      }),
      prompt: `Based on these recent financial news headlines from the last 24 hours, provide market insights:

${articlesText}

Please provide:
1. Overall market sentiment
2. Key themes and trends
3. Sectors to watch
4. Potential opportunities
5. Risk factors
6. Trading recommendations

Keep it concise and actionable for traders and investors.`,
      system:
        "You are a senior market analyst providing daily market insights based on news flow. Be objective and practical.",
    })

    return Response.json({ insights: result.text })
  } catch (error) {
    console.error("Error generating market insights:", error)
    return new Response("Failed to generate insights", { status: 500 })
  }
}
