# Sacred Journal - Deployment Guide

## Vercel Deployment

Sacred Journal is optimized for Vercel deployment. Follow these steps:

### Prerequisites
- Vercel account (free or pro)
- GitHub account with the sacredjournal repository
- API keys for all external services (Gemini, DeepGram, etc.)

### Step 1: Connect GitHub to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in with your GitHub account
3. Import the `sacredjournal` repository

### Step 2: Configure Environment Variables

In your Vercel project settings, add the following environment variables:

#### Supabase (Required)
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

#### AI & Speech APIs (Required)
```
GEMINI_API_KEY=your_gemini_api_key
NEXT_PUBLIC_GEMINI_MODEL=gemini-3-pro
DEEPGRAM_API_KEY=your_deepgram_api_key
ELEVENLABS_API_KEY=your_elevenlabs_api_key
MISTRAL_API_KEY=your_mistral_api_key
```

#### Neo4j Knowledge Graph (Optional)
```
NEO4J_URI=your_neo4j_uri
NEO4J_USERNAME=your_neo4j_username
NEO4J_PASSWORD=your_neo4j_password
```

### Step 3: Deploy

Vercel will automatically:
1. Detect Next.js framework
2. Install dependencies with npm
3. Run `npm run build`
4. Deploy to serverless functions

Your app will be available at `sacredjournal.vercel.app`

### Custom Domain

To use a custom domain (e.g., sacredjournal.com):

1. Go to Vercel project → Settings → Domains
2. Add your domain
3. Update DNS records according to Vercel's instructions
4. Wait for DNS propagation (can take up to 48 hours)

### Environment-Specific Configuration

Create different `.env` configurations for:
- **Development** (.env.local)
- **Preview/Staging** (set in Vercel Preview environment)
- **Production** (set in Vercel Production environment)

### Monitoring & Analytics

Vercel provides built-in:
- **Web Vitals** - Performance metrics
- **Real User Monitoring (RUM)** - End-user experience
- **Error Tracking** - Automatic error capture
- **Analytics** - Usage statistics

For enhanced error tracking, integrate Sentry:

```bash
npm install @sentry/nextjs
```

### Database Setup

Supabase connection is automatic with environment variables. First time setup:

1. Create Supabase project at [supabase.com](https://supabase.com)
2. Run migrations (create tables as needed)
3. Set RLS policies for multi-tenant isolation

### Scaling & Performance

Sacred Journal is designed for scale:
- **Serverless Functions** - Auto-scale with demand
- **CDN** - Global edge caching of static assets
- **Database Optimization** - Connection pooling via Supabase
- **Image Optimization** - Next.js Image component

For high-volume voice processing, consider:
- Async job queue for transcription (AWS SQS, Bull)
- Caching layer for frequently used data
- Database query optimization

### Troubleshooting

**Build failures:**
- Check `npm run build` locally
- Verify all dependencies in package.json
- Check Node.js version (should be 22.x)

**API errors:**
- Verify environment variables are set correctly
- Check API rate limits for external services
- Review CloudFlare/WAF settings if applicable

**Performance issues:**
- Use Vercel Analytics to identify bottlenecks
- Optimize database queries
- Enable caching headers for static content
- Consider upgrading Vercel plan if needed

### CI/CD Pipeline

Vercel automatically runs:
1. Linting (`npm run lint`)
2. Type checking (TypeScript)
3. Build (`npm run build`)
4. Tests (when configured)

Commits to `main` deploy to production.
Pull requests create preview deployments.

### Rollback

If needed, revert to previous version:
1. Go to Vercel project → Deployments
2. Click on previous successful deployment
3. Click "Redeploy" (creates new deployment from same code)

### Support

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/learn-pages-router/basics/deploying-nextjs-app)
- Sacred Journal GitHub Issues
