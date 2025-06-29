# Supabase Setup Guide for PromptCraft

## 1. Environment Variables Setup

### Create `.env.local` file in your project root:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### Where to find these values:

1. Go to [supabase.com](https://supabase.com)
2. Sign in and select your project
3. Go to **Settings** → **API**
4. Copy:
   - **URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role secret** key → `SUPABASE_SERVICE_ROLE_KEY`

## 2. Database Setup

### Step 1: Run the Schema Creation
Go to your Supabase dashboard → **SQL Editor** and run:

```sql
-- Copy and paste the contents of supabase-schema.sql
```

### Step 2: Run the Setup Script
After the schema, run:

```sql
-- Copy and paste the contents of supabase-setup.sql
```

## 3. Verify Row Level Security (RLS)

### Check if RLS is enabled on all tables:
```sql
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'prompt_sessions', 'clarifying_answers', 'generated_prompts');
```

Should return `rowsecurity = true` for all tables.

### Check RLS Policies:
```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public';
```

## 4. Test Database Connection

### Test 1: Basic Connection
```sql
SELECT 'Database connection successful!' as status;
```

### Test 2: Authentication Test
```sql
SELECT auth.uid() as current_user_id;
```

### Test 3: Profile Access Test
```sql
SELECT count(*) as profile_count FROM profiles;
```

## 5. Common Issues and Solutions

### Issue 1: RLS Policies Too Restrictive
If queries hang, temporarily disable RLS to test:
```sql
-- ONLY FOR TESTING - RE-ENABLE AFTER
ALTER TABLE prompt_sessions DISABLE ROW LEVEL SECURITY;
-- Test your query
-- Then re-enable:
ALTER TABLE prompt_sessions ENABLE ROW LEVEL SECURITY;
```

### Issue 2: Missing Foreign Key Relationships
Check if foreign keys exist:
```sql
SELECT 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' 
AND tc.table_schema='public';
```

### Issue 3: Profile Creation Failed
Manually create a profile for testing:
```sql
INSERT INTO profiles (id, email, full_name)
VALUES (auth.uid(), 'test@example.com', 'Test User');
```

## 6. Production Deployment Checklist

### Environment Variables (Production)
- [ ] `NEXT_PUBLIC_SUPABASE_URL` is set
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set  
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is set
- [ ] All values are from your production Supabase project

### Database Configuration
- [ ] All tables created with correct schema
- [ ] RLS enabled on all tables
- [ ] RLS policies created and working
- [ ] handle_new_user function created with correct search_path
- [ ] Triggers created for auto-profile creation

### Testing
- [ ] User can sign up
- [ ] User can sign in
- [ ] Profile is created automatically
- [ ] User can create prompt sessions
- [ ] User can view saved prompts
- [ ] User can sign out

## 7. Debug Commands

### Check if Supabase is configured in your app:
Add this to any page temporarily:
```typescript
console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
console.log('Supabase Key exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
```

### Test Supabase connection:
```typescript
const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('profiles').select('count').limit(1)
    console.log('Connection test:', { data, error })
  } catch (err) {
    console.error('Connection failed:', err)
  }
}
``` 