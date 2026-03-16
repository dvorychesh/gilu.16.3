import './globals.css';

export const metadata = {
  title: 'גילוי נאות - פרופיל תלמיד הוליסטי',
  description: 'סיוע פדגוגי מתקדם עם AI',
};

export default function RootLayout({ children }) {
  return (
    <html lang="he">
      <body>{children}</body>
    </html>
  );
}
