'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { useAuth } from '@/lib/auth'
import { promptTemplates, templateCategories, getTemplatesByCategory, getTemplateById, type PromptTemplate } from '@/lib/templates'
import { Lightbulb, HelpCircle, Rocket, Database, Palette, UserCheck, Plus, X, Check, BookOpen, ArrowRight, Sparkles } from 'lucide-react'

interface ClarifyingQuestion {
  id: string
  question: string
  type: 'select' | 'input' | 'both'
  options?: {
    value: string
    label: string
    explanation: string
  }[]
  placeholder?: string
  allowCustom?: boolean
}

const clarifyingQuestions: ClarifyingQuestion[] = [
  {
    id: 'framework',
    question: 'What type of website framework would work best?',
    type: 'both',
    options: [
      {
        value: 'react',
        label: 'React',
        explanation: 'Popular choice for interactive websites. Great for beginners and widely used by companies.'
      },
      {
        value: 'nextjs',
        label: 'Next.js',
        explanation: 'Complete solution for modern websites - includes everything you need in one package. Recommended for most apps.'
      },
      {
        value: 'vue',
        label: 'Vue.js',
        explanation: 'Beginner-friendly framework with excellent documentation and gentle learning curve.'
      },
      {
        value: 'angular',
        label: 'Angular',
        explanation: 'Enterprise-grade framework used by large companies. Great for complex business applications.'
      }
    ],
    placeholder: 'e.g., I heard Svelte is good, or I want to use whatever is easiest to learn...',
    allowCustom: true
  },
  {
    id: 'auth',
    question: 'Do people need to create accounts and log in?',
    type: 'both',
    options: [
      {
        value: 'yes',
        label: 'Yes, users need accounts',
        explanation: 'Users can sign up, log in, and have personalized experiences. Great for saving user data.'
      },
      {
        value: 'no',
        label: 'No accounts needed',
        explanation: 'Anyone can use the app without signing up. Simpler to build and use.'
      }
    ],
    placeholder: 'e.g., I want Google sign-in, or users should be able to sign up with email...',
    allowCustom: true
  },
  {
    id: 'backend',
    question: 'Does your app need to store and manage data?',
    type: 'both',
    options: [
      {
        value: 'yes',
        label: 'Yes, I need to store data',
        explanation: 'Your app will save user information, posts, products, etc. and retrieve them later.'
      },
      {
        value: 'no',
        label: 'No, just a simple website',
        explanation: 'Your app works entirely in the browser, maybe using other services for data.'
      }
    ],
    placeholder: 'e.g., I need to store user posts, or I want to save product information...',
    allowCustom: true
  },
  {
    id: 'database',
    question: 'Where should your app store its data?',
    type: 'both',
    options: [
      {
        value: 'supabase',
        label: 'Supabase',
        explanation: 'Easy-to-use database service with built-in user authentication. Great for beginners.'
      },
      {
        value: 'firebase',
        label: 'Firebase',
        explanation: 'Google\'s app platform with real-time features. Perfect for chat apps and live updates.'
      },
      {
        value: 'local',
        label: 'Browser Storage',
        explanation: 'Data stays on the user\'s device. Simple but data isn\'t shared between devices.'
      }
    ],
    placeholder: 'e.g., I want something free and easy to set up, or I need real-time features...',
    allowCustom: true
  },
  {
    id: 'ui',
    question: 'What style should your app have?',
    type: 'both',
    options: [
      {
        value: 'tailwind',
        label: 'Modern & Minimal',
        explanation: 'Clean, modern design that\'s highly customizable. Professional look that works everywhere.'
      },
      {
        value: 'shadcn',
        label: 'Beautiful Components',
        explanation: 'Pre-built beautiful components that look professional out of the box. Great for quick development.'
      },
      {
        value: 'mui',
        label: 'Google Material Design',
        explanation: 'Follows Google\'s design system. Familiar to users and works great on mobile.'
      }
    ],
    placeholder: 'e.g., I want it to look like Instagram, or I prefer a corporate/professional look...',
    allowCustom: true
  },
  {
    id: 'features',
    question: 'What special features does your app need?',
    type: 'input',
    placeholder: 'e.g., Users can chat with each other, upload photos, make payments, send notifications, admin dashboard...',
    allowCustom: true
  }
]

const stepIcons = [
  <BookOpen key="template" className="h-5 w-5 text-gray-400" />, // Step 0
  <Lightbulb key="idea" className="h-5 w-5 text-gray-400" />, // Step 1
  <HelpCircle key="questions" className="h-5 w-5 text-gray-400" />, // Step 2
  <Rocket key="prompt" className="h-5 w-5 text-gray-400" />, // Step 3
]

