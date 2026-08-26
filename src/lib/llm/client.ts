// Cliente unificado de LLM en el servidor.
// Recibe la configuración del cliente (header x-llm-config) y enruta al provider correcto.
// Cada provider se implementa con fetch nativo (sin SDKs externos) para máxima compatibilidad
// con Vercel y otros entornos serverless.

import { LLMSettings, getProvider } from './providers';
import { SWADESH } from '@/lib/linguistics/swadesh';
import { LANGUAGES, getLanguage } from '@/lib/linguistics/languages';
import { PHONETIC_FEATURES, FEATURE_MATRIX } from '@/lib/linguistics/features';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatOptions {
  temperature?: number;
  maxTokens?: number;
  // El sistema puede inyectar contexto del estado actual del usuario
  systemContext?: SystemContext;
}

export interface SystemContext {
  tab?: string;
  selectedLanguage?: string;
  selectedConcept?: string;
}

export interface ChatResult {
  content: string;
  provider: string;
  model?: string;
  fallback?: boolean;
  warning?: string;
}

// ---------- Sistema base ----------

const BASE_SYSTEM_PROMPT = `Eres "Rosetta", un asistente pedagógico experto en lingüística románica integrado en un sistema interactivo llamado "Sistema Piedra Roseta".

El sistema tiene 5 módulos (pestañas) a los que el usuario puede acceder:
1. "Concepto" — Marco teórico: por qué una lengua es un vector, qué es una base lingüística, referencias científicas.
2. "Piedra Roseta" — Vista comparativa: 40 conceptos en 10 lenguas romances en paralelo (latín como ancestro común).
3. "Espacio Vectorial" — Visualización PCA 2D de las lenguas como puntos en un espacio de 19 rasgos fonológicos.
4. "Sintetizador" — Editor de bases: combina lenguas con pesos α para generar una lengua híbrida (combinación lineal).
5. "Aprender" — Quiz adaptativo con ejercicios generados por IA.

Tu rol:
- Explicar conceptos de lingüística romance en lenguaje simple y didáctico
- Conectar la teoría matemática (álgebra lineal, PCA) con la lingüística
- Dar ejemplos concretos de cambios fonéticos (latín → lenguas modernas)
- Sugerir al usuario qué pestaña explorar según sus preguntas
- Animar al estudiante y reforzar su comprensión

Estilo:
- Respuestas breves (2-4 párrafos máximo)
- Usa analogías y ejemplos cotidianos
- Cuando menciones una lengua o concepto, usa su nombre completo la primera vez
- Puedes usar emojis con moderación (🪨, 🗣️, 📚, 🧮) pero sin abuso

Conocimientos disponibles:
- 10 lenguas romances: latín (ancestro), español, portugués, gallego, catalán, occitano, francés, italiano, sardo, rumano
- 40 conceptos de la lista de Swadesh (vocabulario básico universal)
- 19 rasgos fonológicos y gramaticales por lengua (vocales nasales, /ʎ/, /ɲ/, geminación, casos, etc.)
- Visualización PCA y combinaciones lineales de lenguas-base`;

// ---------- Función principal ----------

export async function chat(
  messages: ChatMessage[],
  settings: LLMSettings | null,
  options: ChatOptions = {}
): Promise<ChatResult> {
  const sys = options.systemContext ? buildSystemWithContext(options.systemContext) : BASE_SYSTEM_PROMPT;
  const fullMessages: ChatMessage[] = [
    { role: 'system', content: sys },
    ...messages,
  ];

  // Si no hay settings o no está configurado, usar fallback local
  if (!settings || !isAvailable(settings)) {
    return localFallback(messages, options.systemContext);
  }

  try {
    switch (settings.provider) {
      case 'zai':
        return await callZai(fullMessages, settings, options);
      case 'anthropic':
        return await callAnthropic(fullMessages, settings, options);
      case 'openai':
      case 'openai-compatible':
        return await callOpenAI(fullMessages, settings, options);
      default:
        return localFallback(messages, options.systemContext);
    }
  } catch (e: any) {
    console.warn(`[llm] provider ${settings.provider} falló:`, e?.message);
    const fallback = localFallback(messages, options.systemContext);
    return {
      ...fallback,
      warning: `El proveedor "${settings.provider}" falló (${e?.message}). Respuesta local.`,
    };
  }
}

