import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// This route runs only on the server, so it is safe to use the service-role key.
// It consolidates the heavy join used by the Saved Prompts page and returns a
// lightweight shape that the client can render quickly.

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    const { userId } = await request.json()

    if (!userId || typeof userId !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid userId' }, { status: 400 })
    }

    // Perform the join on the server where we can bypass RLS and leverage indexes
    const { data, error } = await supabase
      .from('prompt_sessions')
      .select(
        `id, app_idea, created_at, generated_prompts(prompt)`
      )
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[get-saved-prompts] DB error:', error)
      return NextResponse.json({ error: 'Failed to fetch saved prompts' }, { status: 500 })
    }

    // Flatten the nested rows so the client doesn't have to do heavy processing
    const prompts = (data || [])
      .filter((session) => session.generated_prompts && session.generated_prompts.length > 0)
      .map((session) => ({
        id: session.id,
        app_idea: session.app_idea,
        prompt: session.generated_prompts[0].prompt,
        created_at: session.created_at,
      }))

    return NextResponse.json({ prompts })
  } catch (err) {
    console.error('[get-saved-prompts] Unexpected error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 