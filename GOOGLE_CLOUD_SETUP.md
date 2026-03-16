# 🔐 Google Cloud Setup — Production API Key

AI Studio (free tier) is unstable. Use **Google Cloud** for production-grade stability.

## Step 1: Create Google Cloud Project

1. Go to https://console.cloud.google.com
2. Click **"Select a Project"** (top left)
3. Click **"New Project"**
4. Name: `gilui-naot-prod`
5. Organization: (leave default or select yours)
6. Click **"Create"**
7. Wait for project to be created (~1 min)

## Step 2: Enable Gemini API

1. Search for **"Generative AI API"** in the search bar
2. Click on **"Generative Language API"**
3. Click **"Enable"**
4. Wait for it to be enabled

## Step 3: Create API Key (Recommended for Next.js)

### Option A: Browser/Web API Key (Easiest)

1. Go to **APIs & Services** → **Credentials**
2. Click **"+ Create Credentials"** → **API Key**
3. Click on the **key** to open details
4. Restrict to: **Generative Language API** only
5. Application restrictions: **HTTP referrers**
   - Add: `https://yourdomain.vercel.app`
   - Add: `http://localhost:3000` (dev)
6. Copy the key

### Option B: Service Account (More Secure)

1. Go to **APIs & Services** → **Credentials**
2. Click **"+ Create Credentials"** → **Service Account**
3. Name: `gilui-naot-app`
4. Click **"Create and Continue"**
5. Grant role: **Editor** (or custom: Generative Language API User)
6. Click **"Continue"** → **"Done"**
7. Click on the service account
8. Go to **Keys** tab
9. Click **"Add Key"** → **Create new key**
10. Select **JSON**
11. Click **"Create"** (downloads JSON file)
12. Copy content to `.env.local`:

```bash
# .env.local
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_CLOUD_SERVICE_ACCOUNT_JSON={full json content}
```

## Step 4: Set Up Billing

1. Go to **Billing** (left menu)
2. Click **"Link Billing Account"**
3. Create new account or select existing
4. Add payment method (credit card)
5. Click **"Link Account"**

### Set Budget Alert

1. Go to **Billing** → **Budgets & Alerts**
2. Click **"Create Budget"**
3. Budget: `$10/month` (adjust as needed)
4. Alert threshold: `50%`, `90%`, `100%`
5. Email: your email
6. Click **"Create"**

## Step 5: Update Code

Update `app/api/analyze/route.js` to use Google Cloud:

```javascript
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request) {
  try {
    const { answers } = await request.json();

    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: SYSTEM_PROMPT,
    });

    const answersText = Object.entries(answers)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');

    const result = await model.generateContent(answersText);
    const responseText = result.response.text();

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in response');

    const profile = JSON.parse(jsonMatch[0]);

    return new Response(JSON.stringify(profile), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('API error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
```

## Step 6: Local Development

Create `.env.local`:

```bash
# Option A: Simple API Key
GOOGLE_API_KEY=AIza...

# Option B: Service Account (if using)
GOOGLE_CLOUD_PROJECT_ID=gilui-naot-prod
GOOGLE_CLOUD_SERVICE_ACCOUNT_EMAIL=gilui-naot-app@project.iam.gserviceaccount.com
```

Test locally:
```bash
npm run dev
```

## Step 7: Deploy to Vercel

1. In Vercel console → Project Settings → Environment Variables
2. Add:
   ```
   GOOGLE_API_KEY = AIza...
   ```
3. Scope: Production, Preview, Development
4. **Save & Redeploy**

Or via CLI:
```bash
vercel env add GOOGLE_API_KEY
# Paste your key
# Select all scopes
vercel deploy --prod
```

## Step 8: Monitor Usage

### In Google Cloud Console

1. **APIs & Services** → **Quotas**
   - Monitor Generative Language API usage

2. **Billing** → **Reports**
   - Track costs
   - Set up alerts

3. **Logging** → **Cloud Logging**
   - View API call logs
   - Debug errors

### In Vercel

1. **Analytics** → **Web Vitals**
2. **Logs** → View API errors
3. **Deployments** → Build logs

## Pricing

| Metric | Price |
|--------|-------|
| Input tokens (1M) | $0.075 |
| Output tokens (1M) | $0.3 |
| Free tier | 15 req/min, 1500/day |
| Paid tier | Pay as you go |

**Typical cost:**
- 100 student profiles/day = ~$1-2/month
- 1000 profiles/day = ~$10-20/month

## Quotas & Limits

Default quotas (can be increased):
- **Requests per minute:** 600
- **Requests per day:** 100,000
- **Concurrent requests:** 100

To increase: **APIs & Services** → **Quotas** → Select API → Click quota → Edit quotas

## Troubleshooting

### "API key not valid"
- Verify key is correct in `.env.local`
- Check API is enabled in Cloud Console
- Wait 60s for new keys to activate

### "Quota exceeded"
- Check quotas in Cloud Console
- Request increase (takes 1-2 days)
- Implement rate limiting (see below)

### "Project not set up"
- Ensure billing is enabled
- Ensure Generative Language API is enabled
- Check service account has correct roles

## Rate Limiting (Optional)

To prevent abuse, implement rate limiting in `app/api/analyze/route.js`:

```javascript
const requestCounts = new Map();

export async function POST(request) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const now = Date.now();
  const count = requestCounts.get(ip) || [];

  // Remove requests older than 1 hour
  const recentRequests = count.filter(t => now - t < 3600000);

  if (recentRequests.length >= 20) {
    return new Response(
      JSON.stringify({ error: 'Rate limit exceeded (20/hour)' }),
      { status: 429, headers: { 'Content-Type': 'application/json' } }
    );
  }

  requestCounts.set(ip, [...recentRequests, now]);

  // ... rest of API logic
}
```

## Security Best Practices

1. ✅ Never commit `.env.local` to git
2. ✅ Use API key restrictions (HTTP referrers + API)
3. ✅ Set budget alerts
4. ✅ Monitor quotas regularly
5. ✅ Rotate keys every 90 days
6. ✅ Use different keys for dev/prod
7. ✅ Enable Cloud Audit Logs

## Support

- **Google Cloud Docs:** https://cloud.google.com/docs/generative-ai
- **Gemini API Docs:** https://ai.google.dev/docs
- **Billing Issues:** https://console.cloud.google.com/billing

---

**Now you have production-grade stability!** 🚀
