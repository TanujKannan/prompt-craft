'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from './supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  hydrated: boolean
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<void>
  signInWithGoogle: () => Promise<{ error: AuthError | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [hydrated, setHydrated] = useState(false)

  // Check for existing session on mount to reduce flash
  const [initialCheck] = useState(false)

  useEffect(() => {
    // Mark as hydrated on client side
    setHydrated(true)
    
    // Quick initial check for session
    const quickCheck = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setSession(session)
        setUser(session?.user ?? null)
        // setInitialCheck(true)
        setLoading(false)
      } catch (error) {
        console.error('Error getting initial session:', error)
        setLoading(false)
      }
    }
    
    quickCheck()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)

      // Create or update user profile when user signs up or signs in
      if (session?.user && (event === 'SIGNED_IN' || event === 'SIGNED_UP')) {
        const { error } = await supabase
          .from('profiles')
          .upsert({
            id: session.user.id,
            email: session.user.email,
            full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0],
            updated_at: new Date(),
          })
        
        if (error) {
          console.error('Error updating profile:', error)
        }
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, fullName?: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })
    return { error }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    return { error }
  }

  const signOut = async () => {
    console.log('Starting sign-out…')

    // Helper that always clears local React state
    const clearState = () => {
      setUser(null)
      setSession(null)
      setLoading(false)
    }

    // 1) Immediately clear the session locally so a page refresh does NOT restore it.
    //    This is much faster than waiting for the network request to Supabase.
    try {
      await supabase.auth.signOut({ scope: 'local' })
    } catch (err) {
      // Even if this fails, we'll still proceed. The goal is to clear local storage ASAP.
      console.warn('Local signOut threw', err)
    }

    // 2) Fire off the global network sign-out in the background – this revokes the refresh token
    //    on the Supabase backend, but we don't block the UI on it.
    const TIMEOUT_MS = 8000

    const globalSignOutPromise = supabase.auth.signOut({ scope: 'global' })

    // Start a timer that will fallback-resolve after TIMEOUT_MS so the UI doesn't hang
    const timeoutFallback = new Promise<{ error: undefined }>((resolve) => {
      setTimeout(() => {
        console.warn('Global signOut still pending after', TIMEOUT_MS, 'ms – continuing UI flow')
        resolve({ error: undefined })
      }, TIMEOUT_MS)
    })

    // Race the network request with the fallback; whichever finishes first unblocks the UI
    const { error } = await Promise.race([globalSignOutPromise, timeoutFallback])

    if (error) {
      // Log but don't disrupt the UX – we cleared session locally already.
      console.error('Supabase global signOut returned an error:', error)
    }

    clearState()
    console.log('Sign-out flow complete (local cleared, global attempted)')
  }

  const value = {
    user,
    session,
    loading,
    hydrated,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 