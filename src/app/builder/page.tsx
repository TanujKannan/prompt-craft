'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { HelpCircle, Sparkles, Copy, BookOpen, ArrowRight, Check, Edit } from 'lucide-react'
import { debounce } from 'lodash'
import { useAuth } from '@/lib/auth'
import { promptTemplates, templateCategories, getTemplatesByCategory, type PromptTemplate } from '@/lib/templates'
import { Lightbulb, Plus, X, Rocket } from 'lucide-react'
import AuthModal from '@/components/AuthModal'
import { useToast } from '@/components/ToastProvider'

interface ClarifyingQuestion {
  id: string
  question: string
  type: 'select' | 'input' | 'both'
  options?: {
    value: string
    label: string
    explanation: string
    recommended?: boolean
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
  const [sessionId] = useState<string>(() => crypto.randomUUID())
  const [generatedPrompt, setGeneratedPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [showCustomInput, setShowCustomInput] = useState<Record<string, boolean>>({})
  
  // New state for dynamic questions
  const [dynamicQuestions, setDynamicQuestions] = useState<ClarifyingQuestion[]>([])
  const [isGeneratingQuestions, setIsGeneratingQuestions] = useState(false)
  const [questionsGenerated, setQuestionsGenerated] = useState(false)
  const [questionsGeneratedForIdea, setQuestionsGeneratedForIdea] = useState('')
  const [generatingStatus, setGeneratingStatus] = useState('')
  const [generatedQuestionsPreview, setGeneratedQuestionsPreview] = useState<ClarifyingQuestion[]>([])
  const [copied, setCopied] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [promptSaved, setPromptSaved] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [isEditingIdea, setIsEditingIdea] = useState(false)
  const [editedIdea, setEditedIdea] = useState('')
  const [celebrateProgress, setCelebrateProgress] = useState(false)
  const [lastAnsweredQuestion, setLastAnsweredQuestion] = useState<string | null>(null)
  const { addToast } = useToast()

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
    
    // Clear previous dynamic questions state when switching templates
    setDynamicQuestions([])
    setQuestionsGenerated(false)
    setQuestionsGeneratedForIdea('')
    setIsGeneratingQuestions(false)
    setGeneratingStatus('')
    setGeneratedQuestionsPreview([])
    setShowCustomInput({})
    setGeneratedPrompt('')
    setCopied(false)
    setPromptSaved(false)
  }

  // Start from scratch
  const startFromScratch = () => {
    setSelectedTemplate(null)
    setAppIdea('')
    setAnswers({})
    setCurrentStep(1)
    
    // Clear dynamic questions state when starting from scratch
    setDynamicQuestions([])
    setQuestionsGenerated(false)
    setQuestionsGeneratedForIdea('')
    setIsGeneratingQuestions(false)
    setGeneratingStatus('')
    setGeneratedQuestionsPreview([])
    setShowCustomInput({})
    setGeneratedPrompt('')
    setCopied(false)
    setPromptSaved(false)
  }

  // Reset all state for creating another app
  const resetAllState = () => {
    setSelectedTemplate(null)
    setAppIdea('')
    setAnswers({})
    setGeneratedPrompt('')
    setShowCustomInput({})
    // Reset dynamic questions state
    setDynamicQuestions([])
    setIsGeneratingQuestions(false)
    setQuestionsGenerated(false)
    setQuestionsGeneratedForIdea('')
    setGeneratingStatus('')
    setGeneratedQuestionsPreview([])
    setCopied(false)
    setIsSaving(false)
    setPromptSaved(false)
    setCurrentStep(0)
  }

  // Get filtered templates
  const getFilteredTemplates = () => {
    if (selectedCategory === 'all') return promptTemplates
    return getTemplatesByCategory(selectedCategory)
  }

  // Auto-save debounced app idea
  const debouncedSaveAppIdea = useCallback(
    debounce(async (idea: string) => {
      if (!idea.trim()) return
      
      // Skip database operations from frontend to avoid RLS policy violations
      // Session creation is handled properly in the backend API routes
      
      // Just update local state - no database operations needed here
      // The backend API routes handle session creation with proper service role permissions
    }, 1000),
    [sessionId, user?.id]
  )

  // Generate dynamic questions based on app idea
  const generateDynamicQuestions = async (idea: string) => {
    if (!idea.trim()) return

    setIsGeneratingQuestions(true)
    setGeneratingStatus('🤖 AI is analyzing your app idea...')
    setGeneratedQuestionsPreview([])
    
    // Simulate progressive question generation with status updates
    const statusUpdates = [
      '🧠 Understanding your app concept...',
      '🔍 Identifying key technical decisions...',
      '⚙️ Analyzing technology requirements...',
      '📋 Crafting personalized questions...',
      '✨ Finalizing recommendations...'
    ]
    
    let statusIndex = 0
    const statusInterval = setInterval(() => {
      if (statusIndex < statusUpdates.length) {
        setGeneratingStatus(statusUpdates[statusIndex])
        statusIndex++
      }
    }, 1200)
    
    try {
      const response = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appIdea: idea })
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Question generation failed:', errorData)
        throw new Error(`Failed to generate questions: ${response.statusText}`)
      }

