'use client';

import React, { useState, useRef } from 'react';
import {
  Brain,
  Heart,
  Target,
  AlertCircle,
  UploadCloud,
  ChevronLeft,
  BookOpen,
  Activity,
  Play,
  FileText,
  CheckCircle,
  Loader,
} from 'lucide-react';

const QUESTIONS = [
  {
    id: 'personal',
    title: 'היכרות ראשונית',
    desc: 'שם, כיתה וגיל התלמיד/ה',
    example: 'יעל כהן, י"א 3, 17',
    minWords: 1,
  },
  {
    id: 'strengths',
    title: 'מנופי הצלחה',
    desc: 'באילו תחומים מצטיינ/ת? מה מסקרן ומהווה מנוף ללמידה?',
    example: 'מגלה סקרנות בנושאים ערכיים, שואלת שאלות עומק, מחברת בין תחומי דעת.',
    minWords: 5,
  },
  {
    id: 'cognitive',
    title: 'דפוסים קוגניטיביים',
    desc: 'סגנון חשיבה (אנליטי/יצירתי), התמדה מול אתגר',
    example: 'משלבת חשיבה לוגית עם דמיון, נוטה לוותר כשההוראות נוקשות מדי.',
    minWords: 5,
  },
  {
    id: 'communication',
    title: 'שפה ותקשורת',
    desc: 'דרך הביטוי, יחסים חברתיים, קול וזהות',
    example: 'תקשורת ברורה וחכמה, מעדיפה קבוצות קטנות, מעצמת אחרים בדבריה.',
    minWords: 5,
  },
  {
    id: 'challenges',
    title: 'אתגרים וקשיים',
    desc: 'מה מקושה? הכאבים, הפחדים, הבדידות או הדחק?',
    example: 'קשה לה להקשיב ללא דירוג, נדחקת במחלוקות, חרדה מביצועים.',
    minWords: 5,
  },
];

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

export default function GiluiNaot() {
  const [view, setView] = useState('home'); // home, interview, upload, dashboard
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  // Mode A: Interview wizard
  const handleNextQuestion = () => {
    const answer = answers[QUESTIONS[currentQuestion].id];
    if (!answer || answer.trim().split(/\s+/).length < QUESTIONS[currentQuestion].minWords) {
      setError(`בבקשה ענה בפחות מ-${QUESTIONS[currentQuestion].minWords} מילים`);
      return;
    }
    setError(null);
    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      submitAnswers(answers);
    }
  };

  // Mode B: CSV upload
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const csv = event.target?.result;
        const lines = csv.split('\n');
        if (lines.length < 2) throw new Error('קובץ CSV לא תקין');

        const questions = lines[0].split(',').map((q) => q.trim());
        const data = lines[1].split(',').map((d) => d.trim());

        const csvAnswers = {};
        questions.forEach((q, i) => {
          csvAnswers[q.toLowerCase().replace(/\s+/g, '_')] = data[i] || '';
        });

        setAnswers(csvAnswers);
        submitAnswers(csvAnswers);
      } catch (err) {
        setError('שגיאה בקריאת הקובץ: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  // Submit to AI
  const submitAnswers = async (data) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: data }),
      });

      if (!response.ok) throw new Error('שגיאה בתקשורת עם השרת');

      const result = await response.json();
      setProfile(result);
      setView('dashboard');
    } catch (err) {
      setError(err.message || 'שגיאה לא צפויה');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setView('home');
    setAnswers({});
    setCurrentQuestion(0);
    setProfile(null);
    setError(null);
  };

  // ============= UI COMPONENTS =============

  if (view === 'dashboard' && profile) {
    return <DashboardView profile={profile} onReset={reset} />;
  }

  if (view === 'interview') {
    return (
      <InterviewView
        question={QUESTIONS[currentQuestion]}
        currentIndex={currentQuestion}
        totalQuestions={QUESTIONS.length}
        answer={answers[QUESTIONS[currentQuestion].id] || ''}
        onAnswerChange={(text) =>
          setAnswers({ ...answers, [QUESTIONS[currentQuestion].id]: text })
        }
        onNext={handleNextQuestion}
        onBack={
          currentQuestion > 0
            ? () => setCurrentQuestion(currentQuestion - 1)
            : () => setView('home')
        }
        error={error}
        loading={loading}
      />
    );
  }

  if (view === 'upload') {
    return (
      <UploadView
        onFileUpload={handleFileUpload}
        onBack={() => setView('home')}
        loading={loading}
        error={error}
        fileInputRef={fileInputRef}
      />
    );
  }

  return <HomeView onSelectMode={(mode) => setView(mode)} />;
}

