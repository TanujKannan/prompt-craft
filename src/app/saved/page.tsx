'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/lib/auth'
import AuthModal from '@/components/AuthModal'
import { Lock } from 'lucide-react'

interface SavedPrompt {
  id: string
  app_idea: string
  prompt: string
  created_at: string
}

export default function SavedPrompts() {
  const { user, loading: authLoading } = useAuth()
  const [prompts, setPrompts] = useState<SavedPrompt[]>([])
  const [loading, setLoading] = useState(true)
  const [showAuthModal, setShowAuthModal] = useState(false)

  useEffect(() => {
    if (!authLoading) {
      if (user) {
        loadSavedPrompts()
      } else {
        setLoading(false)
      }
    }
  }, [user, authLoading])

  const loadSavedPrompts = async () => {
    if (!user) return

    try {
      console.log('Loading saved prompts for user ID:', user.id)
      
      const { data, error } = await supabase
        .from('prompt_sessions')
        .select(`
          id,
          app_idea,
          created_at,
          generated_prompts (
            prompt
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      console.log('Raw query result:', data)

      const formattedPrompts = data
        .filter(session => session.generated_prompts && session.generated_prompts.length > 0)
        .map(session => ({
          id: session.id,
          app_idea: session.app_idea,
          prompt: session.generated_prompts[0].prompt,
          created_at: session.created_at
        }))

      console.log('Formatted prompts:', formattedPrompts)
      setPrompts(formattedPrompts)
    } catch (error) {
      console.error('Error loading saved prompts:', error)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async (prompt: string) => {
    try {
      await navigator.clipboard.writeText(prompt)
      // You could add a toast notification here
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  // Show authentication required state
  if (!authLoading && !user) {
    return (
      <>
        <div className="w-full min-h-screen flex flex-col items-center bg-white">
          <main className="w-full max-w-3xl mx-auto flex flex-col items-center px-6 py-12 space-y-12">
            <section className="w-full flex flex-col items-center text-center space-y-6">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Saved Prompts</h1>
              <p className="text-base md:text-lg text-gray-500 max-w-xl mx-auto">
                Your previously generated prompts are saved here for easy access.
              </p>
            </section>

            <Card className="w-full rounded-xl border border-gray-200 bg-white shadow-none text-center">
              <CardHeader className="pb-4">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                    <Lock className="w-8 h-8 text-gray-400" />
                  </div>
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900">Sign In Required</CardTitle>
                <CardDescription className="text-gray-500">
                  You need to sign in to view your saved prompts. Your prompts are securely stored and only visible to you.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button 
                    onClick={() => setShowAuthModal(true)}
                    className="bg-black text-white rounded-md px-6 py-2 font-medium shadow hover:shadow-md hover:bg-gray-900 transition"
                  >
                    Sign In
                  </Button>
                  <Button 
                    asChild 
                    variant="outline"
                    className="rounded-md px-6 py-2 font-medium"
                  >
                    <a href="/builder">Try Without Account</a>
                  </Button>
                </div>
                <p className="text-xs text-gray-400 mt-4">
                  Don't have an account? Sign up is quick and free!
                </p>
              </CardContent>
            </Card>
          </main>
        </div>

        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
          defaultMode="signin"
        />
      </>
    )
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-white">
      <main className="w-full max-w-3xl mx-auto flex flex-col items-center px-6 py-12 space-y-12">
        <section className="w-full flex flex-col items-center text-center space-y-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Saved Prompts</h1>
          <p className="text-base md:text-lg text-gray-500 max-w-xl mx-auto">
            Your previously generated prompts are saved here for easy access.
          </p>
        </section>

        {loading ? (
          <div className="w-full flex flex-col items-center text-center space-y-4">
            <p className="text-base text-gray-500">Loading your saved prompts...</p>
          </div>
        ) : prompts.length === 0 ? (
          <Card className="w-full rounded-xl border border-gray-200 bg-white shadow-none text-center">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-gray-900">No Saved Prompts</CardTitle>
              <CardDescription className="text-gray-500 text-sm">
                You haven't generated any prompts yet. Start building to see them here!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="bg-black text-white rounded-md px-6 py-2 font-medium shadow hover:shadow-md hover:bg-gray-900 transition">
                <a href="/builder">Start Building</a>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="w-full flex flex-col space-y-6">
            {prompts.map((savedPrompt) => (
              <Card key={savedPrompt.id} className="w-full rounded-xl border border-gray-200 bg-white shadow-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold text-gray-900 truncate">{savedPrompt.app_idea}</CardTitle>
                  <CardDescription className="text-gray-500 text-sm">
                    Generated on {new Date(savedPrompt.created_at).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    value={savedPrompt.prompt}
                    readOnly
                    className="min-h-[120px] font-mono text-sm bg-white border border-gray-200 rounded-md focus:border-black focus:ring-0 transition"
                  />
                  <div className="flex justify-end">
                    <Button onClick={() => copyToClipboard(savedPrompt.prompt)} className="bg-black text-white rounded-md px-6 py-2 font-medium shadow hover:shadow-md hover:bg-gray-900 transition">
                      Copy to Clipboard
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
} 