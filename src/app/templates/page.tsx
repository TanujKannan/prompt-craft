'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { promptTemplates, templateCategories, getTemplatesByCategory, type PromptTemplate } from '@/lib/templates'
import { ArrowRight, ExternalLink } from 'lucide-react'

export default function Templates() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedTemplate, setSelectedTemplate] = useState<PromptTemplate | null>(null)

  const getFilteredTemplates = () => {
    if (selectedCategory === 'all') return promptTemplates
    return getTemplatesByCategory(selectedCategory)
  }

  const startWithTemplate = (template: PromptTemplate) => {
    // Store the selected template in localStorage and redirect to builder
    localStorage.setItem('selectedTemplate', JSON.stringify(template))
    window.location.href = '/builder'
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-white">
      <main className="w-full max-w-6xl mx-auto flex flex-col items-center px-6 py-12 space-y-12">
        {/* Header */}
        <div className="w-full flex flex-col items-center text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Ready-Made App Ideas</h1>
          <p className="text-lg text-gray-500 max-w-2xl">
            Skip the brainstorming and start with proven app concepts. Each template includes everything you need to get started, with all the technical details already figured out.
          </p>
        </div>

        {/* Category Filter */}
        <div className="w-full flex flex-col items-center space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Browse by app type</h3>
          <div className="flex flex-wrap gap-2 justify-center">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('all')}
              className="rounded-md"
            >
              Show All
            </Button>
            {templateCategories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="rounded-md"
              >
                {category.icon} {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getFilteredTemplates().map((template) => (
            <Card
              key={template.id}
              className="rounded-xl border border-gray-200 bg-white shadow-none hover:shadow-md transition-all"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{template.icon}</div>
                    <div>
                      <CardTitle className="text-lg font-semibold text-gray-900">{template.name}</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                          {templateCategories.find(cat => cat.id === template.category)?.icon} {templateCategories.find(cat => cat.id === template.category)?.name}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-gray-600 leading-relaxed">
                  {template.description}
                </CardDescription>

                {/* Features */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-900">What this app can do:</h4>
                  <div className="flex flex-wrap gap-1">
                    {template.features.map((feature, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Tech Stack Preview */}
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-900">Pre-configured for you:</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    {template.prefilledAnswers.framework && (
                      <div>Framework: {template.prefilledAnswers.framework.selected}</div>
                    )}
                    {template.prefilledAnswers.database && (
                      <div>Data storage: {template.prefilledAnswers.database.selected}</div>
                    )}
                    {template.prefilledAnswers.ui && (
                      <div>Design style: {template.prefilledAnswers.ui.selected}</div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={() => startWithTemplate(template)}
                    className="flex-1 bg-black text-white rounded-md hover:bg-gray-900 transition"
                  >
                    Build This App
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedTemplate(template)}
                    className="rounded-md"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="w-full flex flex-col items-center text-center space-y-6 pt-8">
          <h2 className="text-2xl font-bold text-gray-900">Have a different idea?</h2>
          <p className="text-base text-gray-500">
            No problem! Start from scratch and we'll help you build exactly what you have in mind.
          </p>
          <Link href="/builder">
            <Button size="lg" variant="outline" className="rounded-md px-6 py-3 font-medium">
              Build My Own App
            </Button>
          </Link>
        </div>

        {/* Template Detail Modal */}
        {selectedTemplate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-3xl">{selectedTemplate.icon}</div>
                    <div>
                      <CardTitle className="text-xl font-bold text-gray-900">{selectedTemplate.name}</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                          {templateCategories.find(cat => cat.id === selectedTemplate.category)?.icon} {templateCategories.find(cat => cat.id === selectedTemplate.category)?.name}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedTemplate(null)}
                    className="rounded-md"
                  >
                    ✕
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">What this app does</h3>
                  <p className="text-gray-600 leading-relaxed">{selectedTemplate.description}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Detailed App Description</h3>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-700 leading-relaxed">{selectedTemplate.appIdea}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {selectedTemplate.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Technical Setup (already chosen for you)</h3>
                  <div className="space-y-2">
                    {Object.entries(selectedTemplate.prefilledAnswers).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
                        <span className="text-sm font-medium text-gray-600 capitalize">{key}:</span>
                        <span className="text-sm text-gray-900">{value.selected || value.custom}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={() => startWithTemplate(selectedTemplate)}
                    className="flex-1 bg-black text-white rounded-md hover:bg-gray-900 transition"
                  >
                    Build This App
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedTemplate(null)}
                    className="rounded-md px-6"
                  >
                    Close
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
} 