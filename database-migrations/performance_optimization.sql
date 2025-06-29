-- Performance Optimization Migration
-- This script adds indexes and optimizations to improve query performance

-- Add indexes for frequently queried columns
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON profiles(created_at);

CREATE INDEX IF NOT EXISTS idx_prompt_sessions_user_id ON prompt_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_prompt_sessions_created_at ON prompt_sessions(created_at);
CREATE INDEX IF NOT EXISTS idx_prompt_sessions_user_created ON prompt_sessions(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_clarifying_answers_session_id ON clarifying_answers(session_id);
CREATE INDEX IF NOT EXISTS idx_clarifying_answers_created_at ON clarifying_answers(created_at);

CREATE INDEX IF NOT EXISTS idx_generated_prompts_session_id ON generated_prompts(session_id);
CREATE INDEX IF NOT EXISTS idx_generated_prompts_generated_at ON generated_prompts(generated_at);

-- Optimize existing queries with partial indexes for better performance
CREATE INDEX IF NOT EXISTS idx_prompt_sessions_active_user 
ON prompt_sessions(user_id, created_at DESC) 
WHERE user_id IS NOT NULL;

-- Add statistics collection for better query planning
ANALYZE profiles;
ANALYZE prompt_sessions;
ANALYZE clarifying_answers;
ANALYZE generated_prompts;

-- Create performance monitoring view
CREATE OR REPLACE VIEW performance_stats AS
SELECT 
  schemaname,
  tablename,
  attname,
  n_distinct,
  correlation
FROM pg_stats 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'prompt_sessions', 'clarifying_answers', 'generated_prompts');

-- Create query to identify slow queries
CREATE OR REPLACE FUNCTION get_slow_queries()
RETURNS TABLE(
  query text,
  mean_exec_time numeric,
  calls bigint,
  total_exec_time numeric
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pg_stat_statements.query,
    pg_stat_statements.mean_exec_time,
    pg_stat_statements.calls,
    pg_stat_statements.total_exec_time
  FROM pg_stat_statements
  WHERE pg_stat_statements.mean_exec_time > 100 -- queries taking more than 100ms
  ORDER BY pg_stat_statements.mean_exec_time DESC
  LIMIT 10;
END;
$$ LANGUAGE plpgsql;

-- Optimize autovacuum settings for better performance
ALTER TABLE profiles SET (
  autovacuum_vacuum_scale_factor = 0.1,
  autovacuum_analyze_scale_factor = 0.05
);

ALTER TABLE prompt_sessions SET (
  autovacuum_vacuum_scale_factor = 0.1,
  autovacuum_analyze_scale_factor = 0.05
);

-- Create function to refresh performance statistics
CREATE OR REPLACE FUNCTION refresh_performance_stats()
RETURNS void AS $$
BEGIN
  ANALYZE profiles;
  ANALYZE prompt_sessions;
  ANALYZE clarifying_answers;
  ANALYZE generated_prompts;
END;
$$ LANGUAGE plpgsql;

SELECT 'Performance optimization completed successfully!' AS status; 