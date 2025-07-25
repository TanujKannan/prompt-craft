'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Sparkles, User, LogOut, Settings, Menu, X, Loader2 } from 'lucide-react'
import { useAuth } from '@/lib/auth'
import AuthModal from './AuthModal'

export default function Header() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const [signingOut, setSigningOut] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  // Ensure UI renders after client-side hydration even if context flags misbehave
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false)
      }
    }

    if (showUserDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showUserDropdown])

  const handleSignInClick = () => {
    setAuthMode('signin')
    setShowAuthModal(true)
  }

  const handleSignUpClick = () => {
    setAuthMode('signup')
    setShowAuthModal(true)
  }

  const handleSignOut = async () => {
    if (signingOut) return
    
    setSigningOut(true)
    setShowMobileMenu(false)
    setShowUserDropdown(false)
    
    try {
      await signOut()
      router.push('/')
    } catch (error) {
      // Still redirect - if signOut failed, user likely wants to leave anyway
      router.push('/')
    } finally {
      setSigningOut(false)
    }
  }

  const getUserDisplayName = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name
    }
    if (user?.email) {
      return user.email.split('@')[0]
    }
    return 'User'
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 transition-opacity hover:opacity-80">
            <Sparkles className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold tracking-tight">PromptCraft</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground relative group"
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </Link>
            <Link 
              href="/about" 
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground relative group"
            >
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </Link>
            <Link 
              href="/templates" 
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground relative group"
            >
              Templates
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </Link>
            <Link 
              href="/resources" 
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground relative group"
            >
              Resources
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </Link>
            {user && (
              <Link 
                href="/saved" 
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground relative group"
              >
                Saved Prompts
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
              </Link>
            )}
          </nav>

          {/* Desktop Auth Controls */}
          <div className="hidden md:flex items-center space-x-3">
            {!mounted ? (
              <div className="flex items-center space-x-3">
                <div className="w-20 h-8 rounded-md bg-gray-200 animate-pulse"></div>
                <div className="w-16 h-8 rounded-md bg-gray-200 animate-pulse"></div>
                <div className="w-24 h-8 rounded-md bg-gray-200 animate-pulse"></div>
              </div>
            ) : user ? (
              <div className="flex items-center space-x-3">
                <Link href="/builder">
                  <Button 
                    size="sm" 
                    className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
                  >
                    Start Building
                  </Button>
                </Link>
                <div className="relative" ref={dropdownRef}>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex items-center space-x-2"
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                  >
                    <User className="h-4 w-4" />
                    <span className="text-sm font-medium">{getUserDisplayName()}</span>
                  </Button>
                  {showUserDropdown && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-background border rounded-md shadow-lg z-50">
                      <div className="py-1">
                        <div className="px-3 py-2 text-xs text-muted-foreground border-b">
                          {user.email}
                        </div>
                        <Link 
                          href="/saved"
                          className="flex items-center px-3 py-2 text-sm text-foreground hover:bg-accent transition-colors"
                          onClick={() => setShowUserDropdown(false)}
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Saved Prompts
                        </Link>
                        <button
                          onClick={handleSignOut}
                          disabled={signingOut}
                          className="flex items-center w-full px-3 py-2 text-sm text-foreground hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {signingOut ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <LogOut className="h-4 w-4 mr-2" />
                          )}
                          {signingOut ? 'Signing out...' : 'Sign out'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Button variant="ghost" size="sm" onClick={handleSignInClick}>
                  Sign in
                </Button>
                <Button size="sm" onClick={handleSignUpClick}>
                  Sign up
                </Button>
                <Link href="/builder">
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
                  >
                    Start Building
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-9 w-9 p-0"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              {showMobileMenu ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {showMobileMenu && (
          <div className="md:hidden border-t bg-background/95 backdrop-blur-lg">
            <div className="container py-4 space-y-3">
              <Link 
                href="/" 
                className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setShowMobileMenu(false)}
              >
                Home
              </Link>
              <Link 
                href="/about" 
                className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setShowMobileMenu(false)}
              >
                About
              </Link>
              <Link 
                href="/templates" 
                className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setShowMobileMenu(false)}
              >
                Templates
              </Link>
              <Link 
                href="/resources" 
                className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setShowMobileMenu(false)}
              >
                Resources
              </Link>
              {user && (
                <Link 
                  href="/saved" 
                  className="block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Saved Prompts
                </Link>
              )}
              
              <div className="pt-3 border-t space-y-3">
                {!mounted ? (
                  <div className="space-y-3">
                    <div className="w-32 h-4 rounded bg-gray-200 animate-pulse"></div>
                    <div className="w-full h-8 rounded-md bg-gray-200 animate-pulse"></div>
                    <div className="w-full h-8 rounded-md bg-gray-200 animate-pulse"></div>
                  </div>
                ) : user ? (
                  <div className="space-y-3">
                    <div className="text-sm text-muted-foreground">
                      Signed in as {getUserDisplayName()}
                    </div>
                    <Link href="/builder" onClick={() => setShowMobileMenu(false)}>
                      <Button size="sm" className="w-full">
                        Start Building
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleSignOut}
                      disabled={signingOut}
                      className="w-full"
                    >
                      {signingOut ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <LogOut className="h-4 w-4 mr-2" />
                      )}
                      {signingOut ? 'Signing out...' : 'Sign out'}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleSignInClick}
                      className="w-full"
                    >
                      Sign in
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={handleSignUpClick}
                      className="w-full"
                    >
                      Sign up
                    </Button>
                    <Link href="/builder" onClick={() => setShowMobileMenu(false)}>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="w-full"
                      >
                        Start Building
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        defaultMode={authMode}
      />

      {/* Sign Out Loading Popup */}
      <Dialog open={signingOut} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-[400px] [&>button]:hidden">
          <DialogHeader>
            <div className="flex flex-col items-center space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <Loader2 className="h-8 w-8 text-gray-600 animate-spin" />
              </div>
              <div className="text-center">
                <DialogTitle className="text-xl font-semibold text-gray-900">
                  Signing Out
                </DialogTitle>
                <DialogDescription className="text-gray-600 mt-2">
                  Please wait while we sign you out securely...
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  )
} 