function isAvailable(s: LLMSettings): boolean {
  const p = getProvider(s.provider);
  if (p.needsApiKey && !s.apiKey) return false;
  if (p.needsBaseUrl && !s.baseUrl) return false;
  return true;
}

// ---------- Construcción de system prompt con contexto ----------

function buildSystemWithContext(ctx: SystemContext): string {
  let s = BASE_SYSTEM_PROMPT + '\n\n--- CONTEXTO ACTUAL DEL USUARIO ---\n';
  if (ctx.tab) s += `- Pestaña activa: "${ctx.tab}"\n`;
  if (ctx.selectedLanguage) {
    const lang = getLanguage(ctx.selectedLanguage);
    s += `- Lengua seleccionada: ${lang.name} (${lang.endonym})\n`;
    s += `  Rasgos fonológicos: ${PHONETIC_FEATURES.map((f, i) => `${f.name}=${FEATURE_MATRIX[lang.code][i]}`).join(', ')}\n`;
    s += `  Nota: ${lang.notes}\n`;
  }
  if (ctx.selectedConcept) {
    const entry = SWADESH.find(e => e.id === ctx.selectedConcept);
    if (entry) {
      s += `- Concepto seleccionado: "${entry.gloss}" (etimón latino: ${entry.latin})\n`;
      s += `  Formas en lenguas romances: ${LANGUAGES.filter(l => l.code !== 'la').map(l => `${l.name}=${entry.forms[l.code]}`).join(', ')}\n`;
    }
  }
  return s;
}

// ---------- Z.ai (z-ai-web-dev-sdk) ----------

async function callZai(
  messages: ChatMessage[],
  _settings: LLMSettings,
  options: ChatOptions
): Promise<ChatResult> {
  // Import dinámico para evitar cargar el SDK si no se usa
  const ZAI = (await import('z-ai-web-dev-sdk')).default;
  const zai = await ZAI.create();
  const completion = await zai.chat.completions.create({
    messages: messages.map(m => ({ role: m.role === 'system' ? 'assistant' : m.role, content: m.content })),
    thinking: { type: 'disabled' },
  });
  return {
    content: completion.choices[0]?.message?.content ?? '',
    provider: 'zai',
  };
}

// ---------- Anthropic Claude ----------

async function callAnthropic(
  messages: ChatMessage[],
  settings: LLMSettings,
  options: ChatOptions
): Promise<ChatResult> {
  // Anthropic separa system del resto
  const systemMsg = messages.find(m => m.role === 'system')?.content ?? '';
  const userMessages = messages
    .filter(m => m.role !== 'system')
    .map(m => ({ role: m.role, content: m.content }));

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': settings.apiKey!,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: settings.model || 'claude-sonnet-4-5-20250929',
      max_tokens: options.maxTokens ?? 1024,
      temperature: options.temperature ?? 0.7,
      system: systemMsg,
      messages: userMessages,
    }),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Anthropic API ${res.status}: ${txt.slice(0, 200)}`);
  }

  const data = await res.json();
  const content = data.content?.map((c: any) => c.text).join('') ?? '';
  return {
    content,
    provider: 'anthropic',
    model: settings.model,
  };
}

// ---------- OpenAI (y compatibles: Groq, Together, OpenRouter) ----------

async function callOpenAI(
  messages: ChatMessage[],
  settings: LLMSettings,
  options: ChatOptions
): Promise<ChatResult> {
  const baseUrl = settings.provider === 'openai'
    ? 'https://api.openai.com/v1'
    : (settings.baseUrl || 'https://api.openai.com/v1');

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${settings.apiKey}`,
    },
    body: JSON.stringify({
      model: settings.model || 'gpt-4o-mini',
      max_tokens: options.maxTokens ?? 1024,
      temperature: options.temperature ?? 0.7,
      messages,
    }),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`OpenAI-compatible API ${res.status}: ${txt.slice(0, 200)}`);
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content ?? '';
  return {
    content,
    provider: settings.provider,
    model: settings.model,
  };
}

