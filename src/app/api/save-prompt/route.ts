import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Use service role key for backend operations (bypasses RLS)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // This bypasses RLS
)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { appIdea, userId, answers, prompt } = body

    // Validate input
    if (!appIdea || !userId || !answers || !prompt) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Validate that the user is authenticated
    if (!userId || typeof userId !== 'string') {
      return NextResponse.json({ error: 'User authentication required' }, { status: 401 })
    }

    // Validate input length to prevent abuse
    if (appIdea.length > 5000) {
      return NextResponse.json({ error: 'App idea too long (max 5000 characters)' }, { status: 400 })
    }

    if (prompt.length > 10000) {
      return NextResponse.json({ error: 'Prompt too long (max 10000 characters)' }, { status: 400 })
    }

    // Create a new session for this saved prompt
    const { data: newSession, error: createError } = await supabase
      .from('prompt_sessions')
      .insert({
        app_idea: appIdea,
        user_id: userId
      })
      .select()
      .single()

    if (createError) {
      console.error('Failed to create session:', createError)
      return NextResponse.json({ error: 'Failed to save prompt session' }, { status: 500 })
    }

    const sessionId = newSession.id

    // Save the clarifying answers
    if (answers.length > 0) {
      const answerInserts = answers.map(answer => ({
        session_id: sessionId,
        question: answer.question,
        selected_answer: answer.selectedAnswer,
        explanation: answer.explanation
      }))

      const { error: answersError } = await supabase
        .from('clarifying_answers')
        .insert(answerInserts)

      if (answersError) {
        console.error('Failed to save answers:', answersError)
        return NextResponse.json({ error: 'Failed to save answers' }, { status: 500 })
      }
    }

    // Save the generated prompt
    const { error: promptError } = await supabase
      .from('generated_prompts')
      .insert({
        session_id: sessionId,
        prompt: prompt
      })

    if (promptError) {
      console.error('Failed to save generated prompt:', promptError)
      return NextResponse.json({ error: 'Failed to save prompt' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      sessionId: sessionId,
      message: 'Prompt saved successfully' 
    })

  } catch (error) {
    console.error('Error saving prompt:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 