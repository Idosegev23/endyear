// Flow Engine - No AI needed, just smart pattern matching
import { flowQuestions, FlowQuestion } from './flowQuestions';
import dataPack from '@/data/leaders-2025.json';

export interface FlowResponse {
  intentId: string;
  answerText: string;
  visualPayload: {
    type: string;
    props: Record<string, unknown>;
  };
  nextQuestion: FlowQuestion | null;
}

// תגובות חיוביות שמפעילות את ה-intent הבא
const POSITIVE_RESPONSES = [
  'כן', 'יאלה', 'בוא', 'בואו', 'נתחיל', 'מתחילים', 'אוקי', 'ok', 'בסדר',
  'כן בוא', 'יאלה בוא', 'בטח', 'נשמע טוב', 'מעולה', 'יופי', 'קדימה',
  'כן נתחיל', 'בוא נתחיל', 'מוכן', 'מוכנים', 'תמשיך', 'הלאה', 'ספר',
  'ספר לנו', 'תן', 'תגיד', 'דבר', 'אמור', 'הראה', 'תראה', 'בינוני',
  'קטן', 'גדול', 'הפוך'
];

// מפת Intent לתשובות מובנות
const INTENT_RESPONSES: Record<string, (data: typeof dataPack) => FlowResponse['answerText']> = {
  'YEAR_RECAP_HEADLINES': () => `קיבלתי!\nהנה ראשי פרקים לסיכום 2025:\n\n1. פתיחה - שנה שלא מובנת מאליה\n2. היעדים שהצבנו מול מה שבפועל קרה\n3. אבני דרך והישגים מרכזיים\n4. חדשנות, ניסוי וטעייה\n5. אנשים ותרבות ארגונית\n6. אתגרים והתמודדויות\n7. התפתחות וצמיחה אישית\n8. מבט קדימה - 2026\n9. תודה וסגירה`,

  'YEAR_RECAP_SHORT': () => `קיבלתי, גרסת הלא-חופר:\n\n1. מה חשבנו שתהיה 2025 - ומה היא עשתה לנו בפועל\n2. 3 דברים שעבדו הרבה יותר ממה שציפינו\n3. 2 טעויות יקרות - ולמה הן שוות זהב\n4. רגע אחד שאם לא היינו שם - הוא לא היה קורה\n5. אנשים שעשו מעבר להגדרת התפקיד\n6. משהו אחד שהפסקנו לעשות - והשתפרנו\n7. אמת קצרה על עומסים, לחץ ואיך שרדנו\n8. מה אסור לנו לאבד גם כשגדלים\n9. משפט אחד על 2026 שלא נאמר עדיין`,

  'TOP_REVENUE_CLIENT_2025': (data) => {
    const clients = data.finance.top_revenue_clients;
    const colgate = clients[0];
    const seacret = clients[1];
    const tourism = clients[2];
    return `שאלה טריקית אבל מעניינת!\n\nהעבודה עם קולגייט הייתה בשנת 2024 סביב תקציב של ${(colgate.revenue_2024! / 1000000).toFixed(1)} מיליון שח.\nב-2025 התקציב קפץ ל-${(colgate.revenue_2025! / 1000000).toFixed(1)} מיליון שח - צמיחה של ${colgate.growth_pct}%!\n\nSeacret צמחה ב-${seacret.growth_pct}%.\n\nאבל הכוכב הכי מרשים? משרד התיירות עם קפיצה של ${tourism.growth_pct}%!\n\nכל הכבוד לצוותים של נועה, אלית ובתאל!`;
  },

  'COFFEE_TO_REVENUE': (data) => {
    const revenue = data.finance.total_revenue_2025;
    const price = data.finance.coffee_calculation.aroma_medium_price;
    const cups = data.finance.coffee_calculation.total_cups;
    const perEmployee = data.finance.coffee_calculation.cups_per_employee;
    return `אז סך ההכנסות של LEADERS ב-2025 עמדו על מעל ${(revenue / 1000000)} מיליון שח.\n\nאם נחלק את זה ב-${price} שח לכוס בינוני בארומה:\n${cups.toLocaleString()} כוסות!\n\nלחלק ל-${data.company.employees_count} עובדים = ${perEmployee.toLocaleString()} כוסות לכל עובד.\n\nאגב, מדובר בהמון קפאין שיביא המון יעילות!`;
  },

  'STRONGEST_QUARTER': (data) => {
    const deal = data.finance.strongest_quarter_deal;
    return `הרבעון הכי חזק בשנת 2025 היה רבעון ${data.finance.strongest_quarter.replace('Q', '')}.\n\nהעסקה החזקה ביותר הייתה עם ${deal.client} - מותגי הרכב ${deal.brands.join(' ו')}.\n\nמשפיענים: ${deal.influencers.join(', ')}\n\n${deal.team_credits.join('\n')}`;
  },

  'COFFEE_CORNER_JOKE': (data) => {
    const joke = data.culture.coffee_corner_joke;
    return `הנתונים מראים עלייה חריגה בצריכת הקפאין באזור השולחן של ${joke.most_coffee} אחרי שהתחלפו פולי הקפה.\n\nמומלץ לבדוק אם הוא ישן בלילה.\n\nלגבי זמן בפינת הקפה - ${joke.previous_champion} הייתה מספר אחת אבל ${joke.previous_note}.`;
  },

  'VIRAL_CAMPAIGN_2025': (data) => {
    const campaign = data.campaigns.viral_campaign_2025;
    return `ללא ספק המהלך של ${campaign.name} היה הקמפיין הכי ויראלי של LEADERS ב-2025!\n\n${campaign.top_influencer} הביאה יותר מ-${campaign.views.toLocaleString()} חשיפות!`;
  },

  'CLIENT_FEEDBACK_KEYWORDS': (data) => {
    const keywords = data.campaigns.client_feedback_keywords;
    return `אוקיי, אז המילה "${keywords[0].word}" ${keywords[0].note} חזרה על עצמה הכי הרבה פעמים.\n\nאחריה המילה "${keywords[1].word}"\n\nואחריה המילה "${keywords[2].word}" (${keywords[2].context})`;
  },

  'AI_TIME_SAVINGS': (data) => {
    const ai = data.ai;
    return `בזכות שימוש בכלי AI במחלקות השונות הצלחנו לחסוך ${ai.time_savings_pct}% בזמן העבודה.\n\n${ai.equivalent.weekly}!\n${ai.equivalent.yearly}!\n${ai.equivalent.hiring_equivalent}.\n\n${ai.summary}`;
  },

  'ENZO_SODASTREAM': (data) => {
    const enzo = data.campaigns.enzo_sodastream;
    const team = enzo.team.map(t => `${t.name} - ${t.role}`).join('\n');
    return `הפרויקט המורכב ביותר טכנולוגית היה ללא שום ספק מהלך השקת ה${enzo.name}.\n\n${enzo.description}:\n${enzo.highlights.slice(0, 3).join('\n')}\n\nהצוות:\n${team}\n\nציטוט מ${enzo.client_quote.from} ב${enzo.client_quote.time}: "${enzo.client_quote.word}"`;
  },

  'ROI_BEST': (data) => {
    const roi = data.finance.roi_best;
    return `ב${roi.month} עבדתם עם ${roi.client} בצורה ממוקדת ומדויקת.\n\nכל שקל שהושקע החזיר פי ${roi.roi}!\n\nROI ${roi.roi}.\n\n${roi.description}`;
  },

  'MOST_COMMON_MEETING_PHRASE': (data) => {
    return `תשמחו לגלות שהמשפט הנפוץ ביותר שנאמר בפגישות הוידאו שלכם היה:\n\n"${data.culture.most_common_meeting_phrase}"`;
  },

  'CULTURE_EVENTS': (data) => {
    const culture = data.culture;
    return `אז נראה שאתם בלידרס אוהבים ממש לחגוג!\n\nחמישי שמח: ${culture.thursday_happy_count} - הרוב היה ${culture.thursday_happy_highlight}\n\nאירועי חברה: ${culture.company_events.map(e => e.name).join(', ')}\n\n${culture.volunteering_description}`;
  },

  'TOP_PERFORMING_TEAM': (data) => {
    const team = data.kpi.top_performing_team;
    return `בעבודה מדויקת על ${team.client}, ${team.name} הצליח לייצר טירוף מכירות אמיתי!\n\nיעד: ${(team.target / 1000000).toFixed(0)} מיליון שח\nבפועל: ${(team.actual / 1000000).toFixed(2)} מיליון שח!\n\n${team.description}\n\n${team.result}`;
  },

  'COMPANY_DNA': (data) => {
    const values = data.dna.values;
    return `חמשת ערכי הליבה של לידרס:\n\n${values.map((v, i) => `${i + 1}. ${v.title}\n${v.description}`).join('\n\n')}`;
  },

  'LEAST_PRODUCTIVE_TIME': (data) => {
    const lpt = data.culture.least_productive_time;
    return `${lpt.when} ${lpt.description}.\n\n${lpt.recommendation}`;
  },

  'GROWTH_FORECAST': (data) => {
    const s1 = data.vision_2026.growth_scenarios.scenario_1;
    const s2 = data.vision_2026.growth_scenarios.scenario_2;
    return `שני תרחישים:\n\nתרחיש 1 - ${s1.name}:\nעובדים: ${s1.employees_growth} גידול\nהכנסות: ${s1.revenue_growth}, ${s1.multiplier}\n\nתרחיש 2 - ${s2.name}:\nעובדים: ${s2.employees_growth} גידול בלבד\nהכנסות: ${s2.revenue_growth}, ${s2.multiplier}\n${s2.notes}`;
  },

  'CONSULTANTS': (data) => {
    return `היועצים שמלווים אותנו:\n\n${data.consultants.map(c => `${c.name} - ${c.role}\n${c.description || ''}`).join('\n\n')}`;
  },

  'VISION_2026_INTRO': (data) => {
    return `${data.vision_2026.intro}\n\nהיעדים:\n${data.vision_2026.targets.map(t => `- ${t}`).join('\n')}`;
  },

  'RAP_SUMMARY': (data) => {
    return data.rap_summary.lyrics;
  }
};

