import { generateText } from "ai"
import { xai } from "@ai-sdk/xai"
import type { NextRequest } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { articleId, title, content, category } = await request.json()

    if (!articleId || !title || !content) {
      return new Response("Article ID, title, and content are required", { status: 400 })
    }

    const result = await generateText({
      model: xai("grok-4", {
        apiKey: process.env.XAI_API_KEY,
      }),
      prompt: `Analyze this financial news article and provide insights:

Title: ${title}
Category: ${category}
Content: ${content}

Please provide:
1. Sentiment analysis (bullish, bearish, neutral) with confidence score
2. Key financial implications
3. Affected sectors/companies
4. Market impact prediction
5. A concise 2-sentence summary
6. Risk level (low, medium, high)

Format as JSON with these exact keys: sentiment, confidence, implications, sectors, marketImpact, summary, riskLevel`,
      system:
        "You are a financial analyst AI that provides accurate, objective analysis of financial news. Always respond with valid JSON format.",
    })

    let analysis
    try {
      analysis = JSON.parse(result.text)
    } catch (parseError) {
      // Fallback if JSON parsing fails
      analysis = {
        sentiment: "neutral",
        confidence: 0.5,
        implications: "Analysis unavailable",
        sectors: [],
        marketImpact: "Unknown impact",
        summary: title,
        riskLevel: "medium",
      }
    }

    const supabase = createServerClient()
    const { error } = await supabase
      .from("news_articles")
      .update({
        ai_sentiment: analysis.sentiment,
        ai_confidence: analysis.confidence,
        ai_summary: analysis.summary,
        ai_implications: analysis.implications,
        ai_sectors: analysis.sectors,
        ai_market_impact: analysis.marketImpact,
        ai_risk_level: analysis.riskLevel,
        ai_analyzed_at: new Date().toISOString(),
      })
      .eq("id", articleId)

    if (error) {
      console.error("Error updating article with AI analysis:", error)
    }

    return Response.json(analysis)
  } catch (error) {
    console.error("Error analyzing news:", error)
    return new Response("Failed to analyze news", { status: 500 })
  }
}
