-- Create user bookmarks table
create table if not exists public.user_bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  article_id uuid not null references public.news_articles(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, article_id)
);

-- Enable RLS on user_bookmarks
alter table public.user_bookmarks enable row level security;

-- RLS policies for user_bookmarks
create policy "user_bookmarks_select_own" on public.user_bookmarks for select using (auth.uid() = user_id);
create policy "user_bookmarks_insert_own" on public.user_bookmarks for insert with check (auth.uid() = user_id);
create policy "user_bookmarks_delete_own" on public.user_bookmarks for delete using (auth.uid() = user_id);

-- Create user likes table
create table if not exists public.user_likes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  article_id uuid not null references public.news_articles(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, article_id)
);

-- Enable RLS on user_likes
alter table public.user_likes enable row level security;

-- RLS policies for user_likes
create policy "user_likes_select_all" on public.user_likes for select using (true);
create policy "user_likes_insert_own" on public.user_likes for insert with check (auth.uid() = user_id);
create policy "user_likes_delete_own" on public.user_likes for delete using (auth.uid() = user_id);

-- Create comments table
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  article_id uuid not null references public.news_articles(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  parent_id uuid references public.comments(id) on delete cascade,
  content text not null,
  is_edited boolean default false,
  like_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on comments
alter table public.comments enable row level security;

-- RLS policies for comments
create policy "comments_select_all" on public.comments for select using (true);
create policy "comments_insert_own" on public.comments for insert with check (auth.uid() = user_id);
create policy "comments_update_own" on public.comments for update using (auth.uid() = user_id);
create policy "comments_delete_own" on public.comments for delete using (auth.uid() = user_id);

-- Create comment likes table
create table if not exists public.comment_likes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  comment_id uuid not null references public.comments(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, comment_id)
);

-- Enable RLS on comment_likes
alter table public.comment_likes enable row level security;

-- RLS policies for comment_likes
create policy "comment_likes_select_all" on public.comment_likes for select using (true);
create policy "comment_likes_insert_own" on public.comment_likes for insert with check (auth.uid() = user_id);
create policy "comment_likes_delete_own" on public.comment_likes for delete using (auth.uid() = user_id);

-- Add indexes for performance
create index if not exists user_bookmarks_user_id_idx on public.user_bookmarks(user_id);
create index if not exists user_bookmarks_article_id_idx on public.user_bookmarks(article_id);
create index if not exists user_likes_article_id_idx on public.user_likes(article_id);
create index if not exists comments_article_id_idx on public.comments(article_id);
create index if not exists comments_parent_id_idx on public.comments(parent_id);
create index if not exists comment_likes_comment_id_idx on public.comment_likes(comment_id);

-- Add updated_at trigger to comments
create trigger comments_updated_at
  before update on public.comments
  for each row
  execute function public.handle_updated_at();
