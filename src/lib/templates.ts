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
  { id: 'health', name: 'Health & Fitness', icon: '🏥' },
  { id: 'finance', name: 'Finance & Investment', icon: '💰' },
  { id: 'food', name: 'Food & Recipe', icon: '🍽️' },
  { id: 'travel', name: 'Travel & Transport', icon: '✈️' },
  { id: 'realestate', name: 'Real Estate', icon: '🏠' },
  { id: 'content', name: 'Content Creation', icon: '📸' },
  { id: 'utility', name: 'Utility Tools', icon: '🛠️' },
  { id: 'nonprofit', name: 'Non-profit & Charity', icon: '❤️' },
  { id: 'agriculture', name: 'Agriculture & Environment', icon: '🌱' },
  { id: 'ai', name: 'AI & Machine Learning', icon: '🤖' },
  { id: 'iot', name: 'IoT & Smart Home', icon: '🏡' },
  { id: 'gaming', name: 'Gaming', icon: '🎯' },
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
  },

  // More Productivity Apps
  {
    id: 'time-tracker',
    name: 'Time Tracking App',
    category: 'productivity',
    description: 'Track time spent on projects and tasks with detailed reporting',
    icon: '⏰',
    appIdea: 'Build a time tracking application for freelancers and teams to log hours worked on different projects and tasks. Include features like project categorization, automated time tracking, manual time entry, detailed reporting and analytics, billing integration, team time overview, and export capabilities for invoicing.',
    prefilledAnswers: {
      framework: { selected: 'nextjs' },
      auth: { selected: 'yes' },
      backend: { selected: 'yes' },
      database: { selected: 'supabase' },
      ui: { selected: 'shadcn' },
      features: { custom: 'Time tracking, project categorization, automated tracking, reporting, billing integration, team overview, export features' }
    },
    features: ['Time tracking', 'Project categorization', 'Automated tracking', 'Detailed reporting', 'Billing integration'],
    tags: ['productivity', 'time management', 'freelance', 'reporting']
  },
  {
    id: 'habit-tracker',
    name: 'Habit Tracker',
    category: 'productivity',
    description: 'Build and maintain good habits with tracking and motivation',
    icon: '📈',
    appIdea: 'Create a habit tracking application that helps users build positive habits and break bad ones. Include features like custom habit creation, daily check-ins, streak tracking, progress visualization, habit categories, reminder notifications, achievement badges, and social accountability features.',
    prefilledAnswers: {
      framework: { selected: 'react' },
      auth: { selected: 'yes' },
      backend: { selected: 'yes' },
      database: { selected: 'firebase' },
      ui: { selected: 'mui' },
      features: { custom: 'Habit creation, daily check-ins, streak tracking, progress charts, reminders, achievements, social features' }
    },
    features: ['Habit creation', 'Streak tracking', 'Progress visualization', 'Reminder notifications', 'Achievement system'],
    tags: ['productivity', 'habits', 'self-improvement', 'tracking']
  },

  // More E-commerce Apps
  {
    id: 'subscription-box',
    name: 'Subscription Box Service',
    category: 'ecommerce',
    description: 'Curated subscription boxes with recurring billing and inventory',
    icon: '📦',
    appIdea: 'Build a subscription box service where customers can subscribe to monthly curated product boxes. Include features like subscription management, recurring billing, inventory tracking, box customization options, shipping management, customer preferences, pause/resume subscriptions, and admin tools for curation.',
    prefilledAnswers: {
      framework: { selected: 'nextjs' },
      auth: { selected: 'yes' },
      backend: { selected: 'yes' },
      database: { selected: 'supabase' },
      ui: { selected: 'shadcn' },
      features: { custom: 'Subscription management, recurring billing, inventory tracking, customization, shipping, customer preferences, pause/resume' }
    },
    features: ['Subscription management', 'Recurring billing', 'Inventory tracking', 'Box customization', 'Shipping management'],
    tags: ['ecommerce', 'subscription', 'recurring', 'curation']
  },

  // Health & Fitness Apps
  {
    id: 'fitness-tracker',
    name: 'Fitness Tracking App',
    category: 'health',
    description: 'Track workouts, nutrition, and health metrics with progress monitoring',
    icon: '💪',
    appIdea: 'Create a comprehensive fitness tracking application where users can log workouts, track nutrition, monitor health metrics, and set fitness goals. Include features like exercise library, workout templates, calorie tracking, progress photos, social challenges, personal trainer connections, and integration with wearable devices.',
    prefilledAnswers: {
      framework: { selected: 'react' },
      auth: { selected: 'yes' },
      backend: { selected: 'yes' },
      database: { selected: 'firebase' },
      ui: { selected: 'mui' },
      features: { custom: 'Workout logging, nutrition tracking, health metrics, goal setting, exercise library, progress photos, social challenges, trainer connections' }
    },
    features: ['Workout logging', 'Nutrition tracking', 'Progress monitoring', 'Goal setting', 'Social challenges'],
    tags: ['health', 'fitness', 'nutrition', 'tracking', 'wellness']
  },
  {
    id: 'mental-health',
    name: 'Mental Health & Meditation',
    category: 'health',
    description: 'Mental wellness platform with meditation, mood tracking, and resources',
    icon: '🧘',
    appIdea: 'Build a mental health and wellness platform with guided meditations, mood tracking, anxiety management tools, and mental health resources. Include features like daily check-ins, personalized meditation plans, crisis support resources, progress tracking, community support groups, and professional therapist connections.',
    prefilledAnswers: {
      framework: { selected: 'nextjs' },
      auth: { selected: 'yes' },
      backend: { selected: 'yes' },
      database: { selected: 'supabase' },
      ui: { selected: 'tailwind' },
      features: { custom: 'Guided meditations, mood tracking, anxiety tools, crisis resources, check-ins, community support, therapist connections' }
    },
    features: ['Guided meditations', 'Mood tracking', 'Anxiety management', 'Crisis resources', 'Community support'],
    tags: ['mental health', 'meditation', 'wellness', 'mindfulness', 'therapy']
  },
  {
    id: 'telemedicine',
    name: 'Telemedicine Platform',
    category: 'health',
    description: 'Virtual healthcare consultations and patient management system',
    icon: '🩺',
    appIdea: 'Create a telemedicine platform connecting patients with healthcare providers for virtual consultations. Include features like appointment scheduling, video consultations, medical record management, prescription handling, payment processing, insurance verification, and follow-up care coordination.',
    prefilledAnswers: {
      framework: { selected: 'nextjs' },
      auth: { selected: 'yes' },
      backend: { selected: 'yes' },
      database: { selected: 'supabase' },
      ui: { selected: 'shadcn' },
      features: { custom: 'Appointment scheduling, video consultations, medical records, prescriptions, payments, insurance verification, follow-up care' }
    },
    features: ['Video consultations', 'Appointment scheduling', 'Medical records', 'Prescription management', 'Insurance verification'],
    tags: ['healthcare', 'telemedicine', 'medical', 'consultations', 'telehealth']
  },

  // Finance & Investment Apps
  {
    id: 'budget-tracker',
    name: 'Personal Budget Tracker',
    category: 'finance',
    description: 'Track expenses, manage budgets, and analyze spending patterns',
    icon: '💳',
    appIdea: 'Build a personal finance application for tracking expenses, creating budgets, and analyzing spending patterns. Include features like transaction categorization, bank account integration, budget alerts, financial goal setting, bill reminders, expense reporting, and savings tracking with visual charts and insights.',
    prefilledAnswers: {
      framework: { selected: 'nextjs' },
      auth: { selected: 'yes' },
      backend: { selected: 'yes' },
      database: { selected: 'supabase' },
      ui: { selected: 'shadcn' },
      features: { custom: 'Expense tracking, budget creation, spending analysis, bank integration, budget alerts, goal setting, bill reminders, savings tracking' }
    },
    features: ['Expense tracking', 'Budget creation', 'Spending analysis', 'Bank integration', 'Financial goals'],
    tags: ['finance', 'budgeting', 'expenses', 'personal finance', 'savings']
  },
  {
    id: 'investment-portfolio',
    name: 'Investment Portfolio Tracker',
    category: 'finance',
    description: 'Track investments, analyze portfolio performance, and manage assets',
    icon: '📈',
    appIdea: 'Create an investment portfolio tracking application where users can monitor their investments across different asset classes. Include features like real-time stock prices, portfolio performance analytics, dividend tracking, rebalancing suggestions, risk assessment, investment research tools, and tax optimization insights.',
    prefilledAnswers: {
      framework: { selected: 'nextjs' },
      auth: { selected: 'yes' },
      backend: { selected: 'yes' },
      database: { selected: 'supabase' },
      ui: { selected: 'shadcn' },
      features: { custom: 'Portfolio tracking, real-time prices, performance analytics, dividend tracking, rebalancing, risk assessment, research tools' }
    },
    features: ['Portfolio tracking', 'Real-time prices', 'Performance analytics', 'Risk assessment', 'Rebalancing suggestions'],
    tags: ['finance', 'investing', 'portfolio', 'stocks', 'wealth management']
  },
  {
    id: 'cryptocurrency-tracker',
    name: 'Cryptocurrency Portfolio',
    category: 'finance',
    description: 'Track crypto investments, prices, and DeFi activities',
    icon: '₿',
    appIdea: 'Build a cryptocurrency portfolio tracker with real-time price monitoring, DeFi protocol integration, and trading insights. Include features like multi-wallet support, transaction importing, staking rewards tracking, yield farming monitoring, tax reporting, price alerts, and market analysis tools.',
    prefilledAnswers: {
      framework: { selected: 'nextjs' },
      auth: { selected: 'yes' },
      backend: { selected: 'yes' },
      database: { selected: 'supabase' },
      ui: { selected: 'tailwind' },
      features: { custom: 'Multi-wallet support, transaction importing, staking tracking, yield farming, tax reporting, price alerts, market analysis' }
    },
    features: ['Multi-wallet support', 'Real-time prices', 'DeFi integration', 'Staking rewards', 'Tax reporting'],
    tags: ['cryptocurrency', 'blockchain', 'defi', 'portfolio', 'crypto']
  },

  // Food & Recipe Apps
  {
    id: 'recipe-manager',
    name: 'Recipe & Meal Planner',
    category: 'food',
    description: 'Organize recipes, plan meals, and generate shopping lists',
    icon: '🍳',
    appIdea: 'Create a recipe management and meal planning application where users can save recipes, plan weekly meals, and generate shopping lists. Include features like recipe scaling, nutritional information, dietary restrictions filtering, meal planning calendar, shopping list generation, and social recipe sharing.',
    prefilledAnswers: {
      framework: { selected: 'react' },
      auth: { selected: 'yes' },
      backend: { selected: 'yes' },
      database: { selected: 'firebase' },
      ui: { selected: 'mui' },
      features: { custom: 'Recipe management, meal planning, shopping lists, recipe scaling, nutrition info, dietary filters, social sharing' }
    },
    features: ['Recipe management', 'Meal planning', 'Shopping lists', 'Nutritional info', 'Social sharing'],
    tags: ['food', 'recipes', 'meal planning', 'cooking', 'nutrition']
  },
  {
    id: 'restaurant-app',
    name: 'Restaurant Management',
    category: 'food',
    description: 'Complete restaurant management with orders, inventory, and staff',
    icon: '🍽️',
    appIdea: 'Build a comprehensive restaurant management system with table reservations, order management, inventory tracking, staff scheduling, and customer feedback. Include features like menu management, POS integration, kitchen display system, delivery coordination, analytics dashboard, and customer loyalty programs.',
    prefilledAnswers: {
      framework: { selected: 'nextjs' },
      auth: { selected: 'yes' },
      backend: { selected: 'yes' },
      database: { selected: 'supabase' },
      ui: { selected: 'shadcn' },
      features: { custom: 'Table reservations, order management, inventory tracking, staff scheduling, menu management, POS integration, kitchen display' }
    },
    features: ['Table reservations', 'Order management', 'Inventory tracking', 'Staff scheduling', 'POS integration'],
    tags: ['restaurant', 'food service', 'management', 'hospitality', 'orders']
  },
  {
    id: 'food-delivery',
    name: 'Food Delivery Platform',
    category: 'food',
    description: 'Multi-restaurant food delivery app with real-time tracking',
    icon: '🚚',
    appIdea: 'Create a food delivery platform connecting customers with multiple restaurants and delivery drivers. Include features like restaurant discovery, menu browsing, order placement, real-time tracking, payment processing, driver assignment, rating system, and delivery optimization.',
    prefilledAnswers: {
      framework: { selected: 'nextjs' },
      auth: { selected: 'yes' },
      backend: { selected: 'yes' },
      database: { selected: 'supabase' },
      ui: { selected: 'tailwind' },
      features: { custom: 'Restaurant discovery, menu browsing, order placement, real-time tracking, payment processing, driver assignment, ratings' }
    },
    features: ['Restaurant discovery', 'Order placement', 'Real-time tracking', 'Payment processing', 'Driver assignment'],
    tags: ['food delivery', 'marketplace', 'logistics', 'restaurants', 'delivery']
  },

  // Travel & Transportation Apps
  {
    id: 'travel-planner',
    name: 'Travel Planning App',
    category: 'travel',
    description: 'Plan trips, book accommodations, and manage travel itineraries',
    icon: '🧳',
    appIdea: 'Create a comprehensive travel planning application where users can plan trips, search and book flights, hotels, and activities, create itineraries, and manage travel documents. Include features like destination recommendations, budget tracking, weather integration, travel alerts, social trip sharing, and offline access.',
    prefilledAnswers: {
      framework: { selected: 'nextjs' },
      auth: { selected: 'yes' },
      backend: { selected: 'yes' },
      database: { selected: 'supabase' },
      ui: { selected: 'shadcn' },
      features: { custom: 'Trip planning, flight/hotel booking, itinerary creation, destination recommendations, budget tracking, weather integration, social sharing' }
    },
    features: ['Trip planning', 'Booking integration', 'Itinerary management', 'Budget tracking', 'Social sharing'],
    tags: ['travel', 'planning', 'booking', 'itinerary', 'vacation']
  },
  {
    id: 'ride-sharing',
    name: 'Ride Sharing Platform',
    category: 'travel',
    description: 'Connect drivers and passengers for ride sharing services',
    icon: '🚗',
    appIdea: 'Build a ride sharing platform connecting drivers with passengers for convenient transportation. Include features like real-time matching, GPS tracking, fare calculation, payment processing, driver and passenger ratings, route optimization, and safety features like emergency contacts and trip sharing.',
    prefilledAnswers: {
      framework: { selected: 'nextjs' },
      auth: { selected: 'yes' },
      backend: { selected: 'yes' },
      database: { selected: 'supabase' },
      ui: { selected: 'tailwind' },
      features: { custom: 'Real-time matching, GPS tracking, fare calculation, payment processing, ratings, route optimization, safety features' }
    },
    features: ['Real-time matching', 'GPS tracking', 'Fare calculation', 'Payment processing', 'Safety features'],
    tags: ['transportation', 'ride sharing', 'mobility', 'gps', 'matching']
  },

  // Real Estate Apps
  {
    id: 'property-listing',
    name: 'Real Estate Listing Platform',
    category: 'realestate',
    description: 'Property search, listing, and management for buyers and agents',
    icon: '🏘️',
    appIdea: 'Create a real estate platform where agents can list properties and buyers can search, filter, and inquire about homes. Include features like advanced search filters, virtual tours, mortgage calculator, neighborhood insights, agent profiles, appointment scheduling, and lead management for real estate professionals.',
    prefilledAnswers: {
      framework: { selected: 'nextjs' },
      auth: { selected: 'yes' },
      backend: { selected: 'yes' },
      database: { selected: 'supabase' },
      ui: { selected: 'shadcn' },
      features: { custom: 'Property listings, advanced search, virtual tours, mortgage calculator, neighborhood data, agent profiles, appointment scheduling' }
    },
    features: ['Property listings', 'Advanced search', 'Virtual tours', 'Mortgage calculator', 'Agent management'],
    tags: ['real estate', 'property', 'listings', 'housing', 'agents']
  },
  {
    id: 'property-management',
    name: 'Property Management System',
    category: 'realestate',
    description: 'Manage rental properties, tenants, and maintenance requests',
    icon: '🏢',
    appIdea: 'Build a property management system for landlords and property managers to handle rental properties, tenant relationships, and maintenance. Include features like tenant screening, lease management, rent collection, maintenance requests, expense tracking, and financial reporting.',
    prefilledAnswers: {
      framework: { selected: 'nextjs' },
      auth: { selected: 'yes' },
      backend: { selected: 'yes' },
      database: { selected: 'supabase' },
      ui: { selected: 'shadcn' },
      features: { custom: 'Tenant management, lease tracking, rent collection, maintenance requests, expense tracking, financial reporting, tenant screening' }
    },
    features: ['Tenant management', 'Lease tracking', 'Rent collection', 'Maintenance requests', 'Financial reporting'],
    tags: ['property management', 'rental', 'landlord', 'tenants', 'maintenance']
  },

  // Gaming Apps
  {
    id: 'game-tournament',
    name: 'Gaming Tournament Platform',
    category: 'gaming',
    description: 'Organize and manage gaming tournaments and competitions',
    icon: '🏆',
    appIdea: 'Create a gaming tournament platform where organizers can create tournaments and players can register and compete. Include features like bracket generation, live scoring, player rankings, prize pool management, streaming integration, and community features for gamers.',
    prefilledAnswers: {
      framework: { selected: 'nextjs' },
      auth: { selected: 'yes' },
      backend: { selected: 'yes' },
      database: { selected: 'supabase' },
      ui: { selected: 'tailwind' },
      features: { custom: 'Tournament creation, bracket generation, live scoring, player rankings, prize pools, streaming integration, community features' }
    },
    features: ['Tournament creation', 'Bracket generation', 'Live scoring', 'Player rankings', 'Prize management'],
    tags: ['gaming', 'esports', 'tournaments', 'competition', 'leaderboards']
  },
  {
    id: 'game-library',
    name: 'Game Library Manager',
    category: 'gaming',
    description: 'Track gaming library, progress, and recommendations',
    icon: '🎮',
    appIdea: 'Build a game library management application where gamers can track their game collection, monitor progress, write reviews, and get recommendations. Include features like platform integration, achievement tracking, wishlist management, friend connections, and personalized game recommendations.',
    prefilledAnswers: {
      framework: { selected: 'react' },
      auth: { selected: 'yes' },
      backend: { selected: 'yes' },
      database: { selected: 'firebase' },
      ui: { selected: 'mui' },
      features: { custom: 'Game collection tracking, progress monitoring, reviews, recommendations, platform integration, achievement tracking, social features' }
    },
    features: ['Game collection', 'Progress tracking', 'Reviews', 'Recommendations', 'Social features'],
    tags: ['gaming', 'library', 'collection', 'progress', 'social']
  },

  // Content Creation Apps
  {
    id: 'content-scheduler',
    name: 'Social Media Scheduler',
    category: 'content',
    description: 'Schedule and manage social media content across platforms',
    icon: '📅',
    appIdea: 'Create a social media management tool where content creators can schedule posts across multiple platforms, analyze performance, and manage their online presence. Include features like multi-platform posting, content calendar, analytics dashboard, hashtag suggestions, and team collaboration.',
    prefilledAnswers: {
      framework: { selected: 'nextjs' },
      auth: { selected: 'yes' },
      backend: { selected: 'yes' },
      database: { selected: 'supabase' },
      ui: { selected: 'shadcn' },
      features: { custom: 'Multi-platform posting, content calendar, analytics, hashtag suggestions, team collaboration, scheduled publishing' }
    },
    features: ['Multi-platform posting', 'Content calendar', 'Analytics dashboard', 'Team collaboration', 'Scheduled publishing'],
    tags: ['social media', 'content creation', 'scheduling', 'analytics', 'marketing']
  },
  {
    id: 'podcast-platform',
    name: 'Podcast Hosting Platform',
    category: 'content',
    description: 'Host, distribute, and monetize podcasts with analytics',
    icon: '🎙️',
    appIdea: 'Build a podcast hosting and distribution platform where creators can upload episodes, manage shows, and distribute to major platforms. Include features like episode scheduling, analytics dashboard, monetization tools, listener engagement, RSS feed generation, and multi-platform distribution.',
    prefilledAnswers: {
      framework: { selected: 'nextjs' },
      auth: { selected: 'yes' },
      backend: { selected: 'yes' },
      database: { selected: 'supabase' },
      ui: { selected: 'shadcn' },
      features: { custom: 'Episode hosting, analytics, monetization, RSS feeds, distribution, listener engagement, scheduling' }
    },
    features: ['Episode hosting', 'Analytics dashboard', 'Monetization tools', 'Multi-platform distribution', 'Listener engagement'],
    tags: ['podcast', 'audio', 'content creation', 'hosting', 'monetization']
  },

  // AI & Machine Learning Apps
  {
    id: 'ai-image-generator',
    name: 'AI Image Generation Tool',
    category: 'ai',
    description: 'Generate and edit images using AI with customizable prompts',
    icon: '🎨',
    appIdea: 'Create an AI-powered image generation platform where users can create artwork, edit photos, and generate images from text prompts. Include features like style transfer, image upscaling, background removal, prompt optimization, gallery management, and collaboration tools for creative projects.',
    prefilledAnswers: {
      framework: { selected: 'nextjs' },
      auth: { selected: 'yes' },
      backend: { selected: 'yes' },
      database: { selected: 'supabase' },
      ui: { selected: 'tailwind' },
      features: { custom: 'AI image generation, style transfer, image editing, prompt optimization, gallery management, collaboration tools' }
    },
    features: ['AI image generation', 'Style transfer', 'Image editing', 'Prompt optimization', 'Gallery management'],
    tags: ['ai', 'machine learning', 'image generation', 'creativity', 'art']
  },
  {
    id: 'ai-chatbot-builder',
    name: 'AI Chatbot Builder',
    category: 'ai',
    description: 'Build and deploy custom AI chatbots for businesses',
    icon: '🤖',
    appIdea: 'Build a no-code platform for creating custom AI chatbots for websites and customer service. Include features like conversation flow design, NLP training, integration options, analytics dashboard, multi-language support, and deployment tools for various platforms.',
    prefilledAnswers: {
      framework: { selected: 'nextjs' },
      auth: { selected: 'yes' },
      backend: { selected: 'yes' },
      database: { selected: 'supabase' },
      ui: { selected: 'shadcn' },
      features: { custom: 'Chatbot builder, conversation flows, NLP training, integrations, analytics, multi-language, deployment tools' }
    },
    features: ['Chatbot builder', 'Conversation flows', 'NLP training', 'Analytics dashboard', 'Multi-platform deployment'],
    tags: ['ai', 'chatbot', 'nlp', 'automation', 'customer service']
  },

  // Utility Tools
  {
    id: 'password-manager',
    name: 'Password Manager',
    category: 'utility',
    description: 'Secure password storage and generation with encryption',
    icon: '🔐',
    appIdea: 'Create a secure password manager where users can store, generate, and autofill passwords across devices. Include features like password generation, secure encryption, biometric authentication, password health monitoring, breach monitoring, and secure sharing of credentials.',
    prefilledAnswers: {
      framework: { selected: 'nextjs' },
      auth: { selected: 'yes' },
      backend: { selected: 'yes' },
      database: { selected: 'supabase' },
      ui: { selected: 'shadcn' },
      features: { custom: 'Password storage, password generation, encryption, biometric auth, health monitoring, breach alerts, secure sharing' }
    },
    features: ['Password storage', 'Password generation', 'Secure encryption', 'Biometric auth', 'Breach monitoring'],
    tags: ['security', 'password', 'encryption', 'privacy', 'authentication']
  },
  {
    id: 'qr-code-generator',
    name: 'QR Code Generator & Analytics',
    category: 'utility',
    description: 'Generate QR codes with tracking and analytics capabilities',
    icon: '📱',
    appIdea: 'Build a QR code generation platform with analytics tracking, custom designs, and management features. Include features like bulk generation, custom branding, scan tracking, location analytics, dynamic QR codes, and integration with marketing campaigns.',
    prefilledAnswers: {
      framework: { selected: 'nextjs' },
      auth: { selected: 'yes' },
      backend: { selected: 'yes' },
      database: { selected: 'supabase' },
      ui: { selected: 'tailwind' },
      features: { custom: 'QR code generation, analytics tracking, custom designs, bulk generation, scan tracking, dynamic codes' }
    },
    features: ['QR code generation', 'Analytics tracking', 'Custom designs', 'Bulk generation', 'Scan tracking'],
    tags: ['qr code', 'analytics', 'tracking', 'marketing', 'utility']
  },

  // Non-profit & Charity Apps
  {
    id: 'donation-platform',
    name: 'Donation & Fundraising Platform',
    category: 'nonprofit',
    description: 'Platform for charitable donations and fundraising campaigns',
    icon: '💝',
    appIdea: 'Create a donation platform where non-profits can create fundraising campaigns and donors can contribute to causes they care about. Include features like campaign creation, donation processing, progress tracking, donor management, impact reporting, and social sharing to amplify reach.',
    prefilledAnswers: {
      framework: { selected: 'nextjs' },
      auth: { selected: 'yes' },
      backend: { selected: 'yes' },
      database: { selected: 'supabase' },
      ui: { selected: 'shadcn' },
      features: { custom: 'Campaign creation, donation processing, progress tracking, donor management, impact reporting, social sharing' }
    },
    features: ['Campaign creation', 'Donation processing', 'Progress tracking', 'Donor management', 'Impact reporting'],
    tags: ['nonprofit', 'charity', 'donations', 'fundraising', 'social impact']
  },

  // Agriculture & Environment Apps
  {
    id: 'farm-management',
    name: 'Smart Farm Management',
    category: 'agriculture',
    description: 'IoT-enabled farm monitoring and crop management system',
    icon: '🚜',
    appIdea: 'Build a smart farming platform that helps farmers monitor crops, manage resources, and optimize yields. Include features like weather monitoring, soil analysis, irrigation scheduling, pest tracking, harvest planning, and integration with IoT sensors for real-time field data.',
    prefilledAnswers: {
      framework: { selected: 'nextjs' },
      auth: { selected: 'yes' },
      backend: { selected: 'yes' },
      database: { selected: 'supabase' },
      ui: { selected: 'shadcn' },
      features: { custom: 'Crop monitoring, weather tracking, soil analysis, irrigation scheduling, pest management, harvest planning, IoT integration' }
    },
    features: ['Crop monitoring', 'Weather tracking', 'Soil analysis', 'Irrigation scheduling', 'IoT integration'],
    tags: ['agriculture', 'farming', 'iot', 'sustainability', 'crop management']
  },

  // IoT & Smart Home Apps
  {
    id: 'smart-home-hub',
    name: 'Smart Home Control Hub',
    category: 'iot',
    description: 'Central control system for IoT devices and home automation',
    icon: '🏠',
    appIdea: 'Create a smart home management platform where users can control and monitor all their IoT devices from a single interface. Include features like device discovery, automation rules, energy monitoring, security alerts, voice control integration, and customizable dashboards for different rooms and device types.',
    prefilledAnswers: {
      framework: { selected: 'nextjs' },
      auth: { selected: 'yes' },
      backend: { selected: 'yes' },
      database: { selected: 'supabase' },
      ui: { selected: 'shadcn' },
      features: { custom: 'Device control, automation rules, energy monitoring, security alerts, voice integration, custom dashboards, device discovery' }
    },
    features: ['Device control', 'Automation rules', 'Energy monitoring', 'Security alerts', 'Voice integration'],
    tags: ['iot', 'smart home', 'automation', 'energy', 'security']
  },
  {
    id: 'iot-sensor-platform',
    name: 'IoT Sensor Monitoring Platform',
    category: 'iot',
    description: 'Monitor and analyze data from IoT sensors across locations',
    icon: '📡',
    appIdea: 'Build an IoT sensor monitoring platform for businesses to track environmental data, equipment status, and operational metrics. Include features like real-time data visualization, alert systems, predictive analytics, multi-location management, and integration with various sensor types.',
    prefilledAnswers: {
      framework: { selected: 'nextjs' },
      auth: { selected: 'yes' },
      backend: { selected: 'yes' },
      database: { selected: 'supabase' },
      ui: { selected: 'tailwind' },
      features: { custom: 'Sensor monitoring, data visualization, alert systems, predictive analytics, multi-location support, sensor integration' }
    },
    features: ['Sensor monitoring', 'Data visualization', 'Alert systems', 'Predictive analytics', 'Multi-location support'],
    tags: ['iot', 'sensors', 'monitoring', 'analytics', 'industrial']
  },

  // More Entertainment Apps
  {
    id: 'event-ticketing',
    name: 'Event Ticketing Platform',
    category: 'entertainment',
    description: 'Create, manage, and sell tickets for events and shows',
    icon: '🎫',
    appIdea: 'Create an event ticketing platform where organizers can create events, manage seating, and sell tickets while attendees can discover and purchase tickets. Include features like seating charts, payment processing, ticket validation, event promotion, analytics, and mobile ticket scanning.',
    prefilledAnswers: {
      framework: { selected: 'nextjs' },
      auth: { selected: 'yes' },
      backend: { selected: 'yes' },
      database: { selected: 'supabase' },
      ui: { selected: 'shadcn' },
      features: { custom: 'Event creation, seating management, ticket sales, payment processing, validation, promotion, analytics, mobile scanning' }
    },
    features: ['Event creation', 'Seating management', 'Ticket sales', 'Payment processing', 'Mobile scanning'],
    tags: ['entertainment', 'events', 'tickets', 'shows', 'concerts']
  },
  {
    id: 'book-club',
    name: 'Book Club & Reading Community',
    category: 'entertainment',
    description: 'Social platform for book lovers with clubs and discussions',
    icon: '📚',
    appIdea: 'Build a social platform for book enthusiasts to join book clubs, track reading progress, and discuss literature. Include features like book recommendations, reading challenges, club creation, discussion forums, reading statistics, and integration with book databases.',
    prefilledAnswers: {
      framework: { selected: 'nextjs' },
      auth: { selected: 'yes' },
      backend: { selected: 'yes' },
      database: { selected: 'supabase' },
      ui: { selected: 'tailwind' },
      features: { custom: 'Book clubs, reading tracking, discussions, recommendations, challenges, statistics, book database integration' }
    },
    features: ['Book clubs', 'Reading tracking', 'Discussion forums', 'Book recommendations', 'Reading challenges'],
    tags: ['books', 'reading', 'community', 'literature', 'social']
  },

  // More Business Tools
  {
    id: 'hr-management',
    name: 'HR Management System',
    category: 'business',
    description: 'Complete HR solution for employee management and payroll',
    icon: '👥',
    appIdea: 'Create a comprehensive HR management system for businesses to handle employee lifecycle, payroll, benefits, and performance management. Include features like employee onboarding, time tracking, leave management, performance reviews, payroll processing, and compliance reporting.',
    prefilledAnswers: {
      framework: { selected: 'nextjs' },
      auth: { selected: 'yes' },
      backend: { selected: 'yes' },
      database: { selected: 'supabase' },
      ui: { selected: 'shadcn' },
      features: { custom: 'Employee management, payroll processing, time tracking, leave management, performance reviews, onboarding, compliance' }
    },
    features: ['Employee management', 'Payroll processing', 'Time tracking', 'Performance reviews', 'Compliance reporting'],
    tags: ['hr', 'payroll', 'employees', 'management', 'business']
  },
  {
    id: 'inventory-management',
    name: 'Inventory Management System',
    category: 'business',
    description: 'Track inventory, manage suppliers, and optimize stock levels',
    icon: '📦',
    appIdea: 'Build an inventory management system for businesses to track stock levels, manage suppliers, and optimize inventory. Include features like barcode scanning, automated reordering, supplier management, inventory analytics, multi-location support, and integration with e-commerce platforms.',
    prefilledAnswers: {
      framework: { selected: 'nextjs' },
      auth: { selected: 'yes' },
      backend: { selected: 'yes' },
      database: { selected: 'supabase' },
      ui: { selected: 'shadcn' },
      features: { custom: 'Stock tracking, barcode scanning, automated reordering, supplier management, analytics, multi-location, e-commerce integration' }
    },
    features: ['Stock tracking', 'Barcode scanning', 'Automated reordering', 'Supplier management', 'Multi-location support'],
    tags: ['inventory', 'supply chain', 'warehouse', 'retail', 'business']
  },

  // More Education Apps
  {
    id: 'language-learning',
    name: 'Language Learning Platform',
    category: 'education',
    description: 'Interactive language learning with lessons and practice',
    icon: '🗣️',
    appIdea: 'Create an interactive language learning platform with personalized lessons, speaking practice, and cultural content. Include features like adaptive learning paths, pronunciation feedback, conversation practice with AI, cultural lessons, progress tracking, and social features for language exchange.',
    prefilledAnswers: {
      framework: { selected: 'nextjs' },
      auth: { selected: 'yes' },
      backend: { selected: 'yes' },
      database: { selected: 'supabase' },
      ui: { selected: 'tailwind' },
      features: { custom: 'Interactive lessons, pronunciation feedback, conversation practice, cultural content, progress tracking, language exchange' }
    },
    features: ['Interactive lessons', 'Pronunciation feedback', 'Conversation practice', 'Progress tracking', 'Language exchange'],
    tags: ['education', 'language learning', 'multilingual', 'culture', 'practice']
  },
  {
    id: 'skill-assessment',
    name: 'Skill Assessment & Certification',
    category: 'education',
    description: 'Platform for skill testing, certification, and professional development',
    icon: '🎖️',
    appIdea: 'Build a skill assessment platform where professionals can test their abilities, earn certifications, and track their development. Include features like adaptive testing, industry-standard certifications, skill gap analysis, learning recommendations, and integration with professional networks.',
    prefilledAnswers: {
      framework: { selected: 'nextjs' },
      auth: { selected: 'yes' },
      backend: { selected: 'yes' },
      database: { selected: 'supabase' },
      ui: { selected: 'shadcn' },
      features: { custom: 'Adaptive testing, certifications, skill analysis, learning recommendations, professional integration, progress tracking' }
    },
    features: ['Adaptive testing', 'Digital certifications', 'Skill gap analysis', 'Learning recommendations', 'Professional integration'],
    tags: ['education', 'certification', 'skills', 'professional development', 'assessment']
  },

  // More Social Media Apps
  {
    id: 'video-sharing',
    name: 'Video Sharing Platform',
    category: 'social',
    description: 'Short-form video creation and sharing with social features',
    icon: '📹',
    appIdea: 'Create a video sharing platform focused on short-form content with creation tools, social features, and discovery algorithms. Include features like video editing tools, filters and effects, trending content, user following, live streaming, monetization options, and content moderation.',
    prefilledAnswers: {
      framework: { selected: 'nextjs' },
      auth: { selected: 'yes' },
      backend: { selected: 'yes' },
      database: { selected: 'supabase' },
      ui: { selected: 'tailwind' },
      features: { custom: 'Video editing, filters and effects, trending content, user following, live streaming, monetization, content moderation' }
    },
    features: ['Video editing tools', 'Social features', 'Content discovery', 'Live streaming', 'Monetization'],
    tags: ['video', 'social media', 'content creation', 'streaming', 'entertainment']
  },

  // More Utility Tools
  {
    id: 'file-converter',
    name: 'Universal File Converter',
    category: 'utility',
    description: 'Convert files between different formats with batch processing',
    icon: '🔄',
    appIdea: 'Build a universal file conversion tool that supports multiple file formats including documents, images, videos, and audio. Include features like batch processing, cloud storage integration, conversion history, quality settings, and API access for developers.',
    prefilledAnswers: {
      framework: { selected: 'nextjs' },
      auth: { selected: 'yes' },
      backend: { selected: 'yes' },
      database: { selected: 'supabase' },
      ui: { selected: 'shadcn' },
      features: { custom: 'Multi-format conversion, batch processing, cloud integration, conversion history, quality settings, API access' }
    },
    features: ['Multi-format support', 'Batch processing', 'Cloud integration', 'Conversion history', 'API access'],
    tags: ['file conversion', 'productivity', 'documents', 'media', 'utility']
  }
]

export function getTemplatesByCategory(category: string): PromptTemplate[] {
  return promptTemplates.filter(template => template.category === category)
}

export function getTemplateById(id: string): PromptTemplate | undefined {
  return promptTemplates.find(template => template.id === id)
} 