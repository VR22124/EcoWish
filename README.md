# EcoWish - Carbon Footprint Tracker

A simple, modern, accessible web application designed to help individuals understand, track, and reduce their carbon footprint through simple actions. Built with React, Vite, TypeScript, and Supabase.

## Features
- **Track Carbon Footprint:** Log daily eco-friendly actions to see the estimated CO₂ reduced.
- **Accessible UI:** Clean, keyboard-navigable interface with glassmorphism aesthetics.
- **Secure Sessions:** Anonymous persistent sessions that securely separate user data using Postgres Row Level Security (RLS).
- **Tested:** Comprehensive test suite utilizing Vitest and React Testing Library.

## Tech Stack
- Frontend: React + Vite + TypeScript
- Styling: Vanilla CSS with CSS Variables
- Backend & DB: Supabase (PostgreSQL)

## Setup Instructions

1. **Clone and Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file in the root directory and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Database Migration**
   Using the Supabase CLI, link to your project and push the schema:
   ```bash
   npx supabase link --project-ref <your-project-ref>
   npx supabase db push
   ```

4. **Run the Application**
   ```bash
   npm run dev
   ```

## Testing
To run the automated unit test suite:
```bash
npm run test
```

## Accessibility
EcoWish strictly adheres to WCAG AA guidelines. It supports full keyboard navigation, utilizes `aria-live` announcements for dynamic content updates, and features accessible high-contrast form elements with `:focus-visible` outlines.
