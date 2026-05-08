
# VETRA MVP Backend — Lovable Cloud Integration

Convert VETRA from mock data to a real backend: email/password auth, Postgres tables, file storage for audio + cover images, real likes, dynamic dashboard. Mock data is dropped entirely.

## 1. Enable Lovable Cloud
Provision Postgres, Auth, and Storage. No external accounts required.

## 2. Database Schema (migrations)

**`profiles`** (1-to-1 with `auth.users`, auto-created via trigger)
- `id uuid PK` → `auth.users.id` (cascade)
- `username text unique not null`
- `bio text`
- `avatar_url text`
- `profile_type` enum: `music_creator | project_creator | visitor`
- `created_at timestamptz default now()`

**`contents`**
- `id uuid PK default gen_random_uuid()`
- `owner_id uuid` → `auth.users.id` (cascade)
- `content_type` enum: `music | project`
- `title text not null`, `description text`
- `audio_url text` (nullable), `image_url text` (nullable)
- Project fields: `vision text`, `skills text[]`, `stage text`, `model text` (all nullable)
- Music fields: `genre text` (nullable)
- `likes_count int default 0`
- `created_at timestamptz default now()`

**`likes`**
- `id uuid PK`, `user_id uuid`, `content_id uuid`
- `created_at timestamptz default now()`
- `unique(user_id, content_id)` ← enforces one-like-per-user

**Triggers**
- `handle_new_user()` → insert profile row from signup metadata (username, profile_type)
- `on_like_insert/delete` → increment/decrement `contents.likes_count`

**RLS**
- `profiles`: select public; update own.
- `contents`: select public; insert/update/delete own (`auth.uid() = owner_id`).
- `likes`: select public; insert/delete own.

## 3. Storage Buckets
- `audio` (public read) — mp3/wav, 20MB cap, mime check
- `covers` (public read) — png/jpg/webp, 5MB cap

RLS: authenticated users can upload to their own folder `{user_id}/...`; public read.

## 4. Authentication
Email/password only. Auto-confirm enabled (no email verification gate for MVP).

**Pages**
- `/auth` — combined Sign Up / Login tabs.
  - Sign Up fields: email, password, username, **profile type** (Music Creator / Project Creator / Visitor).
  - Login: email + password.
- `useAuth` hook with `onAuthStateChange` listener set up before `getSession()`, exposing `{ user, profile, loading, signOut }`.
- `<ProtectedRoute>` wrapper redirecting unauthenticated users from `/dashboard`, `/publish`, `/profile`, `/chat` to `/auth`.
- Logout button in sidebar.

## 5. Content Publishing
Rewrite `Publish.tsx` to write to DB:
- **Project form**: insert into `contents` with `content_type='project'`.
- **Music form**: upload audio to `audio` bucket → upload optional cover to `covers` bucket → insert row with public URLs.
- Client validation (zod): title 1–120 chars, description ≤2000, audio mime in `[audio/mpeg, audio/wav]`, ≤20MB.
- Any authenticated user can publish either type.

## 6. Dynamic Dashboard
Replace `contentStore` mock store with React Query fetching from `contents` joined to `profiles` (creator info).
- Tabs: **All / Music / Projects**.
- Sort toggle: **Trending** (`likes_count desc`) / **Latest** (`created_at desc`).
- Trending and Latest sections both visible on the page when "All" is active.
- Real-time refresh: invalidate query on like / publish; optionally subscribe to Postgres changes for `contents`.

## 7. Like System
- `LikeButton` calls `supabase.from('likes').insert/delete`.
- Unique constraint blocks duplicates server-side.
- `likes_count` updated by trigger; UI uses optimistic update + query invalidation.
- If unauthenticated → toast "Sign in to like" + redirect to `/auth`.
- Replace `useLikes` localStorage hook with a query that loads the current user's liked content IDs.

## 8. Audio Player
Keep native `<audio controls>` for music cards (responsive, accessible). No redesign.

## 9. Anti-Spam / Validation
- DB unique constraint on likes.
- RLS prevents acting on others' rows.
- Zod validation on all forms.
- File size + mime checks before upload.
- Auth gate on publish + like.

## 10. Cleanup
- Delete `src/data/mockData.ts` content arrays and `src/data/contentStore.ts`.
- Replace `currentUser` references with the real authenticated profile.
- Profile page reads from `profiles` table for the logged-in user; reputation/contribution sections become "coming soon" placeholders (no fake data).
- Chat page left as-is (out of scope, future).

## Technical Approach

**Files to create**
```
src/hooks/useAuth.tsx
src/components/auth/ProtectedRoute.tsx
src/pages/Auth.tsx
src/lib/validation.ts                (zod schemas)
src/hooks/useContents.ts             (react-query)
src/hooks/useLikes.ts                (rewritten, db-backed)
supabase/migrations/*.sql            (schema + triggers + RLS + buckets)
```

**Files to modify**
```
src/App.tsx                          (Auth route + ProtectedRoute wrappers)
src/pages/Publish.tsx                (DB writes + storage uploads)
src/pages/Dashboard.tsx              (react-query + trending/latest)
src/pages/Profile.tsx                (real profile data)
src/components/LikeButton.tsx        (DB-backed)
src/components/content/MusicCard.tsx (use image_url)
src/components/content/ProjectCard.tsx
src/components/layout/AppSidebar.tsx (logout)
```

**Files to remove**
```
src/data/contentStore.ts
src/data/mockData.ts                 (keep only static lists: ALL_SKILLS, GENRES)
```

## Out of Scope (modular hooks left for future)
Chat, collaborations/applications, reputation scoring, crowdfunding. Tables and components are structured so these can be added without refactoring (e.g., generic `contents.content_type`, separate `likes` table pattern reusable for follows/applies).
