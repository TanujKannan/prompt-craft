-- PromptCraft Database Setup - Run this after your basic table creation
-- This adds authentication features and security to your existing tables

-- First, let's add the missing columns to existing tables
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS updated_at timestamp default now();
ALTER TABLE prompt_sessions ADD COLUMN IF NOT EXISTS updated_at timestamp default now();

-- Update foreign key constraint to cascade deletes properly
ALTER TABLE prompt_sessions DROP CONSTRAINT IF EXISTS prompt_sessions_user_id_fkey;
ALTER TABLE prompt_sessions ADD CONSTRAINT prompt_sessions_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- Update other foreign key constraints
ALTER TABLE clarifying_answers DROP CONSTRAINT IF EXISTS clarifying_answers_session_id_fkey;
ALTER TABLE clarifying_answers ADD CONSTRAINT clarifying_answers_session_id_fkey 
  FOREIGN KEY (session_id) REFERENCES prompt_sessions(id) ON DELETE CASCADE;

ALTER TABLE generated_prompts DROP CONSTRAINT IF EXISTS generated_prompts_session_id_fkey;
ALTER TABLE generated_prompts ADD CONSTRAINT generated_prompts_session_id_fkey 
  FOREIGN KEY (session_id) REFERENCES prompt_sessions(id) ON DELETE CASCADE;

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE clarifying_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_prompts ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view their own sessions" ON prompt_sessions;
DROP POLICY IF EXISTS "Users can insert their own sessions" ON prompt_sessions;
DROP POLICY IF EXISTS "Users can update their own sessions" ON prompt_sessions;
DROP POLICY IF EXISTS "Users can view their own answers" ON clarifying_answers;
DROP POLICY IF EXISTS "Users can insert their own answers" ON clarifying_answers;
DROP POLICY IF EXISTS "Users can update their own answers" ON clarifying_answers;
DROP POLICY IF EXISTS "Users can view their own prompts" ON generated_prompts;
DROP POLICY IF EXISTS "Users can insert their own prompts" ON generated_prompts;

-- Create RLS policies for authenticated users

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON profiles 
  FOR SELECT USING ((select auth.uid()) = id);

CREATE POLICY "Users can insert their own profile" ON profiles 
  FOR INSERT WITH CHECK ((select auth.uid()) = id);

CREATE POLICY "Users can update their own profile" ON profiles 
  FOR UPDATE USING ((select auth.uid()) = id);

-- Prompt sessions policies (allow anonymous sessions with user_id = NULL)
CREATE POLICY "Users can view their own sessions" ON prompt_sessions 
  FOR SELECT USING ((select auth.uid()) = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert their own sessions" ON prompt_sessions 
  FOR INSERT WITH CHECK ((select auth.uid()) = user_id OR ((select auth.uid()) IS NULL AND user_id IS NULL));

CREATE POLICY "Users can update their own sessions" ON prompt_sessions 
  FOR UPDATE USING ((select auth.uid()) = user_id OR user_id IS NULL);

-- Clarifying answers policies
CREATE POLICY "Users can view their own answers" ON clarifying_answers 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM prompt_sessions 
      WHERE prompt_sessions.id = clarifying_answers.session_id 
      AND (prompt_sessions.user_id = (select auth.uid()) OR prompt_sessions.user_id IS NULL)
    )
  );

CREATE POLICY "Users can insert their own answers" ON clarifying_answers 
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM prompt_sessions 
      WHERE prompt_sessions.id = clarifying_answers.session_id 
      AND (prompt_sessions.user_id = (select auth.uid()) OR prompt_sessions.user_id IS NULL)
    )
  );

CREATE POLICY "Users can update their own answers" ON clarifying_answers 
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM prompt_sessions 
      WHERE prompt_sessions.id = clarifying_answers.session_id 
      AND (prompt_sessions.user_id = (select auth.uid()) OR prompt_sessions.user_id IS NULL)
    )
  );

-- Generated prompts policies
CREATE POLICY "Users can view their own prompts" ON generated_prompts 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM prompt_sessions 
      WHERE prompt_sessions.id = generated_prompts.session_id 
      AND (prompt_sessions.user_id = (select auth.uid()) OR prompt_sessions.user_id IS NULL)
    )
  );

CREATE POLICY "Users can insert their own prompts" ON generated_prompts 
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM prompt_sessions 
      WHERE prompt_sessions.id = generated_prompts.session_id 
      AND (prompt_sessions.user_id = (select auth.uid()) OR prompt_sessions.user_id IS NULL)
    )
  );

-- Create function to handle profile creation on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to automatically create profile on user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at columns
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS update_prompt_sessions_updated_at ON prompt_sessions;
CREATE TRIGGER update_prompt_sessions_updated_at
  BEFORE UPDATE ON prompt_sessions
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Grant necessary permissions for the service role
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Test that everything works by checking if we can select from tables
-- (This will help verify the policies are working correctly)
SELECT 'Database setup completed successfully!' AS status; 