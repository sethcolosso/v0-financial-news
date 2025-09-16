-- Add AI analysis columns to news_articles table
ALTER TABLE news_articles ADD COLUMN IF NOT EXISTS ai_sentiment TEXT;
ALTER TABLE news_articles ADD COLUMN IF NOT EXISTS ai_confidence DECIMAL(3,2);
ALTER TABLE news_articles ADD COLUMN IF NOT EXISTS ai_summary TEXT;
ALTER TABLE news_articles ADD COLUMN IF NOT EXISTS ai_implications TEXT;
ALTER TABLE news_articles ADD COLUMN IF NOT EXISTS ai_sectors TEXT[];
ALTER TABLE news_articles ADD COLUMN IF NOT EXISTS ai_market_impact TEXT;
ALTER TABLE news_articles ADD COLUMN IF NOT EXISTS ai_risk_level TEXT;
ALTER TABLE news_articles ADD COLUMN IF NOT EXISTS ai_analyzed_at TIMESTAMP WITH TIME ZONE;

-- Create index for AI analysis queries
CREATE INDEX IF NOT EXISTS idx_news_articles_ai_sentiment ON news_articles(ai_sentiment);
CREATE INDEX IF NOT EXISTS idx_news_articles_ai_analyzed_at ON news_articles(ai_analyzed_at);