      const data = await response.json()
      
      if (data.questions && Array.isArray(data.questions)) {
        // Clear status interval
        clearInterval(statusInterval)
        setGeneratingStatus('🎉 Questions generated! Loading them now...')
        
        // Simulate questions appearing one by one
        const questions = data.questions
        setGeneratedQuestionsPreview([])
        
        for (let i = 0; i < questions.length; i++) {
          await new Promise(resolve => setTimeout(resolve, 300)) // 300ms delay between each question
          setGeneratedQuestionsPreview(prev => [...prev, questions[i]])
        }
        
        // Final delay before showing all questions
        await new Promise(resolve => setTimeout(resolve, 500))
        
        setDynamicQuestions(data.questions)
        setQuestionsGenerated(true)
        setQuestionsGeneratedForIdea(idea)
        setAnswers({}) // Reset answers when new questions are generated
        setShowCustomInput({})
      } else {
        console.error('Invalid response format:', data)
        throw new Error('Invalid response format')
      }
    } catch (error) {
      clearInterval(statusInterval)
      console.error('Error generating questions:', error)
      // Fallback to static questions if dynamic generation fails
      setGeneratingStatus('⚠️ Using fallback questions...')
      await new Promise(resolve => setTimeout(resolve, 1000))
      setDynamicQuestions(clarifyingQuestions)
      setQuestionsGenerated(true)
      setQuestionsGeneratedForIdea(idea)
    } finally {
      clearInterval(statusInterval)
      setIsGeneratingQuestions(false)
      setGeneratingStatus('')
    }
  }

  // Save app idea to Supabase with debounce
  const saveAppIdea = async (idea: string) => {
    debouncedSaveAppIdea(idea)
  }

  useEffect(() => {
    if (appIdea.trim()) {
      saveAppIdea(appIdea)
    }
  }, [appIdea])

  const handleNext = async () => {
    if (currentStep === 1) {
      // Moving from step 1 to step 2 - generate dynamic questions
      if (!appIdea.trim()) {
        alert('Please enter your app idea first')
        return
      }
      
      // Check if we need to generate new questions
      const needNewQuestions = !questionsGenerated || 
        appIdea.trim() !== questionsGeneratedForIdea.trim()
      
      if (needNewQuestions) {
        await generateDynamicQuestions(appIdea)
      }
    }
    
    setCurrentStep(prev => Math.min(prev + 1, 3))
  }

  // Save answers to Supabase
  const saveAnswer = async (questionId: string, answer: { selected?: string; custom?: string }) => {
    // Skip database operations from frontend to avoid RLS policy violations
    // Answer saving is handled properly in the backend API routes with service role permissions
    
    // The generatePrompt API call will handle saving all answers to the database
    // using the service role key which bypasses RLS policies
  }

  const handleAnswerSelect = (questionId: string, selectedValue: string) => {
    const wasAlreadyAnswered = answers[questionId]?.selected || answers[questionId]?.custom
    
    setAnswers(prev => ({ 
      ...prev, 
      [questionId]: { ...prev[questionId], selected: selectedValue, custom: undefined }
    }))
    setShowCustomInput(prev => ({ ...prev, [questionId]: false }))
    setLastAnsweredQuestion(questionId)
    
    // Celebrate progress if this is a new answer
    if (!wasAlreadyAnswered) {
      const newAnswerCount = Object.keys(answers).length + 1
      const progressPercent = (newAnswerCount / dynamicQuestions.length) * 100
      
      // Trigger celebration for milestones
      if (progressPercent === 50 || progressPercent === 100 || newAnswerCount % 3 === 0) {
        setCelebrateProgress(true)
        setTimeout(() => setCelebrateProgress(false), 2000)
      }
      
      // Auto-scroll to next unanswered question
      setTimeout(() => {
        const currentIndex = dynamicQuestions.findIndex(q => q.id === questionId)
        const nextUnansweredIndex = dynamicQuestions.findIndex((q, idx) => 
          idx > currentIndex && !answers[q.id]?.selected && !answers[q.id]?.custom
        )
        
        if (nextUnansweredIndex !== -1) {
          const nextElement = document.getElementById(`question-${dynamicQuestions[nextUnansweredIndex].id}`)
          if (nextElement) {
            nextElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
          }
        }
      }, 500)
    }
    
    // Only save if questions have been generated and we have dynamic questions
    if (questionsGenerated && dynamicQuestions.length > 0) {
      saveAnswer(questionId, { selected: selectedValue })
    }
  }

  const handleCustomInput = (questionId: string, customValue: string) => {
    setAnswers(prev => ({ 
      ...prev, 
      [questionId]: { ...prev[questionId], custom: customValue, selected: undefined }
    }))
    
    // Only save if questions have been generated and we have dynamic questions
    if (questionsGenerated && dynamicQuestions.length > 0) {
      saveAnswer(questionId, { custom: customValue })
    }
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

      // Always send data directly to avoid session issues
      const requestBody = { 
        appIdea, 
        userId: user?.id || null, // Include user ID for proper saving
        answers: Object.entries(answers).map(([questionId, answer]) => {
          const question = dynamicQuestions.find(q => q.id === questionId)
          return {
            question: question?.question || questionId,
            selectedAnswer: answer.custom || answer.selected || '',
            explanation: answer.selected 
              ? question?.options?.find(opt => opt.value === answer.selected)?.explanation
              : 'Custom input provided by user'
          }
        })
      }

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
      setCopied(true)
      addToast('Instructions copied to clipboard', 'success')
      // Reset the copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
      addToast('Failed to copy to clipboard', 'error')
    }
  }

  const savePrompt = async () => {
    if (!user || !generatedPrompt) return

    setIsSaving(true)
    try {
      const requestBody = { 
        appIdea, 
        userId: user.id,
        answers: Object.entries(answers).map(([questionId, answer]) => {
          const question = dynamicQuestions.find(q => q.id === questionId)
          return {
            question: question?.question || questionId,
            selectedAnswer: answer.custom || answer.selected || '',
            explanation: answer.selected 
              ? question?.options?.find(opt => opt.value === answer.selected)?.explanation
              : 'Custom input provided by user'
          }
        }),
        prompt: generatedPrompt
      }

      const response = await fetch('/api/save-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save prompt')
      }

      setPromptSaved(true)
      // Reset the saved state after 3 seconds
      setTimeout(() => setPromptSaved(false), 3000)
    } catch (error) {
      console.error('Error saving prompt:', error)
      alert('Failed to save prompt. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const canProceedToStep2 = appIdea.trim().length > 10
  const canProceedToStep3 = Object.keys(answers).length === dynamicQuestions.length && 
    dynamicQuestions.every(q => answers[q.id]?.selected || answers[q.id]?.custom)





  // Handle editing app idea
  const startEditingIdea = () => {
    setEditedIdea(appIdea)
    setIsEditingIdea(true)
  }

  const cancelEditingIdea = () => {
    setEditedIdea('')
    setIsEditingIdea(false)
  }

  const saveEditedIdea = async () => {
    if (!editedIdea.trim()) return
    
    // Update the app idea
    setAppIdea(editedIdea.trim())
    setIsEditingIdea(false)
    
    // Reset generated content to trigger regeneration
    setDynamicQuestions([])
    setAnswers({})
    setShowCustomInput({})
    setGeneratedPrompt('')
    setQuestionsGeneratedForIdea('')
    
    // Go back to step 2 to show new questions
    setCurrentStep(2)
    
    // Generate new questions for the edited idea
    await generateDynamicQuestions(editedIdea.trim())
  }

  // Keyboard shortcuts for navigation (Ctrl/Cmd + →, Ctrl/Cmd + ←)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isModifier = e.metaKey || e.ctrlKey
      if (!isModifier) return
      if (e.key === 'ArrowRight') {
        e.preventDefault()
        goNext()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        goPrev()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentStep, selectedTemplate, appIdea, canProceedToStep3, isGenerating, isGeneratingQuestions, user])

  // Helper functions for navigation
  const goNext = () => {
    if (currentStep === 0) {
      // Need template selection or scratch chosen
      if (selectedTemplate || appIdea.trim().length > 0) {
        setCurrentStep(1)
      }
    } else if (currentStep === 1) {
      // Same logic as clicking Next button
      handleNext()
    } else if (currentStep === 2) {
      if (!canProceedToStep3 || isGenerating || isGeneratingQuestions) return
      if (user) {
        generatePrompt()
      } else {
        setShowAuthModal(true)
      }
    }
  }

  const goPrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-white">
      <main className="w-full max-w-3xl mx-auto flex flex-col items-center px-6 py-12 space-y-12">
        {/* Linear Progress Bar */}
        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
          <div
            className="bg-black h-full transition-all duration-300"
            style={{ width: `${(currentStep / 3) * 100}%` }}
          />
        </div>
        
        {/* Progress Steps Icons */}
        <div className="flex items-center justify-center space-x-4 w-full mb-2">
          {[0, 1, 2, 3].map((step, idx) => (
            <div key={step} className="flex items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                  currentStep >= step
                    ? 'border-black bg-black text-white'
                    : 'border-gray-200 bg-white text-gray-400'
                } font-semibold text-base transition-all relative`}
              >
                {currentStep === 2 && step === 2 && isGeneratingQuestions ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  stepIcons[idx]
                )}
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
                  onClick={handleNext}
                  disabled={!canProceedToStep2 || isGeneratingQuestions}
                  size="lg"
                  className="bg-black text-white rounded-md px-6 py-2 font-medium shadow hover:shadow-md hover:bg-gray-900 transition"
                >
                  {isGeneratingQuestions ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generating Questions...
                    </>
                  ) : (
                    'Continue'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Clarifying Questions */}
        {currentStep === 2 && (
          <div className="w-full flex flex-col items-center space-y-8">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <HelpCircle className="h-8 w-8 text-white" />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Let's configure your app
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl">
                  {isGeneratingQuestions 
                    ? "Our AI is analyzing your app idea to generate personalized questions..."
                    : "These questions are tailored specifically to your app idea. We'll guide you through each decision with clear explanations and smart recommendations."
                  }
                </p>
              </div>
              {!isGeneratingQuestions && questionsGenerated && dynamicQuestions.length > 0 && (
                <div className="flex items-center gap-2 text-sm font-medium text-green-700 bg-gradient-to-r from-green-100 to-blue-100 px-4 py-2 rounded-full border border-green-200 shadow-sm">
                  <Sparkles className="h-4 w-4" />
                  AI-generated questions for "{appIdea.substring(0, 50)}..."
                </div>
              )}
              {!isGeneratingQuestions && questionsGenerated && dynamicQuestions.length > 0 && (
                <div className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  💡 Tip: Use Tab to navigate between options, Space to select, Esc to close custom inputs
                </div>
              )}
            </div>
            
            {isGeneratingQuestions ? (
              <div className="w-full space-y-6">
                {/* Dynamic Status Updates */}
                <div className="flex flex-col items-center space-y-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                  <div className="text-base font-medium text-gray-700 bg-blue-50 px-4 py-2 rounded-full border border-blue-200">
                    {generatingStatus}
                  </div>
                </div>

                {/* Progressive Question Generation */}
                {generatedQuestionsPreview.length > 0 && (
                  <div className="w-full space-y-4">
                    <div className="text-center">
                      <div className="text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-200 inline-flex items-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        Questions appearing as AI generates them...
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {generatedQuestionsPreview.map((question, index) => (
                        <Card 
                          key={index} 
                          className="rounded-xl border border-gray-200 bg-white shadow-none animate-in slide-in-from-bottom-4 duration-500"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <CardHeader className="flex flex-col items-start space-y-2 pb-2">
                            <div className="flex items-center gap-2">
                              <HelpCircle className="h-4 w-4 text-blue-500" />
                              <CardTitle className="text-base font-semibold text-gray-900">{question.question}</CardTitle>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            {question.options && question.options.slice(0, 2).map((option, optIndex) => (
                              <div
                                key={option.value}
                                className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 animate-in fade-in duration-300"
                                style={{ animationDelay: `${(index * 100) + (optIndex * 50)}ms` }}
                              >
                                <div className="font-medium text-sm text-gray-700 flex items-center gap-2">
                                  {option.label}
                                  {option.recommended && (
                                    <span className="text-xs font-semibold text-white bg-green-600 px-2 py-0.5 rounded">Recommended</span>
                                  )}
                                </div>
                                <div className="text-xs text-gray-500 mt-1 truncate">
                                  {option.explanation.substring(0, 60)}...
                                </div>
                              </div>
                            ))}
                            {question.options && question.options.length > 2 && (
                              <div className="text-xs text-gray-400 text-center">
                                +{question.options.length - 2} more options
                              </div>
                            )}
                            <div className="h-6 bg-gray-100 rounded animate-pulse"></div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Static skeleton for remaining questions if any */}
                {generatedQuestionsPreview.length > 0 && generatedQuestionsPreview.length < 6 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Array.from({ length: Math.max(0, 6 - generatedQuestionsPreview.length) }).map((_, i) => (
                      <Card key={`skeleton-${i}`} className="rounded-xl border border-gray-200 bg-white shadow-none opacity-50">
                        <CardHeader className="pb-2">
                          <div className="flex items-center gap-2">
                            <div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4"></div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {[1, 2].map((j) => (
                            <div key={j} className="rounded-md border border-gray-100 bg-gray-50 px-3 py-2">
                              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2 mb-2"></div>
                              <div className="h-3 bg-gray-100 rounded animate-pulse w-full"></div>
                            </div>
                          ))}
                          <div className="h-6 bg-gray-100 rounded animate-pulse"></div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Initial skeleton if no questions generated yet */}
                {generatedQuestionsPreview.length === 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 opacity-30">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <Card key={i} className="rounded-xl border border-gray-200 bg-white shadow-none">
                        <CardHeader className="pb-2">
                          <div className="flex items-center gap-2">
                            <div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4"></div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {[1, 2, 3].map((j) => (
                            <div key={j} className="rounded-md border border-gray-100 bg-gray-50 px-3 py-2">
                              <div className="flex items-center justify-between gap-3">
                                <div className="flex-1 space-y-2">
                                  <div className="h-4 bg-gray-200 rounded animate-pulse w-2/3"></div>
                                  <div className="h-3 bg-gray-100 rounded animate-pulse w-full"></div>
                                </div>
                                <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                              </div>
                            </div>
                          ))}
                          <div className="h-8 w-full bg-gray-100 rounded animate-pulse mt-3"></div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full space-y-8">
                {/* Progress Section */}
                <div className={`bg-white rounded-xl p-6 border border-gray-200 shadow-sm transition-all duration-500 ${
                  celebrateProgress ? 'scale-105 shadow-lg border-green-300 bg-green-50' : ''
                }`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-gray-900">Your Progress</h3>
                      {celebrateProgress && (
                        <span className="text-xl animate-bounce">🎉</span>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-600">
                        {Object.keys(answers).length} of {dynamicQuestions.length} completed
                      </div>
                      <div className="text-xs text-gray-500">
                        {dynamicQuestions.length - Object.keys(answers).length === 0 
                          ? "All done! 🚀" 
                          : `${dynamicQuestions.length - Object.keys(answers).length} remaining`
                        }
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="relative w-full bg-gray-200 rounded-full h-4 mb-3 overflow-hidden">
                    <div 
                      className={`h-4 rounded-full transition-all duration-700 ease-out ${
                        Object.keys(answers).length === dynamicQuestions.length
                          ? 'bg-gradient-to-r from-green-400 via-blue-500 to-purple-600'
                          : 'bg-gradient-to-r from-blue-500 to-green-500'
                      }`}
                      style={{ width: `${(Object.keys(answers).length / dynamicQuestions.length) * 100}%` }}
                    >
                      {celebrateProgress && (
                        <div className="w-full h-full bg-white opacity-30 animate-pulse rounded-full"></div>
                      )}
                    </div>
                    {/* Progress sparkle effect */}
                    {Object.keys(answers).length > 0 && (
                      <div 
                        className="absolute top-1/2 transform -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-lg transition-all duration-700 ease-out"
                        style={{ left: `${(Object.keys(answers).length / dynamicQuestions.length) * 100 - 1}%` }}
                      >
                        <div className="w-full h-full bg-white rounded-full animate-ping"></div>
                      </div>
                    )}
                  </div>
                  
                  {/* Progress Percentage and Status */}
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium text-gray-700">
                      {Math.round((Object.keys(answers).length / dynamicQuestions.length) * 100)}% complete
                    </p>
                    {Object.keys(answers).length === dynamicQuestions.length && (
                      <span className="text-sm font-medium text-green-600 flex items-center gap-1">
                        <Check className="h-4 w-4" />
                        Ready to generate!
                      </span>
                    )}
                  </div>
                </div>

                {/* Questions List */}
                <div className="space-y-6 sm:space-y-8">
                  {dynamicQuestions.map((question, index) => {
                    const currentAnswer = answers[question.id]
                    const isAnswered = currentAnswer?.selected || currentAnswer?.custom
                    const isCustomInputVisible = showCustomInput[question.id]
                    
                    return (
                      <div 
                        key={question.id}
                        id={`question-${question.id}`}
                        className={`relative p-4 sm:p-6 rounded-xl border-2 shadow-sm transition-all duration-500 transform ${
                          isAnswered 
                            ? 'border-green-300 bg-gradient-to-br from-green-50 to-blue-50 shadow-green-100' 
                            : 'border-gray-200 bg-white hover:shadow-lg hover:border-gray-300 hover:-translate-y-1'
                        } ${
                          lastAnsweredQuestion === question.id ? 'animate-pulse' : ''
                        }`}
                      >
                        {/* Question Header */}
                        <div className="flex items-start gap-3 sm:gap-4 mb-6">
                          <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                            isAnswered 
                              ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg scale-110' 
                              : 'bg-gradient-to-r from-gray-200 to-gray-300 text-gray-600 hover:from-blue-100 hover:to-purple-100'
                          }`}>
                            {isAnswered ? (
                              <Check className="h-5 w-5" />
                            ) : (
                              index + 1
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                                {question.question}
                              </h3>
                              {!isAnswered && (
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                                  Required
                                </span>
                              )}
                            </div>
                            {isAnswered && (
                              <div className="flex items-center gap-2">
                                <div className="text-sm text-green-700 font-medium bg-gradient-to-r from-green-100 to-blue-100 px-3 py-1 rounded-full inline-flex items-center gap-1 shadow-sm">
                                  <Check className="h-3 w-3" />
                                  {currentAnswer.selected ? 
                                    question.options?.find(opt => opt.value === currentAnswer.selected)?.label 
                                    : 'Custom answer'
                                  }
                                </div>
                              </div>
                            )}
                            {!isAnswered && (
                              <p className="text-sm text-gray-600">
                                Choose the option that best fits your needs, or provide a custom answer.
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Options */}
                        <div className="ml-0 sm:ml-8 space-y-3">
                          {question.options && question.options.length > 0 && (
                            <div className="space-y-2">
                              {question.options.map((option) => {
                                const isSelected = currentAnswer?.selected === option.value
                                return (
                                  <button
                                    key={option.value}
                                    onClick={() => handleAnswerSelect(question.id, option.value)}
                                    onKeyDown={(e) => {
                                      if (e.key === ' ' || e.key === 'Enter') {
                                        e.preventDefault()
                                        handleAnswerSelect(question.id, option.value)
                                      }
                                    }}
                                    className={`group w-full text-left p-4 rounded-xl border-2 transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                      isSelected 
                                        ? 'border-black bg-gradient-to-r from-gray-50 to-blue-50 shadow-lg scale-[1.02]' 
                                        : option.recommended
                                        ? 'border-green-300 bg-gradient-to-r from-green-50 to-blue-50 hover:border-green-400 hover:shadow-lg hover:scale-[1.01] focus:border-green-500'
                                        : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 hover:shadow-md hover:scale-[1.01] focus:border-blue-400'
                                    } ${
                                      option.recommended && !isSelected ? 'ring-2 ring-green-200' : ''
                                    }`}
                                  >
                                    <div className="flex items-start justify-between gap-3">
                                      <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                                          <span className={`font-semibold ${
                                            isSelected ? 'text-gray-900' : 'text-gray-800'
                                          }`}>
                                            {option.label}
                                          </span>
                                          {option.recommended && (
                                            <span className={`text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 ${
                                              isSelected 
                                                ? 'text-white bg-gradient-to-r from-green-500 to-blue-500'
                                                : 'text-white bg-gradient-to-r from-green-500 to-green-600 animate-pulse'
                                            }`}>
                                              ⭐ Recommended
                                            </span>
                                          )}
                                        </div>
                                        <p className="text-sm text-gray-600 leading-relaxed">
                                          {option.explanation}
                                        </p>
                                        {option.recommended && !isSelected && (
                                          <p className="text-xs text-green-700 font-medium mt-2 flex items-center gap-1">
                                            <span className="w-1 h-1 bg-green-500 rounded-full"></span>
                                            Best choice for most apps
                                          </p>
                                        )}
                                      </div>
                                      <div className={`flex-shrink-0 w-6 h-6 rounded-full border-3 flex items-center justify-center transition-all duration-300 ${
                                        isSelected 
                                          ? 'border-black bg-black shadow-lg' 
                                          : option.recommended
                                          ? 'border-green-400 group-hover:border-green-500'
                                          : 'border-gray-300 group-hover:border-gray-400'
                                      }`}>
                                        {isSelected && (
                                          <div className="w-2 h-2 bg-white rounded-full"></div>
                                        )}
                                        {!isSelected && option.recommended && (
                                          <div className="w-2 h-2 bg-green-400 rounded-full opacity-70"></div>
                                        )}
                                      </div>
                                    </div>
                                  </button>
                                )
                              })}
                            </div>
                          )}

                          {/* Custom Input Section */}
                          {question.allowCustom && (
                            <div className="space-y-3 mt-4">
                              <Button
                                onClick={() => toggleCustomInput(question.id)}
                                variant="outline"
                                className={`w-full py-4 border-2 border-dashed transition-all duration-300 ${
                                  isCustomInputVisible 
                                    ? 'border-blue-300 bg-blue-50 text-blue-700 hover:border-blue-400' 
                                    : 'border-gray-300 hover:border-blue-300 text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                                }`}
                              >
                                {isCustomInputVisible ? (
                                  <>
                                    <X className="h-4 w-4 mr-2" />
                                    Hide Custom Answer
                                  </>
                                ) : (
                                  <>
                                    <Plus className="h-4 w-4 mr-2" />
                                    💡 Or provide your own answer
                                  </>
                                )}
                              </Button>

                              {isCustomInputVisible && (
                                <div className="space-y-3 animate-in slide-in-from-top-2 duration-300">
                                  <div className="relative">
                                    <Textarea
                                      placeholder={question.placeholder || "Enter your custom answer..."}
                                      value={currentAnswer?.custom || ''}
                                      onChange={(e) => handleCustomInput(question.id, e.target.value)}
                                      className="min-h-[120px] text-sm border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none bg-gradient-to-br from-white to-blue-50 p-4"
                                      onKeyDown={(e) => {
                                        if (e.key === 'Escape') {
                                          toggleCustomInput(question.id)
                                        }
                                      }}
                                    />
                                    <div className="absolute bottom-2 right-2 text-xs text-gray-400 bg-white px-2 py-1 rounded-md">
                                      Press Esc to close
                                    </div>
                                  </div>
                                  {currentAnswer?.custom && (
                                    <div className="text-sm text-green-700 font-medium bg-gradient-to-r from-green-100 to-blue-100 px-3 py-2 rounded-lg inline-flex items-center gap-2 shadow-sm">
                                      <Check className="h-4 w-4" />
                                      Custom answer provided ({currentAnswer.custom.length} characters)
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Input-only Questions */}
                          {question.type === 'input' && (
                            <div className="space-y-3">
                              <div className="relative">
                                <Textarea
                                  placeholder={question.placeholder || "Enter your answer..."}
                                  value={currentAnswer?.custom || ''}
                                  onChange={(e) => handleCustomInput(question.id, e.target.value)}
                                  className="min-h-[120px] text-sm border-2 border-blue-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none bg-gradient-to-br from-white to-blue-50 p-4"
                                />
                                <div className="absolute bottom-2 right-2 text-xs text-gray-400 bg-white px-2 py-1 rounded-md">
                                  {currentAnswer?.custom?.length || 0} characters
                                </div>
                              </div>
                              {currentAnswer?.custom && (
                                <div className="text-sm text-green-700 font-medium bg-gradient-to-r from-green-100 to-blue-100 px-3 py-2 rounded-lg inline-flex items-center gap-2 shadow-sm">
                                  <Check className="h-4 w-4" />
                                  Answer provided ({currentAnswer.custom.length} characters)
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
            <div className="flex justify-between items-center w-full pt-8">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(1)}
                disabled={isGeneratingQuestions}
                className="rounded-xl px-6 py-3 font-medium border-2 hover:border-gray-400 hover:shadow-md transition-all duration-300"
              >
                ← Edit App Idea
              </Button>
              <div className="flex items-center gap-4">
                {Object.keys(answers).length > 0 && Object.keys(answers).length < dynamicQuestions.length && (
                  <div className="text-sm text-amber-700 bg-amber-50 px-3 py-2 rounded-lg border border-amber-200 flex items-center gap-1">
                    ⏳ {dynamicQuestions.length - Object.keys(answers).length} more questions to complete
                  </div>
                )}
                {user ? (
                  <Button
                    onClick={generatePrompt}
                    disabled={!canProceedToStep3 || isGenerating || isGeneratingQuestions}
                    className={`rounded-xl px-8 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform ${
                      canProceedToStep3 && !isGenerating && !isGeneratingQuestions
                        ? 'bg-gradient-to-r from-black to-gray-800 text-white hover:scale-105'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Creating Your Perfect Prompt...
                      </>
                    ) : isGeneratingQuestions ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Loading Questions...
                      </>
                    ) : canProceedToStep3 ? (
                      <>
                        🚀 Generate My Perfect Prompt
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </>
                    ) : (
                      <>
                        Answer All Questions First
                        <span className="ml-2 text-xs">({Object.keys(answers).length}/{dynamicQuestions.length})</span>
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={() => setShowAuthModal(true)}
                    disabled={!canProceedToStep3 || isGeneratingQuestions}
                    className={`rounded-xl px-8 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform ${
                      canProceedToStep3 && !isGeneratingQuestions
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:scale-105'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {canProceedToStep3 ? (
                      <>
                        🔐 Sign In to Generate Prompt
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </>
                    ) : (
                      <>
                        Complete Questions to Continue
                        <span className="ml-2 text-xs">({Object.keys(answers).length}/{dynamicQuestions.length})</span>
                      </>
                    )}
                  </Button>
                )}
              </div>
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
              {/* Edit App Idea Section */}
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-orange-800 mb-1">Want to refine your app idea?</h3>
                    <p className="text-sm text-orange-700">
                      Edit your original idea to add more details or change direction, then get updated instructions.
                    </p>
                  </div>
                  <Button
                    onClick={startEditingIdea}
                    variant="outline"
                    className="ml-4 border-orange-300 text-orange-700 hover:bg-orange-100 rounded-md px-4 py-2 text-sm font-medium shadow hover:shadow-md transition"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit App Idea
                  </Button>
                </div>
              </div>

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
              
              <div className="relative">
                <Textarea
                  value={generatedPrompt}
                  readOnly
                  className="min-h-[300px] text-sm bg-gray-50 border border-gray-200 rounded-md focus:border-black focus:ring-0 transition"
                />
                <Button
                  onClick={copyToClipboard}
                  className={`absolute top-2 right-2 rounded-md px-3 py-1 text-xs font-medium shadow hover:shadow-md transition ${
                    copied 
                      ? 'bg-green-600 text-white hover:bg-green-700' 
                      : 'bg-black text-white hover:bg-gray-900'
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="h-3 w-3 mr-1" />
                      Copied!
                    </>
                  ) : (
                    'Copy Instructions'
                  )}
                </Button>
              </div>

              {/* Save Prompt Section - Only for authenticated users */}
              {user && (
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-yellow-800 mb-1">Save this prompt?</h3>
                      <p className="text-sm text-yellow-700">
                        Save this prompt to your account so you can access it later from the Saved Prompts page.
                      </p>
                    </div>
                    <Button
                      onClick={savePrompt}
                      disabled={isSaving || promptSaved}
                      className={`ml-4 rounded-md px-4 py-2 text-sm font-medium shadow hover:shadow-md transition ${
                        promptSaved
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'bg-yellow-600 text-white hover:bg-yellow-700'
                      }`}
                    >
                      {isSaving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Saving...
                        </>
                      ) : promptSaved ? (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          Saved!
                        </>
                      ) : (
                        'Save Prompt'
                      )}
                    </Button>
                  </div>
                  {promptSaved && (
                    <div className="mt-3 text-sm text-green-700 bg-green-50 px-3 py-2 rounded-md border border-green-200">
                      ✓ Prompt saved successfully! You can view it anytime in your <a href="/saved" className="underline font-medium">Saved Prompts</a>.
                    </div>
                  )}
                </div>
              )}

              {/* Sign in prompt for non-authenticated users */}
              {!user && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-blue-800 mb-1">Want to save this prompt?</h3>
                      <p className="text-sm text-blue-700">
                        Sign in to save your prompts and access them anytime from any device.
                      </p>
                    </div>
                    <Button
                      asChild
                      className="ml-4 bg-blue-600 text-white hover:bg-blue-700 rounded-md px-4 py-2 text-sm font-medium shadow hover:shadow-md transition"
                    >
                      <a href="/saved">Sign In to Save</a>
                    </Button>
                  </div>
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
                  onClick={resetAllState}
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
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />

      {/* Edit App Idea Modal */}
      {isEditingIdea && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Edit Your App Idea</h2>
            <p className="text-sm text-gray-600 mb-4">
              Refine your app concept below. The AI will generate new customized questions based on your updated idea.
            </p>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="editedIdea" className="text-sm font-medium text-gray-700">
                  Your App Idea
                </Label>
                <Textarea
                  id="editedIdea"
                  value={editedIdea}
                  onChange={(e) => setEditedIdea(e.target.value)}
                  placeholder="Describe your app idea in detail..."
                  className="mt-1 min-h-[120px] w-full border border-gray-300 rounded-md focus:border-black focus:ring-0 transition"
                />
              </div>
              
              <div className="flex gap-3 justify-end">
                <Button
                  onClick={cancelEditingIdea}
                  variant="outline"
                  className="px-4 py-2 rounded-md"
                >
                  Cancel
                </Button>
                <Button
                  onClick={saveEditedIdea}
                  disabled={!editedIdea.trim() || editedIdea.trim() === appIdea}
                  className="bg-orange-600 text-white hover:bg-orange-700 px-4 py-2 rounded-md font-medium shadow hover:shadow-md transition"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Update & Generate New Questions
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 