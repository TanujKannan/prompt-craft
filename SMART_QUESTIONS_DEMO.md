# 🧠 Smart Question Generation Feature

## How It Works

The Smart Question Generation feature uses AI (GPT-4o) to analyze your app idea and create personalized, relevant clarifying questions instead of using generic static questions.

## Example Comparison

### Before (Static Questions):
- What frontend framework would you like to use?
- Do you need user authentication?
- What type of backend do you prefer?
- What database would you like to use?
- What UI style do you prefer?

### After (Dynamic Questions for "Food Delivery App"):
- How do you want customers to place orders in your food delivery app?
- What payment processing approach works best for your food delivery business?
- How should restaurants manage their menus and availability in your app?
- What delivery tracking features are important for your food delivery service?
- How do you want to handle user accounts and order history?

## Technical Implementation

1. **API Route**: `/api/generate-questions`
   - Takes app idea as input
   - Uses GPT-4o to generate 4-6 relevant questions
   - Returns structured JSON with questions and multiple choice options

2. **Frontend Integration**:
   - Triggers when user moves from Step 1 to Step 2
   - Shows loading skeleton while generating
   - Falls back to static questions if AI generation fails

3. **AI Prompt Engineering**:
   - System prompt instructs AI to be specific to the app idea
   - Focus on technical decisions that impact development
   - Beginner-friendly with clear explanations
   - JSON response format for consistent parsing

## Benefits

✅ **More Relevant**: Questions are tailored to the specific app idea
✅ **Better UX**: Users get questions that actually matter for their project
✅ **Smarter Prompts**: Final generated prompts are more accurate and helpful
✅ **Graceful Fallback**: Still works if AI generation fails

## User Flow

1. User enters app idea in Step 1
2. Clicks "Continue" → triggers question generation
3. AI analyzes the app idea and creates custom questions
4. User sees personalized questions in Step 2
5. Answers are used to generate highly relevant final prompt

## Example Generated Questions

For a "Fitness Tracking App":
- How do you want users to track their workouts and progress?
- What types of fitness data should your app collect and display?
- How important is social sharing and community features?
- What devices should your fitness app integrate with?
- How do you want to handle user motivation and goal setting?

This creates much more relevant and actionable prompts compared to generic questions! 