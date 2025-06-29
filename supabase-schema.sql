-- PromptCraft Database Schema
-- Run this in your Supabase SQL editor

-- Create profiles table
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- Create prompt_sessions table
create table if not exists prompt_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  app_idea text not null,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- Create clarifying_answers table
create table if not exists clarifying_answers (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references prompt_sessions(id) on delete cascade,
  question text not null,
  selected_answer text not null,
  explanation text,
  created_at timestamp default now()
);

-- Create generated_prompts table
create table if not exists generated_prompts (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references prompt_sessions(id) on delete cascade,
  prompt text not null,
  generated_at timestamp default now()
);

-- Enable Row Level Security (RLS)
alter table profiles enable row level security;
alter table prompt_sessions enable row level security;
alter table clarifying_answers enable row level security;
alter table generated_prompts enable row level security;

-- Drop existing policies if they exist
drop policy if exists "Public profiles are viewable by everyone" on profiles;
drop policy if exists "Users can insert their own profile" on profiles;
drop policy if exists "Users can update their own profile" on profiles;
drop policy if exists "Public prompt_sessions are viewable by everyone" on prompt_sessions;
drop policy if exists "Anyone can insert prompt_sessions" on prompt_sessions;
drop policy if exists "Anyone can update prompt_sessions" on prompt_sessions;
drop policy if exists "Public clarifying_answers are viewable by everyone" on clarifying_answers;
drop policy if exists "Anyone can insert clarifying_answers" on clarifying_answers;
drop policy if exists "Anyone can update clarifying_answers" on clarifying_answers;
drop policy if exists "Public generated_prompts are viewable by everyone" on generated_prompts;
drop policy if exists "Anyone can insert generated_prompts" on generated_prompts;
drop policy if exists "Anyone can update generated_prompts" on generated_prompts;

-- Create new RLS policies for authenticated users

-- Profiles policies
create policy "Users can view their own profile" on profiles for select using ((select auth.uid()) = id);
create policy "Users can insert their own profile" on profiles for insert with check ((select auth.uid()) = id);
create policy "Users can update their own profile" on profiles for update using ((select auth.uid()) = id);

-- Prompt sessions policies
create policy "Users can view their own sessions" on prompt_sessions for select using (
  (select auth.uid()) = user_id OR user_id IS NULL
);
create policy "Users can insert their own sessions" on prompt_sessions for insert with check (
  (select auth.uid()) = user_id OR ((select auth.uid()) IS NULL AND user_id IS NULL)
);
create policy "Users can update their own sessions" on prompt_sessions for update using (
  (select auth.uid()) = user_id OR user_id IS NULL
);

-- Clarifying answers policies
create policy "Users can view their own answers" on clarifying_answers for select using (
  EXISTS (
    SELECT 1 FROM prompt_sessions 
    WHERE prompt_sessions.id = clarifying_answers.session_id 
    AND (prompt_sessions.user_id = (select auth.uid()) OR prompt_sessions.user_id IS NULL)
  )
);
create policy "Users can insert their own answers" on clarifying_answers for insert with check (
  EXISTS (
    SELECT 1 FROM prompt_sessions 
    WHERE prompt_sessions.id = clarifying_answers.session_id 
    AND (prompt_sessions.user_id = (select auth.uid()) OR prompt_sessions.user_id IS NULL)
  )
);
create policy "Users can update their own answers" on clarifying_answers for update using (
  EXISTS (
    SELECT 1 FROM prompt_sessions 
    WHERE prompt_sessions.id = clarifying_answers.session_id 
    AND (prompt_sessions.user_id = (select auth.uid()) OR prompt_sessions.user_id IS NULL)
  )
);

-- Generated prompts policies
create policy "Users can view their own prompts" on generated_prompts for select using (
  EXISTS (
    SELECT 1 FROM prompt_sessions 
    WHERE prompt_sessions.id = generated_prompts.session_id 
    AND (prompt_sessions.user_id = (select auth.uid()) OR prompt_sessions.user_id IS NULL)
  )
);
create policy "Users can insert their own prompts" on generated_prompts for insert with check (
  EXISTS (
    SELECT 1 FROM prompt_sessions 
    WHERE prompt_sessions.id = generated_prompts.session_id 
    AND (prompt_sessions.user_id = (select auth.uid()) OR prompt_sessions.user_id IS NULL)
  )
);

-- Create function to handle profile creation on user signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger to automatically create profile on user signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- Create function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = current_timestamp;
  return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at
drop trigger if exists update_profiles_updated_at on profiles;
create trigger update_profiles_updated_at
  before update on profiles
  for each row execute procedure update_updated_at_column();

drop trigger if exists update_prompt_sessions_updated_at on prompt_sessions;
create trigger update_prompt_sessions_updated_at
  before update on prompt_sessions
  for each row execute procedure update_updated_at_column(); 