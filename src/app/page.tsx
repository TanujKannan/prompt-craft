import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Lightbulb, HelpCircle, FileText, Zap, BookOpen, Code, Sparkles } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Main Content */}
      <main className="flex-1 w-full flex flex-col items-center">
        {/* Hero Section */}
        <section className="w-full flex flex-col items-center px-6 py-16">
          <div className="w-full max-w-3xl mx-auto flex flex-col items-center text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
              Turn your app ideas into working apps with AI
            </h1>
            <p className="text-base md:text-lg text-gray-500 max-w-2xl mx-auto">
              Turn your app ideas into detailed, professional prompts that get you exactly what you want from AI coding tools like Cursor, Replit, and Lovable. No technical jargon &ndash; just clear, actionable instructions.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-2">
              <Link href="/builder">
                <Button size="lg" className="bg-black text-white rounded-md px-6 py-2 font-medium shadow hover:shadow-md hover:bg-gray-900 transition">
                  Create My App Instructions
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" size="lg" className="rounded-md px-6 py-2 font-medium border-gray-300 text-gray-700 bg-white hover:bg-gray-100 transition">
                  Learn How It Works
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* What is this section */}
        <section className="w-full flex flex-col items-center px-6 py-12 bg-blue-50">
          <div className="w-full max-w-3xl mx-auto flex flex-col items-center text-center space-y-6">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">What is PromptCraft?</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              <Card className="rounded-xl border border-blue-200 bg-white shadow-none">
                <CardHeader className="flex flex-col items-center space-y-2 pb-3">
                  <Lightbulb className="h-8 w-8 text-blue-600" />
                  <CardTitle className="text-lg font-semibold text-gray-900">You Have an App Idea</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-gray-600">
                    Maybe you want to build a task manager, an online store, or a social platform. You know what you want, but don't know how to code it.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="rounded-xl border border-blue-200 bg-white shadow-none">
                <CardHeader className="flex flex-col items-center space-y-2 pb-3">
                  <Code className="h-8 w-8 text-blue-600" />
                  <CardTitle className="text-lg font-semibold text-gray-900">AI Tools Build It</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-gray-600">
                    AI coding tools like Cursor, Claude, and ChatGPT can write code for you - but they need clear, detailed instructions to work well.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
            <div className="w-full">
              <Card className="rounded-xl border border-blue-200 bg-white shadow-none">
                <CardHeader className="flex flex-col items-center space-y-2 pb-3">
                  <FileText className="h-8 w-8 text-blue-600" />
                  <CardTitle className="text-lg font-semibold text-gray-900">We Bridge the Gap</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-gray-600">
                    PromptCraft translates your app idea into detailed, technical instructions (called "prompts") that AI tools understand perfectly. Think of us as your translator to the AI world.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="w-full flex flex-col items-center px-6 py-16">
          <div className="w-full max-w-3xl mx-auto flex flex-col items-center text-center space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">How It Works</h2>
            <p className="text-base text-gray-500">From your idea to a working app in just a few steps</p>
          </div>
          <div className="w-full max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mt-8">
            <Card className="rounded-xl border border-gray-200 bg-white shadow-none">
              <CardHeader className="flex flex-col items-center space-y-2 pb-2">
                <BookOpen className="h-6 w-6 text-gray-400" />
                <CardTitle className="text-base font-semibold text-gray-900">Pick a Template</CardTitle>
              </CardHeader>
              <CardContent className="text-center px-2 pb-4">
                <CardDescription className="text-gray-500 text-sm">
                  Choose from popular app types (like social media or e-commerce) or start with your own unique idea.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="rounded-xl border border-gray-200 bg-white shadow-none">
              <CardHeader className="flex flex-col items-center space-y-2 pb-2">
                <Lightbulb className="h-6 w-6 text-gray-400" />
                <CardTitle className="text-base font-semibold text-gray-900">Describe Your Vision</CardTitle>
              </CardHeader>
              <CardContent className="text-center px-2 pb-4">
                <CardDescription className="text-gray-500 text-sm">
                  Tell us about your app in everyday language. What problem does it solve? Who will use it?
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="rounded-xl border border-gray-200 bg-white shadow-none">
              <CardHeader className="flex flex-col items-center space-y-2 pb-2">
                <HelpCircle className="h-6 w-6 text-gray-400" />
                <CardTitle className="text-base font-semibold text-gray-900">Answer Simple Questions</CardTitle>
              </CardHeader>
              <CardContent className="text-center px-2 pb-4">
                <CardDescription className="text-gray-500 text-sm">
                  We'll ask about features you want and suggest the best technologies (don't worry, we explain everything).
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="rounded-xl border border-gray-200 bg-white shadow-none">
              <CardHeader className="flex flex-col items-center space-y-2 pb-2">
                <FileText className="h-6 w-6 text-gray-400" />
                <CardTitle className="text-base font-semibold text-gray-900">Get AI Instructions</CardTitle>
              </CardHeader>
              <CardContent className="text-center px-2 pb-4">
                <CardDescription className="text-gray-500 text-sm">
                  Receive detailed instructions that you can copy and paste into AI coding tools.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="rounded-xl border border-gray-200 bg-white shadow-none">
              <CardHeader className="flex flex-col items-center space-y-2 pb-2">
                <Zap className="h-6 w-6 text-gray-400" />
                <CardTitle className="text-base font-semibold text-gray-900">Watch AI Build It</CardTitle>
              </CardHeader>
              <CardContent className="text-center px-2 pb-4">
                <CardDescription className="text-gray-500 text-sm">
                  Paste the instructions into tools like Cursor, Claude, or ChatGPT and watch your app come to life!
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* AI Tools Explanation */}
        <section className="w-full flex flex-col items-center px-6 py-16 bg-gray-50">
          <div className="w-full max-w-3xl mx-auto flex flex-col items-center text-center space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">What Are AI Coding Tools?</h2>
            <p className="text-base text-gray-500 max-w-2xl">
              These are smart computer programs that can write code for you. Just like how you might ask ChatGPT to write an essay, you can ask these tools to build an app!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
              <Card className="rounded-xl border border-gray-200 bg-white shadow-none">
                <CardHeader className="text-center pb-3">
                  <CardTitle className="text-lg font-semibold text-gray-900">Cursor</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-gray-600 text-sm">
                    A smart code editor that writes code as you type. Perfect for beginners who want to learn while building.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="rounded-xl border border-gray-200 bg-white shadow-none">
                <CardHeader className="text-center pb-3">
                  <CardTitle className="text-lg font-semibold text-gray-900">Claude & ChatGPT</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-gray-600 text-sm">
                    AI assistants that can write complete app code when given clear instructions.
                  </CardDescription>
                </CardContent>
              </Card>
              <Card className="rounded-xl border border-gray-200 bg-white shadow-none">
                <CardHeader className="text-center pb-3">
                  <CardTitle className="text-lg font-semibold text-gray-900">Replit & Others</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-gray-600 text-sm">
                    Online platforms where you can build and run apps directly in your web browser.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full flex flex-col items-center px-6 py-16">
          <div className="w-full max-w-3xl mx-auto flex flex-col items-center text-center space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Ready to Build Your App?</h2>
            <p className="text-base text-gray-500 max-w-xl mx-auto">
              No coding experience needed. Just bring your creativity and let AI do the technical work. Your app idea could become reality in minutes, not months.
            </p>
            <Link href="/builder">
              <Button size="lg" className="bg-black text-white rounded-md px-6 py-2 font-medium shadow hover:shadow-md hover:bg-gray-900 transition">
                Start Building My App
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-gray-100 bg-white py-8 mt-auto">
        <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 gap-4 text-sm text-gray-500">
          <div className="flex flex-col items-center md:items-start">
            <span className="font-semibold text-gray-900">PromptCraft</span>
            <span>Turn ideas into AI-ready instructions</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:underline">Privacy</a>
            <a href="#" className="hover:underline">Terms</a>
            <a href="#" className="hover:underline">Support</a>
          </div>
        </div>
        <div className="text-center text-xs text-gray-400 mt-4">© 2025 PromptCraft. All rights reserved.</div>
      </footer>
    </div>
  )
}
