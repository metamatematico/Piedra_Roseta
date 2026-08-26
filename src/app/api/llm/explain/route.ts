import { NextRequest, NextResponse } from 'next/server';
import { chat } from '@/lib/llm/client';
import { decodeSettingsHeader } from '@/lib/llm/providers';
import { SWADESH } from '@/lib/linguistics/swadesh';
import { LANGUAGES } from '@/lib/linguistics/languages';
import { PHONETIC_FEATURES } from '@/lib/linguistics/features';

export interface ExplainRequest {
  conceptId: string;
  answerText: string;
  correct: boolean;
}

export interface ExplainResponse {
  explanation: string;
  pattern?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ExplainRequest;
    const entry = SWADESH.find(e => e.id === body.conceptId);
    if (!entry) {
      return NextResponse.json({ error: 'Concepto no encontrado' }, { status: 400 });
    }

    const formsTable = LANGUAGES
      .filter(l => l.code !== 'la')
      .map(l => `- ${l.name} (${l.code}): ${entry.forms[l.code]}`)
      .join('\n');

    const settings = decodeSettingsHeader(req.headers.get('x-llm-config'));

    // Si no hay LLM, fallback local
    if (!settings) {
      return NextResponse.json({
        explanation: body.correct
          ? `¡Bien hecho! «${body.answerText}» comparte raíz con el latín ${entry.latin}.`
          : `La respuesta correcta derivaba del latín ${entry.latin}.`,
        pattern: `Etimón: ${entry.latin}`,
      } satisfies ExplainResponse);
    }

    const prompt = `Un estudiante respondió una pregunta sobre el concepto "${entry.gloss}".

- Etimón latino: ${entry.latin}
- Respuesta del estudiante: "${body.answerText}"
- ¿Correcta?: ${body.correct ? 'SÍ' : 'NO'}

Formas romances del concepto:
${formsTable}

Patrones fonológicos relevantes:
${PHONETIC_FEATURES.slice(0, 8).map(f => `- ${f.name}`).join('\n')}

Tarea:
- Si fue correcta, refuerza por qué (qué patrón fonético ilustra).
- Si fue incorrecta, explica amablemente la respuesta correcta.
- Máximo 2-3 frases, lenguaje simple.
- Termina con una pista corta.

Responde SOLO JSON: {"explanation": "...", "pattern": "..."}`;

    const result = await chat(
      [{ role: 'user', content: prompt }],
      settings,
      { temperature: 0.5, maxTokens: 400 }
    );

    const raw = result.content;
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        return NextResponse.json({
          explanation: String(parsed.explanation ?? ''),
          pattern: parsed.pattern ? String(parsed.pattern) : undefined,
        } satisfies ExplainResponse);
      } catch {
        // cae al fallback
      }
    }

    return NextResponse.json({
      explanation: body.correct
        ? `¡Bien hecho! «${body.answerText}» comparte raíz con el latín ${entry.latin}.`
        : `La respuesta correcta derivaba del latín ${entry.latin}.`,
      pattern: `Etimón: ${entry.latin}`,
    } satisfies ExplainResponse);
  } catch (e: any) {
    console.error('[llm/explain] error:', e);
    return NextResponse.json({ error: e?.message ?? 'Error' }, { status: 500 });
  }
}
