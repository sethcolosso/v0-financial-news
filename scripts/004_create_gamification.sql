-- Create user points table for gamification
create table if not exists public.user_points (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  points integer not null default 0,
  level integer not null default 1,
  total_earned integer not null default 0,
  streak_days integer not null default 0,
  last_activity_date date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id)
);

-- Enable RLS on user_points
alter table public.user_points enable row level security;

-- RLS policies for user_points
create policy "user_points_select_all" on public.user_points for select using (true);
create policy "user_points_insert_own" on public.user_points for insert with check (auth.uid() = user_id);
create policy "user_points_update_own" on public.user_points for update using (auth.uid() = user_id);

-- Create achievements table
create table if not exists public.achievements (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text not null,
  icon text,
  points_required integer,
  badge_color text default '#3b82f6',
  category text check (category in ('reading', 'engagement', 'social', 'streak', 'special')),
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on achievements
alter table public.achievements enable row level security;

-- RLS policies for achievements (public read)
create policy "achievements_select_all" on public.achievements for select using (true);

-- Create user achievements table
create table if not exists public.user_achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  achievement_id uuid not null references public.achievements(id) on delete cascade,
  earned_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, achievement_id)
);

-- Enable RLS on user_achievements
alter table public.user_achievements enable row level security;

-- RLS policies for user_achievements
create policy "user_achievements_select_all" on public.user_achievements for select using (true);
create policy "user_achievements_insert_own" on public.user_achievements for insert with check (auth.uid() = user_id);

-- Create point transactions table for tracking point history
create table if not exists public.point_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  points integer not null,
  transaction_type text not null check (transaction_type in ('earned', 'spent', 'bonus')),
  description text not null,
  reference_id uuid, -- Can reference article_id, comment_id, etc.
  reference_type text, -- 'article_read', 'comment_posted', 'like_given', etc.
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on point_transactions
alter table public.point_transactions enable row level security;

-- RLS policies for point_transactions
create policy "point_transactions_select_own" on public.point_transactions for select using (auth.uid() = user_id);
create policy "point_transactions_insert_own" on public.point_transactions for insert with check (auth.uid() = user_id);

-- Add indexes for performance
create index if not exists user_points_user_id_idx on public.user_points(user_id);
create index if not exists user_points_points_idx on public.user_points(points desc);
create index if not exists user_achievements_user_id_idx on public.user_achievements(user_id);
create index if not exists point_transactions_user_id_idx on public.point_transactions(user_id);

-- Add updated_at trigger to user_points
create trigger user_points_updated_at
  before update on public.user_points
  for each row
  execute function public.handle_updated_at();

-- Insert default achievements
insert into public.achievements (name, description, icon, points_required, category) values
  ('First Steps', 'Read your first article', '📖', 0, 'reading'),
  ('Bookworm', 'Read 10 articles', '📚', 50, 'reading'),
  ('News Junkie', 'Read 50 articles', '📰', 250, 'reading'),
  ('Market Expert', 'Read 100 articles', '📈', 500, 'reading'),
  ('Commentator', 'Post your first comment', '💬', 0, 'engagement'),
  ('Discussion Leader', 'Post 25 comments', '🗣️', 125, 'engagement'),
  ('Social Butterfly', 'Like 50 articles', '❤️', 100, 'social'),
  ('Curator', 'Bookmark 25 articles', '🔖', 75, 'social'),
  ('Streak Master', 'Maintain a 7-day reading streak', '🔥', 100, 'streak'),
  ('Dedication', 'Maintain a 30-day reading streak', '⭐', 500, 'streak')
on conflict (name) do nothing;
