// Flow Engine - תשובות בדיוק לפי התסריט
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

// מפת Intent לתשובות - בדיוק לפי התסריט
const INTENT_RESPONSES: Record<string, (data: typeof dataPack) => string> = {
  
  // שאלה 1: ראשי פרקים - גרסת החופר
  'YEAR_RECAP_HEADLINES': () => `בוקר טוב! הנה 9 ראשי פרקים לסיכום 2025. הכל מפורט בצד ימין.`,

  // שאלה 2: גרסה תמציתית - הלא חופר
  'YEAR_RECAP_SHORT': () => `קיבלתי!

אז הנה גרסת הלא-חופר, קצר, חד, ומייצר סקרנות.

אם בא לך - אני גם יכול לחדד את זה ל-7 דקות דיבור נטו, או לתת לך משפט פתיחה וסגירה שגורמים להם להרים ראש מהטלפון.`,

  // שאלה 3: לקוח הכיס העמוק
  'TOP_REVENUE_CLIENT_2025': (data) => {
    const clients = data.finance.top_revenue_clients;
    const colgate = clients[0];
    const seacret = clients[1];
    const tourism = clients[2];
    return `זו שאלה קצת טריקית אבל מעניינת מאוד!

אני שם לב שהעבודה עם "קולגייט" הייתה בשנת 2024 סביב תקציב של ${(colgate.revenue_2024! / 1000000).toFixed(1)} מיליון שח.
בשנת 2025 - התקציב קפץ ל-${(colgate.revenue_2025! / 1000000).toFixed(1)} מיליון שח מה שאומר שהפעילות שלו צמחה בכמעט ${colgate.growth_pct}% בשנה האחרונה.

לגבי לקוחות בצמיחה - יש לציין את Seacret שעמד על תקציב פעילות של ${(seacret.revenue_2024! / 1000000).toFixed(1)} מיליון שח ב-2024,
ובשנת 2025 התקציב כבר גדל ל-${(seacret.revenue_2025! / 1000000).toFixed(1)} מיליון. מדובר בכ-${seacret.growth_pct}% צמיחה!

אבל הכוכב המרשים ביותר הוא משרד התיירות, שלמרות האתגר ב-2023 - לקוח שהצלחתם לפצח ולנהל בצורה די מרשימה עם קפיצה תקציבית של ${tourism.growth_pct}% משנת 2024 לשנת 2025!

אז כל הכבוד לצוותים של נועה ואלית ובתאל שעשו עבודה מדהימה והצליחו להצמיח את הפעילות של הלקוחות שלהן!`;
  },

  // שאלה 4: קפה ארומה - שאלת המשך
  'COFFEE_SIZE_QUESTION': () => `זה תלוי איזה גודל קפה?
הפוך קטן עולה 10 שח, בינוני 13 שח וגדול עולה 16 שח.
איזה גודל קפה תרצה?`,

  // שאלה 4: התשובה לקפה
  'COFFEE_TO_REVENUE': (data) => {
    const revenue = data.finance.total_revenue_2025;
    const price = data.finance.coffee_calculation.aroma_medium_price;
    const cups = data.finance.coffee_calculation.total_cups;
    const perEmployee = data.finance.coffee_calculation.cups_per_employee;
    return `אז סך ההכנסות של LEADERS ב-2025 עמדו על מעל ${revenue / 1000000} מיליון,
אם נחלק את זה ב-${price} שח זה אומר שאנחנו יכולים לקנות ${cups.toLocaleString()} כוסות!
אם נחלק את זה לכמות העובדים שלנו שהיא ${data.company.employees_count} - אנחנו מדברים על ${perEmployee.toLocaleString()} כוסות לכל עובד.

אגב, מדובר בהמון קפאין שיביא המון יעילות!`;
  },

  // שאלה 5: הרבעון הכי חזק
  'STRONGEST_QUARTER': (data) => {
    const deal = data.finance.strongest_quarter_deal;
    return `הרבעון הכי חזק בשנת 2025 היה דווקא רבעון 3.
זה רבעון שהביא איתו כמה עסקאות גדולות אבל החזקה מביניהן הייתה בעבודה עם ${deal.client} -
מותגי הרכב ${deal.brands.join(' ו')} איתם יצאנו להפקות מדהימות שהיו מוצלחות במיוחד.

הייתה פה עבודה מעולה על ליהוק של משפיענים מעניינים, ביניהם - ${deal.influencers.join(', ')}.
היה שם קריאייטיב מעולה שיצא מהקופסא, מהלכי מדיה תומכים של יואב, וניהול לקוח ברמה גבוהה מאוד של יובל רפאל!`;
  },

  // שאלה 6: מי במטבח
  'COFFEE_CORNER_JOKE': (data) => {
    const joke = data.culture.coffee_corner_joke;
    return `הנתונים מראים עלייה חריגה בצריכת הקפאין באזור השולחן של ${joke.most_coffee} אחרי שהתחלפו פולי הקפה.
מומלץ לבדוק אם הוא ישן בלילה.

לגבי זמן בפינת הקפה - ${joke.previous_champion} הייתה מספר אחת אבל מאז שהיא לא איתנו - הכורסאות שם די פנויות.`;
  },

  // שאלה 7: קמפיין ויראלי
  'VIRAL_CAMPAIGN_2025': (data) => {
    const campaign = data.campaigns.viral_campaign_2025;
    return `שאלה מעולה!
ללא ספק המהלך של ${campaign.name} היה הקמפיין הכי ויראלי של LEADERS ב-2025.
אבל אם נהיה מדויקים, ${campaign.top_influencer} הביאה יותר מ-${campaign.views.toLocaleString()} חשיפות שעלו בתוצרי הקמפיין של אקספנג מבית פריזבי.`;
  },

  // שאלה 8: מילות פידבק
  'CLIENT_FEEDBACK_KEYWORDS': (data) => {
    const keywords = data.campaigns.client_feedback_keywords;
    return `אוקיי,
אז המילה "${keywords[0].word}" ${keywords[0].note} חזרה על עצמה הכי הרבה פעמים.
אחריה המילה - "${keywords[1].word}"
ואחריה המילה - "${keywords[2].word}" (בהקשר של ${keywords[2].context})`;
  },

  // שאלה 9: חיסכון AI
  'AI_TIME_SAVINGS': (data) => {
    const ai = data.ai;
    return `בזכות שימוש בכלי AI במחלקות השונות הצלחנו לחסוך ב-${ai.time_savings_pct}% בזמן העבודה שלנו.
בחישוב מהיר - מדובר בחיסכון של ${ai.equivalent.weekly}!
אם מסתכלים על זה בראייה שנתית - ${ai.equivalent.yearly}!
זה חסכון שווה ערך ל${ai.equivalent.hiring_equivalent}.

כלומר - יצרתם כוח עבודה נוסף - בלי שכר, בלי גיוס ובלי עומס ניהולי.
מטורף!`;
  },

  // שאלה 10: פרויקט מורכב - אנזו
  'ENZO_SODASTREAM': (data) => {
    const enzo = data.campaigns.enzo_sodastream;
    return `הפרויקט המורכב ביותר טכנולוגית שעשיתם היה ללא שום ספק מהלך השקת ה"אנזו" של סודה סטרים.
לא צריך לנתח יותר מידי - הצלחתם לגעת בעולם חדש, טכנולוגי, חדשני, שמבוסס בינה מלאכותית,
היה שם קריאייטיב שונה שנתן מענה לחלומות של עמית וקלע בול למה שהיא חיפשה.

לקראת השקת מכשיר ה-SodaStream enso היוקרתי, יצרנו מהלך אינטראקטיבי ובנינו אתר עם ממשק AI ייחודי.
הגולשים הוזמנו להקליד מילים חופשיות, וה-AI יצר עבורם פרשנות מאוירת וחדשנית של מכשיר ה-Enso בסביבה יצירתית לבחירתם.
התוצרים הוצגו בגלריה פתוחה שאפשרה צפייה, לייקים ושיתוף בין המשתתפים - ויצרה חוויית השקה חיה, מעורבת ודינמית.

מה שיותר יפה היה שכמות אנשי הצוות שעבדו על המהלך הייתה מצומצמת מאוד:
${enzo.team.map(t => `${t.name} - ${t.role}`).join('\n')}

התוצאה הייתה מהממת, ואצטט את ${enzo.client_quote.from} בהודעה שנשלחה ב${enzo.client_quote.time} לקבוצה:
"${enzo.client_quote.word}"`;
  },

  // שאלה 11: ROI
  'ROI_BEST': (data) => {
    const roi = data.finance.roi_best;
    return `ב${roi.month} עבדתם עם ${roi.client} בצורה ממוקדת ומדויקת עם מטרה עסקית ברורה.
בפועל, כל שקל שהושקע במהלכי המדיה והמשפיעניות החזיר פי ${roi.roi}, ROI ${roi.roi}.
מעבר למספר, ${roi.description}`;
  },

  // שאלה 12: משפט נפוץ
  'MOST_COMMON_MEETING_PHRASE': (data) => {
    return `תשמחו לגלות שהמשפט הנפוץ ביותר שנאמר בפגישות הוידאו שלכם היה:

"${data.culture.most_common_meeting_phrase}"`;
  },

  // שאלה 13: אירועי חברה
  'CULTURE_EVENTS': (data) => {
    const culture = data.culture;
    return `אז נראה שאתם בלידרס אוהבים ממש לחגוג, אתחיל מהקטן -

חמישי שמח - היו בסך הכל ${culture.thursday_happy_count} כאלה כשהרוב הבולט היה ${culture.thursday_happy_highlight}.

אירועי חברה - ${culture.company_events.map(e => e.name).join(', ')}

${culture.volunteering_description}`;
  },

  // שאלה 14: צוות שיאני ביצועים
  'TOP_PERFORMING_TEAM': (data) => {
    const team = data.kpi.top_performing_team;
    return `בעבודה מדויקת, חכמה ועקבית על ${team.client}, הצוות הצליח לייצר טירוף מכירות אמיתי דרך הנעת קהל באמצעות משפיעניות - בלי אפיליאציה ובלי עמלות מכר.

קמפיין ההטבה של ${team.client}, שקורה פעמיים בשנה, הגיע עם יעד ברור של ${(team.target / 1000000).toFixed(0)} מיליון שח, ובפועל נסגר על ${(team.actual / 1000000).toFixed(2)} מיליון שח.
זו קפיצה משמעותית מעל היעד, תוצאה של עבודה רציפה לאורך כל השנה שמייצרת שיח חיובי, נוכחות ונחשקות אמיתית למותג.

הנתונים האלו לא רק מדברים בעד עצמם, אלא גם ${team.result} - הוכחה לכך שכאשר המיקוד הוא נחשקות שמניעה למכר, הביצועים כבר מגיעים לבד.`;
  },

  // שאלה 15: DNA של לידרס
  'COMPANY_DNA': (data) => {
    const values = data.dna.values;
    return `אנסה לזקק את זה לא כערכים "יפים על קיר", אלא כ-DNA שמתבטא בהחלטות, בקצב, ובאופן שבו הארגון חושב ופועל בפועל.

כך הייתי מגדיר את חמשת ערכי הליבה של לידרס:

${values.map((v, i) => `${i + 1}. ${v.title}
${v.description}`).join('\n\n')}`;
  },

  // שאלה 16: יום פחות פרודוקטיבי
  'LEAST_PRODUCTIVE_TIME': (data) => {
    const lpt = data.culture.least_productive_time;
    return `אז ${lpt.when} אתם הופכים ל${lpt.description}.
אי אפשר לבוא אליכם כמובן בטענות אבל כנראה ש${lpt.recommendation}.`;
  },

  // שאלה 17: תחזית צמיחה
  'GROWTH_FORECAST': (data) => {
    const s1 = data.vision_2026.growth_scenarios.scenario_1;
    const s2 = data.vision_2026.growth_scenarios.scenario_2;
    return `בגלל שאנחנו נמצאים בזמנים מורכבים מאוד מבחינת עסקים וצמיחה, טכנולוגיה ויכולות, ישנם 2 תרחישים שיכולים לקרות:

תרחיש 1: ${s1.name}
עובדים: גידול מצטבר של כ-${s1.employees_growth} עד סוף 2026
הכנסות: צמיחה של כ-${s1.revenue_growth} בשנה, סהכ ${s1.multiplier} מהיום
${s1.notes}

תרחיש 2: ${s2.name}
עובדים: גידול מתון של כ-${s2.employees_growth} בלבד
הכנסות: צמיחה של כ-${s2.revenue_growth} בשנה, סהכ ${s2.multiplier} מהיום
${s2.notes}`;
  },

  // שאלה 18: יועצים
  'CONSULTANTS': (data) => {
    return `${data.consultants.map(c => `${c.name}
${c.role}
${c.description || ''}`).join('\n\n')}`;
  },

  // שאלה 19: חזון 2026
  'VISION_2026_INTRO': (data) => {
    return `${data.vision_2026.intro}

${data.vision_2026.bullets.map(b => `- ${b}`).join('\n')}`;
  },

  // שאלה 20: שיר ראפ
  'RAP_SUMMARY': (data) => {
    return data.rap_summary.lyrics;
  }
};

