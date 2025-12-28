// סדר השאלות לפי התסריט
export interface FlowQuestion {
  id: string;
  question: string;
  intentId: string;
}

export const flowQuestions: FlowQuestion[] = [
  {
    id: 'q1',
    question: 'תן לי ראשי פרקים לסיכום השנה',
    intentId: 'YEAR_RECAP_HEADLINES'
  },
  {
    id: 'q2',
    question: 'מי היה לקוח הכיס העמוק שלנו?',
    intentId: 'TOP_REVENUE_CLIENT_2025'
  },
  {
    id: 'q3',
    question: 'כמה כוסות קפה זה ההכנסות שלנו?',
    intentId: 'COFFEE_TO_REVENUE'
  },
  {
    id: 'q4',
    question: 'מה היה הרבעון הכי חזק?',
    intentId: 'STRONGEST_QUARTER'
  },
  {
    id: 'q5',
    question: 'מי בילה הכי הרבה במטבח ליד הקפה?',
    intentId: 'COFFEE_CORNER_JOKE'
  },
  {
    id: 'q6',
    question: 'איזה קמפיין שבר את הרשת?',
    intentId: 'VIRAL_CAMPAIGN_2025'
  },
  {
    id: 'q7',
    question: 'אילו 3 מילים הופיעו הכי הרבה בפידבקים?',
    intentId: 'CLIENT_FEEDBACK_KEYWORDS'
  },
  {
    id: 'q8',
    question: 'כמה זמן חסכנו עם AI?',
    intentId: 'AI_TIME_SAVINGS'
  },
  {
    id: 'q9',
    question: 'מה היה הפרויקט הכי מורכב טכנולוגית?',
    intentId: 'ENZO_SODASTREAM'
  },
  {
    id: 'q10',
    question: 'מה ה-ROI הכי מרשים שעשינו?',
    intentId: 'ROI_BEST'
  },
  {
    id: 'q11',
    question: 'מה המשפט הכי נפוץ בפגישות וידאו?',
    intentId: 'MOST_COMMON_MEETING_PHRASE'
  },
  {
    id: 'q12',
    question: 'כמה אירועי חברה וגיבושים היו?',
    intentId: 'CULTURE_EVENTS'
  },
  {
    id: 'q13',
    question: 'איזה צוות שיאני הביצועים?',
    intentId: 'TOP_PERFORMING_TEAM'
  },
  {
    id: 'q14',
    question: 'מה ה-DNA של לידרס?',
    intentId: 'COMPANY_DNA'
  },
  {
    id: 'q15',
    question: 'מתי הכי פחות פרודוקטיביים?',
    intentId: 'LEAST_PRODUCTIVE_TIME'
  },
  {
    id: 'q16',
    question: 'איפה לידרס תהיה בסוף 2026?',
    intentId: 'GROWTH_FORECAST'
  },
  {
    id: 'q17',
    question: 'מי היועצים שמלווים אותנו?',
    intentId: 'CONSULTANTS'
  },
  {
    id: 'q18',
    question: 'ספר לי על לידרס ב-2026',
    intentId: 'VISION_2026_INTRO'
  },
  {
    id: 'q19',
    question: 'תכתוב שיר ראפ לסיכום!',
    intentId: 'RAP_SUMMARY'
  }
];

// מחזיר את 2-3 השאלות הבאות לפי ה-intent האחרון
export function getNextQuestions(lastIntentId: string | null, askedIntents: string[]): FlowQuestion[] {
  // מוצא את האינדקס של ה-intent האחרון
  let startIndex = 0;
  
  if (lastIntentId) {
    const lastIndex = flowQuestions.findIndex(q => q.intentId === lastIntentId);
    if (lastIndex !== -1) {
      startIndex = lastIndex + 1;
    }
  }
  
  // מסנן שאלות שכבר נשאלו ולוקח 2-3 הבאות
  const availableQuestions = flowQuestions
    .slice(startIndex)
    .filter(q => !askedIntents.includes(q.intentId));
  
  return availableQuestions.slice(0, 3);
}

// שאלות פתיחה
export function getOpeningQuestions(): FlowQuestion[] {
  return flowQuestions.slice(0, 3);
}

