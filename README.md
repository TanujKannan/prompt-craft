# PromptCraft

Transform your app ideas into detailed, implementation-ready prompts for AI coding tools like Cursor, Replit, and Lovable.

## 🚀 Features

- **Multi-step Prompt Builder**: Guided wizard to capture your app idea and preferences
- **AI-Powered Generation**: Uses OpenAI GPT-4o to create comprehensive prompts
- **Clarifying Questions**: Smart questions to understand your technical requirements
- **Saved Prompts**: Access your previously generated prompts
- **Modern UI**: Built with Next.js, Tailwind CSS, and ShadCN UI
- **Real-time Saving**: Auto-saves your progress as you build

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS
- **UI Components**: ShadCN UI, Radix UI
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **AI**: OpenAI GPT-4o
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- OpenAI API key

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd promptcraft
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
# OpenAI API Key
OPENAI_API_KEY=your_openai_api_key_here

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 4. Set Up Supabase Database

Run the following SQL in your Supabase SQL editor:

```sql
-- Create profiles table
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  created_at timestamp default now()
);

-- Create prompt_sessions table
create table prompt_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  app_idea text not null,
  created_at timestamp default now()
);

-- Create clarifying_answers table
create table clarifying_answers (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references prompt_sessions(id),
  question text not null,
  selected_answer text not null,
  explanation text,
  created_at timestamp default now()
);

-- Create generated_prompts table
create table generated_prompts (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references prompt_sessions(id),
  prompt text not null,
  generated_at timestamp default now()
);
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   └── generate-prompt/
│   ├── about/             # About page
│   ├── builder/           # Prompt builder page
│   ├── saved/             # Saved prompts page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # ShadCN UI components
│   └── Header.tsx        # Navigation header
└── lib/                  # Utility functions
    ├── supabase.ts       # Supabase client
    └── utils.ts          # Utility functions
```

## 🎯 How It Works

1. **Describe Your Idea**: Users input their app idea in a textarea
2. **Answer Questions**: Users answer clarifying questions about tech preferences
3. **Generate Prompt**: AI creates a comprehensive prompt using the collected information
4. **Copy & Use**: Users copy the generated prompt to their AI coding tool

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

Make sure to set these in your Vercel dashboard:

- `OPENAI_API_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 🔧 Customization

### Adding New Clarifying Questions

Edit the `clarifyingQuestions` array in `src/app/builder/page.tsx`:

```typescript
const clarifyingQuestions: ClarifyingQuestion[] = [
  {
    id: 'new-question',
    question: 'Your question here?',
    options: [
      {
        value: 'option1',
        label: 'Option 1',
        explanation: 'Explanation for option 1'
      },
      // ... more options
    ]
  }
]
```

### Modifying the AI Prompt

Edit the system message in `src/app/api/generate-prompt/route.ts` to customize how the AI generates prompts.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

Built with ❤️ using Next.js, Tailwind CSS, and ShadCN UI