// ============= HOME VIEW =============
function HomeView({ onSelectMode }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        <div className="mb-8">
          <Brain className="w-16 h-16 mx-auto text-primary mb-4" />
          <h1 className="text-5xl font-bold text-gray-900 mb-2">גילוי נאות</h1>
          <p className="text-xl text-gray-600">פרופיל תלמיד הוליסטי עם בינה מלאכותית</p>
        </div>

        <p className="text-lg text-gray-700 mb-12">
          בחר את הדרך הנוחה לך להעניק לתלמידותיך ניתוח עמוק וממוקד.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Mode A */}
          <button
            onClick={() => onSelectMode('interview')}
            className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition border-2 border-primary hover:border-opacity-80"
          >
            <BookOpen className="w-12 h-12 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">ראיון פדגוגי</h2>
            <p className="text-gray-600 mb-6">
              תשובה לשאלות דוקטרינריות שלב אחרי שלב
            </p>
            <button className="flex items-center justify-center gap-2 text-primary font-semibold">
              <Play className="w-5 h-5" />
              התחל עכשיו
            </button>
          </button>

          {/* Mode B */}
          <button
            onClick={() => onSelectMode('upload')}
            className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition border-2 border-accent hover:border-opacity-80"
          >
            <UploadCloud className="w-12 h-12 text-accent mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">העלאת נתונים</h2>
            <p className="text-gray-600 mb-6">
              העלה קובץ Excel או CSV עם נתוני התלמיד
            </p>
            <button className="flex items-center justify-center gap-2 text-accent font-semibold">
              <FileText className="w-5 h-5" />
              בחר קובץ
            </button>
          </button>
        </div>
      </div>
    </div>
  );
}

