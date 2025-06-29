-- EMERGENCY: Temporarily disable RLS for testing
-- ⚠️ ONLY USE THIS FOR DEBUGGING - RE-ENABLE IMMEDIATELY AFTER TESTING ⚠️

-- Disable RLS on all tables temporarily
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE clarifying_answers DISABLE ROW LEVEL SECURITY;
ALTER TABLE generated_prompts DISABLE ROW LEVEL SECURITY;

SELECT 'RLS temporarily disabled. Test your queries now, then run the re-enable script!' AS warning;

-- ========================================
-- TO RE-ENABLE RLS AFTER TESTING:
-- ========================================

-- ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE prompt_sessions ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE clarifying_answers ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE generated_prompts ENABLE ROW LEVEL SECURITY;

-- SELECT 'RLS re-enabled!' AS status; 