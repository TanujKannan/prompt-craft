import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

// Use service role key for backend operations (bypasses RLS)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // This bypasses RLS
)

interface DirectDataRequest {
  appIdea: string
  answers: Array<{
    question: string
    selectedAnswer: string
    explanation: string
  }>
}

interface SessionIdRequest {
  sessionId: string
}

export async function POST(req: NextRequest) {
  try {
    // Basic rate limiting check (simple implementation)
    const userAgent = req.headers.get('user-agent')
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip')
    
    const body = await req.json()
    
    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key is not configured')
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 })
    }
    
    // Validate input length to prevent abuse
    if (body.appIdea && body.appIdea.length > 5000) {
      return NextResponse.json({ error: 'App idea too long (max 5000 characters)' }, { status: 400 })
    }
    
    let appIdea: string
    let answers: Array<{ question: string; selectedAnswer: string; explanation: string }>
    let sessionId: string | null = null
    let userId: string | null = null

    // Check if this is a sessionId request or direct data request
    if ('sessionId' in body) {
      sessionId = body.sessionId
      
      if (!sessionId) {
        return NextResponse.json({ error: 'Session ID is required' }, { status: 400 })
      }

      // Get the app idea from the session
      const { data: session, error: sessionError } = await supabase
        .from('prompt_sessions')
        .select('app_idea, user_id')
        .eq('id', sessionId)
        .single()

      if (sessionError || !session) {
        console.error('Session not found:', sessionError)
        return NextResponse.json({ error: 'Session not found' }, { status: 404 })
      }

      // Get the clarifying answers
      const { data: answersData, error: answersError } = await supabase
        .from('clarifying_answers')
        .select('question, selected_answer, explanation')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true })

      if (answersError) {
        console.error('Failed to fetch answers:', answersError)
        return NextResponse.json({ error: 'Failed to fetch answers' }, { status: 500 })
      }

      appIdea = session.app_idea
      userId = session.user_id
      answers = answersData.map(a => ({
        question: a.question,
        selectedAnswer: a.selected_answer,
        explanation: a.explanation
      }))
    } else if ('appIdea' in body && 'answers' in body) {
      // Direct data submission - create a session for authenticated users
      appIdea = body.appIdea
      answers = body.answers
      userId = body.userId || null // Get userId from request body
      
      console.log('Received request body:', { appIdea: appIdea.substring(0, 50) + '...', userId, answersCount: answers.length })
      console.log('User ID from request:', userId)
      
      // Create a new session for this prompt generation
      try {
        const { data: newSession, error: createError } = await supabase
          .from('prompt_sessions')
          .insert({
            app_idea: appIdea,
            user_id: userId // This will now properly use the authenticated user's ID
          })
          .select()
          .single()

        if (createError) {
          console.error('Failed to create session:', createError)
          // Continue without saving - user still gets their prompt
        } else {
          sessionId = newSession.id
          console.log('Created session with user_id:', userId, 'session_id:', sessionId)
          
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
            } else {
              console.log('Successfully saved answers for session:', sessionId)
            }
          }
        }
      } catch (error) {
        console.error('Error creating session:', error)
        // Continue without saving
      }
    } else {
      return NextResponse.json({ error: 'Either sessionId or appIdea+answers is required' }, { status: 400 })
    }

    // Validate that we have the required data
    if (!appIdea || !appIdea.trim()) {
      return NextResponse.json({ error: 'App idea is required' }, { status: 400 })
    }

    // Format the clarifying answers with more detail
    const clarifying = answers
      .map(a => {
        const isCustom = a.explanation === 'Custom input provided by user'
        return `Q: ${a.question}\nA: ${a.selectedAnswer}${isCustom ? ' (Custom input)' : ''}\nContext: ${a.explanation}`
      })
      .join('\n\n')

    // Create the user message for OpenAI
    const userMessage = `
App Idea:
"${appIdea}"

Technical Preferences & Requirements:
${clarifying}

Please generate a comprehensive, structured prompt that the user can paste into Cursor, Replit, or other AI coding tools to start building their application. 

The prompt should include:
1. Clear project overview and goals
2. Specific technical stack recommendations based on their preferences
3. Key features and functionality requirements
4. Architecture suggestions (frontend, backend, database)
5. Development approach and best practices
6. Step-by-step implementation guidance

Make the prompt detailed enough that an AI coding tool can understand exactly what to build, but concise and well-structured. Focus on the core functionality first, then mention additional features.
    `.trim()

    // Generate the prompt using OpenAI
    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are an expert software architect and developer who creates detailed, actionable prompts for building full-stack applications using AI code tools like Cursor, Replit, and Lovable.

Your prompts should be:
1. Clear and well-structured with proper sections
2. Include specific technical requirements and stack recommendations
3. Provide step-by-step implementation guidance
4. Mention key features and functionality
5. Include architecture and best practices
6. Be comprehensive but not overly verbose
7. Focus on the core functionality first
8. Use markdown formatting for better readability

Format your response as a single, well-structured prompt that can be copied and pasted directly into an AI coding tool. Use clear headings, bullet points, and code examples where appropriate.`
          },
          {
            role: 'user',
            content: userMessage
          }
        ],
        temperature: 0.7,
        max_tokens: 2000
      })

      const generatedPrompt = response.choices[0].message.content

      if (!generatedPrompt) {
        console.error('OpenAI returned empty response')
        return NextResponse.json({ error: 'Failed to generate prompt - empty response' }, { status: 500 })
      }

      // Save the generated prompt to Supabase if we have a sessionId
      if (sessionId) {
        try {
          await supabase.from('generated_prompts').insert({
            session_id: sessionId,
            prompt: generatedPrompt,
          })
          console.log('Successfully saved generated prompt to database')
        } catch (error) {
          console.error('Error saving generated prompt to database:', error)
          // Continue anyway - the user still gets their prompt
        }
      } else {
        console.log('No session ID available, prompt not saved to database')
      }

      return NextResponse.json({ prompt: generatedPrompt })
    } catch (openaiError) {
      console.error('OpenAI API error:', openaiError)
      return NextResponse.json({ 
        error: 'Failed to generate prompt with AI', 
        details: openaiError instanceof Error ? openaiError.message : 'Unknown OpenAI error'
      }, { status: 500 })
    }
  } catch (error) {
    console.error('Error generating prompt:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 