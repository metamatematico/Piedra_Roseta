import { NextRequest, NextResponse } from 'next/server';
import { chat, ChatMessage } from '@/lib/llm/client';
import { decodeSettingsHeader } from '@/lib/llm/providers';

export interface ChatRequest {
  messages: { role: 'user' | 'assistant'; content: string }[];
  context?: {
    selectedLanguage?: string;
    selectedConcept?: string;
    tab?: string;
  };
}

export async function POST(req: NextRequest) {
  let body: ChatRequest | null = null;
  try {
    body = (await req.json()) as ChatRequest;
    const messages = body.messages ?? [];

    if (messages.length === 0) {
      return NextResponse.json({ error: 'No messages provided' }, { status: 400 });
    }

    // Decodificar settings del header
    const settings = decodeSettingsHeader(req.headers.get('x-llm-config'));

    const result = await chat(
      messages as ChatMessage[],
      settings,
      {
        systemContext: body.context,
        temperature: 0.7,
        maxTokens: 1024,
      }
    );

    return NextResponse.json({
      response: result.content,
      ok: true,
      provider: result.provider,
      model: result.model,
      fallback: result.fallback,
      warning: result.warning,
    });
  } catch (e: any) {
    console.error('[llm/chat] error:', e);
    return NextResponse.json(
      { error: e?.message ?? 'Error interno', ok: false },
      { status: 500 }
    );
  }
}
