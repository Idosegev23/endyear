import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LEADERS 2025 - סיכום שנה",
  description: "סיכום שנה אינטראקטיבי של חברת LEADERS לשנת 2025",
  keywords: ["LEADERS", "2025", "סיכום שנה", "Year Recap"],
  authors: [{ name: "LEADERS" }],
  openGraph: {
    title: "LEADERS 2025 - סיכום שנה",
    description: "סיכום שנה אינטראקטיבי של חברת LEADERS לשנת 2025",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;500;600;700;800;900&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="antialiased">
        {/* Grain Overlay */}
        <div className="grain-overlay" />
        
        {/* Main Content */}
        {children}
      </body>
    </html>
  );
}
