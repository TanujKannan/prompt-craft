-- Fix RLS Policies for PromptCraft
-- Run this in your Supabase SQL Editor to fix all permission issues

-- First, drop all existing policies to start fresh
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
DROP POLICY IF EXISTS "Users can update their own prompts" ON generated_prompts;

-- Also drop any other policies that might exist
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Public prompt_sessions are viewable by everyone" ON prompt_sessions;
DROP POLICY IF EXISTS "Anyone can insert prompt_sessions" ON prompt_sessions;
DROP POLICY IF EXISTS "Anyone can update prompt_sessions" ON prompt_sessions;
DROP POLICY IF EXISTS "Public clarifying_answers are viewable by everyone" ON clarifying_answers;
DROP POLICY IF EXISTS "Anyone can insert clarifying_answers" ON clarifying_answers;
DROP POLICY IF EXISTS "Anyone can update clarifying_answers" ON clarifying_answers;
DROP POLICY IF EXISTS "Public generated_prompts are viewable by everyone" ON generated_prompts;
DROP POLICY IF EXISTS "Anyone can insert generated_prompts" ON generated_prompts;
DROP POLICY IF EXISTS "Anyone can update generated_prompts" ON generated_prompts;

-- Make sure RLS is enabled on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE clarifying_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_prompts ENABLE ROW LEVEL SECURITY;

-- CREATE SIMPLE, WORKING RLS POLICIES

-- 1. PROFILES TABLE POLICIES
-- Allow users to see and manage their own profile
CREATE POLICY "profiles_select_own" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_insert_own" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- 2. PROMPT_SESSIONS TABLE POLICIES
-- Allow users to see and manage their own sessions + anonymous sessions
CREATE POLICY "prompt_sessions_select" ON prompt_sessions
    FOR SELECT USING (
        auth.uid() = user_id OR 
        user_id IS NULL
    );

CREATE POLICY "prompt_sessions_insert" ON prompt_sessions
    FOR INSERT WITH CHECK (
        auth.uid() = user_id OR 
        (auth.uid() IS NULL AND user_id IS NULL)
    );

CREATE POLICY "prompt_sessions_update" ON prompt_sessions
    FOR UPDATE USING (
        auth.uid() = user_id OR 
        user_id IS NULL
    );

CREATE POLICY "prompt_sessions_delete" ON prompt_sessions
    FOR DELETE USING (
        auth.uid() = user_id OR 
        user_id IS NULL
    );

-- 3. CLARIFYING_ANSWERS TABLE POLICIES
-- Allow access based on session ownership
CREATE POLICY "clarifying_answers_select" ON clarifying_answers
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM prompt_sessions ps
            WHERE ps.id = clarifying_answers.session_id
            AND (ps.user_id = auth.uid() OR ps.user_id IS NULL)
        )
    );

CREATE POLICY "clarifying_answers_insert" ON clarifying_answers
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM prompt_sessions ps
            WHERE ps.id = clarifying_answers.session_id
            AND (ps.user_id = auth.uid() OR ps.user_id IS NULL)
        )
    );

CREATE POLICY "clarifying_answers_update" ON clarifying_answers
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM prompt_sessions ps
            WHERE ps.id = clarifying_answers.session_id
            AND (ps.user_id = auth.uid() OR ps.user_id IS NULL)
        )
    );

CREATE POLICY "clarifying_answers_delete" ON clarifying_answers
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM prompt_sessions ps
            WHERE ps.id = clarifying_answers.session_id
            AND (ps.user_id = auth.uid() OR ps.user_id IS NULL)
        )
    );

-- 4. GENERATED_PROMPTS TABLE POLICIES
-- Allow access based on session ownership
CREATE POLICY "generated_prompts_select" ON generated_prompts
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM prompt_sessions ps
            WHERE ps.id = generated_prompts.session_id
            AND (ps.user_id = auth.uid() OR ps.user_id IS NULL)
        )
    );

CREATE POLICY "generated_prompts_insert" ON generated_prompts
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM prompt_sessions ps
            WHERE ps.id = generated_prompts.session_id
            AND (ps.user_id = auth.uid() OR ps.user_id IS NULL)
        )
    );

CREATE POLICY "generated_prompts_update" ON generated_prompts
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM prompt_sessions ps
            WHERE ps.id = generated_prompts.session_id
            AND (ps.user_id = auth.uid() OR ps.user_id IS NULL)
        )
    );

CREATE POLICY "generated_prompts_delete" ON generated_prompts
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM prompt_sessions ps
            WHERE ps.id = generated_prompts.session_id
            AND (ps.user_id = auth.uid() OR ps.user_id IS NULL)
        )
    );

-- Test the policies work
SELECT 'RLS policies have been reset and recreated successfully!' AS status;

-- Verify policies are created
SELECT schemaname, tablename, policyname, permissive, roles, cmd 
FROM pg_policies 
WHERE schemaname = 'public' 
ORDER BY tablename, policyname; 