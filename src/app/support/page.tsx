import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Mail, MessageCircle, Book, AlertCircle, Lightbulb, Shield } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Support - PromptCraft',
  description: 'Get help with PromptCraft - FAQs, guides, and contact information.',
}

export default function SupportPage() {
  const faqs = [
    {
      question: "How do I create my first prompt?",
      answer: "Start by clicking 'Build Your App' on the homepage. Enter your app idea, then answer the AI-generated questions to help us understand your requirements. Finally, we'll generate a detailed prompt you can use in AI coding tools."
    },
    {
      question: "What AI coding tools work with PromptCraft prompts?",
      answer: "Our prompts are designed to work with popular AI coding tools like Cursor, Replit, Claude, ChatGPT, and other code generation platforms. Simply copy the generated prompt and paste it into your preferred tool."
    },
    {
      question: "Do I need to create an account?",
      answer: "You can use PromptCraft without an account, but creating one allows you to save your prompts for future reference and access them from any device."
    },
    {
      question: "How are my saved prompts stored?",
      answer: "Your saved prompts are securely stored in our database and are only accessible to you when you're signed in to your account. We use industry-standard security measures to protect your data."
    },
    {
      question: "Is there a limit to how many prompts I can generate?",
      answer: "We have rate limiting in place to ensure fair usage (10 prompts per 15-minute window). This helps us maintain service quality for all users while preventing abuse."
    },
    {
      question: "Can I edit or modify generated prompts?",
      answer: "Yes! Once a prompt is generated, you can copy it and modify it as needed. The generated prompts are starting points that you can customize for your specific requirements."
    },
    {
      question: "What if the AI doesn't understand my app idea?",
      answer: "Try to be more specific about your app's core functionality. Include details about the main features, target users, and any specific technologies you prefer. The AI will ask clarifying questions to better understand your needs."
    },
    {
      question: "How do I delete my account and data?",
      answer: "You can delete your account by contacting our support team. We'll remove all your personal data and saved prompts in accordance with our privacy policy."
    }
  ]

  const contactOptions = [
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us a detailed message about your issue",
      action: "Contact via Email",
      color: "blue"
    },
    {
      icon: MessageCircle,
      title: "Community Discussions",
      description: "Join discussions with other PromptCraft users",
      action: "Join Community",
      color: "green"
    },
    {
      icon: Book,
      title: "Documentation",
      description: "Browse our guides and tutorials",
      action: "View Docs",
      color: "purple"
    }
  ]

  const troubleshooting = [
    {
      icon: AlertCircle,
      title: "Prompt Generation Failed",
      description: "If prompt generation fails, check your internet connection and try again. If the issue persists, you may have hit the rate limit."
    },
    {
      icon: Shield,
      title: "Account Issues",
      description: "For login problems, check your email for confirmation links. If you forgot your password, use the reset option on the sign-in page."
    },
    {
      icon: Lightbulb,
      title: "Improving Prompt Quality",
      description: "Be specific about your app's purpose, mention preferred technologies, and provide clear feature requirements for better results."
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Support Center</h1>
          <p className="text-xl text-muted-foreground">
            Get help with PromptCraft and find answers to common questions
          </p>
        </div>

        {/* Contact Options */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {contactOptions.map((option, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className={`w-12 h-12 rounded-full bg-${option.color}-100 flex items-center justify-center mx-auto mb-4`}>
                  <option.icon className={`h-6 w-6 text-${option.color}-600`} />
                </div>
                <CardTitle className="text-lg">{option.title}</CardTitle>
                <CardDescription>{option.description}</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                  {option.action}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Troubleshooting */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Quick Troubleshooting</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {troubleshooting.map((item, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <item.icon className="h-5 w-5 text-orange-500" />
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
          <div className="grid gap-4">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg text-left">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Service Status */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              Service Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              All systems operational. Last updated: {new Date().toLocaleString()}
            </p>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between items-center">
                <span>Prompt Generation</span>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Operational
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>User Authentication</span>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Operational
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Saved Prompts</span>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Operational
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Still Need Help?</CardTitle>
            <CardDescription>
              Can't find what you're looking for? We're here to help!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-muted-foreground">
              For technical issues, feature requests, or general questions, please reach out to our support team. 
              We typically respond within 24 hours during business days.
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p><strong>Response Time:</strong> Within 24 hours (business days)</p>
              <p><strong>Support Hours:</strong> Monday - Friday, 9 AM - 5 PM PST</p>
              <p><strong>Languages:</strong> English</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 