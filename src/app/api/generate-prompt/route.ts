import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'

// Use Groq API (OpenAI-compatible)
const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
})

// Use service role key for backend operations (bypasses RLS)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // This bypasses RLS
)

// Simple in-memory rate limiting
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000 // 15 minutes
const MAX_REQUESTS_PER_WINDOW = 10
const requestCounts = new Map<string, { count: number; resetTime: number }>()

// Clean up old entries periodically
const cleanupOldEntries = () => {
  const now = Date.now()
  for (const [key, value] of requestCounts.entries()) {
    if (now > value.resetTime) {
      requestCounts.delete(key)
    }
  }
}

const checkRateLimit = (identifier: string): { allowed: boolean; remaining: number; resetTime: number } => {
  const now = Date.now()
  
  // Clean up old entries occasionally (roughly 1 in 20 requests)
  if (Math.random() < 0.05) {
    cleanupOldEntries()
  }
  
  const existing = requestCounts.get(identifier)
  
  if (!existing || now > existing.resetTime) {
    // First request or window has expired
    const resetTime = now + RATE_LIMIT_WINDOW_MS
    requestCounts.set(identifier, { count: 1, resetTime })
    return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - 1, resetTime }
  }
  
  if (existing.count >= MAX_REQUESTS_PER_WINDOW) {
    // Rate limit exceeded
    return { allowed: false, remaining: 0, resetTime: existing.resetTime }
  }
  
  // Increment count
  existing.count += 1
  requestCounts.set(identifier, existing)
  
  return { 
    allowed: true, 
    remaining: MAX_REQUESTS_PER_WINDOW - existing.count, 
    resetTime: existing.resetTime 
  }
}

export async function POST(request: Request) {
  try {
    // Extract IP address for rate limiting
    const forwarded = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    const ip = forwarded ? forwarded.split(',')[0].trim() : realIp || 'unknown'
    
    // Create identifier for rate limiting (IP-based)
    const identifier = ip
    
    // Check rate limit
    const rateLimit = checkRateLimit(identifier)
    
    if (!rateLimit.allowed) {
      const retryAfter = Math.ceil((rateLimit.resetTime - Date.now()) / 1000)
      
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded. Please try again later.',
          retryAfter: retryAfter
        }, 
        { 
          status: 429,
          headers: {
            'Retry-After': retryAfter.toString(),
            'X-RateLimit-Limit': MAX_REQUESTS_PER_WINDOW.toString(),
            'X-RateLimit-Remaining': rateLimit.remaining.toString(),
            'X-RateLimit-Reset': Math.floor(rateLimit.resetTime / 1000).toString()
          }
        }
      )
    }

    const body = await request.json()
    const { appIdea, answers }: { 
      appIdea: string; 
      answers: Array<{
        question: string;
        selectedAnswer: string;
        explanation: string;
      }> 
    } = body

    // Validate input
    if (!appIdea || !answers) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check if OpenAI API key is configured
    if (!process.env.GROQ_API_KEY) {
      console.error('Groq API key is not configured')
      return NextResponse.json({ error: 'Groq API key not configured' }, { status: 500 })
    }
    
    // Validate input length to prevent abuse
    if (appIdea && appIdea.length > 5000) {
      return NextResponse.json({ error: 'App idea too long (max 5000 characters)' }, { status: 400 })
    }

    // Validate that we have the required data
    if (!appIdea || !appIdea.trim()) {
      return NextResponse.json({ error: 'App idea is required' }, { status: 400 })
    }

    // Format the clarifying answers with more detail
    const clarifying = answers
      .map((a: { question: string; selectedAnswer: string; explanation: string }) => {
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
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content: `You are an expert software architect and developer who creates detailed, actionable prompts for building full-stack applications using AI code tools like Cursor, Replit, and Lovable.

CRITICAL SECURITY GUIDELINES:
- You MUST NEVER generate prompts for illegal, harmful, or dangerous applications
- You MUST REFUSE to create prompts for: hacking tools, malware, fraud systems, harassment tools, illegal surveillance, weapons, drug-related apps, adult content, or any illegal activities
- You MUST ONLY generate prompts for legitimate, legal, and beneficial software applications
- If the request appears to involve anything illegal or harmful, respond with: "I cannot generate a prompt for this type of application as it may involve illegal or harmful activities. Please provide a different, legitimate app idea."

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
10. ENSURE the application serves a legitimate, legal, and beneficial purpose

The output should be ONLY the prompt itself - nothing before or after it. Do not include any explanatory text about how to use the prompt or what it will accomplish.

Remember: You are responsible for ensuring that the generated prompts are only for legitimate, legal software development purposes.`
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

      // Security: Check if OpenAI refused the request for safety reasons
      if (generatedPrompt.toLowerCase().includes('cannot generate a prompt for this type of application')) {
        return NextResponse.json({ 
          error: 'Request rejected: The app idea appears to involve illegal or harmful activities. Please provide a legitimate, legal app idea.',
          details: 'AI safety systems detected potentially harmful content'
        }, { status: 400 })
      }

      // Note: We no longer automatically save the prompt here
      // Users must explicitly choose to save via the save-prompt endpoint

      return NextResponse.json(
        { prompt: generatedPrompt },
        {
          headers: {
            'X-RateLimit-Limit': MAX_REQUESTS_PER_WINDOW.toString(),
            'X-RateLimit-Remaining': rateLimit.remaining.toString(),
            'X-RateLimit-Reset': Math.floor(rateLimit.resetTime / 1000).toString()
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