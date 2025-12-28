// סדר השאלות לפי התסריט המדויק - בסגנון show hosting
export interface FlowQuestion {
  id: string;
  question: string; // מה איתמר כותב/לוחץ
  botIntro: string; // מה הבוט אומר לפני
  intentId: string;
}

export const flowQuestions: FlowQuestion[] = [
  {
    id: 'q1',
    question: 'כן, בוא נתחיל',
    botIntro: 'איתמר, יאלה בוא נתחיל.. שנציג להם את ראשי הפרקים?',
    intentId: 'YEAR_RECAP_HEADLINES'
  },
  {
    id: 'q2',
    question: 'תמציתי יותר בבקשה',
    botIntro: 'איתמר, חפרנו להם קצת... רוצה גרסה יותר קצרה?',
    intentId: 'YEAR_RECAP_SHORT'
  },
  {
    id: 'q3',
    question: 'כן, בוא נראה',
    botIntro: 'עכשיו משהו מעניין - בואו נראה מי היה לקוח הכיס העמוק שלנו?',
    intentId: 'TOP_REVENUE_CLIENT_2025'
  },
  {
    id: 'q4',
    question: 'בינוני',
    botIntro: 'שאלה חשובה - אם היינו ממירים את כל ההכנסות לכוסות קפה בארומה... איזה גודל קפה, איתמר?',
    intentId: 'COFFEE_TO_REVENUE'
  },
  {
    id: 'q5',
    question: 'ספר לנו',
    botIntro: 'איתמר רוצה לדעת - מה היה הרבעון הכי חזק שלנו?',
    intentId: 'STRONGEST_QUARTER'
  },
  {
    id: 'q6',
    question: 'דווקא כן!',
    botIntro: 'תגידו, בא לכם לגלות מי בילה הכי הרבה במטבח ליד מכונת הקפה?',
    intentId: 'COFFEE_CORNER_JOKE'
  },
  {
    id: 'q7',
    question: 'בטח!',
    botIntro: 'ועכשיו הרגע שכולם מחכים לו - איזה קמפיין שבר את הרשת?',
    intentId: 'VIRAL_CAMPAIGN_2025'
  },
  {
    id: 'q8',
    question: 'מה יצא?',
    botIntro: 'סקרנים לדעת - אילו 3 מילים הופיעו הכי הרבה בפידבקים מהלקוחות?',
    intentId: 'CLIENT_FEEDBACK_KEYWORDS'
  },
  {
    id: 'q9',
    question: 'תראה לנו',
    botIntro: 'עכשיו משהו שממש גאים בו - כמה זמן חסכנו בזכות AI?',
    intentId: 'AI_TIME_SAVINGS'
  },
  {
    id: 'q10',
    question: 'ספר!',
    botIntro: 'הפרויקט הכי מורכב טכנולוגית שפיצחנו השנה - מי יודע מה זה?',
    intentId: 'ENZO_SODASTREAM'
  },
  {
    id: 'q11',
    question: 'תן לנו מספר',
    botIntro: 'רוצים לשמוע נתון שישאיר אתכם פתוחים? ה-ROI הכי מרשים שעשינו...',
    intentId: 'ROI_BEST'
  },
  {
    id: 'q12',
    question: 'הא?',
    botIntro: 'ועכשיו קצת הומור - מה המשפט הכי נפוץ שנאמר בפגישות הוידאו שלנו?',
    intentId: 'MOST_COMMON_MEETING_PHRASE'
  },
  {
    id: 'q13',
    question: 'תסכם',
    botIntro: 'בואו נדבר על הווי - כמה אירועים, גיבושים וחמישי שמח היו השנה?',
    intentId: 'CULTURE_EVENTS'
  },
  {
    id: 'q14',
    question: 'מי זה?',
    botIntro: 'והצוות שמחזיק בתואר שיאני הביצועים של 2025...',
    intentId: 'TOP_PERFORMING_TEAM'
  },
  {
    id: 'q15',
    question: 'נשמע מעניין',
    botIntro: 'איתמר, בוא נזקק את ה-DNA של לידרס - 5 ערכים שמגדירים אותנו:',
    intentId: 'COMPANY_DNA'
  },
  {
    id: 'q16',
    question: 'אמת?',
    botIntro: 'ועכשיו אמת קטנה - מתי אנחנו הכי פחות פרודוקטיביים?',
    intentId: 'LEAST_PRODUCTIVE_TIME'
  },
  {
    id: 'q17',
    question: 'ספר לנו',
    botIntro: 'בואו נסתכל קדימה - איפה לידרס תהיה בסוף 2026?',
    intentId: 'GROWTH_FORECAST'
  },
  {
    id: 'q18',
    question: 'הציגו אותם',
    botIntro: 'לפני שנמשיך - בואו נכיר את היועצים המדהימים שמלווים אותנו:',
    intentId: 'CONSULTANTS'
  },
  {
    id: 'q19',
    question: 'מוכן!',
    botIntro: 'ועכשיו הרגע הגדול - Welcome 2026! איתמר, מוכן?',
    intentId: 'VISION_2026_INTRO'
  },
  {
    id: 'q20',
    question: 'יאלה!',
    botIntro: 'ולסיום - שיר ראפ קצר שחוגג את כל מה שעשינו!',
    intentId: 'RAP_SUMMARY'
  }
];

// מחזיר את השאלה הבאה לפי ה-intent האחרון
export function getNextQuestion(lastIntentId: string | null, askedIntents: string[]): FlowQuestion | null {
  let startIndex = 0;
  
  if (lastIntentId) {
    const lastIndex = flowQuestions.findIndex(q => q.intentId === lastIntentId);
    if (lastIndex !== -1) {
      startIndex = lastIndex + 1;
    }
  }
  
  const availableQuestions = flowQuestions
    .slice(startIndex)
    .filter(q => !askedIntents.includes(q.intentId));
  
  return availableQuestions[0] || null;
}

// שאלה ראשונה
export function getOpeningQuestion(): FlowQuestion {
  return flowQuestions[0];
}

// For backwards compatibility
export function getNextQuestions(lastIntentId: string | null, askedIntents: string[]): FlowQuestion[] {
  const next = getNextQuestion(lastIntentId, askedIntents);
  return next ? [next] : [];
}

export function getOpeningQuestions(): FlowQuestion[] {
  return [flowQuestions[0]];
}
