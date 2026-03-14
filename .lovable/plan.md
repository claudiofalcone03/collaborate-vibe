

# VETRA — Visionary Execution Platform

## Overview
A multi-page dark-mode web app connecting visionaries with executors. Five core views with realistic mock data, glassmorphism styling, and full responsiveness.

## Design System
- **Background:** Zinc-950 (#09090B) with Zinc-900 surface cards
- **Accent:** Indigo-500 (#6366F1) for CTAs, active states, focus rings
- **Text:** #FAFAFA primary, #A1A1AA muted
- **Cards:** Semi-transparent with backdrop-blur and 1px Zinc-800 borders
- **Font:** Inter, clean and minimal
- **Motion:** 150ms ease-out transitions

## Pages & Features

### 1. Public Landing Page (`/`)
- Sticky top navbar with logo, nav links, and "Sign In" / "Get Started" buttons
- Hero section: "Turn Ideas into Execution." headline, subheadline, two CTAs
- Feature grid: 3 cards (Structured Ideas, Skill Matching, Reputation System) with icons
- Stats section and footer

### 2. Dashboard / Project Feed (`/dashboard`)
- Sidebar navigation (240px) with links to all internal views, collapsible to icon-only
- Top bar with search input and filter dropdowns (Skills, Project Stage)
- Responsive grid of Project Cards showing: title, description, skill badges, stage indicator, "Apply" button
- Mock data: 8-10 diverse projects with varied skills and stages

### 3. Idea Publishing (`/publish`)
- Full-page form (or modal triggered from dashboard)
- Fields: Project Name, Vision (textarea), Objectives, Required Skills (multi-select tags), Collaborative Model (radio: Equity/Paid/Volunteer)
- Form validation UI and submit button

### 4. User Profile (`/profile`)
- Profile header: avatar, name, role badge, bio
- Reputation score with visual progress/badge display
- Three sections: Declared Skills (tag chips), Active Projects (cards), Past Contributions (list)
- Mock user data with realistic stats

### 5. Chat & Team Space (`/chat`)
- Split-pane: left sidebar (300px) with project channels and DM contacts
- Right pane: chat interface with message bubbles (sent/received styling), message input bar
- Mock conversation data across multiple channels

## Technical Approach
- React Router for navigation between all 5 views
- Shared sidebar layout for internal pages (dashboard, publish, profile, chat)
- Comprehensive mock data files for projects, users, skills, and messages
- Fully responsive: mobile hamburger menu, stacked layouts on small screens
- Lucide React icons throughout, shadcn/ui components as base