// Visual payloads לכל intent
const INTENT_VISUALS: Record<string, (data: typeof dataPack) => { type: string; props: Record<string, unknown> }> = {
  'YEAR_RECAP_HEADLINES': () => ({
    type: 'FORMATTED_TEXT',
    props: {
      title: 'ראשי פרקים לסיכום שנת 2025',
      sections: [
        {
          title: 'פתיחה - שנה שלא מובנת מאליה',
          content: ['תודה אישית לכל עובד ועובדת', 'הקשר בין העשייה היומיומית להצלחת החברה', 'משפט מסכם על רוח השנה']
        },
        {
          title: 'היעדים שהצבנו מול מה שבפועל קרה',
          content: ['היעדים המרכזיים לשנת 2025', 'מה הושג במלואו', 'מה הושג חלקית', 'מה לא הושג - ולמה זה לגיטימי']
        },
        {
          title: 'אבני דרך והישגים מרכזיים',
          content: ['פרויקטים משמעותיים', 'לקוחות ושיתופי פעולה חדשים', 'קמפיינים, מוצרים ותהליכים שבלטו', 'רגעי שיא של גאוות יחידה']
        },
        {
          title: 'חדשנות, ניסוי וטעייה',
          content: ['דברים חדשים שניסינו השנה', 'מה עבד במיוחד', 'מה פחות - ומה למדנו מזה', 'תרבות של אומץ ויציאה מאזור הנוחות']
        },
        {
          title: 'אנשים ותרבות ארגונית',
          content: ['חיבורים שנוצרו בין צוותים', 'דוגמאות לעבודת צוות יוצאת דופן', 'מנהלים ועובדים שהובילו ערכים ולא רק תוצאות']
        },
        {
          title: 'אתגרים והתמודדויות',
          content: ['אתגרים מקצועיים, שוק ועומסים', 'איך התמודדנו כארגון', 'מה למדנו על עצמנו בדרך']
        },
        {
          title: 'התפתחות וצמיחה אישית',
          content: ['למידה, הכשרות, קידומים', 'אחריות שנלקחה מעבר להגדרה הרשמית', 'צמיחה אישית כחלק מהצלחת החברה']
        },
        {
          title: 'מבט קדימה - 2026',
          content: ['כיוונים אסטרטגיים', 'מה נרצה לשפר', 'מה חשוב שנשמור', 'למה יש למה לחכות']
        },
        {
          title: 'תודה וסגירה',
          content: ['תודה על מחויבות, מקצועיות ואנושיות', 'מסר של אמון והמשך דרך משותפת', 'משפט סיום מחזק ומעורר השראה']
        }
      ]
    }
  }),

  'YEAR_RECAP_SHORT': () => ({
    type: 'ANIMATED_LIST',
    props: {
      title: 'סיכום 2025 - ראשי פרקים',
      items: [
        'מה חשבנו שתהיה 2025 - ומה היא עשתה לנו בפועל',
        '3 דברים שעבדו לנו הרבה יותר ממה שציפינו',
        '2 טעויות יקרות - ולמה הן שוות זהב',
        'רגע אחד שאם לא היינו שם - הוא לא היה קורה',
        'אנשים שעשו מעבר להגדרת התפקיד',
        'משהו אחד שהפסקנו לעשות - והשתפרנו',
        'משהו אחד שאנחנו חייבים להפסיק ב-2026',
        'אמת קצרה על עומסים, לחץ ואיך שרדנו',
        'מה אסור לנו לאבד גם כשגדלים',
        'משפט אחד על 2026 שלא נאמר עדיין'
      ]
    }
  }),

  'TOP_REVENUE_CLIENT_2025': (data) => ({
    type: 'LEADERBOARD_WITH_VIDEOS',
    props: {
      title: 'לקוחות בצמיחה 2025',
      items: data.finance.top_revenue_clients
        .filter((c: { growth_pct?: number }) => c.growth_pct)
        .sort((a: { growth_pct?: number }, b: { growth_pct?: number }) => (b.growth_pct || 0) - (a.growth_pct || 0))
        .slice(0, 3)
        .map((c: { name: string; growth_pct?: number }, i: number) => ({
          rank: i + 1,
          name: c.name,
          value: c.growth_pct,
          suffix: '%',
          subtitle: 'צמיחה'
        })),
      videos: [
        { url: '/vids/colgate/Meridol Bathroom 6s 16x9 V05 HQ.mp4', title: 'קולגייט - מרידול' },
        { url: '/vids/seacret/IMG_6855.MP4', title: 'Seacret' },
        { url: '/vids/tayarut/1.mp4', title: 'משרד התיירות' }
      ]
    }
  }),

  'COFFEE_SIZE_QUESTION': () => ({
    type: 'QUOTE_CARD',
    props: {
      quote: 'קטן? בינוני? גדול?',
      author: 'בחר גודל קפה'
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
      title: `${data.finance.strongest_quarter_deal.client} - רבעון 3`,
      description: data.finance.strongest_quarter_deal.brands.join(' | ')
    }
  }),

  'COFFEE_CORNER_JOKE': (data) => ({
    type: 'IMAGE_CARD',
    props: {
      src: data.culture.coffee_corner_joke.image,
      title: 'פינת הקפה',
      description: `${data.culture.coffee_corner_joke.most_coffee} - בילה הכי הרבה במטבח`
    }
  }),

  'VIRAL_CAMPAIGN_2025': (data) => ({
    type: 'VIDEO_EMBED',
    props: {
      url: data.campaigns.viral_campaign_2025.video,
      title: data.campaigns.viral_campaign_2025.name,
      description: `${data.campaigns.viral_campaign_2025.top_influencer} - ${data.campaigns.viral_campaign_2025.views.toLocaleString()} חשיפות`
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
        subtitle: ''
      }))
    }
  }),

  'AI_TIME_SAVINGS': (data) => ({
    type: 'IMAGE_WITH_KPI',
    props: {
      src: data.ai.image,
      value: data.ai.time_savings_pct,
      label: 'חיסכון בזמן',
      suffix: '%',
      subtext: data.ai.equivalent.weekly
    }
  }),

  'ENZO_SODASTREAM': () => ({
    type: 'VIDEO_EMBED',
    props: {
      url: '/vids/sodastream/Final_5.mp4',
      title: 'SodaStream Enso',
      description: '3 אנשים, מהלך אחד, אימפקט גדול'
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
      author: 'המשפט הכי נפוץ בזום'
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
    type: 'VIDEO_WITH_KPI',
    props: {
      url: data.kpi.top_performing_team.video,
      value: (data.kpi.top_performing_team.actual / 1000000).toFixed(2),
      label: `${data.kpi.top_performing_team.name} - ${data.kpi.top_performing_team.client}`,
      suffix: 'M',
      subtext: `יעד: ${(data.kpi.top_performing_team.target / 1000000).toFixed(0)} מיליון`
    }
  }),

  'COMPANY_DNA': (data) => ({
    type: 'VALUE_CARDS',
    props: {
      title: 'DNA של לידרס',
      cards: data.dna.values.map(v => ({
        title: v.title,
        description: v.description.slice(0, 80) + '...'
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
    type: 'COMPARISON_TABLE',
    props: {
      title: 'תרחישי צמיחה 2026',
      scenario_1: data.vision_2026.growth_scenarios.scenario_1,
      scenario_2: data.vision_2026.growth_scenarios.scenario_2
    }
  }),

  'CONSULTANTS': (data) => ({
    type: 'CONSULTANT_CARDS',
    props: {
      title: 'היועצים שמלווים אותנו',
      consultants: data.consultants.filter((c: { image?: string }) => c.image).map((c: { name: string; role: string; description?: string; image?: string }) => ({
        name: c.name,
        role: c.role,
        description: c.description,
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

  'RAP_SUMMARY': (data) => ({
    type: 'AUDIO_PLAYER',
    props: {
      src: '/vids/sound/song.mp3',
      title: 'LEADERS RAP 2025',
      autoPlay: true,
      lyrics: data.rap_summary.lyrics
    }
  })
};

// זיהוי intent מטקסט
function detectIntent(text: string): string | null {
  const normalizedText = text.trim().toLowerCase();
  
  // מיפוי keywords ל-intents - סדר עדיפויות (ספציפי לפני כללי)
  const intentPatterns: [string[], string][] = [
    // עדיפות גבוהה - ביטויים ספציפיים
    [['שיר', 'ראפ', 'חרוזים', 'לסיום', 'שיר קצר'], 'RAP_SUMMARY'],
    [['שבר את הרשת', 'ויראלי', 'טראפיק הכי גבוה', 'טליה', 'הכי ויראלי'], 'VIRAL_CAMPAIGN_2025'],
    [['פחות פרודוקטיבי', 'תפוחי אדמה', 'יום הכי פחות'], 'LEAST_PRODUCTIVE_TIME'],
    [['קצב צמיחה', 'תחזית', 'דצמבר 2026', '31 בדצמבר', 'מספר עובדים'], 'GROWTH_FORECAST'],
    [['משפט הכי נפוץ', 'משפט נפוץ', 'פגישות הוידאו', 'פגישות וידאו', 'נאמר בפגישות', 'מיוט', 'על מיוט'], 'MOST_COMMON_MEETING_PHRASE'],
    
    // גודל קפה - תשובה לשאלת המשך
    [['קטן', 'בינוני', 'גדול'], 'COFFEE_TO_REVENUE'],
    
    // שאלות ראשיות
    [['ראשי פרקים', 'סיכום שנה', 'בוקר טוב', 'נושאים', 'לכל עובדי'], 'YEAR_RECAP_HEADLINES'],
    [['חפרת', 'תמציתי', 'קצר', 'לא חופר', 'מסקרן', 'עניין'], 'YEAR_RECAP_SHORT'],
    
    // כוסות קפה - שאלה ראשונית
    [['כוסות קפה', 'קפה בארומה', 'ארומה', 'ממירים אותן לכוסות', 'לכוסות', 'כוסות לכל עובד', 'כמה כוסות', 'הכנסות וממירים'], 'COFFEE_SIZE_QUESTION'],
    
    // לקוחות
    [['לקוח גדול', 'כיס עמוק', 'הכיס העמוק', 'קולגייט', 'לקוח הכי גדול', 'תקציב גדול'], 'TOP_REVENUE_CLIENT_2025'],
    [['רבעון חזק', 'רבעון הכי', 'עסקה', 'פריזבי', 'אקספנג'], 'STRONGEST_QUARTER'],
    
    // תרבות
    [['מטבח', 'מכונת קפה', 'קפאין', 'פינת קפה', 'הכי הרבה זמן במטבח', 'בילה הכי הרבה'], 'COFFEE_CORNER_JOKE'],
    [['חמישי שמח', 'אירועי חברה', 'גיבוש', 'הווי', 'work life', 'balance'], 'CULTURE_EVENTS'],
    
    // פידבק ומילים
    [['פידבק', '3 מילים', 'לקוחות אמרו', 'מילים הכי נפוצות'], 'CLIENT_FEEDBACK_KEYWORDS'],
    
    // AI וטכנולוגיה
    [['ai', 'חסכנו', 'זמן חסכנו', 'ייעול', 'בינה מלאכותית', 'כלי ai', 'הטמעת כלי'], 'AI_TIME_SAVINGS'],
    [['אנזו', 'סודה סטרים', 'מורכב טכנולוגית', 'הכי מורכב'], 'ENZO_SODASTREAM'],
    
    // מדדים
    [['roi', 'החזר', 'תשואה', 'נתון מרשים', 'מדד roi'], 'ROI_BEST'],
    [['צוות הכי', 'שיאני', 'kpi', 'שיאני ביצועים', 'עמידה ביעדים'], 'TOP_PERFORMING_TEAM'],
    
    // ערכים
    [['dna', 'ערכים', 'זהות', '5 ערכים', 'הגדיר את ה-dna'], 'COMPANY_DNA'],
    
    // יועצים ו-2026
    [['יועצים', 'מלווים', 'אחיעד', 'כוכבית', 'מיטל', 'אסף'], 'CONSULTANTS'],
    [['חזון', 'לידרס ב-2026', 'שנה הבאה', 'welcome 2026', 'ספר לי על לידרס'], 'VISION_2026_INTRO']
  ];

  for (const [keywords, intentId] of intentPatterns) {
    if (keywords.some(k => normalizedText.includes(k))) {
      return intentId;
    }
  }

  return null;
}

// מנוע הזיהוי הראשי
export function processMessage(
  message: string,
  currentQuestionIndex: number
): FlowResponse {
  const intentId = detectIntent(message);

  if (!intentId) {
    return {
      intentId: 'UNKNOWN',
      answerText: 'לא בטוח שהבנתי. אפשר לנסח אחרת?',
      visualPayload: { type: 'QUOTE_CARD', props: { quote: '?', author: '' } },
      nextQuestion: flowQuestions[currentQuestionIndex] || null
    };
  }

  const responseGenerator = INTENT_RESPONSES[intentId];
  const visualGenerator = INTENT_VISUALS[intentId];

  if (!responseGenerator) {
    return {
      intentId: 'UNKNOWN',
      answerText: 'הנושא הזה עדיין לא מחובר לדאטה שלי.',
      visualPayload: { type: 'QUOTE_CARD', props: { quote: '?', author: '' } },
      nextQuestion: flowQuestions[currentQuestionIndex] || null
    };
  }

  // מצא את השאלה הבאה
  const currentIndex = flowQuestions.findIndex(q => q.intentId === intentId);
  const nextIndex = currentIndex >= 0 ? currentIndex + 1 : currentQuestionIndex + 1;
  const nextQuestion = flowQuestions[nextIndex] || null;

  return {
    intentId,
    answerText: responseGenerator(dataPack),
    visualPayload: visualGenerator?.(dataPack) || { type: 'QUOTE_CARD', props: {} },
    nextQuestion
  };
}

// פונקציה לקבלת ה-index הנוכחי
export function getCurrentQuestionIndex(askedIntents: string[]): number {
  if (askedIntents.length === 0) return 0;
  
  const lastAsked = askedIntents[askedIntents.length - 1];
  const lastIndex = flowQuestions.findIndex(q => q.intentId === lastAsked);
  
  return lastIndex >= 0 ? lastIndex + 1 : askedIntents.length;
}
