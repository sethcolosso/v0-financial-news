-- Create news articles table
create table if not exists public.news_articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  summary text,
  source_url text,
  source_name text,
  author text,
  category text not null check (category in ('stocks', 'crypto', 'forex', 'commodities', 'bonds', 'economics', 'markets', 'analysis', 'news')),
  tags text[],
  sentiment text check (sentiment in ('positive', 'negative', 'neutral')),
  importance_score integer default 0 check (importance_score >= 0 and importance_score <= 100),
  ai_summary text,
  ai_key_points text[],
  image_url text,
  published_at timestamp with time zone,
  scraped_at timestamp with time zone default timezone('utc'::text, now()) not null,
  is_featured boolean default false,
  is_breaking boolean default false,
  view_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on news_articles
alter table public.news_articles enable row level security;

-- RLS policies for news_articles (public read, admin write)
create policy "news_articles_select_all" on public.news_articles for select using (true);

-- Add indexes for performance
create index if not exists news_articles_category_idx on public.news_articles(category);
create index if not exists news_articles_published_at_idx on public.news_articles(published_at desc);
create index if not exists news_articles_importance_score_idx on public.news_articles(importance_score desc);
create index if not exists news_articles_is_featured_idx on public.news_articles(is_featured) where is_featured = true;
create index if not exists news_articles_is_breaking_idx on public.news_articles(is_breaking) where is_breaking = true;

-- Add updated_at trigger to news_articles
create trigger news_articles_updated_at
  before update on public.news_articles
  for each row
  execute function public.handle_updated_at();
