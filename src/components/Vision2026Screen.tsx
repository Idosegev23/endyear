'use client';

import { motion } from 'framer-motion';
import { useAppStore } from '@/lib/store';

export function Vision2026Screen() {
  const setScene = useAppStore((state) => state.setScene);
  
  const visionData = {
    intro: 'ב-2026 LEADERS פועלת כארגון מבוסס AI מקצה לקצה. CRM חכם ואוטומציות מתקדמות מורידים כמעט לחלוטין עבודה טכנית ידנית, ומאפשרים ניהול יעיל של לקוחות, משפיענים ותהליכים.',
    bullets: [
      { title: 'אוטומציות והורדת טכנאות', description: 'המערכות עובדות בשבילנו ולא אנחנו בשבילן' },
      { title: 'מודול ספקים ותהליכים בכספים', description: 'מענה אוטומטי לספקים ותהליכים מסודרים' },
      { title: 'מערכת פרודוקטיביות וכלי AI', description: 'הטמעה וייעול באופן קבוע כדי להישאר יעילים' },
      { title: 'שיווק לידרס', description: 'הסנדלר לא ילך יחף יותר' },
      { title: 'עבודה על 200 לקוחות קבועים', description: 'החדרת מוצר רלוונטי - פיתוח עסקי' },
      { title: 'חיזוק אופליין-אונליין', description: 'שילוב עולמות לחוויה שלמה' },
      { title: 'קהילת משפיעני הפצה ו-UGC', description: 'בניית קהילה פעילה ומעורבת' },
      { title: 'מחלקת קריאטיב AI', description: 'גיוס מומחה AI ויוצרת תוכן AI' },
    ],
    targets: [
      { title: 'הגדלת הכנסות', value: '25%' },
      { title: 'לקוחות קבועים', value: '200' },
    ]
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-b from-near-black to-[#1a1a2e] text-white"
    >
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => setScene('chat')}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          חזרה לצ׳אט
        </button>
        <img src="/logo.png" alt="LEADERS" className="h-6 w-auto" />
      </header>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-main/20 rounded-md mb-6">
            <div className="w-2 h-2 rounded-sm bg-gold-main" />
            <span className="text-gold-main text-sm font-medium">Welcome</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">2026</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto leading-relaxed">
            {visionData.intro}
          </p>
        </motion.div>

        {/* Targets */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex justify-center gap-12 mb-12"
        >
          {visionData.targets.map((target, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-gold-main mb-2">
                {target.value}
              </div>
              <div className="text-gray-400">{target.title}</div>
            </div>
          ))}
        </motion.div>

        {/* Vision Bullets */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {visionData.bullets.map((bullet, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-5 hover:bg-white/10 transition-colors"
            >
              <div className="w-8 h-8 rounded-md bg-gold-main/20 flex items-center justify-center mb-3">
                <span className="text-gold-main font-bold text-sm">{index + 1}</span>
              </div>
              <h3 className="font-semibold mb-1.5">{bullet.title}</h3>
              <p className="text-gray-400 text-sm">{bullet.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Back to Chat CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="text-center mt-12"
        >
          <button
            onClick={() => setScene('chat')}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gold-main text-near-black rounded-md font-semibold hover:bg-gold-main/90 transition-colors"
          >
            חזרה לצ׳אט
            <svg className="w-5 h-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
