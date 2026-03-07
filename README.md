# haoli.ai — Personal Portfolio

Personal portfolio website for Hao Li, showcasing projects in analytics engineering, data analysis, and full-stack development.

## Tech Stack

- **Framework:** Next.js 16 (App Router) + TypeScript
- **Styling:** Tailwind CSS 4
- **Animation:** Framer Motion
- **Icons:** Lucide React
- **Deployment:** Vercel

## Architecture

Single-page portfolio with a split-panel layout inspired by [brittanychiang.com](https://brittanychiang.com):

- **Left panel (sticky):** Name, title, navigation links, social icons
- **Right panel (scrollable):** About, Projects, Contact sections
- **Mobile:** Responsive single-column layout

### Key Features

- Dark theme (slate-900/950) with mouse-following spotlight effect
- Scroll-based navigation highlighting via Intersection Observer
- Framer Motion entrance animations
- Project cards with hover glow effect

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout, fonts, metadata
│   ├── page.tsx            # Home page, assembles all sections
│   └── globals.css         # Tailwind + custom styles
├── components/
│   ├── Spotlight.tsx        # Mouse-following radial gradient
│   ├── LeftSidebar.tsx      # Sticky left panel
│   ├── NavLink.tsx          # Navigation link with active indicator
│   ├── About.tsx            # About section
│   ├── Projects.tsx         # Project list
│   ├── ProjectCard.tsx      # Individual project card
│   ├── Contact.tsx          # Contact CTA
│   └── SocialLinks.tsx      # GitHub, LinkedIn, Email icons
├── lib/
│   └── data.ts              # Centralized content and project data
└── hooks/
    └── useActiveSection.ts  # Intersection Observer hook
```

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm start
```
