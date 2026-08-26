import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';
import { SWADESH } from '@/lib/linguistics/swadesh';
import { LANGUAGES, getLanguage } from '@/lib/linguistics/languages';

// Genera un ejercicio adaptativo según el nivel y desempeño del usuario.
// Niveles: 1 (principiante) → 5 (experto). El historial se usa para no repetir.

export interface ExerciseRequest {
  level: 1 | 2 | 3 | 4 | 5;
  history: { conceptId: string; correct: boolean }[];
  focusLanguage?: string; // código ISO opcional para enfocar
}

export interface Exercise {
  kind: 'cognate-match' | 'identify-ancestor' | 'which-is-not' | 'explain-pattern' | 'predict-evolution';
  prompt: string;
  hint?: string;
  given?: { lang: string; form: string } | { forms: string[]; langs: string[] };
  options: {
    text: string;
    sub?: string;
    correct: boolean;
    explanation: string;
  }[];
  conceptId: string;
  difficulty: number;
}

const LEVEL_PROFILES: Record<number, { kind: Exercise['kind']; pool: string[]; distractors: number; description: string }> = {
  1: {
    kind: 'cognate-match',
    pool: ['water', 'fire', 'sun', 'moon', 'hand', 'foot', 'eye', 'dog', 'fish', 'tree'],
    distractors: 3,
    description: 'Principiante: emparejar cognados obvios (rasgos muy conservados).',
  },
  2: {
    kind: 'identify-ancestor',
    pool: ['man', 'woman', 'one', 'two', 'three', 'heart', 'blood', 'night'],
    distractors: 3,
    description: 'Básico: reconocer la raíz latina a partir de formas romances.',
  },
  3: {
    kind: 'which-is-not',
    pool: ['eat', 'drink', 'see', 'come', 'sleep', 'die', 'big', 'small', 'long', 'good'],
    distractors: 3,
    description: 'Intermedio: detectar el intruso entre cognados.',
  },
  4: {
    kind: 'explain-pattern',
    pool: ['star', 'stone', 'rain', 'mountain', 'bird', 'we', 'who', 'what'],
    distractors: 3,
    description: 'Avanzado: explicar por qué un par de cognados se relacionan.',
  },
  5: {
    kind: 'predict-evolution',
    pool: ['I', 'you', 'this', 'five', 'earth'],
    distractors: 3,
    description: 'Experto: predecir cómo evolucionaría una forma latina.',
  },
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ExerciseRequest;
    const level = body.level ?? 1;
    const profile = LEVEL_PROFILES[level] ?? LEVEL_PROFILES[1];

    // Filtrar conceptos ya usados en el historial reciente (últimos 8)
    const recent = (body.history ?? []).slice(-8).map(h => h.conceptId);
    const candidates = profile.pool.filter(id => !recent.includes(id));
    const pool = candidates.length > 0 ? candidates : profile.pool;
    const conceptId = pool[Math.floor(Math.random() * pool.length)];
    const entry = SWADESH.find(e => e.id === conceptId);
    if (!entry) {
      return NextResponse.json({ error: 'Concepto no encontrado' }, { status: 500 });
    }

    const romanceLangs = LANGUAGES.filter(l => l.code !== 'la');

    // Si el usuario está acertando mucho, le pedimos al LLM una pregunta más retadora
    const recentCorrect = (body.history ?? []).slice(-5).filter(h => h.correct).length;
    const useLLM = level >= 4 || (recentCorrect >= 4 && level >= 2);

    if (useLLM) {
      // Generar ejercicio con LLM (más rico pedagógicamente)
      const exercise = await generateLLMExercise(entry, level, profile.kind, romanceLangs, body.focusLanguage);
      if (exercise) {
        return NextResponse.json(exercise);
      }
      // Si falla, cae al generador local
    }

    // Generador local determinista (rápido)
    const exercise = generateLocalExercise(entry, profile, romanceLangs);
    return NextResponse.json(exercise);
  } catch (e: any) {
    console.error('[llm/exercise] error:', e);
    return NextResponse.json({ error: e?.message ?? 'Error interno' }, { status: 500 });
  }
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateLocalExercise(
  entry: typeof SWADESH[number],
  profile: typeof LEVEL_PROFILES[number],
  romanceLangs: typeof LANGUAGES
): Exercise {
  const distractorEntries = shuffle(SWADESH.filter(e => e.id !== entry.id)).slice(0, profile.distractors);

  if (profile.kind === 'cognate-match') {
    const givenLang = romanceLangs[Math.floor(Math.random() * romanceLangs.length)];
    const targetLang = romanceLangs.filter(l => l.code !== givenLang.code)[
      Math.floor(Math.random() * (romanceLangs.length - 1))
    ];
    const distractors = shuffle(
      romanceLangs.filter(l => l.code !== givenLang.code && l.code !== targetLang.code)
    ).slice(0, profile.distractors);
    return {
      kind: 'cognate-match',
      prompt: `Dada la palabra en ${givenLang.name}, identifica su cognado en otra lengua romance.`,
      hint: 'Busca la palabra que comparte raíz etimológica (sonidos similares).',
      given: { lang: givenLang.code, form: entry.forms[givenLang.code] },
      options: shuffle([
        {
          text: entry.forms[targetLang.code],
          sub: getLanguage(targetLang.code).name,
          correct: true,
          explanation: `«${entry.forms[targetLang.code]}» (${getLanguage(targetLang.code).name}) y «${entry.forms[givenLang.code]}» (${getLanguage(givenLang.code).name}) derivan ambas del latín ${entry.latin}.`,
        },
        ...distractors.map(d => ({
          text: entry.forms[d.code],
          sub: getLanguage(d.code).name,
          correct: false,
          explanation: `«${entry.forms[d.code]}» significa «${entry.gloss}» en ${getLanguage(d.code).name}, pero no es la pareja buscada en esta ronda.`,
        })),
      ]),
      conceptId: entry.id,
      difficulty: 1,
    };
  }

  if (profile.kind === 'identify-ancestor') {
    const langsShown = shuffle(romanceLangs).slice(0, 3);
    const distractors = distractorEntries.map(e => e.latin);
    return {
      kind: 'identify-ancestor',
      prompt: `¿Cuál es la raíz latina (etimón) que dio origen a estas formas romances?`,
      hint: 'Observa letras comunes: latín AQUA → agua/água/aigua/eau/acqua.',
      given: {
        forms: langsShown.map(l => entry.forms[l.code]),
        langs: langsShown.map(l => l.code),
      },
      options: shuffle([
        {
          text: entry.latin,
          correct: true,
          explanation: `«${entry.latin}» es el etimón latino. Las formas mostradas son evoluciones fonéticas regulares de esa misma raíz.`,
        },
        ...distractors.map(d => ({
          text: d,
          correct: false,
          explanation: `«${d}» es el etimón de otro concepto, no de «${entry.gloss}».`,
        })),
      ]),
      conceptId: entry.id,
      difficulty: 2,
    };
  }

  // which-is-not
  const correctLangs = shuffle(romanceLangs).slice(0, 3);
  const wrongLang = romanceLangs.find(l => !correctLangs.includes(l))!;
  const wrongEntry = distractorEntries[0];
  return {
    kind: 'which-is-not',
    prompt: `Tres de estas formas significan «${entry.gloss}». ¿Cuál NO es cognado?`,
    hint: 'Recuerda que un cognado comparte raíz etimológica, no solo significado.',
    options: shuffle([
      ...correctLangs.map(l => ({
        text: entry.forms[l.code],
        sub: getLanguage(l.code).name,
        correct: true,
        explanation: `«${entry.forms[l.code]}» (${getLanguage(l.code).name}) deriva del latín ${entry.latin}.`,
      })),
      {
        text: wrongEntry.forms[wrongLang.code],
        sub: getLanguage(wrongLang.code).name,
        correct: false,
        explanation: `«${wrongEntry.forms[wrongLang.code]}» significa «${wrongEntry.gloss}» en ${getLanguage(wrongLang.code).name}, no «${entry.gloss}». ¡Es un intruso!`,
      },
    ]),
    conceptId: entry.id,
    difficulty: 3,
  };
}

