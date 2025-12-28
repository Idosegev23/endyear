import OpenAI from 'openai';
import { getIntentById } from './intents';

export type VisualType = 
  | 'KPI_BIG_NUMBER'
  | 'MINI_CHART'
  | 'VIDEO_EMBED'
  | 'LEADERBOARD'
  | 'QUOTE_CARD'
  | 'VALUE_CARDS'
  | 'TIMELINE_CARD'
  | 'ANIMATED_LIST'
  | 'FORMATTED_TEXT';

export interface VisualPayload {
  type: VisualType;
  props: Record<string, unknown>;
}

export interface ComposedResponse {
  answer_text: string;
  visual_payload: VisualPayload;
  stage_directions?: string;
  internal: {
    facts_used: string[];
  };
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

const MODEL = 'gpt-5-nano-2025-08-07';

export async function composeResponse(
  intentId: string,
  relevantData: Record<string, unknown>,
  style: string = 'איתמר - חד, הומור עדין, תמציתי'
): Promise<ComposedResponse> {
  const intent = getIntentById(intentId);
  
  if (!intent) {
    return {
      answer_text: 'משהו השתבש. ננסה שוב?',
      visual_payload: { type: 'QUOTE_CARD', props: { quote: 'שגיאה', author: 'מערכת' } },
      internal: { facts_used: [] }
    };
  }

  const instructions = `אתה עוזר ל-LEADERS - סוכנות שיווק דיגיטלי. 
  
התפקיד שלך: לקבל intent ו-data payload ולהחזיר תשובה טבעית בעברית + visual payload לתצוגה.

כללים קריטיים:
1. אסור להמציא עובדות. אם הנתון הוא null - תגיד שהנתון חסר
2. התשובה צריכה להיות קצרה, חדה, ללא חפירות
3. סגנון: ${style}
4. אין אימוג'ים בכלל
5. מספרים בעברית: 800,000 ולא 800K
6. אם יש וידאו - להציג אותו ב-visual

פורמט תשובה (JSON):
{
  "answer_text": "הטקסט לצ'אט",
  "visual_payload": {
    "type": "${intent.visual_type}",
    "props": { ... פרופס רלוונטיים לפי הסוג ... }
  },
  "stage_directions": "הוראות לבמה (אופציונלי)",
  "facts_used": ["עובדה 1", "עובדה 2"]
}

סוגי visuals ופרופס:
- KPI_BIG_NUMBER: { value: number|string, label: string, suffix?: string, prefix?: string, subtext?: string }
- MINI_CHART: { data: [{name, value}], title: string, color?: string }
- VIDEO_EMBED: { url: string, title?: string, description?: string }
- LEADERBOARD: { items: [{rank, name, value, subtitle?}], title: string }
- QUOTE_CARD: { quote: string, author?: string, role?: string }
- VALUE_CARDS: { cards: [{title, description, icon?}], title?: string }
- TIMELINE_CARD: { steps: [{title, description, highlight?}], title: string }`;

  const userPrompt = `Intent: ${intentId}
כותרת: ${intent.title}
סגנון תשובה: ${intent.response_style}
סוג visual מבוקש: ${intent.visual_type}

Data Payload:
${JSON.stringify(relevantData, null, 2)}

צור תשובה מתאימה בפורמט json בלבד.`;

  try {
    const response = await openai.responses.create({
      model: MODEL,
      instructions: instructions,
      input: userPrompt,
      text: {
        format: {
          type: 'json_object'
        }
      },
      reasoning: {
        effort: 'low'
      },
      max_output_tokens: 1500
    });

    const content = response.output_text;
    
    if (!content) {
      console.error('No content in response. Status:', response.status);
      throw new Error('No response content');
    }

    const parsed = JSON.parse(content);
    
    return {
      answer_text: parsed.answer_text,
      visual_payload: parsed.visual_payload,
      stage_directions: parsed.stage_directions,
      internal: {
        facts_used: parsed.facts_used || []
      }
    };
  } catch (error) {
    console.error('Response composition error:', error);
    
    // Fallback response
    return {
      answer_text: 'יש לי את המידע אבל משהו השתבש. תנסה שוב?',
      visual_payload: {
        type: 'QUOTE_CARD',
        props: {
          quote: 'אנחנו עובדים על זה',
          author: 'LEADERS AI'
        }
      },
      internal: { facts_used: [] }
    };
  }
}
