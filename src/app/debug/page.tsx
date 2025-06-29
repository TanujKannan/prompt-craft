'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { useAuth } from '@/lib/auth'
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react'

interface TestResult {
  name: string
  status: 'success' | 'error' | 'warning'
  message: string
  details?: any
}

export default function DebugPage() {
  const { user } = useAuth()
  const [results, setResults] = useState<TestResult[]>([])
  const [testing, setTesting] = useState(false)

  const addResult = (result: TestResult) => {
    setResults(prev => [...prev, result])
  }

  const runDiagnostics = async () => {
    setTesting(true)
    setResults([])

    // Test 1: Environment Variables
    addResult({
      name: 'Environment Variables',
      status: isSupabaseConfigured() ? 'success' : 'error',
      message: isSupabaseConfigured() 
        ? 'Supabase environment variables are configured' 
        : 'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY',
      details: {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL?.slice(0, 30) + '...',
        hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      }
    })

    // Test 2: Basic Connection
    try {
      const { data, error } = await supabase.from('profiles').select('count').limit(1)
      addResult({
        name: 'Basic Database Connection',
        status: error ? 'error' : 'success',
        message: error ? `Connection failed: ${error.message}` : 'Successfully connected to database',
        details: { data, error }
      })
    } catch (err) {
      addResult({
        name: 'Basic Database Connection',
        status: 'error',
        message: `Connection error: ${err}`,
        details: err
      })
    }

    // Test 3: Authentication
    try {
      const { data: { user: authUser }, error } = await supabase.auth.getUser()
      addResult({
        name: 'Authentication',
        status: authUser ? 'success' : 'warning',
        message: authUser ? `Authenticated as ${authUser.email}` : 'Not authenticated',
        details: { userId: authUser?.id, email: authUser?.email }
      })
    } catch (err) {
      addResult({
        name: 'Authentication',
        status: 'error',
        message: `Auth error: ${err}`,
        details: err
      })
    }

    // Test 4: Profile Table Access
    try {
      const { data, error } = await supabase.from('profiles').select('*').limit(5)
      addResult({
        name: 'Profiles Table Access',
        status: error ? 'error' : 'success',
        message: error ? `Profile access failed: ${error.message}` : `Found ${data?.length || 0} profiles`,
        details: { data, error }
      })
    } catch (err) {
      addResult({
        name: 'Profiles Table Access',
        status: 'error',
        message: `Profile query error: ${err}`,
        details: err
      })
    }

    // Test 5: Prompt Sessions Table Access
    try {
      const { data, error } = await supabase.from('prompt_sessions').select('*').limit(5)
      addResult({
        name: 'Prompt Sessions Table Access',
        status: error ? 'error' : 'success',
        message: error ? `Sessions access failed: ${error.message}` : `Found ${data?.length || 0} sessions`,
        details: { data, error }
      })
    } catch (err) {
      addResult({
        name: 'Prompt Sessions Table Access',
        status: 'error',
        message: `Sessions query error: ${err}`,
        details: err
      })
    }

    // Test 6: Generated Prompts Table Access
    try {
      const { data, error } = await supabase.from('generated_prompts').select('*').limit(5)
      addResult({
        name: 'Generated Prompts Table Access',
        status: error ? 'error' : 'success',
        message: error ? `Prompts access failed: ${error.message}` : `Found ${data?.length || 0} generated prompts`,
        details: { data, error }
      })
    } catch (err) {
      addResult({
        name: 'Generated Prompts Table Access',
        status: 'error',
        message: `Prompts query error: ${err}`,
        details: err
      })
    }

    // Test 7: Complex Join Query (the one that's failing)
    if (user) {
      try {
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
          .limit(3)

        addResult({
          name: 'Complex Join Query (Saved Prompts)',
          status: error ? 'error' : 'success',
          message: error ? `Join query failed: ${error.message}` : `Successfully executed join query`,
          details: { data, error }
        })
      } catch (err) {
        addResult({
          name: 'Complex Join Query (Saved Prompts)',
          status: 'error',
          message: `Join query error: ${err}`,
          details: err
        })
      }
    } else {
      addResult({
        name: 'Complex Join Query (Saved Prompts)',
        status: 'warning',
        message: 'Skipped - user not authenticated',
        details: null
      })
    }

    // Test 8: RLS Policies Check
    try {
      const { data, error } = await supabase.rpc('get_policies_info')
      addResult({
        name: 'RLS Policies',
        status: error ? 'warning' : 'success',
        message: error ? 'Could not check RLS policies (function missing)' : 'RLS policies information retrieved',
        details: { data, error }
      })
    } catch (err) {
      addResult({
        name: 'RLS Policies',
        status: 'warning',
        message: 'Could not check RLS policies',
        details: err
      })
    }

    setTesting(false)
  }

  const getIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'error': return <XCircle className="w-5 h-5 text-red-600" />
      case 'warning': return <AlertCircle className="w-5 h-5 text-yellow-600" />
      default: return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'border-green-200 bg-green-50'
      case 'error': return 'border-red-200 bg-red-50'
      case 'warning': return 'border-yellow-200 bg-yellow-50'
      default: return 'border-gray-200 bg-white'
    }
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-white">
      <main className="w-full max-w-4xl mx-auto flex flex-col px-6 py-12 space-y-8">
        <section className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Supabase Diagnostics</h1>
          <p className="text-base md:text-lg text-gray-500 max-w-xl mx-auto">
            This page tests your Supabase configuration to identify any issues.
          </p>
          <Button 
            onClick={runDiagnostics} 
            disabled={testing}
            className="bg-black text-white rounded-md px-6 py-3 font-medium shadow hover:shadow-md hover:bg-gray-900 transition"
          >
            {testing ? 'Running Tests...' : 'Run Diagnostics'}
          </Button>
        </section>

        {results.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Test Results</h2>
            <div className="grid gap-4">
              {results.map((result, index) => (
                <Card key={index} className={`${getStatusColor(result.status)} shadow-none`}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center space-x-2">
                      {getIcon(result.status)}
                      <CardTitle className="text-base font-semibold">{result.name}</CardTitle>
                    </div>
                    <CardDescription className="text-sm">
                      {result.message}
                    </CardDescription>
                  </CardHeader>
                  {result.details && (
                    <CardContent>
                      <details className="mt-2">
                        <summary className="cursor-pointer text-sm font-medium text-gray-700">
                          View Details
                        </summary>
                        <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
                          {JSON.stringify(result.details, null, 2)}
                        </pre>
                      </details>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </section>
        )}

        <section className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Fix Commands</h3>
          <div className="space-y-2 text-sm">
            <p><strong>Missing environment variables?</strong> Create a <code>.env.local</code> file with your Supabase credentials.</p>
            <p><strong>Tables not found?</strong> Run the SQL scripts in your Supabase dashboard → SQL Editor.</p>
            <p><strong>Permission denied?</strong> Check your Row Level Security policies.</p>
            <p><strong>Queries timing out?</strong> Try temporarily disabling RLS on problem tables for testing.</p>
          </div>
        </section>
      </main>
    </div>
  )
} 