# VETRA — Music Creators + Likes & Ranking

Extend the current Project-only platform to a generic **Content** model that supports both **Projects** and **Music**, with file uploads, a like system, and a ranked dashboard. Frontend-only MVP using mock data + localStorage (no backend yet).

## 1. Generic Content Model

Refactor `src/data/mockData.ts` to introduce a shared base with a discriminator:

```ts
type ContentType = "project" | "music";

interface BaseContent {
  id: string;
  contentType: ContentType;
  title: string;
  description: string;
  creator: string;
  creatorAvatar: string;
  createdAt: string;
  likes: number;       // baseline likes from mock data
}

interface ProjectContent extends BaseContent {
  contentType: "project";
  vision: string;
  skills: string[];
  stage: "Idea" | "MVP" | "Growth" | "Scaling";
  model: "Equity" | "Paid" | "Volunteer";
  applicants: number;
}

interface MusicContent extends BaseContent {
  contentType: "music";
  genre?: string;
  audioUrl: string;     // object URL or remote URL
  coverColor?: string;  // for visual variety
  durationLabel?: string;
}

type Content = ProjectContent | MusicContent;
```

Existing `projects` data is mapped to `ProjectContent`. Add ~6 mock `MusicContent` entries (Lo-fi, Synthwave, Hip-Hop, Ambient, Indie, Electronic) using public sample audio URLs (e.g. `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3`).

Profile (`User`) gains: `creatorTypes: ("project" | "music")[]` so a user can be one or both.

## 2. Like System (client-side)

New `src/hooks/useLikes.ts` — manages a `Set<string>` of liked content IDs in `localStorage` (`vetra.likes`). Exposes:
- `isLiked(id)`
- `toggleLike(id)` → updates local set + bumps an in-memory `likeDeltas` map
- `getLikeCount(content)` → `content.likes + (delta[id] ?? 0)`

Rule enforcement: toggle is idempotent per user (one like max). No backend, so "user" = browser.

New reusable `<LikeButton content={...} />` component (heart icon from lucide, filled when liked, shows count).

## 3. Music Upload Flow

Update `src/pages/Publish.tsx` to start with a **Content Type selector** (two large cards: Project / Music).

- **Project branch**: existing form unchanged.
- **Music branch**: new form with fields
  - Title (required)
  - Description (required)
  - Genre (optional dropdown: Lo-fi, Hip-Hop, Electronic, Rock, Ambient, Other)
  - Creator name (prefilled from `currentUser`)
  - Audio file input (`accept="audio/mpeg,audio/wav"`)
    - Validates type + size (≤20MB)
    - Uses `URL.createObjectURL(file)` to get a local URL (frontend MVP)
  - Inline `<audio controls>` preview after selection

Submit pushes a new `MusicContent` into a shared in-memory store (`src/data/contentStore.ts`) so it appears in the dashboard during the session. Toast confirms publish.

> Note for the user: for true persistence + cross-device playback we need Lovable Cloud + Supabase Storage. This step keeps things fully frontend; uploaded tracks live for the session only.

## 4. Dashboard Ranking & Filters

Refactor `src/pages/Dashboard.tsx`:

- Header tab toggle: **All | Projects | Music** (segmented control).
- New sort dropdown: **Top (likes)** (default) | **Recent**.
- Combine `projects + music + userPublished` from `contentStore`, then filter by tab, then sort:
  - Top: `likes desc, then createdAt desc`
  - Recent: `createdAt desc`
- Existing search box still matches title/description.
- Skill/Stage filters only show when tab is `Projects` or `All` (hidden for Music-only view).
- Add a small "🏆 Top Content" badge on the #1 ranked card.

Replace `ProjectCard` with two cards driven by `contentType`:

- `ProjectCard` (current visuals + `<LikeButton>` in footer next to Apply).
- `MusicCard`: gradient cover block, title, creator, genre badge, compact `<audio controls>` player, `<LikeButton>`.

Both share the same outer `glass` shell for visual consistency.

## 5. Detail / Profile Touch-ups

- `src/pages/Profile.tsx`: show a "Creator Type" chip row (Project Builder / Music Creator) and split contributions into "Projects" and "Tracks" sections if music exists.
- No new detail-page routes required for MVP; the card itself contains the player.

## 6. Files to Add / Edit

**New**
- `src/data/contentStore.ts` — in-memory + localStorage-backed store for session-published content
- `src/hooks/useLikes.ts`
- `src/components/LikeButton.tsx`
- `src/components/content/MusicCard.tsx`
- `src/components/content/ProjectCard.tsx` (extracted from Dashboard)
- `src/components/publish/ContentTypePicker.tsx`
- `src/components/publish/MusicForm.tsx`
- `src/components/publish/ProjectForm.tsx` (extracted from current Publish page)

**Edited**
- `src/data/mockData.ts` — generic Content model + mock music tracks
- `src/pages/Dashboard.tsx` — tabs, sort, unified content list
- `src/pages/Publish.tsx` — type picker → branch into form
- `src/pages/Profile.tsx` — creator type chips, optional tracks list

## Technical Notes

- No backend changes; all state is React + `localStorage`. Likes and uploaded music persist within the browser session/device only.
- File uploads use `URL.createObjectURL` — fine for preview; not shareable.
- Discriminated union (`contentType`) keeps the model future-proof: adding e.g. `"video"` later only requires a new variant + card component, no rewrites.
- All new UI follows the existing dark + indigo + glassmorphism design system; fully responsive (cards already use the `sm:grid-cols-2 lg:grid-cols-3` layout).

## Out of Scope (flag for later)

- Real audio storage (needs Lovable Cloud + Supabase Storage bucket `tracks`)
- Per-user authentication so likes are truly one-per-user server-side
- Music detail page with waveform / comments