// ---------- Fallback local (sin LLM) ----------

function localFallback(messages: ChatMessage[], ctx?: SystemContext): ChatResult {
  const lastUser = [...messages].reverse().find(m => m.role === 'user')?.content ?? '';
  const content = buildFallbackResponse(lastUser, ctx);
  return {
    content,
    provider: 'local-fallback',
    fallback: true,
  };
}

function buildFallbackResponse(userMessage: string, ctx?: SystemContext): string {
  const msg = userMessage.toLowerCase();
  const tab = ctx?.tab ?? '';

  if (msg.includes('franc') && (msg.includes('diferente') || msg.includes('diferen') || msg.includes('por qué') || msg.includes('porque'))) {
    return `El francés es el más divergente de las lenguas romances porque sufrió varios cambios fonéticos radicales: perdió el acento lexical, palatalizó /ka/ → /ʃa/ (CATU → chat), desarrolló vocales nasales fonémicas y redujo muchas vocales átonas a schwa /ə/. 

Para verlo, ve a la pestaña "Espacio Vectorial": el francés aparece muy separado del cluster ibérico. También prueba en "Piedra Roseta" conceptos como "gato" o "noche" para ver las transformaciones en acción.`;
  }
  if (msg.includes('pca') || msg.includes('componente') || msg.includes('álgebra') || msg.includes('algebra') || msg.includes('vector')) {
    return `El Análisis de Componentes Principales (PCA) es una técnica de álgebra lineal que encuentra los ejes de máxima varianza en un conjunto de datos. En lingüística, aplicamos PCA al espacio de rasgos fonológicos: cada lengua es un vector de 19 dimensiones, y PCA nos da una proyección 2D que conserva la mayor parte de la variación.

En la pestaña "Espacio Vectorial" puedes verlo visualizado: los puntos cerca comparten rasgos, los lejanos divergen. PC1 suele capturar la "cantidad de cambio fonético desde el latín" y PC2 la "dirección del cambio".`;
  }
  if (msg.includes('base') || msg.includes('sinteti') || msg.includes('combin')) {
    return `En el "Sintetizador" puedes elegir lenguas-base con pesos α. Si tratas cada lengua como un vector, una combinación lineal v = α₁·b₁ + α₂·b₂ + ... genera una "lengua híbrida" en el espacio de rasgos.

Prueba combinando latín + francés + español con pesos altos y mira cómo se acerca o aleja de cada lengua real. El "error de reconstrucción" te dice cuánto se diferencia de la lengua objetivo.`;
  }
  if (msg.includes('cognado') || msg.includes('etim') || msg.includes('raíz') || msg.includes('raiz') || msg.includes('latín') || msg.includes('latin')) {
    return `Un cognado es una palabra que comparte raíz etimológica con otra en una lengua distinta. En las lenguas romances, todos los cognados del vocabulario básico derivan del latín.

Ejemplo: latín AQUA → español "agua", portugués "água", catalán "aigua", francés "eau", italiano "acqua", rumano "apă". Aunque se ven diferentes, todos vienen de la misma raíz.

En "Piedra Roseta" puedes ver estos cognados en paralelo. En "Aprender" pondrás a prueba tu capacidad de reconocerlos.`;
  }
  if (msg.includes('hola') || msg.includes('ayuda') || msg.includes('empezar')) {
    return `¡Hola! Soy Rosetta, tu asistente para aprender lenguas romances. Te recomiendo empezar por la pestaña "Concepto" para entender la idea matemática, luego "Piedra Roseta" para ver cognados en paralelo, y "Aprender" para poner a prueba tu comprensión.

¿Hay alguna lengua o concepto que te interese especialmente?`;
  }

  return `Buena pregunta. Te sugiero explorar la pestaña "${tab || 'Concepto'}" para más contexto.

ℹ️ Estoy en modo offline porque no hay un LLM configurado. Para activarme con plena capacidad, ve al botón de configuración (arriba a la derecha) y añade una API key de Anthropic u otro proveedor.`;
}
