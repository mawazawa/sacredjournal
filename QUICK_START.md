# Sacred Journal - Quick Start for Cloud Code Web Agent

## Project Overview

Sacred Journal is a personality-aware AI journaling app with multimodal input (voice, email, text, images) and knowledge graph integration.

**Repository:** https://github.com/mawazawa/sacredjournal
**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, Zustand, Supabase, Neo4j

## What's Done ✅

1. **Project Setup**
   - Next.js 15 with React 19 scaffolding
   - TypeScript, ESLint, Tailwind CSS 4 configured
   - All modern dependencies installed

2. **Documentation**
   - RESEARCH.md - Feature specifications and architecture
   - README.md - Project overview
   - DEPLOYMENT.md - Vercel deployment guide
   - CLOUD_CODE_WEB_PROMPT.md - Development instructions

3. **Components & Files**
   - Home page with feature showcase
   - VoiceButton component (voice recording UI)
   - Zustand stores for auth and journal state
   - Voice recording hook (use-voice-recording.ts)
   - Supabase client configuration
   - Gemini API integration scaffolding

4. **Configuration**
   - Next.js, TypeScript, Tailwind, ESLint configs
   - Vercel deployment config
   - Environment variable templates

## What Needs Building 🚀

### Phase 1: MVP (18 Priority Items)

**Authentication (3 items)**
- [ ] Supabase auth integration
- [ ] Sign up/sign in UI
- [ ] Protected routes

**Database (2 items)**
- [ ] Create Supabase schema (users, entries, relationships)
- [ ] Set up Row Level Security policies

**Core Features (6 items)**
- [ ] Personality assessment questionnaire
- [ ] Text entry creation/editing
- [ ] Entry listing with search
- [ ] Voice recording → transcription (DeepGram)
- [ ] Real-time AI conversation (Gemini)
- [ ] Basic dashboard

**Supporting (7 items)**
- [ ] Auth UI components
- [ ] Journal UI components
- [ ] Error handling & validation
- [ ] Loading states
- [ ] API endpoints
- [ ] Data fetching logic
- [ ] Conversation history storage

## Getting Started

```bash
# 1. Clone repo
git clone https://github.com/mawazawa/sacredjournal.git
cd sacredjournal

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# 4. Run dev server
npm run dev
```

Visit http://localhost:3000

## Required API Keys

Get these before starting development:

1. **Supabase** (supabase.com)
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY

2. **Gemini** (ai.google.dev)
   - GEMINI_API_KEY

3. **DeepGram** (console.deepgram.com)
   - DEEPGRAM_API_KEY

4. **ElevenLabs** (elevenlabs.io) - Optional for Phase 2
   - ELEVENLABS_API_KEY

5. **Mistral** (console.mistral.ai) - Optional for Phase 2
   - MISTRAL_API_KEY

## File Structure

```
app/
├── layout.tsx           # Root layout
├── page.tsx            # Home page
├── auth/               # Auth pages (to create)
├── journal/            # Journal pages (to create)
└── api/                # API routes (to create)

lib/
├── api/gemini.ts       # Gemini integration
├── hooks/use-voice-recording.ts
├── stores/auth.ts      # Auth state
├── stores/journal.ts   # Journal state
└── supabase/client.ts  # DB config

components/
└── VoiceButton.tsx     # Voice recording component

public/                 # Static files
```

## Key Implementation Paths

### 1. Authentication
```
Create auth pages (signup, signin, callback)
→ Supabase auth provider
→ Protected route wrapper
→ Auth context/store
```

### 2. Journal Entries
```
Create EntryForm component
→ Save to Supabase
→ EntryList component
→ Search/filter logic
```

### 3. Voice Journaling
```
Use VoiceButton (expand existing)
→ Send audio to DeepGram API
→ Display transcription
→ Save as entry
```

### 4. AI Coaching
```
Create ChatInterface component
→ Real-time messages with Gemini Live API
→ Personality-aware system prompt
→ Store conversation history
```

## Code Patterns

### Zustand Store Usage
```typescript
import { useAuthStore } from '@/lib/stores/auth';

function Component() {
  const { user, setUser, logout } = useAuthStore();
  // Use state
}
```

### API Route Pattern
```typescript
// app/api/entries/route.ts
export async function POST(req: Request) {
  const { supabase, user } = await getServerSession();
  // Handle request
}
```

### Component Pattern
```typescript
"use client";

import { motion } from 'framer-motion';

export function MyComponent() {
  // Client-side logic
  return <div>Content</div>;
}
```

## Important Notes

1. **Voice-First Mentality** - Minimize visual clutter, prefer voice guidance
2. **Personality Awareness** - All AI responses should consider user's Big Five profile
3. **Privacy** - Use Supabase RLS for multi-tenant isolation
4. **Accessibility** - WCAG AA standards required
5. **Mobile First** - Design for mobile, enhance for desktop

## Database Schema Overview

```sql
-- Users table
users (id, email, personality_profile, onboarded)

-- Journal entries
entries (id, user_id, title, content, source, mood, tags, created_at)

-- Conversations
conversations (id, user_id, created_at)
messages (id, conversation_id, role, content, created_at)

-- Knowledge graph
entities (id, user_id, name, type, data)
relationships (id, user_id, source_id, target_id, type)
```

## Next Immediate Steps

1. **Set up Supabase** - Create project and get API keys
2. **Create auth pages** - signup.tsx, signin.tsx in app/auth/
3. **Build auth flow** - Sign up form → user creation → personality quiz
4. **Create dashboard** - Main page after login
5. **Build entry UI** - Create and view journal entries

## Testing Commands

```bash
npm run dev           # Start dev server
npm run build         # Check for build errors
npm run type-check    # Type checking
npm run lint          # ESLint
```

## Common Tasks

**Create new page:**
```bash
touch app/journal/page.tsx
# Add your route component
```

**Create new API endpoint:**
```bash
touch app/api/entries/route.ts
# Add your handler
```

**Add new dependency:**
```bash
npm install <package-name>
```

## Debugging Tips

- Check `.env.local` for missing API keys
- Use React DevTools for state debugging
- Check network tab for API errors
- Review Supabase dashboard for data issues
- Check console for TypeScript errors

## Resources

- Next.js Docs: https://nextjs.org/docs
- React 19: https://react.dev
- Supabase: https://supabase.com/docs
- Tailwind: https://tailwindcss.com/docs
- Framer Motion: https://www.framer.com/motion/

## Troubleshooting

**Build fails:**
- Run `npm run type-check` to find TypeScript errors
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`

**API errors:**
- Verify API keys in `.env.local`
- Check API rate limits
- Review error logs in browser console

**Styling issues:**
- Verify Tailwind classes are correct
- Check color names (use `sacred-purple-*` not `purple-*`)
- Clear Tailwind cache: `rm -rf .next`

---

**Ready to build? Check CLOUD_CODE_WEB_PROMPT.md for detailed implementation guide.**