// Visual payloads לכל intent
const INTENT_VISUALS: Record<string, (data: typeof dataPack) => FlowResponse['visualPayload']> = {
  'YEAR_RECAP_HEADLINES': (data) => ({
    type: 'VALUE_CARDS',
    props: {
      title: 'ראשי פרקים 2025',
      cards: data.topics.map(t => ({ title: t, description: '' }))
    }
  }),

  'YEAR_RECAP_SHORT': () => ({
    type: 'QUOTE_CARD',
    props: {
      quote: 'גרסת הלא-חופר',
      author: 'סיכום תמציתי שמייצר סקרנות'
    }
  }),

  'TOP_REVENUE_CLIENT_2025': (data) => ({
    type: 'LEADERBOARD',
    props: {
      title: 'לקוחות בצמיחה',
      items: data.finance.top_revenue_clients.slice(0, 4).map((c, i) => ({
        rank: i + 1,
        name: c.name,
        value: `${c.growth_pct}%`,
        subtitle: 'צמיחה'
      }))
    }
  }),

  'COFFEE_TO_REVENUE': (data) => ({
    type: 'KPI_BIG_NUMBER',
    props: {
      value: data.finance.coffee_calculation.total_cups,
      label: 'כוסות קפה',
      subtext: `${data.finance.coffee_calculation.cups_per_employee.toLocaleString()} לכל עובד`
    }
  }),

  'STRONGEST_QUARTER': (data) => ({
    type: 'VIDEO_EMBED',
    props: {
      url: data.finance.strongest_quarter_deal.video,
      title: `${data.finance.strongest_quarter_deal.client} - ${data.finance.strongest_quarter}`,
      description: data.finance.strongest_quarter_deal.video_description
    }
  }),

  'COFFEE_CORNER_JOKE': (data) => ({
    type: 'QUOTE_CARD',
    props: {
      quote: data.culture.most_common_meeting_phrase,
      author: data.culture.coffee_corner_joke.most_coffee
    }
  }),

  'VIRAL_CAMPAIGN_2025': (data) => ({
    type: 'VIDEO_EMBED',
    props: {
      url: data.campaigns.viral_campaign_2025.video,
      title: data.campaigns.viral_campaign_2025.name,
      description: `${data.campaigns.viral_campaign_2025.views.toLocaleString()} חשיפות`
    }
  }),

  'CLIENT_FEEDBACK_KEYWORDS': (data) => ({
    type: 'LEADERBOARD',
    props: {
      title: 'מילות פידבק נפוצות',
      items: data.campaigns.client_feedback_keywords.map(k => ({
        rank: k.rank,
        name: k.word,
        value: '',
        subtitle: k.context || ''
      }))
    }
  }),

  'AI_TIME_SAVINGS': (data) => ({
    type: 'KPI_BIG_NUMBER',
    props: {
      value: data.ai.time_savings_pct,
      label: 'חיסכון בזמן',
      suffix: '%',
      subtext: data.ai.equivalent.weekly
    }
  }),

  'ENZO_SODASTREAM': (data) => ({
    type: 'VIDEO_EMBED',
    props: {
      url: data.campaigns.enzo_sodastream.video,
      title: data.campaigns.enzo_sodastream.name,
      description: data.campaigns.enzo_sodastream.video_description
    }
  }),

  'ROI_BEST': (data) => ({
    type: 'KPI_BIG_NUMBER',
    props: {
      value: data.finance.roi_best.roi,
      label: 'ROI',
      prefix: 'x',
      subtext: `${data.finance.roi_best.client} - ${data.finance.roi_best.month}`
    }
  }),

  'MOST_COMMON_MEETING_PHRASE': (data) => ({
    type: 'QUOTE_CARD',
    props: {
      quote: data.culture.most_common_meeting_phrase,
      author: 'כל פגישת זום'
    }
  }),

  'CULTURE_EVENTS': (data) => ({
    type: 'KPI_BIG_NUMBER',
    props: {
      value: data.culture.thursday_happy_count,
      label: 'חמישי שמח',
      subtext: data.culture.thursday_happy_highlight
    }
  }),

  'TOP_PERFORMING_TEAM': (data) => ({
    type: 'KPI_BIG_NUMBER',
    props: {
      value: data.kpi.top_performing_team.actual,
      label: data.kpi.top_performing_team.name,
      prefix: '₪',
      subtext: `יעד: ${(data.kpi.top_performing_team.target / 1000000).toFixed(0)}M`
    }
  }),

  'COMPANY_DNA': (data) => ({
    type: 'VALUE_CARDS',
    props: {
      title: 'DNA של לידרס',
      cards: data.dna.values.map(v => ({
        title: v.title,
        description: v.description.slice(0, 60) + '...'
      }))
    }
  }),

  'LEAST_PRODUCTIVE_TIME': (data) => ({
    type: 'QUOTE_CARD',
    props: {
      quote: data.culture.least_productive_time.description,
      author: data.culture.least_productive_time.when
    }
  }),

  'GROWTH_FORECAST': (data) => ({
    type: 'MINI_CHART',
    props: {
      title: 'תחזית צמיחה 2026',
      data: [
        { name: 'תרחיש 1', value: 40 },
        { name: 'תרחיש 2', value: 110 }
      ]
    }
  }),

  'CONSULTANTS': (data) => ({
    type: 'VALUE_CARDS',
    props: {
      title: 'היועצים שלנו',
      cards: data.consultants.slice(0, 4).map(c => ({
        title: c.name,
        description: c.role,
        image: c.image
      }))
    }
  }),

  'VISION_2026_INTRO': (data) => ({
    type: 'VALUE_CARDS',
    props: {
      title: 'Welcome 2026',
      cards: data.vision_2026.targets.slice(0, 6).map(t => ({
        title: t,
        description: ''
      }))
    }
  }),

  'RAP_SUMMARY': () => ({
    type: 'QUOTE_CARD',
    props: {
      quote: 'ב-2025 לידרס על המפה, זה כבר לא וייב זה עובדה',
      author: 'LEADERS RAP'
    }
  })
};

