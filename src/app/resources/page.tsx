import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ExternalLink, Code, Database, Zap, Monitor, Globe, Server, Wrench, Book, Play, Download, Cpu, Bot, Cloud } from 'lucide-react'

export default function Resources() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-1 w-full flex flex-col items-center">
        {/* Hero Section */}
        <section className="w-full flex flex-col items-center px-6 py-16">
          <div className="w-full max-w-4xl mx-auto flex flex-col items-center text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
              Development Resources
            </h1>
            <p className="text-lg text-gray-500 max-w-3xl">
              Everything you need to turn your PromptCraft-generated instructions into working applications.
              From AI coding tools to database setup guides - we've got you covered.
            </p>
          </div>
        </section>

        {/* AI Coding Tools */}
        <section className="w-full flex flex-col items-center px-6 py-12 bg-blue-50">
          <div className="w-full max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">AI Coding Tools</h2>
            <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
              These AI-powered platforms can take your PromptCraft instructions and build complete applications.
              Each has different strengths - choose the one that fits your needs and experience level.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Cursor */}
              <Card className="border border-blue-200 bg-white hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <Monitor className="h-8 w-8 text-blue-600" />
                    <div>
                      <CardTitle className="text-xl text-gray-900">Cursor</CardTitle>
                      <CardDescription>AI-powered code editor</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    The best AI code editor. Perfect for beginners and pros alike. Ctrl+K to chat with AI about your code.
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="text-sm text-gray-500">✓ Free tier available</div>
                    <div className="text-sm text-gray-500">✓ Built-in AI assistant</div>
                    <div className="text-sm text-gray-500">✓ Code explanation & debugging</div>
                    <div className="text-sm text-gray-500">✓ Works with all languages</div>
                  </div>
                  <Button asChild className="w-full">
                    <Link href="https://cursor.sh" target="_blank" rel="noopener noreferrer">
                      <Download className="h-4 w-4 mr-2" />
                      Download Cursor
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Lovable */}
              <Card className="border border-purple-200 bg-white hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <Zap className="h-8 w-8 text-purple-600" />
                    <div>
                      <CardTitle className="text-xl text-gray-900">Lovable</CardTitle>
                      <CardDescription>Full-stack app builder</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Build and deploy complete web apps in minutes. Just paste your PromptCraft instructions and watch it build.
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="text-sm text-gray-500">✓ No coding required</div>
                    <div className="text-sm text-gray-500">✓ Instant deployment</div>
                    <div className="text-sm text-gray-500">✓ Full-stack apps</div>
                    <div className="text-sm text-gray-500">✓ Real-time preview</div>
                  </div>
                  <Button asChild className="w-full">
                    <Link href="https://lovable.dev" target="_blank" rel="noopener noreferrer">
                      <Play className="h-4 w-4 mr-2" />
                      Try Lovable
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Replit */}
              <Card className="border border-green-200 bg-white hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <Code className="h-8 w-8 text-green-600" />
                    <div>
                      <CardTitle className="text-xl text-gray-900">Replit</CardTitle>
                      <CardDescription>Cloud development platform</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Code, collaborate, and deploy from your browser. Great for learning and prototyping with AI assistance.
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="text-sm text-gray-500">✓ No setup required</div>
                    <div className="text-sm text-gray-500">✓ Built-in AI helper</div>
                    <div className="text-sm text-gray-500">✓ Instant hosting</div>
                    <div className="text-sm text-gray-500">✓ Collaborative coding</div>
                  </div>
                  <Button asChild className="w-full">
                    <Link href="https://replit.com" target="_blank" rel="noopener noreferrer">
                      <Globe className="h-4 w-4 mr-2" />
                      Open Replit
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Claude */}
              <Card className="border border-orange-200 bg-white hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <Bot className="h-8 w-8 text-orange-600" />
                    <div>
                      <CardTitle className="text-xl text-gray-900">Claude</CardTitle>
                      <CardDescription>AI assistant by Anthropic</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Excellent at writing and explaining code. Perfect for beginners who want to understand what they're building.
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="text-sm text-gray-500">✓ Free tier available</div>
                    <div className="text-sm text-gray-500">✓ Detailed explanations</div>
                    <div className="text-sm text-gray-500">✓ Code generation</div>
                    <div className="text-sm text-gray-500">✓ Debugging help</div>
                  </div>
                  <Button asChild className="w-full">
                    <Link href="https://claude.ai" target="_blank" rel="noopener noreferrer">
                      <Bot className="h-4 w-4 mr-2" />
                      Chat with Claude
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* ChatGPT */}
              <Card className="border border-teal-200 bg-white hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <Cpu className="h-8 w-8 text-teal-600" />
                    <div>
                      <CardTitle className="text-xl text-gray-900">ChatGPT</CardTitle>
                      <CardDescription>AI assistant by OpenAI</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Popular AI assistant great for coding help, step-by-step tutorials, and problem-solving.
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="text-sm text-gray-500">✓ Free tier available</div>
                    <div className="text-sm text-gray-500">✓ Step-by-step guidance</div>
                    <div className="text-sm text-gray-500">✓ Code generation</div>
                    <div className="text-sm text-gray-500">✓ Problem solving</div>
                  </div>
                  <Button asChild className="w-full">
                    <Link href="https://chat.openai.com" target="_blank" rel="noopener noreferrer">
                      <Cpu className="h-4 w-4 mr-2" />
                      Open ChatGPT
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Bolt.new */}
              <Card className="border border-yellow-200 bg-white hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <Zap className="h-8 w-8 text-yellow-600" />
                    <div>
                      <CardTitle className="text-xl text-gray-900">Bolt.new</CardTitle>
                      <CardDescription>StackBlitz's AI app builder</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Build full-stack web apps instantly with AI. Great for rapid prototyping and getting ideas off the ground.
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="text-sm text-gray-500">✓ No setup required</div>
                    <div className="text-sm text-gray-500">✓ Full-stack support</div>
                    <div className="text-sm text-gray-500">✓ Live preview</div>
                    <div className="text-sm text-gray-500">✓ Instant deployment</div>
                  </div>
                  <Button asChild className="w-full">
                    <Link href="https://bolt.new" target="_blank" rel="noopener noreferrer">
                      <Zap className="h-4 w-4 mr-2" />
                      Try Bolt.new
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Database & Backend Services */}
        <section className="w-full flex flex-col items-center px-6 py-16">
          <div className="w-full max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Database & Backend Services</h2>
            <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
              Modern apps need databases and backend services. These platforms make it easy to get started
              without managing servers or complex infrastructure.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Supabase */}
              <Card className="border border-emerald-200 bg-white hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <Database className="h-8 w-8 text-emerald-600" />
                    <div>
                      <CardTitle className="text-xl text-gray-900">Supabase</CardTitle>
                      <CardDescription>Open-source Firebase alternative</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    PostgreSQL database with real-time features, authentication, and storage. Perfect for modern web apps.
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="text-sm text-gray-500">✓ Free tier (2 projects)</div>
                    <div className="text-sm text-gray-500">✓ Real-time subscriptions</div>
                    <div className="text-sm text-gray-500">✓ Built-in authentication</div>
                    <div className="text-sm text-gray-500">✓ File storage</div>
                  </div>
                  <div className="space-y-2">
                    <Button asChild className="w-full" size="sm">
                      <Link href="https://supabase.com" target="_blank" rel="noopener noreferrer">
                        <Globe className="h-4 w-4 mr-2" />
                        Get Started
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full" size="sm">
                      <Link href="https://supabase.com/docs" target="_blank" rel="noopener noreferrer">
                        <Book className="h-4 w-4 mr-2" />
                        Documentation
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Firebase */}
              <Card className="border border-amber-200 bg-white hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <Server className="h-8 w-8 text-amber-600" />
                    <div>
                      <CardTitle className="text-xl text-gray-900">Firebase</CardTitle>
                      <CardDescription>Google's app development platform</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Complete app development platform with NoSQL database, authentication, hosting, and analytics.
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="text-sm text-gray-500">✓ Generous free tier</div>
                    <div className="text-sm text-gray-500">✓ Real-time database</div>
                    <div className="text-sm text-gray-500">✓ Easy authentication</div>
                    <div className="text-sm text-gray-500">✓ Free hosting</div>
                  </div>
                  <div className="space-y-2">
                    <Button asChild className="w-full" size="sm">
                      <Link href="https://firebase.google.com" target="_blank" rel="noopener noreferrer">
                        <Globe className="h-4 w-4 mr-2" />
                        Get Started
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full" size="sm">
                      <Link href="https://firebase.google.com/docs" target="_blank" rel="noopener noreferrer">
                        <Book className="h-4 w-4 mr-2" />
                        Documentation
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* PlanetScale */}
              <Card className="border border-violet-200 bg-white hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <Cloud className="h-8 w-8 text-violet-600" />
                    <div>
                      <CardTitle className="text-xl text-gray-900">PlanetScale</CardTitle>
                      <CardDescription>Serverless MySQL platform</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Serverless MySQL database with branching, like Git for your database. Great for production apps.
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="text-sm text-gray-500">✓ Free tier available</div>
                    <div className="text-sm text-gray-500">✓ Database branching</div>
                    <div className="text-sm text-gray-500">✓ No connection limits</div>
                    <div className="text-sm text-gray-500">✓ Automatic scaling</div>
                  </div>
                  <div className="space-y-2">
                    <Button asChild className="w-full" size="sm">
                      <Link href="https://planetscale.com" target="_blank" rel="noopener noreferrer">
                        <Globe className="h-4 w-4 mr-2" />
                        Get Started
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full" size="sm">
                      <Link href="https://planetscale.com/docs" target="_blank" rel="noopener noreferrer">
                        <Book className="h-4 w-4 mr-2" />
                        Documentation
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Setup Guides */}
        <section className="w-full flex flex-col items-center px-6 py-16 bg-gray-50">
          <div className="w-full max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Quick Setup Guides</h2>
            <p className="text-center text-gray-600 mb-12">
              Step-by-step instructions to get your development environment ready.
            </p>
            
            <div className="space-y-6">
              {/* Supabase Setup */}
              <Card className="border border-gray-200 bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl text-gray-900">
                    <Database className="h-6 w-6 mr-3 text-emerald-600" />
                    Setting Up Supabase
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="pl-6 border-l-2 border-emerald-200">
                      <h4 className="font-semibold mb-2">1. Create Account & Project</h4>
                      <p className="text-gray-600 text-sm mb-2">Go to supabase.com, sign up, and create a new project. Choose a database password you'll remember.</p>
                    </div>
                    <div className="pl-6 border-l-2 border-emerald-200">
                      <h4 className="font-semibold mb-2">2. Get Your API Keys</h4>
                      <p className="text-gray-600 text-sm mb-2">In your project dashboard, go to Settings → API. Copy your project URL and anon public key.</p>
                    </div>
                    <div className="pl-6 border-l-2 border-emerald-200">
                      <h4 className="font-semibold mb-2">3. Add to Your App</h4>
                      <p className="text-gray-600 text-sm mb-2">Add these to your environment variables as NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.</p>
                    </div>
                    <Button asChild variant="outline" size="sm">
                      <Link href="https://supabase.com/docs/guides/getting-started" target="_blank" rel="noopener noreferrer">
                        <Book className="h-4 w-4 mr-2" />
                        Full Setup Guide
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Development Environment */}
              <Card className="border border-gray-200 bg-white">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl text-gray-900">
                    <Wrench className="h-6 w-6 mr-3 text-blue-600" />
                    Development Environment Setup
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="pl-6 border-l-2 border-blue-200">
                      <h4 className="font-semibold mb-2">1. Install Node.js</h4>
                      <p className="text-gray-600 text-sm mb-2">Download and install Node.js from nodejs.org (use the LTS version).</p>
                    </div>
                    <div className="pl-6 border-l-2 border-blue-200">
                      <h4 className="font-semibold mb-2">2. Install Cursor</h4>
                      <p className="text-gray-600 text-sm mb-2">Download Cursor from cursor.sh - it's like VS Code but with AI superpowers.</p>
                    </div>
                    <div className="pl-6 border-l-2 border-blue-200">
                      <h4 className="font-semibold mb-2">3. Create Your First App</h4>
                      <p className="text-gray-600 text-sm mb-2">Use "npx create-next-app@latest my-app" in terminal, then open in Cursor and start building!</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="w-full flex flex-col items-center px-6 py-16 bg-blue-600 text-white">
          <div className="w-full max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Build Your App?</h2>
            <p className="text-blue-100 mb-8 text-lg">
              Now that you know about all these amazing tools, create your first prompt with PromptCraft 
              and bring your app idea to life!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary">
                <Link href="/templates">
                  Browse Templates
                </Link>
              </Button>
              <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-blue-50 border-0">
                <Link href="/builder">
                  Start Building
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
} 