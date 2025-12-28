export interface Intent {
  id: string;
  title: string;
  triggers: string[];
  response_style: string;
  visual_type: string;
  data_paths: string[];
}

export const intents: Intent[] = [
  {
    id: 'YEAR_RECAP_HEADLINES',
    title: 'ראשי פרקים לסיכום שנה',
    triggers: ['ראשי פרקים', 'סיכום שנה', 'תן לי נושאים', 'בוקר טוב'],
    response_style: 'רשימה מסודרת וברורה',
    visual_type: 'VALUE_CARDS',
    data_paths: ['topics']
  },
  {
    id: 'TOP_REVENUE_CLIENT_2025',
    title: 'לקוח הכיס העמוק',
    triggers: ['לקוח הכי גדול', 'הכנסות הכי גבוהות', 'כיס עמוק', 'לקוח גדול'],
    response_style: 'מספרי עם קרדיט לצוותים',
    visual_type: 'LEADERBOARD',
    data_paths: ['finance.top_revenue_clients']
  },
  {
    id: 'COFFEE_TO_REVENUE',
    title: 'המרת הכנסות לכוסות קפה',
    triggers: ['כוסות קפה', 'קפה בארומה', 'המרה לקפה', 'קפה'],
    response_style: 'הומוריסטי עם מספרים',
    visual_type: 'KPI_BIG_NUMBER',
    data_paths: ['finance.total_revenue_2025', 'finance.coffee_calculation', 'company.employees_count']
  },
  {
    id: 'STRONGEST_QUARTER',
    title: 'הרבעון החזק ביותר',
    triggers: ['רבעון הכי חזק', 'רבעון הכי טוב', 'איזה רבעון', 'רבעון חזק'],
    response_style: 'עובדתי עם סיפור העסקה',
    visual_type: 'TIMELINE_CARD',
    data_paths: ['finance.strongest_quarter', 'finance.strongest_quarter_deal']
  },
  {
    id: 'TOTAL_REVENUE_2025',
    title: 'סך הכנסות 2025',
    triggers: ['כמה הכנסנו', 'סך הכנסות', 'הכנסות השנה', 'הכנסות 2025'],
    response_style: 'מספר גדול עם הקשר',
    visual_type: 'KPI_BIG_NUMBER',
    data_paths: ['finance.total_revenue_2025', 'finance.total_revenue_2024']
  },
  {
    id: 'ROI_BEST',
    title: 'ה-ROI הכי מרשים',
    triggers: ['ROI', 'החזר השקעה', 'תשואה', 'נתון מרשים'],
    response_style: 'מספר מרשים עם הסבר',
    visual_type: 'KPI_BIG_NUMBER',
    data_paths: ['finance.roi_best']
  },
  {
    id: 'VIRAL_CAMPAIGN_2025',
    title: 'הקמפיין הוויראלי',
    triggers: ['קמפיין וויראלי', 'שבר את הרשת', 'הכי הרבה צפיות', 'ויראלי', 'טראפיק'],
    response_style: 'סיפורי עם מספרים',
    visual_type: 'VIDEO_EMBED',
    data_paths: ['campaigns.viral_campaign_2025']
  },
  {
    id: 'CLIENT_FEEDBACK_KEYWORDS',
    title: 'מילות פידבק נפוצות',
    triggers: ['פידבק מלקוחות', 'מילים נפוצות', 'מה לקוחות אמרו', 'פידבק', '3 מילים'],
    response_style: 'קצר וחד עם ציטוטים',
    visual_type: 'LEADERBOARD',
    data_paths: ['campaigns.client_feedback_keywords']
  },
  {
    id: 'ENZO_SODASTREAM',
    title: 'פרויקט האנזו - סודה סטרים',
    triggers: ['אנזו', 'סודה סטרים', 'פרויקט מורכב', 'מורכב טכנולוגית', 'sodastream'],
    response_style: 'סיפורי עם פרטים טכניים',
    visual_type: 'TIMELINE_CARD',
    data_paths: ['campaigns.enzo_sodastream']
  },
  {
    id: 'AI_TIME_SAVINGS',
    title: 'חיסכון זמן עם AI',
    triggers: ['חיסכון זמן', 'AI', 'בינה מלאכותית', 'כמה חסכנו', 'ייעול'],
    response_style: 'מספרי עם המחשה',
    visual_type: 'KPI_BIG_NUMBER',
    data_paths: ['ai']
  },
  {
    id: 'COFFEE_CORNER_JOKE',
    title: 'בדיחת פינת הקפה',
    triggers: ['פינת קפה', 'מכונת קפה', 'מי שותה הכי הרבה קפה', 'מטבח', 'קפאין'],
    response_style: 'הומוריסטי',
    visual_type: 'QUOTE_CARD',
    data_paths: ['culture.coffee_corner_joke']
  },
  {
    id: 'MOST_COMMON_MEETING_PHRASE',
    title: 'משפט נפוץ בפגישות',
    triggers: ['משפט נפוץ', 'פגישות וידאו', 'zoom', 'פגישות', 'מיוט'],
    response_style: 'הומוריסטי קצר',
    visual_type: 'QUOTE_CARD',
    data_paths: ['culture.most_common_meeting_phrase']
  },
  {
    id: 'LEAST_PRODUCTIVE_TIME',
    title: 'זמן הכי פחות פרודוקטיבי',
    triggers: ['פרודוקטיביות', 'פחות פרודוקטיבי', 'אחרי חמישי שמח', 'שקי תפוחי אדמה'],
    response_style: 'הומוריסטי עם תובנה',
    visual_type: 'QUOTE_CARD',
    data_paths: ['culture.least_productive_time']
  },
  {
    id: 'CULTURE_EVENTS',
    title: 'אירועי חברה והווי',
    triggers: ['חמישי שמח', 'אירועי חברה', 'גיבושים', 'work life balance', 'הווי'],
    response_style: 'מספרי עם דוגמאות',
    visual_type: 'KPI_BIG_NUMBER',
    data_paths: ['culture']
  },
  {
    id: 'TOP_PERFORMING_TEAM',
    title: 'צוות שיאני הביצועים',
    triggers: ['צוות הכי טוב', 'שיאני ביצועים', 'KPI', 'יעדים', 'עמידה ביעדים'],
    response_style: 'מספרי עם קרדיט',
    visual_type: 'LEADERBOARD',
    data_paths: ['kpi.top_performing_team']
  },
  {
    id: 'COMPANY_DNA',
    title: 'DNA של לידרס',
    triggers: ['DNA', 'ערכים', 'זהות', '5 ערכים', 'מי אנחנו'],
    response_style: 'רשימה עם הסברים',
    visual_type: 'VALUE_CARDS',
    data_paths: ['dna.values']
  },
  {
    id: 'CONSULTANTS',
    title: 'היועצים שמלווים אותנו',
    triggers: ['יועצים', 'מלווים', 'אחיעד', 'כוכבית'],
    response_style: 'הצגה אישית',
    visual_type: 'VALUE_CARDS',
    data_paths: ['consultants']
  },
  {
    id: 'VISION_2026_INTRO',
    title: 'חזון 2026',
    triggers: ['2026', 'שנה הבאה', 'עתיד', 'חזון', 'לידרס ב-2026'],
    response_style: 'חזוני עם בולטים',
    visual_type: 'VALUE_CARDS',
    data_paths: ['vision_2026']
  },
  {
    id: 'GROWTH_FORECAST',
    title: 'תחזית צמיחה',
    triggers: ['צמיחה', 'תחזית', 'כמה עובדים', 'דצמבר 2026', 'קצב'],
    response_style: 'תרחישים עם מספרים',
    visual_type: 'MINI_CHART',
    data_paths: ['vision_2026.growth_scenarios']
  },
  {
    id: 'RAP_SUMMARY',
    title: 'שיר ראפ סיכום',
    triggers: ['שיר', 'ראפ', 'חרוזים', 'לסיום'],
    response_style: 'שיר ראפ',
    visual_type: 'QUOTE_CARD',
    data_paths: ['rap_summary']
  }
];

export function getIntentById(id: string): Intent | undefined {
  return intents.find(intent => intent.id === id);
}

export function getIntentDescriptions(): string {
  return intents.map(intent => 
    `- ${intent.id}: ${intent.title}. טריגרים: ${intent.triggers.join(', ')}...`
  ).join('\n');
}
