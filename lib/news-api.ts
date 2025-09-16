// Real news API integration for financial news sources
export interface NewsArticle {
  id: string
  title: string
  content: string
  summary: string
  source_url: string
  source_name: string
  author: string
  category: string
  published_at: string
  image_url?: string
  sentiment?: "positive" | "negative" | "neutral"
  importance_score: number
}

// Alpha Vantage News API integration
export async function fetchAlphaVantageNews(): Promise<NewsArticle[]> {
  try {
    const response = await fetch(
      `https://www.alphavantage.co/query?function=NEWS_SENTIMENT&apikey=${process.env.ALPHA_VANTAGE_API_KEY}&limit=20`,
    )
    const data = await response.json()

    if (data.feed) {
      return data.feed.map((item: any, index: number) => ({
        id: `av-${index}`,
        title: item.title,
        content: item.summary,
        summary: item.summary.substring(0, 200) + "...",
        source_url: item.url,
        source_name: item.source,
        author: item.authors?.[0] || "Unknown",
        category: categorizeNews(item.title + " " + item.summary),
        published_at: item.time_published,
        image_url: item.banner_image,
        sentiment: item.overall_sentiment_label?.toLowerCase() || "neutral",
        importance_score: Math.round(Number.parseFloat(item.relevance_score || "0.5") * 100),
      }))
    }
    return []
  } catch (error) {
    console.error("Error fetching Alpha Vantage news:", error)
    return []
  }
}

// Yahoo Finance RSS feed integration
export async function fetchYahooFinanceNews(): Promise<NewsArticle[]> {
  try {
    const response = await fetch("https://feeds.finance.yahoo.com/rss/2.0/headline")
    const text = await response.text()

    // Parse RSS feed (simplified - in production use a proper RSS parser)
    const items = text.match(/<item>[\s\S]*?<\/item>/g) || []

    return items.slice(0, 10).map((item, index) => {
      const title = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1] || "No title"
      const link = item.match(/<link>(.*?)<\/link>/)?.[1] || ""
      const description = item.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/)?.[1] || ""
      const pubDate = item.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || new Date().toISOString()

      return {
        id: `yf-${index}`,
        title,
        content: description,
        summary: description.substring(0, 200) + "...",
        source_url: link,
        source_name: "Yahoo Finance",
        author: "Yahoo Finance",
        category: categorizeNews(title + " " + description),
        published_at: new Date(pubDate).toISOString(),
        sentiment: "neutral" as const,
        importance_score: 70,
      }
    })
  } catch (error) {
    console.error("Error fetching Yahoo Finance news:", error)
    return []
  }
}

// CNBC RSS feed integration
export async function fetchCNBCNews(): Promise<NewsArticle[]> {
  try {
    const response = await fetch("https://www.cnbc.com/id/100003114/device/rss/rss.html")
    const text = await response.text()

    const items = text.match(/<item>[\s\S]*?<\/item>/g) || []

    return items.slice(0, 10).map((item, index) => {
      const title = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1] || "No title"
      const link = item.match(/<link>(.*?)<\/link>/)?.[1] || ""
      const description = item.match(/<description><!\[CDATA\[(.*?)\]\]><\/description>/)?.[1] || ""
      const pubDate = item.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || new Date().toISOString()

      return {
        id: `cnbc-${index}`,
        title,
        content: description,
        summary: description.substring(0, 200) + "...",
        source_url: link,
        source_name: "CNBC",
        author: "CNBC",
        category: categorizeNews(title + " " + description),
        published_at: new Date(pubDate).toISOString(),
        sentiment: "neutral" as const,
        importance_score: 75,
      }
    })
  } catch (error) {
    console.error("Error fetching CNBC news:", error)
    return []
  }
}

// Categorize news based on content
function categorizeNews(content: string): string {
  const lowerContent = content.toLowerCase()

  if (lowerContent.includes("bitcoin") || lowerContent.includes("crypto") || lowerContent.includes("ethereum")) {
    return "crypto"
  }
  if (lowerContent.includes("stock") || lowerContent.includes("shares") || lowerContent.includes("equity")) {
    return "stocks"
  }
  if (lowerContent.includes("fed") || lowerContent.includes("interest rate") || lowerContent.includes("inflation")) {
    return "economics"
  }
  if (lowerContent.includes("oil") || lowerContent.includes("gold") || lowerContent.includes("commodity")) {
    return "commodities"
  }
  if (lowerContent.includes("forex") || lowerContent.includes("currency") || lowerContent.includes("dollar")) {
    return "forex"
  }
  if (lowerContent.includes("bond") || lowerContent.includes("treasury") || lowerContent.includes("yield")) {
    return "bonds"
  }

  return "markets"
}

// Aggregate news from all sources
export async function fetchAllNews(): Promise<NewsArticle[]> {
  try {
    const [alphaVantage, yahoo, cnbc] = await Promise.allSettled([
      fetchAlphaVantageNews(),
      fetchYahooFinanceNews(),
      fetchCNBCNews(),
    ])

    const allNews: NewsArticle[] = []

    if (alphaVantage.status === "fulfilled") {
      allNews.push(...alphaVantage.value)
    }
    if (yahoo.status === "fulfilled") {
      allNews.push(...yahoo.value)
    }
    if (cnbc.status === "fulfilled") {
      allNews.push(...cnbc.value)
    }

    // Sort by importance score and published date
    return allNews.sort((a, b) => {
      const scoreA = a.importance_score
      const scoreB = b.importance_score
      if (scoreA !== scoreB) return scoreB - scoreA
      return new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
    })
  } catch (error) {
    console.error("Error fetching all news:", error)
    return []
  }
}