// מנוע הזיהוי
export function processMessage(
  message: string,
  currentQuestionIndex: number
): FlowResponse {
  const normalizedMessage = message.trim().toLowerCase();
  
  // בדוק אם זו תשובה חיובית - מפעיל את ה-intent הבא
  const isPositive = POSITIVE_RESPONSES.some(r => 
    normalizedMessage.includes(r.toLowerCase())
  );

  let targetIntent: string;
  let questionIndex = currentQuestionIndex;

  if (isPositive && currentQuestionIndex < flowQuestions.length) {
    // תשובה חיובית - הפעל את ה-intent הנוכחי
    targetIntent = flowQuestions[currentQuestionIndex].intentId;
    questionIndex++;
  } else {
    // נסה לזהות intent מהטקסט
    targetIntent = detectIntentFromText(normalizedMessage) || 
                   flowQuestions[currentQuestionIndex]?.intentId || 
                   'UNKNOWN';
    if (targetIntent !== 'UNKNOWN') {
      questionIndex++;
    }
  }

  const responseGenerator = INTENT_RESPONSES[targetIntent];
  const visualGenerator = INTENT_VISUALS[targetIntent];

  const nextQuestion = flowQuestions[questionIndex] || null;

  if (!responseGenerator) {
    return {
      intentId: 'UNKNOWN',
      answerText: 'לא בטוח שהבנתי. אפשר לנסח אחרת?',
      visualPayload: { type: 'QUOTE_CARD', props: { quote: '?', author: '' } },
      nextQuestion
    };
  }

  return {
    intentId: targetIntent,
    answerText: responseGenerator(dataPack),
    visualPayload: visualGenerator?.(dataPack) || { type: 'QUOTE_CARD', props: {} },
    nextQuestion
  };
}

