import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ExternalLink, Linkedin, GraduationCap, User } from 'lucide-react'

export default function Profile() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-1 w-full flex flex-col items-center">
        {/* Hero Section */}
        <section className="w-full flex flex-col items-center px-6 py-16">
          <div className="w-full max-w-4xl mx-auto flex flex-col items-center text-center space-y-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
              About the Creator
            </h1>
            <p className="text-lg text-gray-500 max-w-3xl">
              Get to know the person behind PromptCraft and the vision for making AI-powered development accessible to everyone.
            </p>
          </div>
        </section>

        {/* Personal Info Section */}
        <section className="w-full flex flex-col items-center px-6 py-12">
          <div className="w-full max-w-4xl mx-auto">
            <Card className="border border-gray-200 bg-white shadow-lg">
              <CardHeader className="text-center">
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <GraduationCap className="h-8 w-8 text-blue-600" />
                  <CardTitle className="text-2xl text-gray-900">Tanuj Kannan</CardTitle>
                </div>
                <CardDescription className="text-lg">
                  Creator of PromptCraft
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <p className="text-lg text-gray-700">
                  I am a rising senior at CWRU, studying CS and Math.
                </p>
                
                <div className="pt-4">
                  <Button asChild size="lg" className="bg-blue-600 text-white hover:bg-blue-700">
                    <Link href="https://www.linkedin.com/in/tanuj-kannan/" target="_blank" rel="noopener noreferrer">
                      <Linkedin className="h-5 w-5 mr-2" />
                      Connect on LinkedIn
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </div>

                {/* Placeholder for future content */}
                <div className="pt-8 border-t border-gray-200">
                  <p className="text-gray-500 text-sm italic">
                    More content coming soon...
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Vision Section */}
        <section className="w-full flex flex-col items-center px-6 py-16 bg-blue-50">
          <div className="w-full max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">The Vision Behind PromptCraft</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
              PromptCraft was born from the belief that great ideas shouldn't be limited by technical barriers. 
              Everyone should have the power to turn their app concepts into reality, regardless of their coding background.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/about">
                  Learn More About PromptCraft
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/builder">
                  Try Building an App
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
} 