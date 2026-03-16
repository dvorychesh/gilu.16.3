# 🚀 Deployment Guide — Vercel + Gemini

## Prerequisites

- Node.js 18+
- Google Gemini API Key
- Vercel account (free at vercel.com)
- Git repository

## Local Setup (First Time)

### 1. Environment Setup

```bash
cd gilu16.3

# Create local environment file
cp .env.local.example .env.local

# Edit .env.local and add your Google API Key
# GOOGLE_API_KEY=sk-...your-key-here...
```

### 2. Verify Configuration

```bash
npm run check-env
# Should output: ✅ All environment variables configured
```

### 3. Install & Test Locally

```bash
npm install

npm run dev
# App runs at http://localhost:3000
```

### 4. Test the flow

1. Open http://localhost:3000
2. Choose "ראיון פדגוגי" (interview)
3. Answer the 5 questions
4. Click "שלח תשובות" (submit)
5. Wait for AI analysis
6. View the dashboard

---

## Deploy to Vercel

### Step 1: Prepare Git

```bash
# Make sure all changes are committed
git status
git add -A
git commit -m "feat: prepare for Vercel deployment"
```

### Step 2: Login to Vercel CLI

```bash
npm install -g vercel

vercel login
# Browser opens → authenticate with GitHub/Google/Email
```

### Step 3: Deploy

```bash
vercel deploy --prod
```

**First deploy:**
- Vercel asks: "Link to existing project?" → **No** (first time)
- Asks for project name → `gilui-naot`
- Asks for directory → `.` (current)

**Output example:**
```
✓ Connected to github.com/dvory/...
✓ Production: https://gilui-naot.vercel.app [in 45s]
```

### Step 4: Add Environment Variable in Vercel Console

1. Go to https://vercel.com/dashboard
2. Click on your `gilui-naot` project
3. Settings → Environment Variables
4. Add: `GOOGLE_API_KEY` = (your API key)
5. Scope: Production, Preview, Development
6. **Save & Redeploy**

Or via CLI:
```bash
vercel env add GOOGLE_API_KEY
# Paste your API key
# Select: production, preview, development
```

Then redeploy:
```bash
vercel deploy --prod
```

---

## How Vercel + Gemini Works

```
User Input (Hebrew)
        ↓
Next.js API Route (app/api/analyze/route.js)
        ↓
Gemini 2.5 Flash (with System Prompt)
        ↓
JSON Response (Profile)
        ↓
React Dashboard (RTL)
        ↓
User sees Student Profile
```

### Key Files

| File | Role |
|------|------|
| `app/page.jsx` | All 4 UI views (Home, Interview, Upload, Dashboard) |
| `app/api/analyze/route.js` | Gemini integration + JSON parsing |
| `vercel.json` | Deployment config + env vars |
| `scripts/check-env.js` | Validates API key before build |

---

## Ongoing Development

### Local Changes

```bash
# Make changes to code
# Test locally
npm run dev

# Commit
git add -A
git commit -m "fix: improve dashboard styling"

# Push to GitHub (if using Git)
git push origin main

# Vercel auto-deploys on push to main!
```

### Manual Redeploy

```bash
vercel deploy --prod
```

---

## Troubleshooting

### "API key not configured"

```bash
# Check local
npm run check-env

# Check Vercel console
vercel env ls
# Should show GOOGLE_API_KEY

# If missing:
vercel env add GOOGLE_API_KEY
vercel deploy --prod
```

### "Module not found" after deploy

```bash
# Rebuild
vercel deploy --prod --force

# Or in console: Redeploy
```

### Gemini returns "Invalid API Key"

1. Verify API key works locally: `npm run dev`
2. Check Vercel env var is correct (no spaces, exact copy)
3. Regenerate API key at https://aistudio.google.com/app/apikeys
4. Update Vercel environment variable
5. Redeploy

### Response too slow

- Gemini takes 3-10s per request (normal)
- Vercel cold starts: +1-2s first request
- Subsequent requests are faster
- Upgrade Vercel plan if needed

---

## Production Checklist

- [ ] `.env.local` is in `.gitignore` (never commit!)
- [ ] `vercel.json` has correct `buildCommand`
- [ ] Vercel console has `GOOGLE_API_KEY` env var
- [ ] `npm run check-env` passes locally
- [ ] `npm run dev` works locally
- [ ] Interview flow tested (5 questions → profile)
- [ ] CSV upload tested
- [ ] Dashboard renders correctly (RTL Hebrew)
- [ ] `git push` triggers Vercel deploy
- [ ] Vercel build succeeds (see Deployments tab)

---

## Gemini API Limits

- **Free tier:** 15 requests/minute, 1500/day
- **Paid:** Pay-as-you-go (~$0.075 per 1M input tokens)
- **Quota:** Check at https://aistudio.google.com/app/usage

If you hit limits:
1. Upgrade API tier at Google Cloud Console
2. Implement rate limiting (coming soon)
3. Cache responses per student

---

## Next Steps

1. ✅ Local dev works
2. ✅ Deployed to Vercel
3. 📊 Monitor usage: https://vercel.com/analytics
4. 🔍 Check logs: `vercel logs`
5. 📈 Scale as needed (Vercel Pro, Google Cloud upgrade)

---

**Questions?** Check README.md or QUICK_START.md
