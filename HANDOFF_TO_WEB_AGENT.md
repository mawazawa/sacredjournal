# Handoff to Cloud Code Web Agent

## Executive Summary

Sacred Journal is a next-generation personality-aware AI journaling application that combines multimodal input (voice, email, text, images), real-time AI coaching with Gemini 3 Pro, and knowledge graph pattern recognition with Neo4j.

**GitHub:** https://github.com/mawazawa/sacredjournal
**Status:** Project scaffold complete, ready for feature implementation
**Next Phase:** MVP development (18 core features)

---

## What the Web Agent Should Do

The Cloud Code Web agent should continue development by implementing Phase 1: MVP features. This includes building the authentication system, database schema, and core journaling functionality.

### Primary Goals

1. **Complete Authentication System** - Supabase auth with signup/signin flow
2. **Create Database Schema** - Users, entries, relationships, conversations
3. **Build Entry Management** - Create, read, update, delete journal entries
4. **Implement Voice-to-Text** - Recording → DeepGram transcription → save
5. **Add AI Coaching** - Real-time conversation with Gemini 3 Pro
6. **Create Personality System** - Assessment questionnaire → personalization

### Success Criteria

- All Phase 1 features implemented and tested
- Build passes without errors
- TypeScript strict mode compliance
- Basic E2E tests for user flows
- Ready to deploy to Vercel

---

## Project Structure

```
sacredjournal/
├── RESEARCH.md                  # Feature specifications
├── README.md                    # Project overview
├── DEPLOYMENT.md                # Vercel deployment
├── QUICK_START.md               # Quick reference
├── CLOUD_CODE_WEB_PROMPT.md     # Detailed dev guide (READ THIS)
│
├── app/
│   ├── layout.tsx              # Root layout (done)
│   ├── page.tsx                # Home page (done)
│   ├── globals.css             # Styles (done)
│   ├── auth/                   # Auth pages (TO BUILD)
│   ├── journal/                # Journal pages (TO BUILD)
│   ├── api/                    # API endpoints (TO BUILD)
│   └── _not-found.tsx
│
├── lib/
│   ├── api/gemini.ts           # Gemini integration (scaffolded)
│   ├── hooks/use-voice-recording.ts  # Voice hook (done)
│   ├── stores/auth.ts          # Auth state (scaffolded)
│   ├── stores/journal.ts       # Journal state (scaffolded)
│   └── supabase/client.ts      # Supabase config (done)
│
├── components/
│   └── VoiceButton.tsx         # Voice button (done)
│
├── public/                     # Static files
├── package.json                # Dependencies (all installed)
├── next.config.ts              # Next.js config (done)
├── tailwind.config.ts          # Tailwind (done)
├── tsconfig.json               # TypeScript (done)
├── postcss.config.mjs          # PostCSS (done)
├── .env.example                # Environment template
├── .eslintrc.json              # ESLint (done)
└── .gitignore
```

---

## 18-Item Phase 1 Checklist

### Authentication (3 items)
```
1. [ ] Set up Supabase auth provider
2. [ ] Create signup/signin pages and forms
3. [ ] Implement protected routes and auth guard
```

### Database (2 items)
```
4. [ ] Create Supabase schema (users, entries, conversations, entities)
5. [ ] Set up Row Level Security policies for multi-tenant isolation
```

### Core Journaling (4 items)
```
6. [ ] Build personality assessment questionnaire component
7. [ ] Create text entry form with rich text editor
8. [ ] Build entry list component with search and filters
9. [ ] Implement voice recording → DeepGram → entry creation flow
```

### AI Coaching (2 items)
```
10. [ ] Integrate Gemini 3 Pro Live API for real-time conversation
11. [ ] Create chat interface with personality-aware system prompts
```

### UI & Components (4 items)
```
12. [ ] Create dashboard/home page for authenticated users
13. [ ] Build entry detail view and edit interface
14. [ ] Create loading states and skeleton screens
15. [ ] Implement error handling and validation feedback
```

### API Endpoints (2 items)
```
16. [ ] Build CRUD endpoints for entries (/api/entries)
17. [ ] Create voice transcription endpoint (/api/transcribe)
18. [ ] Build coaching conversation endpoint (/api/coaching)
```

---

## Technology Reference

### Frontend Stack
- **Framework:** Next.js 16 with App Router
- **UI Library:** React 19
- **Language:** TypeScript 5.9 (strict mode)
- **Styling:** Tailwind CSS 4 + custom colors
- **Animations:** Framer Motion
- **State:** Zustand (auth, journal)
- **Data Fetching:** React Query + SWR
- **Audio:** Wavesurfer.js, MediaRecorder API

### Backend Stack
- **Runtime:** Node.js 22+
- **Database:** Supabase (PostgreSQL) + Row Level Security
- **Auth:** Supabase Auth (email, OAuth)
- **Real-time:** Supabase Realtime subscriptions
- **API Routes:** Next.js serverless functions

### External APIs
- **Gemini 3 Pro** - Real-time AI conversation
- **DeepGram Nova-3** - Speech-to-text transcription
- **Mistral OCR** - Image/document transcription (Phase 2)
- **ElevenLabs** - Text-to-speech (Phase 2)
- **Neo4j** - Knowledge graph (Phase 2)

---

## Environment Variables

Web agent needs to set up `.env.local` with:

```env
# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxx...

# Gemini (Required)
GEMINI_API_KEY=AIzaSy...
NEXT_PUBLIC_GEMINI_MODEL=gemini-3-pro

# DeepGram (Required)
DEEPGRAM_API_KEY=a1b2c3...

# ElevenLabs (Optional - Phase 2)
ELEVENLABS_API_KEY=sk_...

# Mistral (Optional - Phase 2)
MISTRAL_API_KEY=...

# Neo4j (Optional - Phase 2)
NEO4J_URI=neo4j+s://...
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=...

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

---

## Key Design Patterns

### 1. Authentication Flow
```
[Signup] → Create user in Supabase →
[Personality Quiz] → Save Big Five scores →
[Dashboard] ← Protected route
```

### 2. Voice Journaling Flow
```
[VoiceButton] → Record audio →
[DeepGram API] → Transcription text →
[EntryForm] → Save entry
```

### 3. Real-Time Coaching Flow
```
[User message] → Gemini Live API →
[Stream response] → Display in chat →
[Store in DB]
```

### 4. Personality-Aware Responses
All Gemini system prompts should include:
- User's Big Five personality profile
- Preferred persuasion style (Logos/Pathos/Ethos)
- Previous conversation context
- Current user goals and mood

---

## Critical Implementation Notes

### Voice-First Mentality
- Minimize visual elements during journaling
- Default to voice input when possible
- Use brief, concise text (labels, confirmations)
- Voice prompts guide the experience

### Personality Awareness
- Every AI response should consider Big Five traits
- Customize persuasion strategy based on personality
- Adapt tone and depth to user type
- Show personality scores and insights

### Database Security
- Always use Supabase Row Level Security
- Never trust client-side user IDs
- Use service role key only on backend
- Validate all API requests

### Accessibility
- WCAG AA compliance required
- Test with screen readers
- Keyboard navigation support
- Sufficient color contrast
- Captions for audio content

---

## Testing Strategy

### Phase 1 Testing
1. **Unit Tests** - API functions, utilities
2. **Integration Tests** - Database operations
3. **E2E Tests** - Key user flows (signup → create entry → view)
4. **Manual Testing** - Voice recording, Gemini API, transcription

### Recommended Tools
- Jest for unit tests
- Playwright for E2E tests
- Manual testing against Supabase dashboard

---

## Code Quality Standards

### Naming Conventions
- **Components:** PascalCase (UserProfile.tsx)
- **Pages:** kebab-case (journal-entries.tsx)
- **Hooks:** use-[name].ts (use-voice-recording.ts)
- **Utilities:** kebab-case (date-helpers.ts)
- **Folders:** kebab-case (auth-pages/)

### TypeScript
- Strict mode enabled
- No `any` types
- Proper error handling
- Type safe API responses

### Comments
- Only for non-obvious logic
- Document complex algorithms
- No commented-out code
- No console.logs in production

---

## Deployment Path

When Phase 1 is complete:

1. **Run type-check:** `npm run type-check`
2. **Build:** `npm run build` (should pass)
3. **Test:** Manual testing on localhost
4. **Push:** `git push origin`
5. **Deploy:** Vercel automatically deploys from GitHub

Vercel will:
- Run `npm run build`
- Deploy to sacredjournal.vercel.app
- Set up preview deployments for PRs
- Configure serverless functions

---

## Detailed Development Guide

**📌 READ THIS:** CLOUD_CODE_WEB_PROMPT.md contains:
- Phase-by-phase roadmap
- API endpoint specifications
- Component structure details
- Implementation examples
- Priority checklist

---

## Support Documentation

The project includes comprehensive docs:

1. **RESEARCH.md** (442 lines)
   - Feature specifications
   - Technology justification
   - Market analysis
   - Implementation roadmap

2. **README.md**
   - Project overview
   - Getting started
   - Architecture
   - File structure

3. **DEPLOYMENT.md**
   - Vercel setup
   - Environment configuration
   - Monitoring
   - Troubleshooting

4. **QUICK_START.md**
   - What's done/what's needed
   - Quick reference
   - Common tasks
   - Debugging tips

5. **CLOUD_CODE_WEB_PROMPT.md** ← START HERE
   - Detailed development instructions
   - API specifications
   - Component breakdown
   - Phase 1 priorities

---

## Getting Started (for Web Agent)

```bash
# 1. Clone the repo
git clone https://github.com/mawazawa/sacredjournal.git
cd sacredjournal

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env.local
# Add API keys to .env.local

# 4. Start development
npm run dev

# 5. Visit http://localhost:3000
```

---

## Communication Protocol

When the Web Agent needs to:

- **Ask questions** → Check CLOUD_CODE_WEB_PROMPT.md first
- **Report progress** → Update TODO list in documentation
- **Find architecture details** → See RESEARCH.md
- **Need setup help** → Check QUICK_START.md
- **Stuck on implementation** → Review existing code patterns

---

## Success Metrics

Phase 1 is complete when:

- ✅ All 18 checklist items implemented
- ✅ Signup/signin flow working
- ✅ Can create and view journal entries
- ✅ Voice recording → transcription working
- ✅ Real-time AI coaching functional
- ✅ Personality assessment completed
- ✅ Build passes with no errors
- ✅ Basic E2E tests passing
- ✅ Deployed to Vercel

---

## Contact & Questions

If unclear on any requirement:
1. Check CLOUD_CODE_WEB_PROMPT.md for details
2. Review RESEARCH.md for feature specs
3. Look at existing code patterns
4. Check the relevant documentation file

---

## Next Steps for Web Agent

1. **Read CLOUD_CODE_WEB_PROMPT.md** (detailed implementation guide)
2. **Set up environment variables** (get API keys)
3. **Start with authentication** (items 1-3)
4. **Build database schema** (items 4-5)
5. **Create core UI components** (items 6-9)
6. **Implement API endpoints** (items 10-18)
7. **Test and iterate** based on requirements
8. **Deploy to Vercel** when ready

---

**Ready to build the future of journaling! 🚀🧠🎤**

Project established: November 23, 2025
Development starts: [Today]
Target MVP: Phase 1 complete
