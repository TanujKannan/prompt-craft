import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service - PromptCraft',
  description: 'Terms of service for PromptCraft - rules and guidelines for using our service.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="bg-card rounded-lg shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold mb-8 text-center">Terms of Service</h1>
          
          <div className="prose prose-gray max-w-none">
            <p className="text-muted-foreground mb-8 text-center">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Acceptance of Terms</h2>
              <p className="mb-4">
                By accessing and using PromptCraft, you accept and agree to be bound by the terms and 
                provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Use License</h2>
              <p className="mb-4">
                Permission is granted to temporarily use PromptCraft for personal and commercial purposes. 
                This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Use the service for any illegal or unauthorized purpose</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Use the service to create harmful, offensive, or inappropriate content</li>
                <li>Reverse engineer or attempt to extract the source code</li>
                <li>Remove any copyright or other proprietary notations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">User Content</h2>
              <p className="mb-4">
                You retain ownership of the content you create using PromptCraft, including your app ideas and 
                generated prompts. By using our service, you grant us a limited license to:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Store and process your content to provide the service</li>
                <li>Use anonymous, aggregated data to improve our service</li>
              </ul>
              <p className="mb-4">
                You are responsible for ensuring that your content does not violate any laws or third-party rights.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Prohibited Uses</h2>
              <p className="mb-4">You may not use PromptCraft to:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Generate prompts for illegal activities or applications</li>
                <li>Create content that violates intellectual property rights</li>
                <li>Harass, abuse, or harm others</li>
                <li>Distribute malware or harmful code</li>
                <li>Violate any applicable laws or regulations</li>
                <li>Attempt to overwhelm our systems with excessive requests</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Service Availability</h2>
              <p className="mb-4">
                We strive to maintain high availability of our service, but we do not guarantee uninterrupted access. 
                We may temporarily suspend the service for maintenance, updates, or other operational reasons.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Disclaimer</h2>
              <p className="mb-4">
                The information on this service is provided on an "as is" basis. To the fullest extent permitted by law, 
                we exclude all representations, warranties, and conditions relating to our service and the use of this service.
              </p>
              <p className="mb-4">
                The AI-generated prompts are suggestions only. We do not guarantee their accuracy, completeness, 
                or suitability for any particular purpose.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Limitation of Liability</h2>
              <p className="mb-4">
                In no event shall PromptCraft or its suppliers be liable for any damages (including, without limitation, 
                damages for loss of data or profit, or due to business interruption) arising out of the use or inability 
                to use PromptCraft, even if we have been notified orally or in writing of the possibility of such damage.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Privacy</h2>
              <p className="mb-4">
                Your privacy is important to us. Please review our Privacy Policy, which also governs your use 
                of the service, to understand our practices.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Account Termination</h2>
              <p className="mb-4">
                We may terminate or suspend your account and access to the service immediately, without prior notice 
                or liability, for any reason whatsoever, including without limitation if you breach the Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Changes to Terms</h2>
              <p className="mb-4">
                We reserve the right to modify these terms at any time. We will notify users of any significant 
                changes by posting the new terms on this page and updating the "last updated" date.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Governing Law</h2>
              <p className="mb-4">
                These terms shall be governed and construed in accordance with applicable laws, without regard 
                to conflict of law provisions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
              <p className="mb-4">
                If you have any questions about these Terms of Service, please contact us through our support page.
              </p>
            </section>

            <div className="bg-muted/50 rounded-lg p-6 mt-8">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> These terms of service are provided for informational purposes. 
                For specific legal advice regarding terms of service compliance, please consult with a qualified attorney.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 