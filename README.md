# Sacred Journal

A next-generation, personality-aware journaling and mindfulness application combining multimodal input methods with advanced AI reasoning and knowledge graph technology.

## Project Vision

Sacred Journal measures success by **minutes of screen time reduction**, achieving this through:

- **Voice-First, Eyes-Closed Journaling** - Real-time conversation with AI coach
- **Personality-Aware Coaching** - Adapt responses based on Big Five personality traits
- **Multimodal Input** - Voice, email, text, images via OCR
- **Knowledge Graph Pattern Recognition** - Neo4j-powered relationship and pattern analysis
- **Persuasion Taxonomy** - Personality-matched communication strategies

## Features

### Multimodal Input Methods
- **Voice Journaling** - Real-time conversation with Gemini 3 Pro via Live API
- **Email Integration** - CC `entries@sacredjournal.app` to auto-add entries
- **Text Journaling** - Traditional rich text editor with AI-suggested prompts
- **Image & OCR** - Upload physical journal photos, transcribe with Mistral OCR (95%+ accuracy)

### AI & Personality Coaching
- **Big Five Personality Assessment** - Automatic profiling from entry analysis
- **Personality-Aware Responses** - Adapt tone, depth, and persuasion strategy to user type
- **Pattern Recognition** - Identify recurring thoughts, emotions, and behaviors
- **Higher-Level Problem Solving** - AI-guided goal setting and life planning

### Knowledge Graph Features
- **Relationship Mapping** - Visualize your social network and time allocation
- **Entity Extraction** - Automatic detection of people, events, emotions, goals
- **Goal Dependency Tracking** - See how goals interconnect and influence each other
- **Temporal Analysis** - Understand patterns over time

### Screen Time Metrics
- **Eyes-Closed Meditation** - Voice-guided mindfulness with zero-screen interaction
- **Usage Analytics** - Dashboard showing screen time reduction progress
- **Badges & Rewards** - Incentivize voice-first usage and consistent practice

## Technology Stack (November 2025)

### Frontend
- **Next.js 15** - Latest with React 19 support
- **React 19** - Latest hooks and features
- **TypeScript** - Type safety
- **Tailwind CSS 4** - Modern styling
- **Framer Motion** - Smooth animations
- **Zustand** - Lightweight state management
- **React Query** - Server state management
- **Wavesurfer.js** - Audio visualization

### Backend
- **Next.js API Routes** - Serverless functions
- **Node.js 22+** - Latest runtime
- **Supabase** - PostgreSQL + Auth + Real-time
- **Neo4j** - Knowledge graph database
- **pgvector** - Vector embeddings in PostgreSQL

### External APIs
- **Gemini 3 Pro / Live API** - Real-time AI coaching
- **DeepGram Nova-3** - Speech-to-text (54% lower error rate)
- **Mistral OCR** - Document/image transcription (95%+ accuracy)
- **ElevenLabs** - Text-to-speech guidance
- **OpenAI/Mistral** - Embeddings generation

### Deployment
- **Vercel** - Next.js optimized hosting with global CDN
- **GitHub Actions** - CI/CD pipeline
- **Sentry** - Error tracking

## Getting Started

### Prerequisites
- Node.js 22+
- npm or yarn
- Supabase account
- Gemini API key
- DeepGram API key
- (Optional) Neo4j instance

### Installation

```bash
# Clone and install
git clone https://github.com/yourusername/sacredjournal.git
cd sacredjournal
npm install

# Setup environment
cp .env.example .env.local
# Edit .env.local with your API keys

# Run development server
npm run dev
```

Visit `http://localhost:3000`

### Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

GEMINI_API_KEY=
NEXT_PUBLIC_GEMINI_MODEL=gemini-3-pro

DEEPGRAM_API_KEY=

ELEVENLABS_API_KEY=

MISTRAL_API_KEY=

NEO4J_URI=
NEO4J_USERNAME=
NEO4J_PASSWORD=

EMAIL_SERVICE_API_KEY=
```

## Project Structure

```
sacredjournal/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── auth/              # Authentication pages
│   ├── journal/           # Journal interface
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── lib/
│   ├── api/               # External API integrations
│   ├── stores/            # Zustand stores
│   ├── hooks/             # Custom React hooks
│   ├── supabase/          # Supabase client config
│   └── utils/             # Utility functions
├── components/            # Reusable components
├── public/                # Static assets
├── RESEARCH.md            # Comprehensive research document
├── next.config.ts         # Next.js config
├── tailwind.config.ts     # Tailwind CSS config
├── tsconfig.json          # TypeScript config
└── package.json           # Dependencies
```

## Development Roadmap

### Phase 1: MVP (Weeks 1-8)
- Basic text journaling
- Voice recording and playback
- Personality assessment questionnaire
- Supabase authentication setup

### Phase 2: AI Integration (Weeks 9-16)
- Gemini 3 Pro real-time conversation
- DeepGram Nova-3 transcription
- Email-to-journal pipeline
- Personality-aware prompts

### Phase 3: Knowledge Graph (Weeks 17-24)
- Neo4j setup and entity extraction
- Relationship visualization
- Pattern recognition algorithms
- Friend network mapping

### Phase 4: Polish & Launch (Weeks 25-32)
- Screen time metrics dashboard
- Mistral OCR image processing
- ElevenLabs voice guidance
- Goal calendar mapping
- Vercel deployment

## Unique Selling Points

1. **Only app measuring success by screen time reduction** - Not engagement, but wellness
2. **Real-time AI conversation** - Not batch processing, but natural flow
3. **Personality-aware coaching** - Tailored to user type, not one-size-fits-all
4. **Knowledge graph integration** - Deep pattern recognition and relationship mapping
5. **Multimodal flexibility** - Voice, email, text, images all seamlessly integrated

## Market Context

Unlike Apple Journal, Day One, Reflectly, Calm, or Headspace:
- ✅ Eyes-closed, voice-first interface
- ✅ Real-time conversational AI
- ✅ Personality-aware personalization
- ✅ Knowledge graph visualization
- ✅ Multi-modal input methods
- ✅ Explicit screen time reduction metric

## Contributing

Contributions welcome! Please see CONTRIBUTING.md

## License

MIT

## Contact

For questions or feedback, reach out at info@sacredjournal.app

---

Made with 🧠 and 🎤 in 2025