// זיהוי intent מטקסט חופשי
function detectIntentFromText(text: string): string | null {
  const intentKeywords: Record<string, string[]> = {
    'YEAR_RECAP_HEADLINES': ['ראשי פרקים', 'סיכום שנה', 'נושאים'],
    'YEAR_RECAP_SHORT': ['תמציתי', 'קצר', 'לא חופר', 'חפרת'],
    'TOP_REVENUE_CLIENT_2025': ['לקוח גדול', 'כיס עמוק', 'הכנסות'],
    'COFFEE_TO_REVENUE': ['קפה', 'ארומה', 'כוסות'],
    'STRONGEST_QUARTER': ['רבעון', 'חזק', 'עסקה'],
    'COFFEE_CORNER_JOKE': ['מטבח', 'קפאין', 'מכונת קפה'],
    'VIRAL_CAMPAIGN_2025': ['ויראלי', 'שבר את הרשת', 'קמפיין'],
    'CLIENT_FEEDBACK_KEYWORDS': ['פידבק', 'מילים', 'לקוחות אמרו'],
    'AI_TIME_SAVINGS': ['ai', 'בינה מלאכותית', 'חסכנו', 'זמן'],
    'ENZO_SODASTREAM': ['אנזו', 'סודה סטרים', 'מורכב'],
    'ROI_BEST': ['roi', 'החזר', 'תשואה'],
    'MOST_COMMON_MEETING_PHRASE': ['פגישות', 'zoom', 'מיוט', 'משפט'],
    'CULTURE_EVENTS': ['חמישי שמח', 'אירועים', 'גיבוש'],
    'TOP_PERFORMING_TEAM': ['צוות', 'ביצועים', 'kpi', 'יעדים'],
    'COMPANY_DNA': ['dna', 'ערכים', 'זהות'],
    'LEAST_PRODUCTIVE_TIME': ['פרודוקטיבי', 'שקי תפוחי אדמה'],
    'GROWTH_FORECAST': ['צמיחה', 'תחזית', '2026'],
    'CONSULTANTS': ['יועצים', 'מלווים'],
    'VISION_2026_INTRO': ['חזון', 'שנה הבאה'],
    'RAP_SUMMARY': ['שיר', 'ראפ', 'חרוזים']
  };

  for (const [intent, keywords] of Object.entries(intentKeywords)) {
    if (keywords.some(k => text.includes(k))) {
      return intent;
    }
  }

  return null;
}

// פונקציה לקבלת ה-index הנוכחי
export function getCurrentQuestionIndex(askedIntents: string[]): number {
  if (askedIntents.length === 0) return 0;
  
  const lastAsked = askedIntents[askedIntents.length - 1];
  const lastIndex = flowQuestions.findIndex(q => q.intentId === lastAsked);
  
  return lastIndex >= 0 ? lastIndex + 1 : askedIntents.length;
}

