## Collaboration Request System

Adds a structured collaboration flow between users built on top of existing `contents` and `profiles`. Includes a private 1:1 conversation backend so that accepting a request opens a real chat (replacing the current mock Chat page data).

### 1. Database (migration)

**`collaboration_role` enum:** `producer | rapper | vocalist | mix_engineer | developer | designer | marketer | other`

**`request_status` enum:** `pending | accepted | declined`

**`collaboration_requests`**
- `id`, `sender_id`, `receiver_id`, `content_id` (FK → contents, cascade), `message` (text, 10–500 chars), `role` (collaboration_role), `portfolio_url` (text, nullable, validated), `status` (default `pending`), `created_at`
- Unique partial index `(sender_id, content_id) WHERE status = 'pending'` → prevents duplicate pending requests
- Indexes on `receiver_id, status` and `sender_id, created_at`

**`conversations`** (private 1:1, optionally linked to a content)
- `id`, `user_a`, `user_b` (stored sorted so `user_a < user_b`), `content_id` (nullable FK), `created_at`
- Unique `(user_a, user_b, content_id)`

**`conversation_messages`**
- `id`, `conversation_id` (FK cascade), `sender_id`, `body` (1–2000 chars), `created_at`

**RLS**
- `collaboration_requests`: select if `auth.uid() IN (sender_id, receiver_id)`. Insert if `auth.uid() = sender_id` AND sender ≠ content owner AND no existing pending request to same content. Update (status only) if `auth.uid() = receiver_id`.
- `conversations`: select/insert if `auth.uid() IN (user_a, user_b)`.
- `conversation_messages`: select if user is participant of the conversation; insert if sender is participant.

**Anti-spam trigger** `enforce_request_limits()` BEFORE INSERT on `collaboration_requests`:
- Rejects if sender has ≥ 5 requests created in the last 24h
- Rejects if sender is the content's `owner_id`
- Sets `receiver_id` from `contents.owner_id` server-side (ignores client value) to prevent spoofing

**Accept trigger** `on_request_accepted()` AFTER UPDATE on `collaboration_requests`:
- When status flips `pending → accepted`: upsert a `conversations` row for `(sender, receiver, content_id)` with sorted user ids. Idempotent.

**Realtime:** `ALTER PUBLICATION supabase_realtime ADD TABLE conversation_messages, collaboration_requests;`

### 2. UI components (new)

- `src/components/collab/RequestCollabButton.tsx` — button rendered on `ProjectCard` and `MusicCard`. Hidden when viewer is the owner. Unauthenticated click → toast + redirect to `/auth`.
- `src/components/collab/RequestCollabDialog.tsx` — shadcn `Dialog` with form:
  - `message` (Textarea, required, 10–500)
  - `role` (Select from the enum, required)
  - `portfolio_url` (Input, optional, zod `.url()`)
  - Submit calls `supabase.from('collaboration_requests').insert(...)`. Surfaces server errors (duplicate, daily limit, owner-self) as readable toasts.
- `src/components/collab/IncomingRequestsList.tsx` and `OutgoingRequestsList.tsx` — used on Profile page. Receiver sees Accept / Decline buttons; sender sees status badge. After Accept, show "Open chat" link to `/chat?c=<conversationId>`.

### 3. Pages

- **Profile.tsx** — add a "Collaboration Requests" section with two tabs (Incoming / Sent). Pulls via React Query joined to `profiles` for sender/receiver username and to `contents` for title.
- **Chat.tsx** — replace mock channel/message data with real `conversations` + `conversation_messages`:
  - Left list: conversations the user participates in, showing the other user's username + linked content title.
  - Selecting one (or `?c=<id>` from URL) loads messages, supports sending via insert, and subscribes to realtime inserts.
  - Empty state: "Accept a collaboration request to start chatting."

### 4. Validation (`src/lib/validation.ts`)

Add `collabRequestSchema` (zod): message 10–500, role enum, optional URL ≤ 300 chars with safe protocol (`https?:`).

### 5. Files

**Create**
- `supabase/migrations/<ts>_collaboration.sql`
- `src/components/collab/RequestCollabButton.tsx`
- `src/components/collab/RequestCollabDialog.tsx`
- `src/components/collab/IncomingRequestsList.tsx`
- `src/components/collab/OutgoingRequestsList.tsx`
- `src/hooks/useCollabRequests.ts`
- `src/hooks/useConversations.ts`

**Modify**
- `src/components/content/MusicCard.tsx`, `ProjectCard.tsx` — add Request Collab button (hidden for owner)
- `src/pages/Profile.tsx` — add Collaboration Requests section
- `src/pages/Chat.tsx` — replace mock data with real conversations
- `src/lib/validation.ts` — add schema
- `src/data/mockData.ts` — remove `chatChannels` / `chatMessages` (unused after Chat refactor)

### Out of scope
Group chats, message read receipts, notifications, blocking, reputation effects of accepted requests.