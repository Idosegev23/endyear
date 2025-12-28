import OpenAI from 'openai';
import { intents, getIntentDescriptions } from './intents';

export interface IntentResolution {
  intent_id: string;
  confidence: number;
  required_fields: string[];
  missing_fields: string[];
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

const MODEL = 'gpt-5-nano-2025-08-07';

export async function resolveIntent(
  userMessage: string
): Promise<IntentResolution> {
  const intentDescriptions = getIntentDescriptions();
  
  const instructions = `אתה מזהה כוונות משתמש עבור צ'אט סיכום שנה של LEADERS.

הכוונות האפשריות:
${intentDescriptions}

המשימה שלך:
1. לקרוא את הודעת המשתמש
2. לזהות את ה-intent המתאים ביותר
3. להחזיר JSON עם הפרמטרים

כללים:
- אם אין התאמה ברורה, החזר intent_id: "UNKNOWN" עם confidence נמוך
- אם ההודעה מבקשת משהו שלא במערכת, החזר UNKNOWN
- confidence צריך להיות בין 0 ל-1
- אם חסר מידע להשלמת הבקשה, ציין את זה ב-missing_fields

פורמט תשובה (JSON בלבד):
{
  "intent_id": "INTENT_ID",
  "confidence": 0.95,
  "required_fields": ["שדה1", "שדה2"],
  "missing_fields": []
}`;

  const userPrompt = `הודעת המשתמש: "${userMessage}"

החזר תשובה בפורמט json בלבד.`;

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
      max_output_tokens: 500
    });

    const content = response.output_text;
    
    if (!content) {
      console.error('No content in response. Status:', response.status);
      throw new Error('No response content');
    }

    const parsed = JSON.parse(content);
    
    // Validate intent exists
    const validIntent = intents.find(i => i.id === parsed.intent_id);
    if (!validIntent && parsed.intent_id !== 'UNKNOWN') {
      return {
        intent_id: 'UNKNOWN',
        confidence: 0.3,
        required_fields: [],
        missing_fields: []
      };
    }

    return {
      intent_id: parsed.intent_id,
      confidence: parsed.confidence,
      required_fields: parsed.required_fields || [],
      missing_fields: parsed.missing_fields || []
    };
  } catch (error) {
    console.error('Intent resolution error:', error);
    
    return {
      intent_id: 'UNKNOWN',
      confidence: 0,
      required_fields: [],
      missing_fields: []
    };
  }
}
