# AI Writing Assistant

A modern, AI-powered writing assistant application built with Next.js, TypeScript, and Tailwind CSS. Organize your writing projects, create drafts, and manage your content with ease.

## 🚀 Features

- **Modern UI/UX**: Built with Next.js 14 App Router and shadcn/ui components
- **Rich Text Editing**: Intuitive editor for creating and formatting content
- **Folder Organization**: Easily organize your drafts into folders
- **Drag & Drop**: Intuitive drag-and-drop interface for managing content
- **Real-time Updates**: Instant feedback and state management
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark Mode**: Built-in dark theme support

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **State Management**: React DnD, React Hook Form
- **Database**: Supabase (PostgreSQL)
- **Authentication**: NextAuth.js
- **Deployment**: Vercel

## 📦 Prerequisites

- Node.js 18.0.0 or later
- npm or yarn
- Supabase account (for database and authentication)

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone [https://github.com/yourusername/ai-writing-assistant.git](https://github.com/yourusername/ai-writing-assistant.git)
   cd ai-writing-assistant
   ```
2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```
3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Fill in the values for the following variables:

   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_SITE_URL`
   - `DATABASE_URL`
   - `DIRECT_DATABASE_URL`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - `ANTHROPIC_API_KEY`
   - `RESEND_API_KEY`
   - `SUPABASE_BUCKET_NEW_USER`
   - `SUPABASE_BUCKET_PATH_NEW_USER`

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   Open http://localhost:3000 in your browser

src/
├── app/ # App router
├── components/ # Reusable UI components
├── lib/ # Utility functions and configurations
├── store/ # State management
├── types/ # TypeScript type definitions
└── styles/ # Global styles

🔧 Available Scripts
npm run dev - Start the development server
npm run build - Build the application for production
npm start - Start the production server
npm run lint - Run ESLint
npm run format - Format code with Prettier
📝 License
This project is licensed under the MIT License - see the LICENSE file for details.

🙏 Acknowledgments
Next.js Documentation
shadcn/ui Documentation
Tailwind CSS Documentation
Supabase Documentation
