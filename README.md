# גילוי נאות - Holistic Student Profile

**Next.js + Gemini AI** לניתוח הוליסטי של תלמידות עם דוקטרינה פדגוגית.

## 🎯 תכונות

- 🧠 **ראיון פדגוגי** — שאלות שלב אחרי שלב לעידוד הרהור עמוק
- 📊 **העלאת CSV/Excel** — ניתוח נתונים בכמות
- 🤖 **Gemini AI Integration** — ניתוח מתקדם עם בינה מלאכותית
- 💅 **TailwindCSS + RTL** — ממשק מודרני וידידותי לעברית
- 📱 **Responsive Design** — עובד על כל המסכנים

## 🚀 Setup

### דרישות מקדימות
- Node.js 18+
- Google Gemini API Key ([קבל כאן](https://aistudio.google.com/app/apikeys))

### התקנה

1. **Clone/Navigate לתיקייה**
   ```bash
   cd gilu16.3
   ```

2. **התקן dependencies**
   ```bash
   npm install
   ```

3. **הגדר environment variables**
   ```bash
   cp .env.local.example .env.local
   # ערוך את .env.local והוסף את ה-API key שלך
   ```

4. **הרץ את development server**
   ```bash
   npm run dev
   ```

5. **פתח ב-browser**
   ```
   http://localhost:3000
   ```

## 📁 מבנה הפרויקט

```
gilu16.3/
├── app/
│   ├── layout.jsx          # Root layout
│   ├── page.jsx            # Main application (all flows)
│   ├── globals.css         # Tailwind + RTL
│   └── api/
│       └── analyze/
│           └── route.js    # Gemini API endpoint
├── public/                 # Static assets
├── package.json
├── tailwind.config.js
├── next.config.js
└── tsconfig.json
```

## 🔧 API Integration

המערכת משתמשת בـ **Google Generative AI (Gemini 2.5 Flash)**.

### System Prompt
מערכת הפרומפט מכילה:
- אנליזת פדגוגית מתקדמת
- מודלים: NVR, SEL, Slow Education, Positive Psychology
- יעדים רגשיים-חברתיים + פדגוגיים
- מודל רמזור (חסמים אדומים/צהובים)

### Request/Response

**Request:**
```json
{
  "answers": {
    "personal": "שם, כיתה, גיל",
    "strengths": "...",
    "cognitive": "...",
    "communication": "...",
    "challenges": "..."
  }
}
```

**Response:**
```json
{
  "name": "...",
  "summary": "...",
  "strengths": [...],
  "barriers": [...],
  "insights": "...",
  "goals": [...]
}
```

## 📦 Dependencies

- **next** — Framework
- **react** — UI
- **tailwindcss** — Styling
- **lucide-react** — Icons
- **@google/generative-ai** — Gemini API client

## 🏗️ Build & Deploy

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 📝 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GOOGLE_API_KEY` | ✅ | Gemini API key |

## ⚠️ טיפים חשובים

1. **API Key Security** — לעולם אל תקומיט את `.env.local`!
2. **Rate Limiting** — Gemini בעל quota יומי (בדוק בקונסול)
3. **Error Handling** — הג'ימיני עלול לחזור JSON לא תקין — מוטל עליך לתקן
4. **RTL Support** — כל ה-CSS כבר RTL-ready (Heebo font + direction: rtl)

## 🐛 Troubleshooting

| בעיה | פתרון |
|------|--------|
| `API key not configured` | בדוק שיש `.env.local` עם `GOOGLE_API_KEY` |
| JSON parse error | Gemini חזר תשובה לא תקינה — שנה את ה-system prompt |
| Port 3000 in use | הרץ עם `npm run dev -- -p 3001` |

## 📄 License

MIT — Free to use and modify

---

**Built with 💚 by Claude**
