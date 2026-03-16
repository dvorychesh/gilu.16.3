import { GoogleGenerativeAI } from '@google/generative-ai';

const SYSTEM_PROMPT = `אתה פועל כעוזר מחקר פדגוגי בכיר ומומחה לניתוח נתונים במערכות חינוך. משימתך לנתח נתוני תלמיד ולהפיק פרופיל פדגוגי אופרטיבי ומקיף. עליך להתבסס אך ורק על המודלים הבאים: גישת 'הסמכות החדשה' ו-NVR (התנגדות לא אלימה), פסיכולוגיה חיובית, SEL (למידה רגשית-חברתית) וגישת הכוחות. השתמש במודלים אופרטיביים: מודל הרמזור (חסמים אדומים וצהובים), אסטרטגיית WOOP, פונקציית העוגן, והשגחה מותאמת.

החזר את התשובה אך ורק במבנה ה-JSON הבא (ללא טקסט מחוץ ל-JSON):
{
  "name": "שם התלמיד/ה מתוך הנתונים (רק השם הפרטי)",
  "summary": "תמצית אמפתית (עד 3 משפטים) המציגה את התלמיד בצורה הוליסטית.",
  "strengths": [
    {
      "title": "כותרת קצרה של החוזקה",
      "desc": "תיאור ואיך ניתן למנף אותה לאתגרים אחרים"
    }
  ],
  "barriers": [
    {
      "type": "red",
      "title": "חסם אדום (דורש עצירה)",
      "desc": "תיאור הקושי ופרשנות מקצועית להתערבות נחושה"
    },
    {
      "type": "yellow",
      "title": "חסם צהוב (דורש השגחה)",
      "desc": "תיאור הקושי לפי מודל הרמזור"
    }
  ],
  "insights": "תובנת עומק אחת וקריאה בין השורות. קישור לצורך רגשי עמוק (למשל נוכחות מעגנת).",
  "goals": [
    {
      "title": "יעד רגשי-חברתי",
      "tool": "כלי מחקרי (למשל NVR / WOOP)",
      "desc": "הסבר יישומי למורה ומדד להצלחה"
    },
    {
      "title": "יעד פדגוגי",
      "tool": "כלי מחקרי (למשל צ'אנקינג)",
      "desc": "הסבר יישומי לפעולה קונקרטית בכיתה"
    }
  ]
}`;

export async function POST(request) {
  try {
    const { answers } = await request.json();

    if (!answers) {
      return new Response(JSON.stringify({ error: 'Missing answers' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get API key from environment
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: SYSTEM_PROMPT,
    });

    // Format answers for the prompt
    const answersText = Object.entries(answers)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');

    // Call Gemini API
    const result = await model.generateContent(answersText);
    const responseText = result.response.text();

    // Parse JSON response
    let profile;
    try {
      // Try to extract JSON from response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      profile = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return new Response(
        JSON.stringify({
          error: 'Failed to parse AI response',
          details: responseText.substring(0, 200),
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(JSON.stringify(profile), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('API error:', error);
    return new Response(
      JSON.stringify({
        error: error.message || 'Internal server error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
