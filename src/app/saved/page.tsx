'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/lib/auth'
import { useToast } from '@/components/ToastProvider'
import AuthModal from '@/components/AuthModal'
import { Copy, AlertTriangle, Lock, RefreshCw, Trash2, Search, Calendar, SortAsc, SortDesc, Grid, List, Star, Filter, Archive, Eye, Clock, Sparkles, Plus, FileText } from 'lucide-react'

interface SavedPrompt {
  id: string
  app_idea: string
  prompt: string
  created_at: string
}

export default function SavedPrompts() {
  const { user, loading: authLoading } = useAuth()
  const { addToast } = useToast()
  const [prompts, setPrompts] = useState<SavedPrompt[]>([])
  const [loading, setLoading] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [promptToDelete, setPromptToDelete] = useState<SavedPrompt | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  
  // Enhanced UX state
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'date' | 'alphabetical' | 'length'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  const [selectedPrompts, setSelectedPrompts] = useState<Set<string>>(new Set())
  const [expandedPrompts, setExpandedPrompts] = useState<Set<string>>(new Set())
  const [recentlyDeleted, setRecentlyDeleted] = useState<string | null>(null)

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
    if (authLoading) {
      return
    }

    if (user) {
      loadPrompts()
    } else {
      setPrompts([])
      setError(null)
      setLoading(false)
    }
  }, [user, authLoading]) // Only depend on these two things

  // Enhanced functionality
  const filteredAndSortedPrompts = prompts
    .filter(prompt => {
      if (!searchQuery) return true
      const query = searchQuery.toLowerCase()
      return (
        prompt.app_idea.toLowerCase().includes(query) ||
        prompt.prompt.toLowerCase().includes(query)
      )
    })
    .sort((a, b) => {
      let comparison = 0
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          break
        case 'alphabetical':
          comparison = a.app_idea.localeCompare(b.app_idea)
          break
        case 'length':
          comparison = a.prompt.length - b.prompt.length
          break
      }
      
      return sortOrder === 'asc' ? comparison : -comparison
    })

  const togglePromptExpansion = (promptId: string) => {
    setExpandedPrompts(prev => {
      const newSet = new Set(prev)
      if (newSet.has(promptId)) {
        newSet.delete(promptId)
      } else {
        newSet.add(promptId)
      }
      return newSet
    })
  }



  const copyToClipboard = async (prompt: string, appIdea?: string) => {
    try {
      await navigator.clipboard.writeText(prompt)
      addToast(
        `✨ Prompt for "${appIdea ? appIdea.substring(0, 30) + '...' : 'your app'}" copied to clipboard!`, 
        'success'
      )
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
      addToast('Failed to copy to clipboard', 'error')
    }
  }

  const openDeleteDialog = (prompt: SavedPrompt) => {
    setPromptToDelete(prompt)
    setDeleteDialogOpen(true)
  }

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false)
    setPromptToDelete(null)
  }

  const deletePrompt = async () => {
    if (!promptToDelete || !user?.id) return

    setIsDeleting(true)
    setRecentlyDeleted(promptToDelete.id)
    
    try {
      const response = await fetch(`/api/delete-prompt?id=${promptToDelete.id}&userId=${user.id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete prompt')
      }

      // Remove the prompt from the local state
      setPrompts(prevPrompts => prevPrompts.filter(p => p.id !== promptToDelete.id))
      setExpandedPrompts(prev => {
        const newSet = new Set(prev)
        newSet.delete(promptToDelete.id)
        return newSet
      })
      
      addToast(
        `🗑️ "${promptToDelete.app_idea.substring(0, 30)}..." has been deleted`, 
        'success'
      )
      closeDeleteDialog()
      
      // Clear the recently deleted indicator after animation
      setTimeout(() => setRecentlyDeleted(null), 1000)
    } catch (error) {
      console.error('Error deleting prompt:', error)
      const message = error instanceof Error ? error.message : 'Failed to delete prompt'
      addToast(message, 'error')
      setRecentlyDeleted(null)
    } finally {
      setIsDeleting(false)
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
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <main className="w-full max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Enhanced Header */}
        <section className="text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
              Your Prompt Library
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Organize, search, and manage your AI-generated prompts with powerful tools
            </p>
          </div>
          
          {/* Stats Overview */}
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-200 flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-500" />
              <span className="font-medium">{prompts.length}</span>
              <span className="text-gray-500">Total Prompts</span>
            </div>
            <div className="bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-200 flex items-center gap-2">
              <Clock className="h-4 w-4 text-green-500" />
              <span className="font-medium">
                {prompts.length > 0 ? new Date(prompts[0]?.created_at).toLocaleDateString() : 'N/A'}
              </span>
              <span className="text-gray-500">Latest</span>
            </div>
          </div>
        </section>

        {/* Enhanced Controls */}
        <section className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search prompts and app ideas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-200 rounded-lg"
              />
            </div>
            
            {/* Controls */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Sort */}
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [newSortBy, newSortOrder] = e.target.value.split('-') as [typeof sortBy, typeof sortOrder]
                  setSortBy(newSortBy)
                  setSortOrder(newSortOrder)
                }}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-200"
              >
                <option value="date-desc">Newest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="alphabetical-asc">A to Z</option>
                <option value="alphabetical-desc">Z to A</option>
                <option value="length-desc">Longest First</option>
                <option value="length-asc">Shortest First</option>
              </select>
              
              {/* View Mode */}
              <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 text-sm flex items-center gap-1 transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <List className="h-4 w-4" />
                  List
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 text-sm flex items-center gap-1 transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Grid className="h-4 w-4" />
                  Grid
                </button>
              </div>
              
              {/* Refresh */}
              <Button
                onClick={loadPrompts}
                disabled={loading}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 border-gray-200 hover:border-blue-300"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </div>
          
          {/* Search Results Info */}
          {searchQuery && (
            <div className="mt-4 text-sm text-gray-600 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
              Found {filteredAndSortedPrompts.length} prompts matching "{searchQuery}"
              {filteredAndSortedPrompts.length === 0 && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="ml-2 text-blue-600 hover:text-blue-800 underline"
                >
                  Clear search
                </button>
              )}
            </div>
          )}
        </section>

        {/* Enhanced Loading State */}
        {loading && (
          <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 text-center">
            <div className="space-y-4">
              <div className="relative">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-blue-600 animate-pulse" />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-lg font-medium text-gray-900">Loading your prompts...</p>
                <p className="text-sm text-gray-500">Gathering your creative masterpieces</p>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Error State */}
        {error && !loading && (
          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-8 shadow-sm border border-red-200 text-center">
            <div className="space-y-6">
              <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center mx-auto">
                <AlertTriangle className="w-10 h-10 text-red-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-red-900">Oops! Something went wrong</h3>
                <p className="text-red-700 max-w-md mx-auto">{error}</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  onClick={loadPrompts}
                  className="bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl px-6 py-3 font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                <Button 
                  asChild 
                  variant="outline"
                  className="rounded-xl px-6 py-3 border-2 border-red-200 hover:border-red-300"
                >
                  <a href="/builder">
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Prompt
                  </a>
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Empty State */}
        {!loading && !error && prompts.length === 0 && (
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-12 shadow-sm border border-blue-200 text-center">
            <div className="space-y-6">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto">
                <FileText className="w-12 h-12 text-blue-600" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-gray-900">Your prompt library is empty</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Start creating amazing prompts to see them organized here. Each prompt becomes part of your personal AI toolkit!
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  asChild 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl px-8 py-3 font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  <a href="/builder">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Create Your First Prompt
                  </a>
                </Button>
                <Button 
                  asChild 
                  variant="outline"
                  className="rounded-xl px-6 py-3 border-2 border-blue-200 hover:border-blue-300"
                >
                  <a href="/templates">
                    <Eye className="h-4 w-4 mr-2" />
                    Browse Templates
                  </a>
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced No Search Results State */}
        {!loading && !error && prompts.length > 0 && filteredAndSortedPrompts.length === 0 && searchQuery && (
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900">No prompts found</h3>
                <p className="text-gray-500">
                  Try adjusting your search terms or{' '}
                  <button
                    onClick={() => setSearchQuery('')}
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    clear the search
                  </button>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Prompts Display */}
        {!loading && !error && filteredAndSortedPrompts.length > 0 && (
          <div className={`w-full ${
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' 
              : 'flex flex-col space-y-6'
          }`}>
            {filteredAndSortedPrompts.map((savedPrompt) => {
              const isExpanded = expandedPrompts.has(savedPrompt.id)
              const promptPreview = savedPrompt.prompt.substring(0, 200)
              const isLongPrompt = savedPrompt.prompt.length > 200
              
              return (
                <div
                  key={savedPrompt.id}
                  className={`group relative bg-white rounded-xl border-2 shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-[1.02] border-gray-200 hover:border-blue-300 ${recentlyDeleted === savedPrompt.id ? 'animate-pulse' : ''}`}
                >

                  
                  {/* Card Header */}
                  <div className="p-4 pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 text-lg leading-tight line-clamp-2 mb-2">
                          {savedPrompt.app_idea}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(savedPrompt.created_at).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            {savedPrompt.prompt.length} chars
                          </div>
                        </div>
                      </div>
                      

                    </div>
                  </div>
                  
                  {/* Prompt Content */}
                  <div className="px-4 pb-4">
                    <div className="relative">
                      <div className={`bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg border border-gray-200 p-4 transition-all duration-300 ${
                        isExpanded ? 'max-h-none' : 'max-h-32 overflow-hidden'
                      }`}>
                        <pre className="text-sm text-gray-700 font-mono whitespace-pre-wrap leading-relaxed">
                          {isExpanded ? savedPrompt.prompt : promptPreview}
                          {!isExpanded && isLongPrompt && '...'}
                        </pre>
                      </div>
                      
                      {/* Expand/Collapse Button */}
                      {isLongPrompt && (
                        <button
                          onClick={() => togglePromptExpansion(savedPrompt.id)}
                          className="absolute bottom-2 right-2 bg-white shadow-md rounded-lg px-3 py-1 text-xs font-medium text-blue-600 hover:text-blue-800 hover:shadow-lg transition-all"
                        >
                          {isExpanded ? 'Show Less' : 'Show More'}
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="px-4 pb-4">
                    <div className="flex gap-2 flex-wrap">
                      <Button
                        onClick={() => copyToClipboard(savedPrompt.prompt, savedPrompt.app_idea)}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg px-4 py-2 font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                      <Button
                        onClick={() => openDeleteDialog(savedPrompt)}
                        variant="outline"
                        className="px-4 py-2 border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 rounded-lg transition-all duration-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none" />
                </div>
              )
            })}
          </div>
        )}
      </main>

      {/* Enhanced Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[600px] bg-gradient-to-br from-white to-red-50">
          <DialogHeader className="pb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-red-700">Delete Prompt</DialogTitle>
                <DialogDescription className="text-gray-600 mt-1">
                  This action cannot be undone. The prompt will be permanently removed.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          {promptToDelete && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl border-2 border-red-100 shadow-sm">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-1">App Idea:</p>
                    <p className="text-gray-900 font-medium">{promptToDelete.app_idea}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-500">Created:</span>
                      <span className="font-medium text-gray-900">
                        {new Date(promptToDelete.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-500">Length:</span>
                      <span className="font-medium text-gray-900">
                        {promptToDelete.prompt.length} characters
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-lg border">
                    <p className="text-xs font-medium text-gray-600 mb-1">Prompt Preview:</p>
                    <p className="text-xs text-gray-700 font-mono line-clamp-3">
                      {promptToDelete.prompt.substring(0, 150)}...
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-semibold text-red-800 mb-1">Are you absolutely sure?</p>
                    <p className="text-red-700">
                      Once deleted, this prompt and all its data will be permanently removed from your library. 
                      Consider copying it first if you might need it later.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="flex gap-3 pt-6">
            <Button 
              variant="outline" 
              onClick={closeDeleteDialog}
              disabled={isDeleting}
              className="flex-1 sm:flex-none border-2 border-gray-200 hover:border-gray-300 rounded-xl px-6 py-3"
            >
              Keep Prompt
            </Button>
            <Button 
              onClick={deletePrompt}
              disabled={isDeleting}
              className="flex-1 sm:flex-none bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 rounded-xl px-6 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isDeleting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                  Deleting Forever...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Forever
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}