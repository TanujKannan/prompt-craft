export interface PromptTemplate {
  id: string
  name: string
  category: string
  description: string
  icon: string
  appIdea: string
  prefilledAnswers: Record<string, { selected?: string; custom?: string }>
  features: string[]
  tags: string[]
}

export const templateCategories = [
  { id: 'productivity', name: 'Productivity', icon: '📋' },
  { id: 'ecommerce', name: 'E-commerce', icon: '🛒' },
  { id: 'social', name: 'Social Media', icon: '👥' },
  { id: 'business', name: 'Business Tools', icon: '💼' },
  { id: 'education', name: 'Education', icon: '📚' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎮' },
]

export const promptTemplates: PromptTemplate[] = [
  // Productivity Apps
  {
    id: 'task-manager',
    name: 'Task Management App',
    category: 'productivity',
    description: 'A comprehensive task and project management platform for teams',
    icon: '✅',
    appIdea: 'Build a task management application for remote teams that includes project organization, deadline tracking, team collaboration, real-time notifications, and progress analytics. Users should be able to create projects, assign tasks to team members, set priorities and due dates, attach files, comment on tasks, and track overall project progress with visual dashboards.',
    prefilledAnswers: {
      framework: { selected: 'nextjs' },
      auth: { selected: 'yes' },
      backend: { selected: 'yes' },
      database: { selected: 'supabase' },
      ui: { selected: 'shadcn' },
      features: { custom: 'Real-time notifications, file attachments, team collaboration, progress tracking, deadline management, task priorities, project dashboards, time tracking' }
    },
    features: ['Team collaboration', 'Real-time updates', 'File attachments', 'Progress tracking', 'Deadline management'],
    tags: ['productivity', 'collaboration', 'project management', 'teams']
  },
  {
    id: 'note-taking',
    name: 'Note-Taking App',
    category: 'productivity',
    description: 'A powerful note-taking and knowledge management system',
    icon: '📝',
    appIdea: 'Create a modern note-taking application with rich text editing, markdown support, organization through folders and tags, search functionality, and cross-device synchronization. Include features like linking between notes, templates for common note types, collaboration on shared notes, and the ability to embed images, links, and code snippets.',
    prefilledAnswers: {
      framework: { selected: 'nextjs' },
      auth: { selected: 'yes' },
      backend: { selected: 'yes' },
      database: { selected: 'supabase' },
      ui: { selected: 'tailwind' },
      features: { custom: 'Rich text editor, markdown support, note linking, tags and folders, search functionality, templates, collaboration, image embedding' }
    },
    features: ['Rich text editing', 'Markdown support', 'Note linking', 'Search functionality', 'Cross-device sync'],
    tags: ['productivity', 'notes', 'writing', 'knowledge management']
  },

  // E-commerce Apps
  {
    id: 'ecommerce-store',
    name: 'E-commerce Store',
    category: 'ecommerce',
    description: 'A complete online store with payment processing and inventory management',
    icon: '🛍️',
    appIdea: 'Build a modern e-commerce platform with product catalog, shopping cart, secure payment processing, user accounts, order tracking, and admin dashboard. Include features like product search and filtering, customer reviews, inventory management, discount codes, email notifications, and analytics for sales tracking.',
    prefilledAnswers: {
      framework: { selected: 'nextjs' },
      auth: { selected: 'yes' },
      backend: { selected: 'yes' },
      database: { selected: 'supabase' },
      ui: { selected: 'shadcn' },
      features: { custom: 'Product catalog, shopping cart, payment processing, user accounts, order tracking, admin dashboard, product reviews, inventory management, discount codes' }
    },
    features: ['Product catalog', 'Shopping cart', 'Payment processing', 'Order tracking', 'Admin dashboard'],
    tags: ['ecommerce', 'shopping', 'payments', 'retail']
  },
  {
    id: 'marketplace',
    name: 'Marketplace Platform',
    category: 'ecommerce',
    description: 'A multi-vendor marketplace where users can buy and sell products',
    icon: '🏪',
    appIdea: 'Create a marketplace platform where multiple vendors can list and sell their products. Include vendor registration and verification, product listing management, commission-based payments, buyer and seller ratings, dispute resolution, messaging between buyers and sellers, and comprehensive analytics for both vendors and platform administrators.',
    prefilledAnswers: {
      framework: { selected: 'nextjs' },
      auth: { selected: 'yes' },
      backend: { selected: 'yes' },
      database: { selected: 'supabase' },
      ui: { selected: 'shadcn' },
      features: { custom: 'Multi-vendor support, vendor verification, commission system, ratings and reviews, messaging, dispute resolution, analytics dashboard' }
    },
    features: ['Multi-vendor support', 'Commission system', 'Vendor verification', 'Messaging system', 'Analytics'],
    tags: ['marketplace', 'multi-vendor', 'ecommerce', 'platform']
  },

  // Social Media Apps
  {
    id: 'social-media',
    name: 'Social Media Platform',
    category: 'social',
    description: 'A social networking platform with posts, messaging, and connections',
    icon: '📱',
    appIdea: 'Build a social media platform where users can create profiles, share posts with text and images, follow other users, like and comment on posts, send direct messages, and discover new content through a personalized feed. Include features like hashtags, user mentions, story features, and privacy controls.',
    prefilledAnswers: {
      framework: { selected: 'nextjs' },
      auth: { selected: 'yes' },
      backend: { selected: 'yes' },
      database: { selected: 'supabase' },
      ui: { selected: 'tailwind' },
      features: { custom: 'User profiles, post creation, image sharing, following system, likes and comments, direct messaging, personalized feed, hashtags, stories' }
    },
    features: ['User profiles', 'Post sharing', 'Following system', 'Direct messaging', 'Personalized feed'],
    tags: ['social media', 'networking', 'posts', 'messaging']
  },
  {
    id: 'community-forum',
    name: 'Community Forum',
    category: 'social',
    description: 'A discussion forum with topics, threads, and moderation',
    icon: '💬',
    appIdea: 'Create a community forum platform with topic categories, threaded discussions, user reputation system, moderation tools, and search functionality. Include features like upvoting/downvoting posts, user badges and achievements, private messaging, notification system, and admin controls for managing the community.',
    prefilledAnswers: {
      framework: { selected: 'nextjs' },
      auth: { selected: 'yes' },
      backend: { selected: 'yes' },
      database: { selected: 'supabase' },
      ui: { selected: 'shadcn' },
      features: { custom: 'Topic categories, threaded discussions, voting system, user reputation, moderation tools, badges, private messaging, notifications' }
    },
    features: ['Threaded discussions', 'Voting system', 'User reputation', 'Moderation tools', 'Categories'],
    tags: ['forum', 'community', 'discussions', 'moderation']
  },

  // Business Tools
  {
    id: 'crm-system',
    name: 'CRM System',
    category: 'business',
    description: 'Customer relationship management with lead tracking and sales pipeline',
    icon: '📊',
    appIdea: 'Build a comprehensive CRM system for managing customer relationships, tracking leads through sales pipeline, managing contacts and companies, scheduling follow-ups, and generating sales reports. Include features like email integration, activity logging, deal tracking, custom fields, and analytics dashboard for sales performance.',
    prefilledAnswers: {
      framework: { selected: 'nextjs' },
      auth: { selected: 'yes' },
      backend: { selected: 'yes' },
      database: { selected: 'supabase' },
      ui: { selected: 'shadcn' },
      features: { custom: 'Lead management, sales pipeline, contact management, email integration, activity tracking, deal tracking, sales reports, analytics dashboard' }
    },
    features: ['Lead management', 'Sales pipeline', 'Contact management', 'Email integration', 'Analytics'],
    tags: ['crm', 'sales', 'business', 'analytics']
  },
  {
    id: 'invoice-app',
    name: 'Invoice & Billing App',
    category: 'business',
    description: 'Invoice generation and payment tracking for freelancers and small businesses',
    icon: '🧾',
    appIdea: 'Create an invoicing application for freelancers and small businesses to generate professional invoices, track payments, manage clients, and handle recurring billing. Include features like customizable invoice templates, automatic payment reminders, expense tracking, financial reporting, and integration with payment processors.',
    prefilledAnswers: {
      framework: { selected: 'nextjs' },
      auth: { selected: 'yes' },
      backend: { selected: 'yes' },
      database: { selected: 'supabase' },
      ui: { selected: 'shadcn' },
      features: { custom: 'Invoice generation, payment tracking, client management, recurring billing, payment reminders, expense tracking, financial reports, payment integration' }
    },
    features: ['Invoice generation', 'Payment tracking', 'Client management', 'Recurring billing', 'Financial reports'],
    tags: ['invoicing', 'billing', 'freelance', 'business']
  },

  // Education Apps
  {
    id: 'learning-platform',
    name: 'Online Learning Platform',
    category: 'education',
    description: 'A comprehensive e-learning platform with courses and assessments',
    icon: '🎓',
    appIdea: 'Build an online learning platform where instructors can create courses with video lessons, quizzes, and assignments, while students can enroll, track progress, and interact with content. Include features like course marketplace, student progress tracking, discussion forums, certificate generation, and payment processing for paid courses.',
    prefilledAnswers: {
      framework: { selected: 'nextjs' },
      auth: { selected: 'yes' },
      backend: { selected: 'yes' },
      database: { selected: 'supabase' },
      ui: { selected: 'shadcn' },
      features: { custom: 'Course creation, video lessons, quizzes and assignments, progress tracking, discussion forums, certificates, payment processing, course marketplace' }
    },
    features: ['Course creation', 'Video lessons', 'Progress tracking', 'Assessments', 'Certificates'],
    tags: ['education', 'elearning', 'courses', 'training']
  },

  // Entertainment Apps
  {
    id: 'music-streaming',
    name: 'Music Streaming App',
    category: 'entertainment',
    description: 'A music streaming platform with playlists and recommendations',
    icon: '🎵',
    appIdea: 'Create a music streaming application where users can discover, play, and organize music. Include features like playlist creation, music recommendations based on listening history, search functionality, artist and album pages, offline downloads, social sharing of playlists, and user-generated content like reviews and ratings.',
    prefilledAnswers: {
      framework: { selected: 'nextjs' },
      auth: { selected: 'yes' },
      backend: { selected: 'yes' },
      database: { selected: 'supabase' },
      ui: { selected: 'tailwind' },
      features: { custom: 'Music streaming, playlist creation, recommendations, search functionality, artist pages, offline downloads, social sharing, music discovery' }
    },
    features: ['Music streaming', 'Playlist creation', 'Recommendations', 'Search', 'Offline downloads'],
    tags: ['music', 'streaming', 'entertainment', 'audio']
  }
]

export function getTemplatesByCategory(category: string): PromptTemplate[] {
  return promptTemplates.filter(template => template.category === category)
}

export function getTemplateById(id: string): PromptTemplate | undefined {
  return promptTemplates.find(template => template.id === id)
} 