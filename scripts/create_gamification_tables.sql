-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  icon VARCHAR(10) DEFAULT '🏆',
  category VARCHAR(50) NOT NULL,
  points_required INTEGER DEFAULT 0,
  action_required VARCHAR(100), -- e.g., 'read_articles', 'post_comments', 'streak_days'
  threshold INTEGER DEFAULT 1, -- how many times the action needs to be performed
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- Create user_activity table for tracking actions
CREATE TABLE IF NOT EXISTS user_activity (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  activity_type VARCHAR(50) NOT NULL, -- 'read_article', 'post_comment', 'like_article', etc.
  target_id UUID, -- ID of the article, comment, etc.
  points_earned INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create daily_challenges table
CREATE TABLE IF NOT EXISTS daily_challenges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  challenge_type VARCHAR(50) NOT NULL, -- 'read_articles', 'post_comments', 'streak'
  target_count INTEGER DEFAULT 1,
  points_reward INTEGER DEFAULT 10,
  date DATE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_daily_progress table
CREATE TABLE IF NOT EXISTS user_daily_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  challenge_id UUID REFERENCES daily_challenges(id) ON DELETE CASCADE,
  current_progress INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  date DATE NOT NULL,
  UNIQUE(user_id, challenge_id, date)
);

-- Insert initial achievements
INSERT INTO achievements (name, description, icon, category, action_required, threshold, points_required) VALUES
('First Steps', 'Read your first article', '👶', 'reading', 'read_articles', 1, 0),
('News Enthusiast', 'Read 10 articles', '📚', 'reading', 'read_articles', 10, 0),
('News Addict', 'Read 50 articles', '🤓', 'reading', 'read_articles', 50, 0),
('Scholar', 'Read 100 articles', '🎓', 'reading', 'read_articles', 100, 0),
('News Master', 'Read 500 articles', '👑', 'reading', 'read_articles', 500, 0),

('Social Butterfly', 'Post your first comment', '💬', 'social', 'post_comments', 1, 0),
('Conversationalist', 'Post 10 comments', '🗣️', 'social', 'post_comments', 10, 0),
('Community Leader', 'Post 50 comments', '👥', 'social', 'post_comments', 50, 0),
('Discussion Expert', 'Post 100 comments', '🎯', 'social', 'post_comments', 100, 0),

('Appreciator', 'Like your first article', '❤️', 'engagement', 'like_articles', 1, 0),
('Supporter', 'Like 25 articles', '👍', 'engagement', 'like_articles', 25, 0),
('Cheerleader', 'Like 100 articles', '📣', 'engagement', 'like_articles', 100, 0),

('Bookworm', 'Bookmark your first article', '🔖', 'organization', 'bookmark_articles', 1, 0),
('Collector', 'Bookmark 10 articles', '📑', 'organization', 'bookmark_articles', 10, 0),
('Archivist', 'Bookmark 50 articles', '📚', 'organization', 'bookmark_articles', 50, 0),

('Consistent Reader', 'Read articles for 3 days in a row', '🔥', 'streak', 'streak_days', 3, 0),
('Dedicated Follower', 'Read articles for 7 days in a row', '⚡', 'streak', 'streak_days', 7, 0),
('News Devotee', 'Read articles for 30 days in a row', '🌟', 'streak', 'streak_days', 30, 0),
('Legend', 'Read articles for 100 days in a row', '🏆', 'streak', 'streak_days', 100, 0),

('Rising Star', 'Reach 100 points', '⭐', 'points', 'total_points', 0, 100),
('Point Collector', 'Reach 500 points', '💎', 'points', 'total_points', 0, 500),
('Elite Member', 'Reach 1000 points', '👑', 'points', 'total_points', 0, 1000),
('Legendary Trader', 'Reach 5000 points', '🚀', 'points', 'total_points', 0, 5000);

-- Insert daily challenges for today
INSERT INTO daily_challenges (title, description, challenge_type, target_count, points_reward, date) VALUES
('Daily Reader', 'Read 3 articles today', 'read_articles', 3, 15, CURRENT_DATE),
('Social Engagement', 'Post 2 comments today', 'post_comments', 2, 20, CURRENT_DATE),
('Show Some Love', 'Like 5 articles today', 'like_articles', 5, 10, CURRENT_DATE);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON user_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_type ON user_activity(activity_type);
CREATE INDEX IF NOT EXISTS idx_user_daily_progress_user_date ON user_daily_progress(user_id, date);
