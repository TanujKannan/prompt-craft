import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy - PromptCraft',
  description: 'Privacy policy for PromptCraft - how we collect, use, and protect your data.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="bg-card rounded-lg shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold mb-8 text-center">Privacy Policy</h1>
          
          <div className="prose prose-gray max-w-none">
            <p className="text-muted-foreground mb-8 text-center">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
              <p className="mb-4">
                When you use PromptCraft, we may collect the following information:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li><strong>Account Information:</strong> Email address and profile information when you create an account</li>
                <li><strong>App Ideas and Prompts:</strong> The content you create and save within the application</li>
                <li><strong>Usage Data:</strong> Information about how you interact with our service</li>
                <li><strong>Technical Information:</strong> IP address, browser type, and device information for security and functionality</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
              <p className="mb-4">We use the information we collect to:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Provide and maintain our service</li>
                <li>Generate AI-powered prompts based on your input</li>
                <li>Save and organize your created prompts</li>
                <li>Improve our service and user experience</li>
                <li>Communicate with you about your account or our service</li>
                <li>Ensure security and prevent misuse</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Information Sharing</h2>
              <p className="mb-4">
                We do not sell, trade, or otherwise transfer your personal information to third parties, except:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>To trusted service providers who help us operate our service (like our hosting and authentication providers)</li>
                <li>When required by law or to protect our rights and safety</li>
                <li>With your explicit consent</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
              <p className="mb-4">
                We implement appropriate security measures to protect your information against unauthorized access, 
                alteration, disclosure, or destruction. However, no method of transmission over the internet or 
                electronic storage is 100% secure.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
              <p className="mb-4">You have the right to:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Access the personal information we hold about you</li>
                <li>Update or correct your information</li>
                <li>Delete your account and associated data</li>
                <li>Export your saved prompts and data</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Third-Party Services</h2>
              <p className="mb-4">
                Our service integrates with third-party providers including:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li><strong>Supabase:</strong> For authentication and data storage</li>
                <li><strong>OpenAI:</strong> For AI-powered prompt generation</li>
                <li><strong>Vercel:</strong> For hosting and analytics</li>
              </ul>
              <p className="mb-4">
                These services have their own privacy policies, and we encourage you to review them.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Children's Privacy</h2>
              <p className="mb-4">
                Our service is not intended for children under 13 years of age. We do not knowingly collect 
                personal information from children under 13.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Changes to This Policy</h2>
              <p className="mb-4">
                We may update this privacy policy from time to time. We will notify you of any changes by 
                posting the new policy on this page and updating the "last updated" date.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
              <p className="mb-4">
                If you have any questions about this privacy policy or our practices, please contact us through 
                our support page or by email.
              </p>
            </section>

            <div className="bg-muted/50 rounded-lg p-6 mt-8">
              <p className="text-sm text-muted-foreground">
                <strong>Note:</strong> This privacy policy is provided for informational purposes. 
                For specific legal advice regarding privacy compliance, please consult with a qualified attorney.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 