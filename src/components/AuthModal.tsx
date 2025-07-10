'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useAuth } from '@/lib/auth'
import { Loader2, Mail, CheckCircle, Link as LinkIcon } from 'lucide-react'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  defaultMode?: 'signin' | 'signup'
}

export default function AuthModal({ isOpen, onClose, defaultMode = 'signin' }: AuthModalProps) {
  const [mode, setMode] = useState(defaultMode)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false)

  // 'password' = traditional sign in, 'magic' = email magic link
  const [signInMethod, setSignInMethod] = useState<'password' | 'magic'>('password')

  const { signIn, signUp, signInWithMagicLink, signInWithGoogle } = useAuth()

  // Update mode when defaultMode prop changes
  useEffect(() => {
    setMode(defaultMode)
  }, [defaultMode])

  // Reset form and mode when modal opens
  useEffect(() => {
    if (isOpen) {
      setMode(defaultMode)
      setEmail('')
      setPassword('')
      setFullName('')
      setError(null)
      setLoading(false)
      setShowEmailConfirmation(false)
      setSignInMethod('password')
    }
  }, [isOpen, defaultMode])

  const resetForm = () => {
    setEmail('')
    setPassword('')
    setFullName('')
    setError(null)
    setLoading(false)
    setShowEmailConfirmation(false)
    setSignInMethod('password')
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (mode === 'signup') {
        const { error } = await signUp(email, password, fullName)
        if (error) {
          setError(error.message)
        } else {
          // Show email confirmation message instead of closing
          setShowEmailConfirmation(true)
        }
      } else {
        if (signInMethod === 'password') {
          const { error } = await signIn(email, password)
          if (error) {
            setError(error.message)
          } else {
            handleClose()
          }
        } else {
          const { error } = await signInWithMagicLink(email)
          if (error) {
            setError(error.message)
          } else {
            setShowEmailConfirmation(true)
          }
        }
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true)
    setError(null)

    try {
      const { error } = await signInWithGoogle()
      if (error) {
        setError(error.message)
      }
      // Don't close modal here - let the auth state change handle it
    } catch (err) {
      setError('An unexpected error occurred with Google sign in')
    } finally {
      setGoogleLoading(false)
    }
  }

  // Email confirmation success view
  if (showEmailConfirmation) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <div className="flex flex-col items-center space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div className="text-center">
                <DialogTitle className="text-xl font-semibold text-gray-900">
                  Check your email
                </DialogTitle>
                <DialogDescription className="text-gray-600 mt-2">
                  We&apos;ve sent a confirmation link to <strong>{email}</strong>
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">What&apos;s next?</h3>
              <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                <li>Check your email inbox (and spam folder)</li>
                <li>Click the confirmation link in the email</li>
                <li>Come back here and sign in</li>
              </ol>
            </div>

            <div className="text-sm text-gray-500 text-center">
              Didn&apos;t receive the email? Check your spam folder or{' '}
              <button
                type="button"
                onClick={() => {
                  setShowEmailConfirmation(false)
                  setMode('signup')
                }}
                className="text-blue-600 hover:underline font-medium"
              >
                try again
              </button>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowEmailConfirmation(false)
                  setMode('signin')
                }}
                className="flex-1"
              >
                Sign In Instead
              </Button>
              <Button onClick={handleClose} className="flex-1">
                Got It
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === 'signin' ? 'Welcome back' : 'Create your account'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'signin' 
              ? 'Sign in to your account to access your saved prompts and continue building.' 
              : 'Sign up to save your prompts and access them from anywhere.'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Google Sign In Button */}
          <Button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            variant="outline"
            className="w-full relative"
          >
            {googleLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <svg
                className="mr-2 h-4 w-4"
                aria-hidden="true"
                focusable="false"
                data-prefix="fab"
                data-icon="google"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 488 512"
              >
                <path
                  fill="currentColor"
                  d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h240z"
                />
              </svg>
            )}
            Continue with Google
          </Button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with email
              </span>
            </div>
          </div>

          {/* Email/Password or Magic Link Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div className="space-y-2">
                <Label htmlFor="fullName">Full name</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {signInMethod === 'password' && (
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required={signInMethod === 'password'}
                  minLength={6}
                />
              </div>
            )}

            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : signInMethod === 'password' ? (
                <Mail className="mr-2 h-4 w-4" />
              ) : (
                <LinkIcon className="mr-2 h-4 w-4" />
              )}
              {mode === 'signin'
                ? signInMethod === 'password'
                  ? 'Sign in'
                  : 'Send magic link'
                : 'Create account'}
            </Button>

            {mode === 'signin' && (
              <div className="text-xs text-center text-gray-500">
                {signInMethod === 'password' ? (
                  <button
                    type="button"
                    onClick={() => setSignInMethod('magic')}
                    className="text-primary hover:underline font-medium mt-2"
                  >
                    Sign in with magic link instead
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setSignInMethod('password')}
                    className="text-primary hover:underline font-medium mt-2"
                  >
                    Use password instead
                  </button>
                )}
              </div>
            )}
          </form>

          {/* Toggle Mode */}
          <div className="text-center text-sm">
            {mode === 'signin' ? (
              <>
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="text-primary hover:underline font-medium"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className="text-primary hover:underline font-medium"
                >
                  Sign in
                </button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 