async function generateLLMExercise(
  entry: typeof SWADESH[number],
  level: number,
  _kind: Exercise['kind'],
  romanceLangs: typeof LANGUAGES,
  focusLanguage?: string
): Promise<Exercise | null> {
  try {
    const zai = await ZAI.create();
    const examples = romanceLangs.map(l => `${l.name} (${l.code}): ${entry.forms[l.code] ?? '—'}`).join('\n');

    const prompt = `Eres un profesor de lingüística románica. Genera UN ejercicio de nivel ${level}/5 sobre el concepto "${entry.gloss}" (etimón latino: ${entry.latin}).

Formas en varias lenguas:
${examples}

Instrucciones:
- Devuelve EXCLUSIVAMENTE JSON válido, sin texto adicional ni markdown.
- El JSON debe tener esta forma exacta:
{
  "kind": "${level >= 5 ? 'predict-evolution' : level >= 4 ? 'explain-pattern' : 'cognate-match'}",
  "prompt": "string, pregunta clara para el estudiante",
  "hint": "string, pista breve",
  "options": [
    {"text": "string", "sub": "string opcional (nombre de lengua)", "correct": true|false, "explanation": "string"}
  ]
}
- Exactamente 4 opciones, solo 1 correcta.
- Las explicaciones deben enseñar un patrón fonético (ej: latín CT → it tt, es ch, fr it).
- Nivel ${level}: ${level >= 4 ? 'preguntas que requieren razonar sobre cambios fonéticos' : 'preguntas de reconocimiento de cognados'}.
- Todo en español, accesible para un estudiante principiante.
- La respuesta correcta debe ser una forma real de las mostradas arriba (o el etimón latino).`;

    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'assistant', content: 'Eres un profesor experto en lingüística románica que crea ejercicios didácticos. Respondes SOLO con JSON válido.' },
        { role: 'user', content: prompt },
      ],
      thinking: { type: 'disabled' },
    });

    const raw = completion.choices[0]?.message?.content ?? '';
    // Extraer JSON aunque venga con markdown
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;
    const parsed = JSON.parse(jsonMatch[0]);
    if (!parsed.options || !Array.isArray(parsed.options) || parsed.options.length !== 4) return null;
    const correctCount = parsed.options.filter((o: any) => o.correct).length;
    if (correctCount !== 1) return null;
    return {
      kind: parsed.kind,
      prompt: parsed.prompt,
      hint: parsed.hint,
      options: parsed.options.map((o: any) => ({
        text: String(o.text),
        sub: o.sub ? String(o.sub) : undefined,
        correct: Boolean(o.correct),
        explanation: String(o.explanation),
      })),
      conceptId: entry.id,
      difficulty: level,
    };
  } catch (e) {
    console.warn('[llm/exercise] LLM failed, falling back:', e);
    return null;
  }
}