// ============= INTERVIEW VIEW =============
function InterviewView({
  question,
  currentIndex,
  totalQuestions,
  answer,
  onAnswerChange,
  onNext,
  onBack,
  error,
  loading,
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-primary hover:text-indigo-700 mb-6 font-semibold"
          >
            <ChevronLeft className="w-5 h-5" />
            חזור
          </button>

          <div className="bg-white rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-500">
                שאלה {currentIndex + 1} מתוך {totalQuestions}
              </span>
              <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{
                    width: `${((currentIndex + 1) / totalQuestions) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {question.title}
          </h2>
          <p className="text-lg text-gray-600 mb-6">{question.desc}</p>

          {question.example && (
            <div className="bg-indigo-50 rounded-lg p-4 mb-8 border-r-4 border-primary">
              <p className="text-sm font-semibold text-gray-700 mb-1">דוגמא:</p>
              <p className="text-gray-700 italic">{question.example}</p>
            </div>
          )}

          {/* Textarea */}
          <textarea
            value={answer}
            onChange={(e) => onAnswerChange(e.target.value)}
            placeholder="כתוב את התשובה שלך כאן..."
            className="w-full h-32 p-4 border-2 border-gray-200 rounded-lg resize-none focus:outline-none focus:border-primary"
          />

          {error && (
            <div className="flex items-start gap-3 bg-red-50 border-r-4 border-red-500 p-4 rounded mt-4 text-red-700">
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8">
            <button
              onClick={onNext}
              disabled={loading}
              className="flex-1 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  מעבדים...
                </>
              ) : currentIndex === totalQuestions - 1 ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  שלח תשובות
                </>
              ) : (
                <>
                  הבא <ChevronLeft className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============= UPLOAD VIEW =============
function UploadView({ onFileUpload, onBack, loading, error, fileInputRef }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-primary hover:text-indigo-700 mb-8 font-semibold"
        >
          <ChevronLeft className="w-5 h-5" />
          חזור
        </button>

        <div className="bg-white rounded-2xl p-12 shadow-lg text-center">
          <UploadCloud className="w-16 h-16 text-accent mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-2">העלאת קובץ</h2>
          <p className="text-gray-600 mb-8">
            בחר קובץ CSV או Excel עם נתוני התלמידות
          </p>

          <div
            className="border-2 border-dashed border-accent rounded-lg p-8 mb-8 cursor-pointer hover:bg-blue-50 transition"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={onFileUpload}
              className="hidden"
            />
            <UploadCloud className="w-12 h-12 text-accent mx-auto mb-2" />
            <p className="text-lg font-semibold text-gray-900">
              לחץ כדי לבחור קובץ
            </p>
            <p className="text-sm text-gray-500">או גרור קובץ לכאן</p>
          </div>

          {error && (
            <div className="flex items-start gap-3 bg-red-50 border-r-4 border-red-500 p-4 rounded text-red-700">
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {loading && (
            <div className="flex items-center justify-center gap-2 text-primary font-semibold">
              <Loader className="w-5 h-5 animate-spin" />
              מעבדים קובץ...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============= DASHBOARD VIEW =============
function DashboardView({ profile, onReset }) {
  if (!profile) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={onReset}
            className="flex items-center gap-2 text-primary hover:text-indigo-700 font-semibold mb-6"
          >
            <ChevronLeft className="w-5 h-5" />
            חזור לבית
          </button>

          <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              {profile.name}
            </h1>
            <p className="text-lg text-gray-700 leading-relaxed">
              {profile.summary}
            </p>
          </div>
        </div>

        {/* Strengths */}
        {profile.strengths && profile.strengths.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Heart className="w-6 h-6 text-green-500" />
              חוזקות
            </h2>
            <div className="grid gap-4">
              {profile.strengths.map((strength, i) => (
                <div
                  key={i}
                  className="bg-green-50 border-r-4 border-green-500 rounded-lg p-6"
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {strength.title}
                  </h3>
                  <p className="text-gray-700">{strength.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Barriers */}
        {profile.barriers && profile.barriers.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-red-500" />
              חסמים
            </h2>
            <div className="grid gap-4">
              {profile.barriers.map((barrier, i) => {
                const isRed = barrier.type === 'red';
                return (
                  <div
                    key={i}
                    className={`${
                      isRed
                        ? 'bg-red-50 border-r-4 border-red-500'
                        : 'bg-yellow-50 border-r-4 border-yellow-500'
                    } rounded-lg p-6`}
                  >
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {barrier.title}
                    </h3>
                    <p className="text-gray-700">{barrier.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Insights */}
        {profile.insights && (
          <div className="bg-purple-50 border-r-4 border-purple-500 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-2">תובנות</h2>
            <p className="text-gray-700">{profile.insights}</p>
          </div>
        )}

        {/* Goals */}
        {profile.goals && profile.goals.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Target className="w-6 h-6 text-blue-500" />
              יעדים
            </h2>
            <div className="grid gap-4">
              {profile.goals.map((goal, i) => (
                <div key={i} className="bg-blue-50 border-r-4 border-blue-500 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {goal.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>כלי:</strong> {goal.tool}
                  </p>
                  <p className="text-gray-700">{goal.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reset Button */}
        <div className="text-center">
          <button
            onClick={onReset}
            className="bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            בדוק תלמיד נוסף
          </button>
        </div>
      </div>
    </div>
  );
}
