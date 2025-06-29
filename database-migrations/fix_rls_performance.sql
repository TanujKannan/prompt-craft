-- Migration: Fix RLS Performance Issue
-- This script updates existing RLS policies to use (select auth.uid()) instead of auth.uid()
-- to prevent per-row evaluation and improve query performance at scale.

-- Drop existing policies
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

-- Create optimized RLS policies using (select auth.uid()) for better performance

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

-- Confirm migration completed
SELECT 'RLS performance optimization completed successfully!' AS status; 