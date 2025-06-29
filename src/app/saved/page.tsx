'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/lib/auth'
import AuthModal from '@/components/AuthModal'
import { Lock, RefreshCw, AlertTriangle } from 'lucide-react'

interface SavedPrompt {
  id: string
  app_idea: string
  prompt: string
  created_at: string
}

export default function SavedPrompts() {
  const { user, loading: authLoading } = useAuth()
  const [prompts, setPrompts] = useState<SavedPrompt[]>([])
  const [loading, setLoading] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load prompts by fetching them through our dedicated API route. This avoids
  // running the heavy join in the browser and keeps the RLS-bypass on the
  // server only.
  const loadPrompts = async () => {
    if (!user?.id) return

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/get-saved-prompts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      })

      const json = await res.json()

      if (!res.ok) throw new Error(json.error || 'Failed to load prompts')

      setPrompts(json.prompts || [])
    } catch (err) {
      console.error('Failed to load prompts:', err)
      const message = err instanceof Error ? err.message : 'Unknown error'
      setError(message)
      setPrompts([])
    } finally {
      setLoading(false)
    }
  }

  // Simple effect that runs when user changes
  useEffect(() => {
    console.log('🔄 Effect triggered:', { user: !!user, authLoading })
    
    if (authLoading) {
      console.log('⏳ Auth still loading, waiting...')
      return
    }

    if (user) {
      console.log('👤 User found, loading prompts...')
      loadPrompts()
    } else {
      console.log('👤 No user, clearing state...')
      setPrompts([])
      setError(null)
      setLoading(false)
    }
  }, [user, authLoading]) // Only depend on these two things

  const copyToClipboard = async (prompt: string) => {
    try {
      await navigator.clipboard.writeText(prompt)
      console.log('✅ Copied to clipboard')
    } catch (error) {
      console.error('❌ Failed to copy:', error)
    }
  }

  // Show loading state while auth is loading
  if (authLoading) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center bg-white">
        <main className="w-full max-w-3xl mx-auto flex flex-col items-center px-6 py-12 space-y-12">
          <div className="w-full flex flex-col items-center text-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="text-base text-gray-500">Checking authentication...</p>
          </div>
        </main>
      </div>
    )
  }

  // Show sign-in required
  if (!user) {
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

  // Main content for signed-in users
  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-white">
      <main className="w-full max-w-3xl mx-auto flex flex-col items-center px-6 py-12 space-y-12">
        <section className="w-full flex flex-col items-center text-center space-y-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Saved Prompts</h1>
          <p className="text-base md:text-lg text-gray-500 max-w-xl mx-auto">
            Your previously generated prompts are saved here for easy access.
          </p>
          <div className="flex items-center gap-4">
            <Button
              onClick={loadPrompts}
              disabled={loading}
              variant="outline"
              size="sm"
              className="rounded-md px-3 py-1 text-sm font-medium flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Loading...' : 'Refresh'}
            </Button>
          </div>
        </section>

        {/* Loading state */}
        {loading && (
          <div className="w-full flex flex-col items-center text-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="text-base text-gray-500">Loading your saved prompts...</p>
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <Card className="w-full rounded-xl border border-red-200 bg-red-50 shadow-none text-center">
            <CardHeader className="pb-4">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>
              </div>
              <CardTitle className="text-xl font-semibold text-red-900">Error Loading Prompts</CardTitle>
              <CardDescription className="text-red-700">
                {error}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  onClick={loadPrompts}
                  className="bg-black text-white rounded-md px-6 py-2 font-medium shadow hover:shadow-md hover:bg-gray-900 transition"
                >
                  Try Again
                </Button>
                <Button 
                  asChild 
                  variant="outline"
                  className="rounded-md px-6 py-2 font-medium"
                >
                  <a href="/builder">Create New Prompt</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty state */}
        {!loading && !error && prompts.length === 0 && (
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
        )}

        {/* Prompts list */}
        {!loading && !error && prompts.length > 0 && (
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