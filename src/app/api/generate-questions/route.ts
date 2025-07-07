import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
})

interface QuestionOption {
  value: string
  label: string
  explanation: string
  recommended: boolean
}

interface RawQuestion {
  id?: string
  question?: string
  type?: string
  options?: QuestionOption[]
  placeholder?: string
  allowCustom?: boolean
}

export async function POST(req: NextRequest) {
  try {
    const { appIdea } = await req.json()

    // Check if Groq API key is configured
    if (!process.env.GROQ_API_KEY) {
      console.error('Groq API key is not configured')
      return NextResponse.json({ error: 'Groq API key not configured' }, { status: 500 })
    }

    // Validate input
    if (!appIdea || !appIdea.trim()) {
      return NextResponse.json({ error: 'App idea is required' }, { status: 400 })
    }

    if (appIdea.length > 2000) {
      return NextResponse.json({ error: 'App idea too long (max 2000 characters)' }, { status: 400 })
    }

    const systemPrompt = `You are an expert software consultant who helps people build apps. Your job is to generate 4-6 highly relevant clarifying questions based on a user's app idea.

Rules for generating questions:
1. Questions should be specific to their app idea, not generic
2. Focus on technical decisions that will impact the development approach
3. Include questions about user experience, data requirements, and key features
4. Make questions beginner-friendly with clear multiple choice options
5. Each question should help determine the best tech stack and implementation approach
6. For each multiple-choice set, clearly flag **one option** as the simplest path to get an MVP running quickly by adding "recommended": true to that option object
7. Include **exactly one** question that measures the user's coding and computer science experience level (e.g., Beginner, Intermediate, Advanced). Each option must contain a short description so the user knows precisely where they fit. This experience answer will later be used to adjust the detail level of the generated development prompt. **Set \`allowCustom\`: true for this question so users can describe their experience in their own words if needed, and DO NOT add a separate "Custom" option in the list.** **Do not flag recommended as true for this question.**

For each question, provide:
- A clear, specific question
- 3-4 multiple choice options with brief explanations
- Allow for custom input if none of the options fit

Return a JSON array of questions in this exact format:
{
  "questions": [
    {
      "id": "unique_id",
      "question": "Question text here?",
      "type": "both",
      "options": [
        {
          "value": "option_key",
          "label": "Option Label", 
          "explanation": "Brief explanation of when to choose this option",
          "recommended": false
        }
      ],
      "placeholder": "Placeholder text for custom input...",
      "allowCustom": true
    }
  ]
}`

    const userPrompt = `App Idea: "${appIdea}"

Generate 4-6 smart clarifying questions that will help determine the best technical approach for building this specific app. Make the questions relevant to the app idea above.`

    const response = await openai.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: "json_object" }
    })

    const content = response.choices[0].message.content

    if (!content) {
      return NextResponse.json({ error: 'Failed to generate questions' }, { status: 500 })
    }

    // --- Simplified JSON parsing ---
    const jsonText = (
      content
        .replace(/```json|```/g, '')      // strip code fences
        .replace(/,\s*([\]}])/g, '$1')  // delete trailing commas
        .trim()
    )

    const match = jsonText.match(/\{[\s\S]*\}/)
    const parsed: any = JSON.parse(match ? match[0] : jsonText)
    
    // Validate the response structure
    if (!parsed.questions || !Array.isArray(parsed.questions)) {
      throw new Error('Invalid response format')
    }

    // Ensure each question has required fields
    const validatedQuestions = parsed.questions.map((q: RawQuestion, index: number) => ({
      id: q.id || `question_${index}`,
      question: q.question || 'What would you like to know?',
      type: q.type || 'both',
      options: Array.isArray(q.options) ? q.options : [],
      placeholder: q.placeholder || 'Enter your custom answer...',
      allowCustom: q.allowCustom !== false
    }))

    return NextResponse.json({ questions: validatedQuestions })
  } catch (error) {
    console.error('Error generating questions:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 