# 🚨 Vercel Deployment Fix

## The Problem
Vercel deployment created but **no env var** was set → build succeeds but app crashes without API key.

## The Solution (Professional One-Step)

### Vercel Console (1 minute, browser)
1. Go to: https://vercel.com/dvorycheshs-projects/gilu-16-3/settings/environment-variables
2. **Add Environment Variable:**
   - **Name:** `GOOGLE_API_KEY`
   - **Value:** `AIzaSyDhAGYBNZfXJMcov4LhrA5kJdWy6q1yrUM`
   - **Scopes:** ✅ Production, ✅ Preview, ✅ Development (all checked)
3. Click **"Save"**
4. Go to **Deployments** tab
5. Click **"Redeploy"** on latest deployment (or push a commit to trigger new deploy)

**Then in 2 minutes:** https://gilu-16-3.vercel.app works! 🎉

---

## Alternative: Test Locally (No Vercel needed)

```bash
cd "C:\Users\dvory\OneDrive\שולחן העבודה\gilu16.3"
npm run dev
```

Then open: http://localhost:3000

**Works immediately.** No setup needed. Share via `ngrok` if needed.

---

## Why This Matters
- Vercel env vars are **required** for production
- Set once → all future deployments use it automatically
- Takes literally 60 seconds

**That's it.** No more debugging needed. 🎯
