import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Lightbulb, MessageSquare, Code, Sparkles, HelpCircle, ArrowRight, Users, Zap, CheckCircle } from 'lucide-react'

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-1 w-full flex flex-col items-center">
        {/* Hero Section */}
        <section className="w-full flex flex-col items-center px-6 py-16">
          <div className="w-full max-w-4xl mx-auto flex flex-col items-center text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
              Turn Your App Ideas Into Reality
            </h1>
            <p className="text-lg text-gray-500 max-w-3xl">
              PromptCraft bridges the gap between your creative ideas and AI-powered app development. 
              No coding experience required – just describe what you want, and we'll create the perfect instructions for AI to build it.
            </p>
          </div>
        </section>

        {/* The Problem */}
        <section className="w-full flex flex-col items-center px-6 py-12 bg-red-50">
          <div className="w-full max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">The Challenge</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border border-red-200 bg-white">
                <CardHeader className="text-center">
                  <HelpCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                  <CardTitle className="text-lg text-gray-900">You Have Great Ideas</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600">
                    You can envision the perfect app – maybe a tool for your business, 
                    a solution to a daily problem, or the next big social platform.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border border-red-200 bg-white">
                <CardHeader className="text-center">
                  <Code className="h-8 w-8 text-red-500 mx-auto mb-2" />
                  <CardTitle className="text-lg text-gray-900">But Coding is Complex</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600">
                    Traditional app development requires years of learning programming languages, 
                    frameworks, databases, and deployment.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border border-red-200 bg-white">
                <CardHeader className="text-center">
                  <MessageSquare className="h-8 w-8 text-red-500 mx-auto mb-2" />
                  <CardTitle className="text-lg text-gray-900">AI Needs Clear Instructions</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600">
                    AI tools can build apps, but they need detailed, technical instructions 
                    to understand exactly what you want.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* The Solution */}
        <section className="w-full flex flex-col items-center px-6 py-16 bg-green-50">
          <div className="w-full max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Our Solution</h2>
            <div className="flex flex-col items-center space-y-8">
              <Card className="w-full border border-green-200 bg-white">
                <CardHeader className="text-center">
                  <Sparkles className="h-10 w-10 text-green-600 mx-auto mb-3" />
                  <CardTitle className="text-2xl text-gray-900">PromptCraft Translates Your Ideas</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-lg text-gray-600 mb-4">
                    We transform your plain-English app description into detailed, technical instructions 
                    that AI coding tools can perfectly understand and execute.
                  </p>
                  <p className="text-gray-500">
                    Think of us as your personal translator between human creativity and AI capability.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="w-full flex flex-col items-center px-6 py-16">
          <div className="w-full max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How It Works</h2>
            <div className="space-y-8">
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-blue-600">1</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">You Describe Your App</h3>
                  <p className="text-gray-600">
                    Tell us about your app idea in everyday language. What does it do? Who uses it? 
                    What problems does it solve? No technical knowledge needed.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-blue-600">2</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">We Ask Smart Questions</h3>
                  <p className="text-gray-600">
                    Our guided questionnaire helps clarify your vision. We'll ask about features, 
                    design preferences, and technical requirements – but we explain everything in simple terms.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-blue-600">3</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">We Generate Perfect Instructions</h3>
                  <p className="text-gray-600">
                    Using your answers, we create a comprehensive "prompt" – detailed instructions 
                    that tell AI exactly how to build your app, including all the technical details.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-blue-600">4</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Builds Your App</h3>
                  <p className="text-gray-600">
                    Copy our instructions and paste them into AI tools like Claude, Lovable, or Replit. 
                    Watch as the AI writes the code and builds your app exactly as you envisioned.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AI Tools Explanation */}
        <section className="w-full flex flex-col items-center px-6 py-16 bg-blue-50">
          <div className="w-full max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">What Are AI Coding Tools?</h2>
            <div className="text-center mb-8">
              <p className="text-lg text-gray-600">
                AI coding tools are like having a super-smart programmer who works 24/7 and never gets tired. 
                Just like ChatGPT can write essays, these tools can write entire applications.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border border-blue-200 bg-white">
                <CardHeader className="text-center">
                  <CardTitle className="text-lg text-gray-900">Claude</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm text-gray-600">
                    Free AI assistant by Anthropic. Great for beginners – just paste instructions and get working code.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border border-blue-200 bg-white">
                <CardHeader className="text-center">
                  <CardTitle className="text-lg text-gray-900">ChatGPT</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm text-gray-600">
                    Popular AI by OpenAI. Excellent at explaining code and walking you through building apps step by step.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border border-blue-200 bg-white">
                <CardHeader className="text-center">
                  <CardTitle className="text-lg text-gray-900">Cursor</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm text-gray-600">
                    AI-powered code editor. Perfect for learning – it writes code while teaching you how it works.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border border-blue-200 bg-white">
                <CardHeader className="text-center">
                  <CardTitle className="text-lg text-gray-900">Others</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm text-gray-600">
                    Replit, Bolt.new, and more. New AI coding tools launch every month, all getting smarter.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Who This Is For */}
        <section className="w-full flex flex-col items-center px-6 py-16">
          <div className="w-full max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Who Is This For?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="border border-gray-200 bg-white">
                <CardHeader>
                  <Users className="h-8 w-8 text-blue-600 mb-2" />
                  <CardTitle className="text-xl text-gray-900">Non-Technical Founders</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    You have a brilliant business idea but don't know how to code. 
                    You want to build an MVP quickly without learning programming or hiring expensive developers.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-gray-700">Test your idea fast</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-gray-700">No technical skills needed</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-gray-700">Save thousands on development</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border border-gray-200 bg-white">
                <CardHeader>
                  <Lightbulb className="h-8 w-8 text-blue-600 mb-2" />
                  <CardTitle className="text-xl text-gray-900">Curious Learners</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    You're interested in technology and want to understand how apps are built. 
                    You learn best by doing, but don't know where to start.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-gray-700">Learn by building real apps</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-gray-700">Understand modern tech stacks</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-gray-700">Bridge to becoming a developer</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Why It Works */}
        <section className="w-full flex flex-col items-center px-6 py-16 bg-gray-50">
          <div className="w-full max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Why This Works So Well</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border border-gray-200 bg-white">
                <CardHeader className="text-center">
                  <Zap className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <CardTitle className="text-lg text-gray-900">AI is Getting Better Every Day</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600">
                    Modern AI can write production-quality code. With the right instructions, 
                    it can build complete applications that actually work.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border border-gray-200 bg-white">
                <CardHeader className="text-center">
                  <MessageSquare className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <CardTitle className="text-lg text-gray-900">Detailed Instructions Matter</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600">
                    The difference between "build me an app" and our detailed prompts is like 
                    the difference between a sketch and architectural blueprints.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border border-gray-200 bg-white">
                <CardHeader className="text-center">
                  <Sparkles className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                  <CardTitle className="text-lg text-gray-900">We Know What Works</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600">
                    Our prompts include proven patterns, best practices, and all the technical 
                    details AI needs to build robust, scalable applications.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="w-full flex flex-col items-center px-6 py-16">
          <div className="w-full max-w-3xl mx-auto flex flex-col items-center text-center space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Ready to Turn Your Idea Into an App?</h2>
            <p className="text-lg text-gray-500">
              It takes just a few minutes to go from idea to AI-ready instructions. 
              The hardest part is deciding what to build first!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Link href="/builder">
                <Button size="lg" className="bg-black text-white rounded-md px-8 py-3 font-medium shadow hover:shadow-md hover:bg-gray-900 transition">
                  Start Building Now
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Link href="/templates">
                <Button variant="outline" size="lg" className="rounded-md px-8 py-3 font-medium">
                  Browse App Templates
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
} 