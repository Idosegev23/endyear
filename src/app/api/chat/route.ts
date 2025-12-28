import { NextRequest, NextResponse } from 'next/server';
import { loadDataPack } from '@/lib/dataPack';
import { resolveIntent } from '@/lib/intentResolver';
import { composeResponse, VisualPayload } from '@/lib/responseComposer';
import { getIntentById } from '@/lib/intents';

export async function POST(req: NextRequest) {
  try {
    const { message, mode = 'show', current_scene = 'chat' } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Step 1: Resolve Intent
    const { intent_id, confidence, missing_fields } = await resolveIntent(message);

    // Step 2: Handle UNKNOWN intent
    if (intent_id === 'UNKNOWN' || confidence < 0.5) {
      const unknownResponses = [
        'תן לי שניה, אני רוצה לענות מדויק. זה שייך לכסף, קמפיינים, אנשים או 2026?',
        'לא בטוח שהבנתי. אפשר לנסח אחרת?',
        'הנושא הזה עדיין לא מחובר לדאטה שלי.'
      ];
      
      const answer_text = mode === 'admin'
        ? unknownResponses[0]
        : unknownResponses[Math.floor(Math.random() * unknownResponses.length)];

      return NextResponse.json({
        answer_text,
        intent_id: 'UNKNOWN',
        confidence,
        visual_payload: {
          type: 'QUOTE_CARD',
          props: {
            quote: 'נסו לשאול על לקוחות, קמפיינים, AI או 2026',
            author: 'LEADERS AI'
          }
        },
        missing_fields: [],
        internal_debug: mode === 'admin' ? { rationale: 'Low confidence or unknown intent' } : undefined
      });
    }

    // Step 3: Handle missing fields
    if (missing_fields.length > 0) {
      return NextResponse.json({
        answer_text: `צריך עוד פרט קטן: ${missing_fields.join(', ')}?`,
        intent_id,
        confidence,
        visual_payload: {
          type: 'QUOTE_CARD',
          props: {
            quote: `חסר: ${missing_fields.join(', ')}`,
            author: 'המערכת'
          }
        },
        missing_fields
      });
    }

    // Step 4: Load Data and Get Relevant Subset
    const dataPack = loadDataPack();
    const intent = getIntentById(intent_id);
    
    // Extract relevant data based on intent's data_paths
    const relevantData: Record<string, unknown> = {};
    
    // Add company data for context
    relevantData['company'] = dataPack.company;
    
    if (intent?.data_paths) {
      for (const path of intent.data_paths) {
        const keys = path.split('.');
        let value: unknown = dataPack;
        
        for (const key of keys) {
          if (value && typeof value === 'object' && key in value) {
            value = (value as Record<string, unknown>)[key];
          } else {
            value = null;
            break;
          }
        }
        
        relevantData[path] = value;
      }
    }
    
    console.log('Intent:', intent_id);
    console.log('Relevant Data:', JSON.stringify(relevantData, null, 2));

    // Step 5: Compose Response
    const response = await composeResponse(
      intent_id,
      relevantData,
      'איתמר - חד, הומור עדין, בלי אימוג\'ים'
    );

    return NextResponse.json({
      answer_text: response.answer_text,
      intent_id,
      confidence,
      visual_payload: response.visual_payload,
      missing_fields: [],
      internal_debug: mode === 'admin' 
        ? {
            rationale: `Intent: ${intent_id}`,
            facts_used: response.internal.facts_used,
            data_paths: intent?.data_paths
          }
        : undefined
    });

  } catch (error) {
    console.error('Chat API error:', error);
    
    return NextResponse.json({
      answer_text: 'משהו השתבש. תנסו שוב?',
      intent_id: 'ERROR',
      confidence: 0,
      visual_payload: {
        type: 'QUOTE_CARD',
        props: {
          quote: 'שגיאה במערכת',
          author: 'LEADERS AI'
        }
      } as VisualPayload,
      missing_fields: []
    }, { status: 500 });
  }
}
