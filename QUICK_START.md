# 🚀 Quick Start

## צעד 1️⃣ — קבל Google API Key

1. עבור ל- https://aistudio.google.com/app/apikeys
2. לחץ על "Create API Key"
3. בחר "Create API key in new Google Cloud project"
4. העתק את ה-key

## צעד 2️⃣ — הגדר environment

```bash
# בתיקייה gilu16.3
cp .env.local.example .env.local

# ערוך את .env.local
# הדבק את ה-API Key שלך:
# GOOGLE_API_KEY=sk-...
```

## צעד 3️⃣ — התקן dependencies

```bash
npm install
```

## צעד 4️⃣ — הרץ את האפליקציה

```bash
npm run dev
```

פתח את http://localhost:3000 בדפדפן

## 🎯 זה הכל!

אתה יכול עכשיו:
✅ בחר בראיון פדגוגי או העלאת CSV
✅ ענה על השאלות או העלה קובץ
✅ ראה את הפרופיל של התלמיד מ-AI

## 📝 שם תשובות עבור CSV

אם אתה משתמש בـ CSV, השורה הראשונה צריכה להיות:

```
personal,strengths,cognitive,communication,challenges
יעל כהן...,מגלה סקרנות...,משלבת חשיבה...,תקשורת ברורה...,קשה לה להקשיב...
```

## 🔧 פתרון בעיות

**"Module not found"?**
```bash
rm -rf node_modules package-lock.json
npm install
```

**"API key not configured"?**
- בדוק שיש `.env.local` בתיקייה הראשית
- אימת את ה-key בקובץ

**גימיני לא מחזיר JSON תקין?**
- בדוק את ה-system prompt ב- `app/api/analyze/route.js`
- סביר שצריך לתיקון הוראות

---

**הערה:** אם Python לא זמין וצריך להמיר docx → txt, אני יכול להוציא קבצים דרך NodeJS.
