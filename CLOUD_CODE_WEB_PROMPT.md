# Sacred Journal - Cloud Code Web Development Prompt

## Project Context

You are continuing development on **Sacred Journal**, a next-generation personality-aware journaling app with multimodal input methods (voice, email, text, image), real-time AI coaching, and knowledge graph integration.

**GitHub Repository:** https://github.com/mawazawa/sacredjournal

**Live Documentation:**
- RESEARCH.md - Architecture and feature specifications
- README.md - Getting started and project overview
- DEPLOYMENT.md - Vercel deployment guide

**Technology Stack:**
- Frontend: Next.js 16, React 19, TypeScript, Tailwind CSS 4, Framer Motion, Zustand
- Backend: Node.js 22+, Supabase (PostgreSQL), Neo4j
- APIs: Gemini 3 Pro, DeepGram Nova-3, Mistral OCR, ElevenLabs

## Development Roadmap

### Phase 1: MVP (Current - Priority)

Your focus should be on implementing the core features for the MVP:

1. **Authentication & User Setup**
   - [x] Next.js project initialized
   - [ ] Supabase auth integration (email/password, social logins)
   - [ ] User profile creation with initial data
   - [ ] Email verification flow

2. **Database Schema**
   - [ ] users table with personality profiles
   - [ ] entries table for journal entries
   - [ ] relationships table for Neo4j data
   - [ ] embeddings table for vector search
   - [ ] Row Level Security (RLS) policies

3. **Personality Assessment**
   - [ ] Personality questionnaire component (Big Five model)
   - [ ] Data storage and calculation of Big Five scores
   - [ ] Visual results display with trait descriptions
   - [ ] Integration with Gemini for ongoing personality updates

4. **Core Journaling Features**
   - [ ] Text entry creation with rich text editor
   - [ ] Entry listing with filters and search
   - [ ] Entry editing and deletion
   - [ ] Mood/emotion tagging
   - [ ] Entry archiving

5. **Voice Journaling**
   - [ ] Voice recording component (already scaffolded)
   - [ ] DeepGram Nova-3 transcription integration
   - [ ] Real-time transcription display
   - [ ] Audio playback with waveform visualization
   - [ ] Save transcribed text as entry

6. **Real-Time AI Coaching (Real-Time Conversation)**
   - [ ] Gemini 3 Pro Live API integration
   - [ ] Real-time chat interface component
   - [ ] Personality-aware system prompts
   - [ ] Conversation history storage
   - [ ] Session management

### Phase 2: Enhanced Features (Secondary)

These features should be implemented after Phase 1 MVP is complete:

7. **Email Integration**
   - [ ] Postmark/AWS SES webhook setup
   - [ ] Email parsing (subject, body, attachments)
   - [ ] Automatic entry creation from email
   - [ ] Email attachment handling

8. **Image & OCR Processing**
   - [ ] Image upload interface
   - [ ] Mistral OCR API integration
   - [ ] Handwritten note transcription
   - [ ] OCR result review and editing
   - [ ] Save as entry or separate media

9. **Knowledge Graph (Neo4j)**
   - [ ] Entity extraction from entries (using LLM)
   - [ ] Neo4j connection and node creation
   - [ ] Relationship mapping (person, event, emotion, goal)
   - [ ] Graph query API endpoints

10. **Analytics & Visualization**
    - [ ] Screen time metrics tracking
    - [ ] Meditation session logging
    - [ ] Goal progress visualization
    - [ ] Relationship network visualization
    - [ ] Time allocation charts

11. **Advanced Features**
    - [ ] Goal setting with calendar mapping
    - [ ] Meditation mode with voice guidance (ElevenLabs)
    - [ ] Pattern recognition and insights
    - [ ] Export entries (PDF, Markdown)

### Phase 3: Optimization & Deployment (Final)

12. **Testing & Quality**
    - [ ] Unit tests for utility functions
    - [ ] Integration tests for API endpoints
    - [ ] E2E tests with Playwright
    - [ ] Performance testing

13. **Deployment**
    - [ ] Vercel deployment setup
    - [ ] Environment variables configuration
    - [ ] Error tracking with Sentry
    - [ ] Custom domain setup
    - [ ] CI/CD pipeline testing

## Key Implementation Details

### Authentication Flow
```
User → Supabase Auth → Create user profile → Personality questionnaire → Dashboard
```

### Voice-to-Journaling Flow
```
User speaks → MediaRecorder → Audio Blob → DeepGram API → Transcription → Save as Entry
```

### Real-Time Conversation Flow
```
User input → Gemini Live API → Stream response → Store in conversation history → Display
```

### AI Coaching System
Personality-aware responses using the Big Five model:
- **Openness**: Use abstract concepts and explore ideas
- **Conscientiousness**: Provide structured plans and organization
- **Extraversion**: Focus on social connections and relationships
- **Agreeableness**: Use emotional appeals (Pathos) and relationship focus
- **Neuroticism**: Emphasize coping strategies and emotional regulation

All Gemini responses should include the user's personality profile in the system prompt.

### Entry Types & Sources
Entries can come from multiple sources:
- `text` - Manual typing
- `voice` - Voice recording → DeepGram transcription
- `email` - Email ingestion
- `image` - Photo of physical journal → Mistral OCR

All entries should be tagged with source and searchable.

## API Endpoints to Implement

### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/signin` - Sign in
- `POST /api/auth/signout` - Sign out
- `POST /api/auth/verify-email` - Email verification

