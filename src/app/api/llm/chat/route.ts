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
  let body: ChatRequest | null = null;
  try {
    body = (await req.json()) as ChatRequest;
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
    // Fallback amigable si el LLM no está disponible (p.ej. en Vercel sin .z-ai-config)
    const lastUser = (body?.messages ?? []).slice().reverse().find(m => m.role === 'user')?.content ?? '';
    const fallback = buildFallbackChatResponse(lastUser, body?.context);
    return NextResponse.json({
      response: fallback,
      ok: true,
      fallback: true,
      warning: 'El LLM no está configurado en este entorno. Respuesta generada localmente.',
    });
  }
}

function buildFallbackChatResponse(
  userMessage: string,
  context?: ChatRequest['context']
): string {
  const msg = userMessage.toLowerCase();
  const tab = context?.tab ?? '';

  // Patrones simples de respuesta
  if (msg.includes('franc') && (msg.includes('diferente') || msg.includes('diferen') || msg.includes('por qué') || msg.includes('porque'))) {
    return `El francés es el más divergente de las lenguas romances porque sufrió varios cambios fonéticos radicales: perdió el acento lexical, palatalizó /ka/ → /ʃa/ (CATU → chat), desarrolló vocales nasales fonémicas y redujo muchas vocales átonas a schwa /ə/. Míralo en la pestaña "Espacio Vectorial": el francés aparece muy separado del cluster ibérico.

Para explorarlo más, prueba en "Piedra Roseta" el concepto "gato" o "noche" y verás las transformaciones fonéticas en acción.`;
  }
  if (msg.includes('pca') || msg.includes('componente') || msg.includes('álgebra') || msg.includes('algebra') || msg.includes('vector')) {
    return `El Análisis de Componentes Principales (PCA) es una técnica de álgebra lineal que encuentra los ejes de máxima varianza en un conjunto de datos. En lingüística, aplicamos PCA al espacio de rasgos fonológicos de las lenguas: cada lengua es un vector de 19 dimensiones, y PCA nos da una proyección 2D que conserva la mayor parte de la variación.

En la pestaña "Espacio Vectorial" puedes verlo visualizado: los puntos cerca comparten rasgos, los lejanos divergen. PC1 suele capturar la "cantidad de cambio fonético desde el latín" y PC2 la "dirección del cambio" (ibérico vs. galorromance).`;
  }
  if (msg.includes('base') || msg.includes('sinteti') || msg.includes('combin')) {
    return `En el "Sintetizador" puedes elegir lenguas-base con pesos α. Si tratas cada lengua como un vector, una combinación lineal v = α₁·b₁ + α₂·b₂ + ... genera una "lengua híbrida" en el espacio de rasgos.

Prueba combinando latín + francés + español con pesos altos y mira cómo se acerca o aleja de cada lengua real. El "error de reconstrucción" te dice cuánto se diferencia de la lengua objetivo.`;
  }
  if (msg.includes('cognado') || msg.includes('etim') || msg.includes('raíz') || msg.includes('raiz') || msg.includes('latín') || msg.includes('latin')) {
    return `Un cognado es una palabra que comparte raíz etimológica con otra en una lengua distinta. En las lenguas romances, todos los cognados del vocabulario básico derivan del latín.

Ejemplo: latín AQUA → español "agua", portugués "água", catalán "aigua", francés "eau", italiano "acqua", rumano "apă". Aunque se ven diferentes, todos vienen de la misma raíz.

En la pestaña "Piedra Roseta" puedes ver estos cognados en paralelo. En "Aprender" pondrás a prueba tu capacidad de reconocerlos.`;
  }
  if (msg.includes('hola') || msg.includes('ayuda') || msg.includes('empezar')) {
    return `¡Hola! Soy Rosetta, tu asistente para aprender lenguas romances. Te recomiendo empezar por la pestaña "Concepto" para entender la idea matemática, luego "Piedra Roseta" para ver cognados en paralelo, y "Aprender" para poner a prueba tu comprensión.

¿Hay alguna lengua o concepto que te interese especialmente?`;
  }

  return `Buena pregunta. Te sugiero explorar la pestaña "${tab || 'Concepto'}" para más contexto.

Nota: en este entorno el LLM no está completamente configurado, así que mis respuestas son limitadas. Para activar el asistente completo, configura el SDK z-ai-web-dev-sdk en tu despliegue (ver README).`;
}
