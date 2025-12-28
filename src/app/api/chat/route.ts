import { NextRequest, NextResponse } from 'next/server';
import { processMessage, getCurrentQuestionIndex } from '@/lib/flowEngine';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, askedIntents = [] } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // חשב את ה-index הנוכחי
    const currentIndex = getCurrentQuestionIndex(askedIntents);

    // עבד את ההודעה עם ה-flow engine (ללא AI!)
    const result = processMessage(message, currentIndex);

    return NextResponse.json({
      answer_text: result.answerText,
      intent_id: result.intentId,
      confidence: 1.0, // תמיד 100% כי זה rule-based
      visual_payload: result.visualPayload,
      next_question: result.nextQuestion,
      missing_fields: []
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { 
        answer_text: 'משהו השתבש. ננסה שוב?',
        intent_id: 'ERROR',
        confidence: 0,
        visual_payload: { type: 'QUOTE_CARD', props: { quote: 'שגיאה', author: '' } },
        missing_fields: []
      },
      { status: 500 }
    );
  }
}