### Entries
- `GET /api/entries` - List user's entries
- `POST /api/entries` - Create entry
- `GET /api/entries/[id]` - Get single entry
- `PUT /api/entries/[id]` - Update entry
- `DELETE /api/entries/[id]` - Delete entry
- `POST /api/entries/search` - Full-text search

### Voice & Transcription
- `POST /api/transcribe` - Convert audio to text (DeepGram)
- `POST /api/speech` - Convert text to speech (ElevenLabs)

### AI Coaching
- `POST /api/coaching/message` - Send message to Gemini
- `GET /api/coaching/history` - Get conversation history
- `POST /api/coaching/reset` - Clear conversation

### Image Processing
- `POST /api/ocr/upload` - Upload image for OCR
- `GET /api/ocr/[id]` - Get OCR result
- `POST /api/ocr/[id]/confirm` - Confirm OCR text

### Knowledge Graph
- `POST /api/graph/extract` - Extract entities from entry
- `GET /api/graph/relationships` - Get user's relationships
- `GET /api/graph/network` - Get friend network data

### User Profile
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update profile
- `POST /api/user/personality` - Get personality assessment
- `GET /api/user/settings` - User settings

## Environment Variables

Make sure these are set in `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Gemini API
GEMINI_API_KEY=
NEXT_PUBLIC_GEMINI_MODEL=gemini-3-pro

# DeepGram
DEEPGRAM_API_KEY=

# ElevenLabs
ELEVENLABS_API_KEY=

# Mistral
MISTRAL_API_KEY=

# Neo4j (Optional for Phase 1)
NEO4J_URI=
NEO4J_USERNAME=
NEO4J_PASSWORD=

# Email Service
EMAIL_SERVICE_API_KEY=

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

## Component Structure

### Key Components to Build

1. **Auth Components**
   - `AuthProvider` - Context wrapper for auth state
   - `SignUpForm` - Registration form
   - `SignInForm` - Login form
   - `ProtectedRoute` - Route guard for authenticated pages

2. **Journal Components**
   - `EntryForm` - Create/edit entry with rich text
   - `EntryList` - Display list of entries
   - `EntryCard` - Individual entry preview
   - `EntryViewer` - Full entry display

3. **Voice Components**
   - `VoiceRecorder` - Recording interface (expand existing VoiceButton)
   - `TranscriptionDisplay` - Show transcription in progress
   - `AudioPlayback` - Play recorded audio

4. **AI Coaching Components**
   - `CoachingChat` - Real-time conversation interface
   - `CoachingMessage` - Individual message display
   - `CoachingInput` - Message input field

5. **Personality Components**
   - `PersonalityQuiz` - Assessment questionnaire
   - `PersonalityResults` - Display Big Five results

6. **Analytics Components**
   - `ScreenTimeChart` - Show screen time metrics
   - `GoalProgress` - Goal tracking visualization
   - `NetworkVisualization` - Relationship graph

## Styling Notes

- Use the custom `sacred-purple` and `sacred-teal` color schemes from tailwind.config.ts
- Maintain `eyes-closed, voice-first` aesthetic where possible (minimal visual clutter)
- Use Framer Motion for smooth transitions and animations
- Follow mobile-first responsive design
- Ensure WCAG AA accessibility standards

## Testing Strategy

1. **Unit Tests** - API functions, utility functions
2. **Integration Tests** - Database operations, API endpoints
3. **E2E Tests** - User flows (signup → create entry → view entry)
4. **Performance** - Lighthouse audits, Core Web Vitals

## Code Quality Standards

- TypeScript strict mode enabled
- ESLint configuration enforced
- Naming conventions:
  - Components: PascalCase (UserProfile.tsx)
  - Pages: kebab-case (journal-entries.tsx)
  - Hooks: kebab-case with 'use' prefix (use-voice-recording.ts)
  - Utilities: kebab-case (date-helpers.ts)
- Comments only for non-obvious logic
- No console.logs in production code

## Commit Message Format

```
<type>(<scope>): <subject>

<body>

🧠 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>
```

Types: feat, fix, refactor, test, docs, style, perf

## Getting Started Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Check types
npm run type-check

# Lint code
npm run lint

# Build for production
npm run build

# Start production server
npm start
```

## Priority Checklist for Phase 1

- [ ] Supabase auth setup and user model
- [ ] Database schema creation
- [ ] Authentication UI (signup, signin)
- [ ] Protected routes and auth guard
- [ ] Personality questionnaire
- [ ] Text entry creation/editing
- [ ] Entry listing and search
- [ ] Voice recording to transcription
- [ ] Gemini real-time conversation
- [ ] Basic dashboard/home page
- [ ] Error handling and validation
- [ ] Loading states and skeleton screens

## Known Limitations & Technical Debt

1. Email ingestion not yet implemented (Phase 2)
2. Neo4j not integrated (Phase 2)
3. Mistral OCR not integrated (Phase 2)
4. Tests not yet written (Phase 3)
5. Sentry error tracking not configured (Phase 3)
6. Custom domain not set up (Phase 3)

## Questions or Clarifications?

If you encounter ambiguities:
1. Check RESEARCH.md for feature specifications
2. Review README.md for architecture details
3. Check existing code for patterns and conventions
4. Create an issue in GitHub if something needs clarification

---

**Good luck building! Remember: voice-first, eyes-closed, personality-aware, and measuring success by screen time reduction. 🧠🎤**
