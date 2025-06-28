'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Sparkles, User, LogOut, Settings, Menu, X } from 'lucide-react'
import { useAuth } from '@/lib/auth'
import AuthModal from './AuthModal'

export default function Header() {
  const { user, signOut, loading } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

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
    try {
      await signOut()
      setShowMobileMenu(false)
      setShowUserDropdown(false)
    } catch (error) {
      console.error('Error signing out:', error)
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
            {loading ? (
              <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
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
                          className="flex items-center w-full px-3 py-2 text-sm text-foreground hover:bg-accent transition-colors"
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign out
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
                {loading ? (
                  <div className="w-full h-8 rounded bg-gray-200 animate-pulse"></div>
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
                      className="w-full"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign out
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
    </>
  )
} 