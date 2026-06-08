# EcoWish — Carbon Footprint Tracker

A modern, fully accessible web application that helps individuals **understand, track, and reduce their carbon footprint** through simple daily eco-friendly actions and personalized insights.

## Features

- **Track Carbon Impact:** Log eco-friendly actions (cycling, plant-based meals, energy saving, etc.) and see cumulative CO₂ saved in real-time.
- **Personalized Dashboard:** Visualize your total carbon saved and tree-planting equivalents.
- **Secure Anonymous Sessions:** Each browser session is uniquely identified via a `crypto.randomUUID()` stored in `localStorage`. Supabase Row Level Security (RLS) policies enforce strict per-user data isolation without requiring authentication.
- **Optimized Rendering:** React.memo + useCallback ensure zero unnecessary re-renders.
- **Accessible by Design:** Full WCAG AA compliance — keyboard navigation, `aria-live` regions, semantic HTML, `:focus-visible` outlines.
- **Comprehensive Tests:** Vitest + React Testing Library with >90% coverage across all branches.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite + TypeScript |
| Styling | Vanilla CSS with CSS Custom Properties |
| Backend & DB | Supabase (PostgreSQL + RLS) |
| Testing | Vitest + React Testing Library |

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone https://github.com/VR22124/EcoWish.git
cd EcoWish
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Apply Database Migrations

```bash
npx supabase link --project-ref <your-project-ref>
npx supabase db push
```

### 4. Run the Application

```bash
npm run dev
```

## Testing

Run the full test suite:

```bash
npm run test
```

Run with coverage report:

```bash
npm run test:coverage
```

## Architecture

```
src/
├── components/       # UI components (Dashboard, ActionList, LogActionForm)
├── constants/        # Static data (ECO_ACTIONS list)
├── hooks/            # Custom React hooks (useActionLogs)
├── utils/            # Pure utility functions (auth/UUID management)
├── types.ts          # TypeScript interfaces
└── supabaseClient.ts # Supabase client initialisation
```

## Security

- All database access uses the **anon** Supabase role
- **Row Level Security (RLS)** is enforced at the database level — users can only read and delete their own rows
- No user PII is collected or stored — sessions are identified by a random UUID only
- Database columns have `CHECK` constraints enforcing valid data ranges

## Accessibility

EcoWish strictly follows **WCAG 2.1 AA** guidelines:
- Semantic HTML (`<main>`, `<header>`, `<ul>`, `<li>`, `<form>`, `<label>`)
- `aria-live` regions for dynamic loading and error announcements
- `aria-label` on all interactive controls and meaningful stat values
- Full keyboard navigation with `:focus-visible` outlines
- Decorative icons marked `aria-hidden="true"`
