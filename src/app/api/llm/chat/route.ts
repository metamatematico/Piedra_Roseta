import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';
import { SWADESH } from '@/lib/linguistics/swadesh';
import { LANGUAGES, getLanguage } from '@/lib/linguistics/languages';
import { PHONETIC_FEATURES, FEATURE_MATRIX } from '@/lib/linguistics/features';

// Asistente pedagógico: chat contextual sobre cualquier lengua o concepto del sistema.
// Mantiene historial por sesión (enviado por el cliente, no almacenado en servidor).

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
  context?: {
    selectedLanguage?: string;
    selectedConcept?: string;
    tab?: string;
  };
}

const SYSTEM_PROMPT = `Eres "Rosetta", un asistente pedagógico experto en lingüística románica integrado en un sistema interactivo de aprendizaje llamado "Sistema Piedra Roseta".

Tu rol:
- Explicar conceptos de lingüística romance en lenguaje simple y didáctico
- Conectar la teoría matemática (álgebra lineal, PCA) con la lingüística
- Dar ejemplos concretos de cambios fonéticos (latín → lenguas modernas)
- Sugerir qué pestañas del sistema explorar según las preguntas del usuario
- Animar al estudiante y reforzar su comprensión

Estilo:
- Respuestas breves (2-4 párrafos máximo)
- Usa analogías y ejemplos cotidianos
- Cuando menciones una lengua o concepto, usa su nombre completo la primera vez
- Si la pregunta es técnica, simplifica y luego profundiza
- Puedes usar emojis con moderación (🪨, 🗣️, 📚) pero no abuse

Conocimientos disponibles:
- 10 lenguas romances (latín + 9 modernas): español, portugués, gallego, catalán, occitano, francés, italiano, sardo, rumano
- 40 conceptos de la lista de Swadesh
- 19 rasgos fonológicos/gramaticales por lengua
- Visualización PCA y combinaciones lineales de lenguas-base

El usuario puede estar en cualquiera de estas pestañas: Concepto, Piedra Roseta, Espacio Vectorial, Sintetizador, Aprender.
Si te pregunta por algo específico, sugiérele qué pestaña explorar.`;

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ChatRequest;
    const messages = body.messages ?? [];

    if (messages.length === 0) {
      return NextResponse.json({ error: 'No messages provided' }, { status: 400 });
    }

    // Construir contexto adicional si viene
    let contextBlock = '';
    if (body.context) {
      const c = body.context;
      const parts: string[] = [];
      if (c.tab) parts.push(`El usuario está en la pestaña "${c.tab}".`);
      if (c.selectedLanguage) {
        const lang = getLanguage(c.selectedLanguage);
        parts.push(`Lengua seleccionada: ${lang.name} (${lang.endonym}). Rasgos: ${PHONETIC_FEATURES.map((f, i) => `${f.name}=${FEATURE_MATRIX[lang.code][i]}`).join(', ')}.`);
      }
      if (c.selectedConcept) {
        const entry = SWADESH.find(e => e.id === c.selectedConcept);
        if (entry) {
          parts.push(`Concepto seleccionado: "${entry.gloss}" (etimón: ${entry.latin}). Formas: ${LANGUAGES.filter(l => l.code !== 'la').map(l => `${l.code}=${entry.forms[l.code]}`).join(', ')}.`);
        }
      }
      contextBlock = parts.join(' ');
    }

    const fullMessages = [
      { role: 'assistant' as const, content: SYSTEM_PROMPT + (contextBlock ? `\n\nContexto actual del usuario:\n${contextBlock}` : '') },
      ...messages.map(m => ({ role: m.role, content: m.content })),
    ];

    const zai = await ZAI.create();
    const completion = await zai.chat.completions.create({
      messages: fullMessages,
      thinking: { type: 'disabled' },
    });

    const response = completion.choices[0]?.message?.content ?? '';
    return NextResponse.json({ response, ok: true });
  } catch (e: any) {
    console.error('[llm/chat] error:', e);
    return NextResponse.json(
      { error: e?.message ?? 'Error interno', ok: false },
      { status: 500 }
    );
  }
}
