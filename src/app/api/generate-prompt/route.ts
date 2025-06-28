import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

// Use service role key for backend operations (bypasses RLS)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // This bypasses RLS
)

// Rate limiting configuration
const RATE_LIMIT_WINDOW_MINUTES = 15
const MAX_REQUESTS_PER_WINDOW = 10

// Database-based rate limiting function
const checkRateLimit = async (identifier: string): Promise<{ allowed: boolean; resetTime: number; remaining: number }> => {
  const now = new Date()
  const windowStart = new Date(now.getTime() - (RATE_LIMIT_WINDOW_MINUTES * 60 * 1000))
  
  try {
    // Clean up old entries and count recent requests in a single query
    const { data: recentRequests, error } = await supabase
      .from('rate_limits')
      .select('id')
      .eq('identifier', identifier)
      .gte('created_at', windowStart.toISOString())
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Rate limit check error:', error)
      // Fail open - allow request if we can't check rate limit
      return { allowed: true, resetTime: now.getTime() + (RATE_LIMIT_WINDOW_MINUTES * 60 * 1000), remaining: MAX_REQUESTS_PER_WINDOW - 1 }
    }

    const requestCount = recentRequests?.length || 0
    
    if (requestCount >= MAX_REQUESTS_PER_WINDOW) {
      // Find the oldest request to determine reset time
      const oldestRequest = recentRequests[recentRequests.length - 1]
      const resetTime = new Date(oldestRequest.created_at).getTime() + (RATE_LIMIT_WINDOW_MINUTES * 60 * 1000)
      
      return {
        allowed: false,
        resetTime,
        remaining: 0
      }
    }

    // Record this request
    const { error: insertError } = await supabase
      .from('rate_limits')
      .insert({
        identifier,
        created_at: now.toISOString()
      })

    if (insertError) {
      console.error('Failed to record rate limit:', insertError)
      // Fail open
      return { allowed: true, resetTime: now.getTime() + (RATE_LIMIT_WINDOW_MINUTES * 60 * 1000), remaining: MAX_REQUESTS_PER_WINDOW - 1 }
    }

    // Clean up old entries (best effort, don't fail if this doesn't work)
    supabase
      .from('rate_limits')
      .delete()
      .lt('created_at', windowStart.toISOString())
      .then(() => console.log('Cleaned up old rate limit entries'))
      .catch(err => console.warn('Failed to clean up rate limits:', err))

    return {
      allowed: true,
      resetTime: now.getTime() + (RATE_LIMIT_WINDOW_MINUTES * 60 * 1000),
      remaining: MAX_REQUESTS_PER_WINDOW - requestCount - 1
    }
  } catch (error) {
    console.error('Rate limiting error:', error)
    // Fail open - allow request if rate limiting fails
    return { allowed: true, resetTime: now.getTime() + (RATE_LIMIT_WINDOW_MINUTES * 60 * 1000), remaining: MAX_REQUESTS_PER_WINDOW - 1 }
  }
}

export async function POST(request: Request) {
  try {
    // Extract IP address for rate limiting
    const forwarded = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    const ip = forwarded ? forwarded.split(',')[0].trim() : realIp || 'unknown'
    
    // Create a unique identifier for rate limiting
    const userAgent = request.headers.get('user-agent') || ''
    const identifier = `${ip}:${userAgent.slice(0, 50)}`
    
    // Check rate limit
    const rateLimit = await checkRateLimit(identifier)
    
    if (!rateLimit.allowed) {
      const resetDate = new Date(rateLimit.resetTime)
      const retryAfter = Math.ceil((rateLimit.resetTime - Date.now()) / 1000)
      
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded. Please try again later.',
          retryAfter: retryAfter,
          resetTime: resetDate.toISOString()
        }, 
        { 
          status: 429,
          headers: {
            'Retry-After': retryAfter.toString(),
            'X-RateLimit-Limit': MAX_REQUESTS_PER_WINDOW.toString(),
            'X-RateLimit-Remaining': rateLimit.remaining.toString(),
            'X-RateLimit-Reset': rateLimit.resetTime.toString()
          }
        }
      )
    }

    const body = await request.json()
    const { appIdea, answers, sessionId } = body

    // Validate input
    if (!appIdea || !answers) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key is not configured')
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 })
    }
    
    // Validate input length to prevent abuse
    if (appIdea && appIdea.length > 5000) {
      return NextResponse.json({ error: 'App idea too long (max 5000 characters)' }, { status: 400 })
    }
    
    let userId: string | null = null

    // Check if this is a sessionId request or direct data request
    if (sessionId) {
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
    } else {
      // Direct data submission - create a session for authenticated users
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

Your response must:
1. Start with exactly "Build this: " followed by the project description
2. Be a single, clean prompt that can be copied and pasted directly into an AI coding tool
3. Include specific technical requirements and stack recommendations
4. Provide clear implementation guidance
5. Mention key features and functionality
6. Include architecture suggestions
7. Use markdown formatting for better readability
8. Focus on core functionality first
9. NOT include any meta-commentary, instructions to the user, or closing statements like "By following this prompt..." or "Focus on delivering core functionality first..."

The output should be ONLY the prompt itself - nothing before or after it. Do not include any explanatory text about how to use the prompt or what it will accomplish.`
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

      return NextResponse.json(
        { prompt: generatedPrompt },
        {
          headers: {
            'X-RateLimit-Limit': MAX_REQUESTS_PER_WINDOW.toString(),
            'X-RateLimit-Remaining': rateLimit.remaining.toString(),
            'X-RateLimit-Reset': rateLimit.resetTime.toString()
          }
        }
      )
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