export default function PromptBuilder() {
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedTemplate, setSelectedTemplate] = useState<PromptTemplate | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [appIdea, setAppIdea] = useState('')
  const [answers, setAnswers] = useState<Record<string, { selected?: string; custom?: string }>>({})
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [generatedPrompt, setGeneratedPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showCustomInput, setShowCustomInput] = useState<Record<string, boolean>>({})

  // Check for template in localStorage on mount
  useEffect(() => {
    const storedTemplate = localStorage.getItem('selectedTemplate')
    if (storedTemplate) {
      try {
        const template: PromptTemplate = JSON.parse(storedTemplate)
        loadTemplate(template)
        localStorage.removeItem('selectedTemplate') // Clean up
      } catch (error) {
        console.error('Error loading stored template:', error)
      }
    }
  }, [])

  // Load template when selected
  const loadTemplate = (template: PromptTemplate) => {
    setSelectedTemplate(template)
    setAppIdea(template.appIdea)
    setAnswers(template.prefilledAnswers)
    setCurrentStep(1)
  }

  // Start from scratch
  const startFromScratch = () => {
    setSelectedTemplate(null)
    setAppIdea('')
    setAnswers({})
    setCurrentStep(1)
  }

  // Get filtered templates
  const getFilteredTemplates = () => {
    if (selectedCategory === 'all') return promptTemplates
    return getTemplatesByCategory(selectedCategory)
  }

  // Save app idea to Supabase with debounce
  useEffect(() => {
    if (!appIdea.trim()) return

    const timeoutId = setTimeout(async () => {
      try {
        // Check if Supabase is properly configured
        if (!isSupabaseConfigured()) {
          console.log('Supabase not configured, skipping database save')
          return
        }

        if (!sessionId) {
          const { data, error } = await supabase
            .from('prompt_sessions')
            .insert({ 
              app_idea: appIdea,
              user_id: user?.id || null
            })
            .select()
            .single()

          if (error) {
            console.error('Error creating session:', error)
            // For now, continue without saving to database if there's an error
            // This allows anonymous users to still use the builder
            return
          }
          setSessionId(data.id)
        } else {
          const { error } = await supabase
            .from('prompt_sessions')
            .update({ app_idea: appIdea })
            .eq('id', sessionId)

          if (error) {
            console.error('Error updating session:', error)
          }
        }
      } catch (error) {
        console.error('Unexpected error saving app idea:', error)
        // Continue without database storage for now
      }
    }, 1000)

    return () => clearTimeout(timeoutId)
  }, [appIdea, sessionId, user?.id])

  // Save answers to Supabase
  const saveAnswer = async (questionId: string, answer: { selected?: string; custom?: string }) => {
    if (!sessionId) {
      console.log('No session ID available, skipping answer save for:', questionId)
      return
    }

    try {
      const question = clarifyingQuestions.find(q => q.id === questionId)
      if (!question) return

      const answerText = answer.custom || answer.selected || ''
      const explanation = answer.selected 
        ? question.options?.find(opt => opt.value === answer.selected)?.explanation
        : 'Custom input provided by user'

      const { error } = await supabase
        .from('clarifying_answers')
        .upsert({
          session_id: sessionId,
          question: question.question,
          selected_answer: answerText,
          explanation: explanation
        })

      if (error) {
        console.error('Error saving answer:', error)
      }
    } catch (error) {
      console.error('Unexpected error saving answer:', error)
    }
  }

  const handleAnswerSelect = (questionId: string, selectedValue: string) => {
    setAnswers(prev => ({ 
      ...prev, 
      [questionId]: { ...prev[questionId], selected: selectedValue, custom: undefined }
    }))
    setShowCustomInput(prev => ({ ...prev, [questionId]: false }))
    saveAnswer(questionId, { selected: selectedValue })
  }

  const handleCustomInput = (questionId: string, customValue: string) => {
    setAnswers(prev => ({ 
      ...prev, 
      [questionId]: { ...prev[questionId], custom: customValue, selected: undefined }
    }))
    saveAnswer(questionId, { custom: customValue })
  }

  const toggleCustomInput = (questionId: string) => {
    setShowCustomInput(prev => ({ ...prev, [questionId]: !prev[questionId] }))
    if (showCustomInput[questionId]) {
      // Clear custom input when hiding it
      setAnswers(prev => ({ 
        ...prev, 
        [questionId]: { ...prev[questionId], custom: undefined }
      }))
    }
  }

  const generatePrompt = async () => {
    setIsGenerating(true)
    try {
      // Validate that we have the required data
      if (!appIdea || !appIdea.trim()) {
        throw new Error('Please enter your app idea first')
      }

      if (Object.keys(answers).length === 0) {
        throw new Error('Please answer the clarifying questions first')
      }

      console.log('Current user when generating prompt:', user)
      console.log('User ID being sent:', user?.id)

      // Always send data directly to avoid session issues
      // This ensures the app works even if database saving failed
      const requestBody = { 
        appIdea, 
        userId: user?.id || null, // Include user ID for proper saving
        answers: Object.entries(answers).map(([questionId, answer]) => {
          const question = clarifyingQuestions.find(q => q.id === questionId)
          return {
            question: question?.question || questionId,
            selectedAnswer: answer.custom || answer.selected || '',
            explanation: answer.selected 
              ? question?.options?.find(opt => opt.value === answer.selected)?.explanation
              : 'Custom input provided by user'
          }
        })
      }

      console.log('Sending request to generate prompt:', requestBody)

      const response = await fetch('/api/generate-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      })

      const data = await response.json()

      if (!response.ok) {
        console.error('API Error:', data)
        throw new Error(data.error || 'Failed to generate prompt')
      }

      if (!data.prompt) {
        throw new Error('No prompt received from API')
      }

      setGeneratedPrompt(data.prompt)
      setCurrentStep(3)
    } catch (error) {
      console.error('Error generating prompt:', error)
      
      // Show user-friendly error message
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      alert(`Failed to generate prompt: ${errorMessage}. Please try again or check the console for more details.`)
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedPrompt)
      // You could add a toast notification here
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const canProceedToStep2 = appIdea.trim().length > 10
  const canProceedToStep3 = Object.keys(answers).length === clarifyingQuestions.length && 
    clarifyingQuestions.every(q => answers[q.id]?.selected || answers[q.id]?.custom)

  const getQuestionIcon = (questionId: string) => {
    if (questionId === 'framework') return <Rocket className="h-5 w-5 text-gray-400" />
    if (questionId === 'auth') return <UserCheck className="h-5 w-5 text-gray-400" />
    if (questionId === 'backend' || questionId === 'database') return <Database className="h-5 w-5 text-gray-400" />
    if (questionId === 'ui') return <Palette className="h-5 w-5 text-gray-400" />
    if (questionId === 'features') return <Plus className="h-5 w-5 text-gray-400" />
    return <HelpCircle className="h-5 w-5 text-gray-400" />
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-white">
      <main className="w-full max-w-3xl mx-auto flex flex-col items-center px-6 py-12 space-y-12">
        {/* Progress Steps */}
        <div className="flex items-center justify-center space-x-4 w-full mb-2">
          {[0, 1, 2, 3].map((step, idx) => (
            <div key={step} className="flex items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                  currentStep >= step
                    ? 'border-black bg-black text-white'
                    : 'border-gray-200 bg-white text-gray-400'
                } font-semibold text-base transition-all`}
              >
                {stepIcons[idx]}
              </div>
              {step < 3 && (
                <div className="mx-2 h-0.5 w-8 bg-gray-200" />
              )}
            </div>
          ))}
        </div>

        {/* Step 0: Template Selection */}
        {currentStep === 0 && (
          <div className="w-full space-y-8">
            <Card className="w-full rounded-xl border border-gray-200 bg-white shadow-none">
              <CardHeader className="flex flex-col items-center text-center space-y-2 pb-4">
                <BookOpen className="h-6 w-6 text-gray-400" />
                <CardTitle className="text-2xl font-bold text-gray-900">How would you like to start?</CardTitle>
                <CardDescription className="text-base text-gray-500">
                  Choose a template for common app types, or start fresh with your own unique idea.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Start from Scratch Option */}
                <Card className="rounded-xl border border-gray-200 bg-gray-50 shadow-none hover:shadow-sm transition-all cursor-pointer" onClick={startFromScratch}>
                  <CardContent className="flex items-center justify-between p-6">
                    <div className="flex items-center space-x-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-white">
                        <Sparkles className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Start with My Own Idea</h3>
                        <p className="text-sm text-gray-500">I have a unique app concept I want to build</p>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400" />
                  </CardContent>
                </Card>

                {/* Category Filter */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Or pick from popular app types</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={selectedCategory === 'all' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategory('all')}
                      className="rounded-md"
                    >
                      All Templates
                    </Button>
                    {templateCategories.map((category) => (
                      <Button
                        key={category.id}
                        variant={selectedCategory === category.id ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedCategory(category.id)}
                        className="rounded-md"
                      >
                        {category.icon} {category.name}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Template Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {getFilteredTemplates().map((template) => (
                    <Card
                      key={template.id}
                      className="rounded-xl border border-gray-200 bg-white shadow-none hover:shadow-sm transition-all cursor-pointer"
                      onClick={() => loadTemplate(template)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-3">
                          <div className="text-2xl">{template.icon}</div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-base font-semibold text-gray-900 mb-1">{template.name}</h4>
                            <p className="text-sm text-gray-500 mb-3">{template.description}</p>
                            <div className="flex flex-wrap gap-1">
                              {template.features.slice(0, 3).map((feature, idx) => (
                                <span
                                  key={idx}
                                  className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700"
                                >
                                  {feature}
                                </span>
                              ))}
                              {template.features.length > 3 && (
                                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                                  +{template.features.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 1: App Idea Input */}
        {currentStep === 1 && (
          <Card className="w-full rounded-xl border border-gray-200 bg-white shadow-none">
            <CardHeader className="flex flex-col items-center text-center space-y-2 pb-2">
              <Lightbulb className="h-6 w-6 text-gray-400" />
              <CardTitle className="text-2xl font-bold text-gray-900">
                {selectedTemplate ? `Customize: ${selectedTemplate.name}` : 'Tell us about your app idea'}
              </CardTitle>
              <CardDescription className="text-base text-gray-500">
                {selectedTemplate 
                  ? 'Feel free to modify this template to match exactly what you have in mind.'
                  : 'Describe your app in everyday language. What problem does it solve? Who would use it? The more details, the better the result!'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {selectedTemplate && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg">{selectedTemplate.icon}</span>
                    <span className="text-sm font-medium text-blue-800">Using template: {selectedTemplate.name}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentStep(0)}
                    className="text-blue-700 border-blue-300 hover:bg-blue-100"
                  >
                    Choose Different Template
                  </Button>
                </div>
              )}
              <Textarea
                placeholder={selectedTemplate 
                  ? "Feel free to edit the description above to match your specific needs..."
                  : "e.g., I want to build an app where small business owners can track their inventory, see which products are selling well, and get alerts when items are running low. It should be simple to use and work on phones..."
                }
                value={appIdea}
                onChange={(e) => setAppIdea(e.target.value)}
                className="min-h-[120px] text-base bg-white border border-gray-200 rounded-md focus:border-black focus:ring-0 transition"
              />
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(0)}
                  className="rounded-md px-6 py-2"
                >
                  Back
                </Button>
                <Button
                  onClick={() => setCurrentStep(2)}
                  disabled={!canProceedToStep2}
                  size="lg"
                  className="bg-black text-white rounded-md px-6 py-2 font-medium shadow hover:shadow-md hover:bg-gray-900 transition"
                >
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Clarifying Questions */}
        {currentStep === 2 && (
          <div className="w-full flex flex-col items-center space-y-8">
            <div className="flex flex-col items-center text-center space-y-2">
              <HelpCircle className="h-6 w-6 text-gray-400" />
              <h2 className="text-2xl font-bold text-gray-900">Let's configure your app</h2>
              <p className="text-base text-gray-500">
                Don't worry if these seem technical - we'll explain everything and suggest the best options for your needs.
              </p>
            </div>
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
              {clarifyingQuestions.map((question) => {
                const currentAnswer = answers[question.id]
                const isCustomInputVisible = showCustomInput[question.id]
                return (
                  <Card key={question.id} className="rounded-xl border border-gray-200 bg-white shadow-none">
                    <CardHeader className="flex flex-col items-start space-y-2 pb-2">
                      <div className="flex items-center gap-2">
                        {getQuestionIcon(question.id)}
                        <CardTitle className="text-base font-semibold text-gray-900">{question.question}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Predefined Options */}
                      {question.options && (
                        <div className="space-y-3">
                          {question.options.map((option) => {
                            const isSelected = currentAnswer?.selected === option.value
                            return (
                              <div
                                key={option.value}
                                className={`rounded-md border border-gray-200 bg-white px-3 py-2 flex items-center justify-between gap-3 transition-all ${
                                  isSelected ? 'ring-2 ring-black border-black' : 'hover:border-gray-300'
                                }`}
                              >
                                <div className="flex-1">
                                  <div className="font-medium text-base text-gray-900">{option.label}</div>
                                  <div className="text-sm text-gray-500 mt-1">
                                    {option.explanation}
                                  </div>
                                </div>
                                <Button
                                  onClick={() => handleAnswerSelect(question.id, option.value)}
                                  size="sm"
                                  variant={isSelected ? "default" : "outline"}
                                  className={`rounded-md min-w-[80px] ${
                                    isSelected 
                                      ? 'bg-black text-white hover:bg-gray-900' 
                                      : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                                  }`}
                                >
                                  {isSelected ? (
                                    <>
                                      <Check className="h-3 w-3 mr-1" />
                                      Selected
                                    </>
                                  ) : (
                                    'Select'
                                  )}
                                </Button>
                              </div>
                            )
                          })}
                        </div>
                      )}

                      {/* Custom Input Toggle */}
                      {question.allowCustom && (
                        <div className="space-y-3">
                          <Button
                            onClick={() => toggleCustomInput(question.id)}
                            variant="outline"
                            size="sm"
                            className="w-full text-gray-600 border-gray-200 hover:bg-gray-50"
                          >
                            {isCustomInputVisible ? (
                              <>
                                <X className="h-4 w-4 mr-2" />
                                Hide Custom Input
                              </>
                            ) : (
                              <>
                                <Plus className="h-4 w-4 mr-2" />
                                Add Custom Answer
                              </>
                            )}
                          </Button>

                          {isCustomInputVisible && (
                            <Textarea
                              placeholder={question.placeholder || "Enter your custom answer..."}
                              value={currentAnswer?.custom || ''}
                              onChange={(e) => handleCustomInput(question.id, e.target.value)}
                              className="min-h-[80px] text-sm bg-white border border-gray-200 rounded-md focus:border-black focus:ring-0 transition"
                            />
                          )}
                        </div>
                      )}

                      {/* Input-only Questions */}
                      {question.type === 'input' && (
                        <Textarea
                          placeholder={question.placeholder || "Enter your answer..."}
                          value={currentAnswer?.custom || ''}
                          onChange={(e) => handleCustomInput(question.id, e.target.value)}
                          className="min-h-[80px] text-sm bg-white border border-gray-200 rounded-md focus:border-black focus:ring-0 transition"
                        />
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
            <div className="flex justify-between w-full">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(1)}
                className="rounded-md px-6 py-2"
              >
                Back
              </Button>
              <Button
                onClick={generatePrompt}
                disabled={!canProceedToStep3 || isGenerating}
                size="lg"
                className="bg-black text-white rounded-md px-6 py-2 font-medium shadow hover:shadow-md hover:bg-gray-900 transition"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating...
                  </>
                ) : (
                  'Generate Prompt'
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Generated Prompt */}
        {currentStep === 3 && (
          <Card className="w-full rounded-xl border border-gray-200 bg-white shadow-none">
            <CardHeader className="flex flex-col items-center text-center space-y-2 pb-2">
              <Rocket className="h-6 w-6 text-gray-400" />
              <CardTitle className="text-2xl font-bold text-gray-900">Your App Instructions Are Ready!</CardTitle>
              <CardDescription className="text-base text-gray-500">
                Copy these instructions and paste them into any AI coding tool. The AI will understand exactly what to build for you.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Instructions for beginners */}
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h3 className="font-semibold text-green-800 mb-2">What to do next:</h3>
                <ol className="text-sm text-green-700 space-y-1 list-decimal list-inside">
                  <li>Copy the instructions below</li>
                  <li>Go to Claude.ai, ChatGPT, or Cursor</li>
                  <li>Paste the instructions and hit enter</li>
                  <li>Watch the AI build your app!</li>
                </ol>
              </div>
              
              {isLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ) : (
                <div className="relative">
                  <Textarea
                    value={generatedPrompt}
                    readOnly
                    className="min-h-[300px] text-sm bg-gray-50 border border-gray-200 rounded-md focus:border-black focus:ring-0 transition"
                  />
                  <Button
                    onClick={copyToClipboard}
                    className="absolute top-2 right-2 bg-black text-white rounded-md px-3 py-1 text-xs font-medium shadow hover:shadow-md hover:bg-gray-900 transition"
                  >
                    Copy Instructions
                  </Button>
                </div>
              )}
              
              {/* AI Tools recommendation */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold text-blue-800 mb-2">Recommended AI tools to try:</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="text-sm">
                    <div className="font-medium text-blue-900">Claude.ai</div>
                    <div className="text-blue-700">Free & great for beginners</div>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium text-blue-900">ChatGPT</div>
                    <div className="text-blue-700">Popular & easy to use</div>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium text-blue-900">Cursor</div>
                    <div className="text-blue-700">Best for learning to code</div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(2)}
                  className="rounded-md px-6 py-2"
                >
                  Back to Questions
                </Button>
                <Button
                  onClick={() => setCurrentStep(0)}
                  variant="outline"
                  className="rounded-md px-6 py-2"
                >
                  Create Another App
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
} 