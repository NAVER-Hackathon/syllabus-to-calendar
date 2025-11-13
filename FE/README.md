# Syllabus to Calendar

A web application that helps students convert course syllabi (PDFs and images) into organized, week-by-week calendar plans with deadlines, assignments, exams, and class schedules.

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **UI Library**: React 18+
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Component Library**: shadcn/ui
- **AI Services**: NAVER CLOVA OCR + CLOVA Studio

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
# Add your API keys and configuration
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes
│   ├── (dashboard)/       # Protected dashboard routes
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── layout/           # Layout components
│   ├── course/           # Course-related components
│   ├── calendar/         # Calendar views
│   └── upload/           # Upload components
├── lib/                  # Utilities and API clients
├── hooks/                # Custom React hooks
├── store/                # State management (Zustand)
├── types/                # TypeScript type definitions
└── constants/            # Constants and configuration
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Documentation

- [Requirements](./REQUIREMENTS.md) - Product requirements
- [Architecture](./ARCHITECTURE.md) - Technical architecture
- [User Stories](./USER_STORIES.md) - Detailed user stories
- [Development Plan](./DEVELOPMENT_PLAN.md) - 8-week development roadmap
- [Project Summary](./PROJECT_SUMMARY.md) - Quick reference guide

## Features

- 📄 Upload PDF and image syllabi
- 🤖 NAVER AI-powered parsing (CLOVA OCR + Studio)
- 📅 Week-by-week calendar view
- 📆 Multiple calendar views (Month, Week, Agenda)
- ✅ Assignment status tracking
- 🔔 Deadline reminders
- 📤 Export to iCal
- 🔄 Google Calendar two-way sync

## License

ISC

