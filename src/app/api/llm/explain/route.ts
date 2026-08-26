import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';
import { SWADESH } from '@/lib/linguistics/swadesh';
import { LANGUAGES, getLanguage } from '@/lib/linguistics/languages';
import { PHONETIC_FEATURES, FEATURE_MATRIX } from '@/lib/linguistics/features';

// Explica por qué una respuesta fue correcta/incorrecta, en lenguaje accesible.
// Útil para feedback pedagógico inmediato tras cada pregunta.

export interface ExplainRequest {
  conceptId: string;
  answerText: string;
  correct: boolean;
  userLang?: string; // lengua del estudiante (no usado aún)
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

    const zai = await ZAI.create();

    const formsTable = LANGUAGES
      .filter(l => l.code !== 'la')
      .map(l => `- ${l.name} (${l.code}): ${entry.forms[l.code]}`)
      .join('\n');

    const prompt = `Eres un profesor didáctico de lingüística románica. Un estudiante respondió una pregunta sobre el concepto "${entry.gloss}".

Información:
- Etimón latino: ${entry.latin}
- Respuesta del estudiante: "${body.answerText}"
- ¿Correcta?: ${body.correct ? 'SÍ' : 'NO'}

Formas romances del concepto:
${formsTable}

Patrones fonológicos relevantes (matriz):
${PHONETIC_FEATURES.slice(0, 8).map((f, i) => `- ${f.name}`).join('\n')}

Tarea:
- Si la respuesta fue correcta, refuerza por qué (qué patrón fonético ilustra).
- Si fue incorrecta, explica amablemente cuál era la respuesta correcta y por qué, mencionando el patrón fonético.
- Usa máximo 2-3 frases, lenguaje simple, sin jerga técnica innecesaria.
- Termina con una pista corta sobre cómo recordar el patrón.

Responde SOLO con JSON: {"explanation": "...", "pattern": "..."}`;

    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'assistant', content: 'Eres un profesor de lingüística románica amable y claro. Respondes SOLO con JSON válido.' },
        { role: 'user', content: prompt },
      ],
      thinking: { type: 'disabled' },
    });

    const raw = completion.choices[0]?.message?.content ?? '';
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

    // Fallback: explicación local simple
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
