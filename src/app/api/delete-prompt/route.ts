import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Use service role key for backend operations (bypasses RLS)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const promptId = searchParams.get('id')
    const userId = searchParams.get('userId')

    // Validate input
    if (!promptId || typeof promptId !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid prompt ID' }, { status: 400 })
    }

    if (!userId || typeof userId !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid user ID' }, { status: 400 })
    }

    // First, verify that the session belongs to the user
    const { data: session, error: sessionError } = await supabase
      .from('prompt_sessions')
      .select('id, user_id')
      .eq('id', promptId)
      .eq('user_id', userId)
      .single()

    if (sessionError || !session) {
      console.error('Session not found or access denied:', sessionError)
      return NextResponse.json({ error: 'Prompt not found or access denied' }, { status: 404 })
    }

    // Delete the session (this will cascade delete related records)
    const { error: deleteError } = await supabase
      .from('prompt_sessions')
      .delete()
      .eq('id', promptId)
      .eq('user_id', userId)

    if (deleteError) {
      console.error('Failed to delete prompt session:', deleteError)
      return NextResponse.json({ error: 'Failed to delete prompt' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Prompt deleted successfully' 
    })

  } catch (error) {
    console.error('Error deleting prompt:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 