import Link from 'next/link'
import { Sparkles, Mail, Github, Twitter } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold tracking-tight">PromptCraft</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Transform your app ideas into detailed, implementation-ready prompts for AI coding tools.
            </p>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Product</h4>
            <nav className="space-y-2">
              <Link 
                href="/" 
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Home
              </Link>
              <Link 
                href="/builder" 
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Build Your App
              </Link>
              <Link 
                href="/templates" 
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Templates
              </Link>
              <Link 
                href="/about" 
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                About
              </Link>
              <Link 
                href="/resources" 
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Resources
              </Link>
            </nav>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Support</h4>
            <nav className="space-y-2">
              <Link 
                href="/support" 
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Help Center
              </Link>
              <Link 
                href="/support" 
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Contact Us
              </Link>
              <Link 
                href="/creator" 
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                About the Creator
              </Link>
              <a 
                href="mailto:support@promptcraft.app" 
                className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail className="h-3 w-3 mr-1" />
                Email Support
              </a>
            </nav>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Legal</h4>
            <nav className="space-y-2">
              <Link 
                href="/privacy" 
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Privacy Policy
              </Link>
              <Link 
                href="/terms" 
                className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Terms of Service
              </Link>
            </nav>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-8 pt-8 border-t border-border/40 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-muted-foreground">
            © {currentYear} PromptCraft. All rights reserved.
          </div>
          
          {/* Social links (placeholder for future use) */}
          <div className="flex items-center space-x-4">
            <a 
              href="#" 
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="h-4 w-4" />
            </a>
            <a 
              href="#" 
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
} 