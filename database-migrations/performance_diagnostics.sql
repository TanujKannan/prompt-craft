-- Performance Diagnostics - Run these queries to identify performance issues
-- Copy and run each section separately in your Supabase SQL Editor

-- === 1. CHECK DATABASE RESOURCE USAGE ===
SELECT 
  'Database Size' as metric,
  pg_size_pretty(pg_database_size(current_database())) as value
UNION ALL
SELECT 
  'Active Connections',
  count(*)::text
FROM pg_stat_activity
UNION ALL
SELECT 
  'Max Connections',
  setting
FROM pg_settings 
WHERE name = 'max_connections';

-- === 2. IDENTIFY SLOW QUERIES (if pg_stat_statements is available) ===
-- Note: This may not work on Supabase free tier
SELECT 
  query,
  calls,
  total_exec_time,
  mean_exec_time,
  rows
FROM pg_stat_statements 
WHERE mean_exec_time > 50 -- queries taking more than 50ms
ORDER BY mean_exec_time DESC 
LIMIT 10;

-- === 3. CHECK TABLE SIZES ===
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size,
  pg_total_relation_size(schemaname||'.'||tablename) as size_bytes
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- === 4. CHECK INDEX USAGE ===
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_tup_read,
  idx_tup_fetch,
  idx_scan
FROM pg_stat_user_indexes 
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;

-- === 5. CHECK FOR MISSING INDEXES (your app tables) ===
SELECT 
  t.relname as table_name,
  i.relname as index_name,
  array_to_string(array_agg(a.attname), ', ') as column_names
FROM pg_class t
LEFT JOIN pg_index ix ON t.oid = ix.indrelid
LEFT JOIN pg_class i ON i.oid = ix.indexrelid
LEFT JOIN pg_attribute a ON t.oid = a.attrelid AND a.attnum = ANY(ix.indkey)
WHERE t.relkind = 'r'
  AND t.relname IN ('profiles', 'prompt_sessions', 'clarifying_answers', 'generated_prompts')
GROUP BY t.relname, i.relname
ORDER BY t.relname, i.relname;

-- === 6. CHECK VACUUM STATISTICS ===
SELECT 
  schemaname,
  tablename,
  last_vacuum,
  last_autovacuum,
  vacuum_count,
  autovacuum_count
FROM pg_stat_user_tables 
WHERE schemaname = 'public'
ORDER BY last_autovacuum DESC NULLS LAST;

-- === 7. SIMPLE PERFORMANCE TEST ===
-- This should be very fast (< 10ms)
\timing on
SELECT COUNT(*) FROM profiles;
SELECT COUNT(*) FROM prompt_sessions;
\timing off 