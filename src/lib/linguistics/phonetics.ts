// Modelo fonético de cada lengua romance.
// Cada lengua tiene:
//   - Sistema de vocales (con IPA)
//   - Sistema de consonantes notables (con IPA)
//   - Reglas de transformación desde la forma escrita
//   - Código de idioma BCP-47 para Web Speech API
//
// La combinación lineal se hace a nivel de RASGOS (no de letras), y luego
// se sintetiza una pronunciación coherente.

export interface PhonemeMapping {
  written: string;       // patrón en la forma escrita (regex)
  ipa: string;           // transcripción IPA
  description: string;   // explicación didáctica
}

export interface LanguagePhonetics {
  code: string;
  bcp47: string;         // para Web Speech API (es-ES, fr-FR, etc.)
  vowelSystem: {         // sistema vocálico
    symbol: string;      // símbolo IPA
    examples: string[];  // palabras que contienen esta vocal
  }[];
  consonantHighlights: PhonemeMapping[]; // consonantes características
  // Reglas de transformación escrita → IPA (ordenadas por prioridad)
  rules: { pattern: RegExp; replace: string; note?: string }[];
  // Fonemas básicos de cada vocal escrita
  vowelMap: Record<string, string>;
  // Velocidad de habla típica (para TTS)
  speechRate: number;
  // Idioma de fallback si BCP-47 no está disponible
  fallbackBcp47?: string;
}

export const PHONETICS: Record<string, LanguagePhonetics> = {
  la: {
    code: 'la',
    bcp47: 'la',          // latín (clásico) — TTS limitado
    fallbackBcp47: 'it-IT',
    speechRate: 0.9,
    vowelSystem: [
      { symbol: 'a', examples: ['aqua', 'mater'] },
      { symbol: 'e', examples: ['ego', 'mons'] },
      { symbol: 'i', examples: ['ibi', 'dies'] },
      { symbol: 'o', examples: ['sol', 'homo'] },
      { symbol: 'u', examples: ['tu', 'luna'] },
    ],
    consonantHighlights: [
      { written: 'c', ipa: 'k', description: 'Siempre /k/ ante a/o/u, /k/ ante e/i en latín clásico' },
      { written: 'v', ipa: 'w', description: 'Se pronunciaba como /w/ (semivocal), no como /v/' },
      { written: 'qu', ipa: 'kw', description: 'Grupo /kw/ como en "aqua"' },
    ],
    rules: [
      { pattern: /ae/g, replace: 'ai', note: 'diptongo ae → /ai/' },
      { pattern: /oe/g, replace: 'oi', note: 'diptongo oe → /oi/' },
      { pattern: /c(?=[ei])/g, replace: 'k', note: 'c → /k/ (latín clásico)' },
      { pattern: /v/g, replace: 'w', note: 'v → /w/' },
      { pattern: /qu/g, replace: 'kw' },
    ],
    vowelMap: { a: 'a', e: 'e', i: 'i', o: 'o', u: 'u', y: 'i' },
  },

  es: {
    code: 'es',
    bcp47: 'es-ES',
    speechRate: 0.95,
    vowelSystem: [
      { symbol: 'a', examples: ['agua', 'casa'] },
      { symbol: 'e', examples: ['tres', 'noche'] },
      { symbol: 'i', examples: ['sí', 'día'] },
      { symbol: 'o', examples: ['sol', 'dos'] },
      { symbol: 'u', examples: ['tu', 'luna'] },
    ],
    consonantHighlights: [
      { written: 'ñ', ipa: 'ɲ', description: 'Nasal palatal /ɲ/ como en "año"' },
      { written: 'll', ipa: 'ʎ', description: 'Lateral palatal /ʎ/ (yeísmo variable)' },
      { written: 'j/g', ipa: 'x', description: '/x/ fricativa velar sorda (jota)' },
      { written: 'r', ipa: 'r', description: 'Vibrante simple /ɾ/ o múltiple /r/' },
      { written: 'ch', ipa: 'tʃ', description: 'Africada palatal /tʃ/' },
    ],
    rules: [
      { pattern: /ñ/g, replace: 'ny', note: 'ñ → /ɲ/ (nasal palatal)' },
      { pattern: /ll/g, replace: 'y', note: 'll → /ʎ/ → /j/ (yeísmo)' },
      { pattern: /qu/g, replace: 'k' },
      { pattern: /ce/gi, replace: 'se', note: 'ce/ci → /θ/ o /s/' },
      { pattern: /ci/gi, replace: 'si' },
      { pattern: /ge/gi, replace: 'he', note: 'ge/gi → /x/' },
      { pattern: /gi/gi, replace: 'hi' },
      { pattern: /j/g, replace: 'h', note: 'j → /x/ (jota)' },
      { pattern: /h/g, replace: '' },
      { pattern: /v/g, replace: 'b', note: 'v → /b/ (betacismo)' },
    ],
    vowelMap: { a: 'a', e: 'e', i: 'i', o: 'o', u: 'u' },
  },

  pt: {
    code: 'pt',
    bcp47: 'pt-PT',
    fallbackBcp47: 'pt-BR',
    speechRate: 0.95,
    vowelSystem: [
      { symbol: 'a', examples: ['casa'] },
      { symbol: 'ɐ̃', examples: ['pão', 'são'] },  // nasal
      { symbol: 'e', examples: ['tres'] },
      { symbol: 'ɛ', examples: ['peixe'] },         // abierta
      { symbol: 'i', examples: ['sim'] },
      { symbol: 'o', examples: ['sol'] },
      { symbol: 'ɔ', examples: ['noite'] },
      { symbol: 'u', examples: ['tu'] },
      { symbol: 'ũ', examples: ['um'] },            // nasal
    ],
    consonantHighlights: [
      { written: 'nh', ipa: 'ɲ', description: 'Nasal palatal como ñ' },
      { written: 'lh', ipa: 'ʎ', description: 'Lateral palatal como ll' },
      { written: 'rr', ipa: 'R', description: 'Vibrante uvular /R/' },
      { written: 's/z', ipa: 's/z', description: 'Sibilantes con distinción sonora/sorda' },
      { written: 'ch', ipa: 'ʃ', description: '/ʃ/ como en "noite"' },
    ],
    rules: [
      { pattern: /nh/g, replace: 'ny' },
      { pattern: /lh/g, replace: 'ly' },
      { pattern: /ão/g, replace: 'aon', note: 'ão → nasal /ɐ̃ũ/' },
      { pattern: /ã/g, replace: 'an' },
      { pattern: /õ/g, replace: 'on' },
      { pattern: /ç/g, replace: 's' },
      { pattern: /ch/g, replace: 'sh', note: 'ch → /ʃ/' },
      { pattern: /rr/g, replace: 'R', note: 'rr → vibrante uvular' },
      { pattern: /qu/gi, replace: 'k' },
      { pattern: /h/g, replace: '' },
    ],
    vowelMap: { a: 'a', e: 'e', i: 'i', o: 'o', u: 'u' },
  },

  gl: {
    code: 'gl',
    bcp47: 'gl-ES',
    fallbackBcp47: 'pt-PT',
    speechRate: 0.95,
    vowelSystem: [
      { symbol: 'a', examples: ['aug'] },
      { symbol: 'e', examples: ['tres'] },
      { symbol: 'i', examples: ['ti'] },
      { symbol: 'o', examples: ['sol'] },
      { symbol: 'u', examples: ['lúa'] },
    ],
    consonantHighlights: [
      { written: 'ñ', ipa: 'ɲ', description: 'Como ñ español' },
      { written: 'll', ipa: 'ʎ', description: 'Como ll español (no yeísmo)' },
      { written: 'x', ipa: 'ʃ', description: '/ʃ/ como en "peixe"' },
    ],
    rules: [
      { pattern: /ñ/g, replace: 'ny' },
      { pattern: /ll/g, replace: 'ly' },
      { pattern: /x/g, replace: 'sh' },
      { pattern: /qu/g, replace: 'k' },
      { pattern: /h/g, replace: '' },
    ],
    vowelMap: { a: 'a', e: 'e', i: 'i', o: 'o', u: 'u' },
  },

  ca: {
    code: 'ca',
    bcp47: 'ca-ES',
    fallbackBcp47: 'es-ES',
    speechRate: 0.95,
    vowelSystem: [
      { symbol: 'a', examples: ['aigua'] },
      { symbol: 'ɛ', examples: ['set'] },
      { symbol: 'e', examples: ['ges'] },
      { symbol: 'i', examples: ['sis'] },
      { symbol: 'ɔ', examples: ['poc'] },
      { symbol: 'o', examples: ['sol'] },
      { symbol: 'u', examples: ['tu'] },
      { symbol: 'ə', examples: ['pare'] },  // neutra
    ],
    consonantHighlights: [
      { written: 'ny', ipa: 'ɲ', description: 'Nasal palatal' },
      { written: 'll', ipa: 'ʎ', description: 'Lateral palatal' },
      { written: 'j', ipa: 'ʒ', description: '/ʒ/ sonora' },
      { written: 'x', ipa: 'ʃ', description: '/ʃ/ sorda' },
    ],
    rules: [
      { pattern: /ny/g, replace: 'ny' },
      { pattern: /ll/g, replace: 'ly' },
      { pattern: /tx/g, replace: 'ch' },
      { pattern: /j/g, replace: 'zh', note: 'j → /ʒ/' },
      { pattern: /x/g, replace: 'sh', note: 'x → /ʃ/' },
      { pattern: /qu/gi, replace: 'k' },
      { pattern: /h/g, replace: '' },
    ],
    vowelMap: { a: 'a', e: 'e', i: 'i', o: 'o', u: 'u' },
  },

  oc: {
    code: 'oc',
    bcp47: 'oc-ES',  // limitado
    fallbackBcp47: 'fr-FR',
    speechRate: 0.95,
    vowelSystem: [
      { symbol: 'a', examples: ['aiga'] },
      { symbol: 'e', examples: ['tres'] },
      { symbol: 'i', examples: ['ieu'] },
      { symbol: 'o', examples: ['solelh'] },
      { symbol: 'u', examples: ['luna'] },
    ],
    consonantHighlights: [
      { written: 'lh', ipa: 'ʎ', description: 'Lateral palatal' },
      { written: 'nh', ipa: 'ɲ', description: 'Nasal palatal' },
      { written: 'th', ipa: 't', description: 'Interdental sorda' },
    ],
    rules: [
      { pattern: /lh/g, replace: 'ly' },
      { pattern: /nh/g, replace: 'ny' },
      { pattern: /ò/g, replace: 'o' },
      { pattern: /é/g, replace: 'e' },
      { pattern: /h/g, replace: '' },
    ],
    vowelMap: { a: 'a', e: 'e', i: 'i', o: 'o', u: 'u' },
  },

  fr: {
    code: 'fr',
    bcp47: 'fr-FR',
    speechRate: 0.92,
    vowelSystem: [
      { symbol: 'a', examples: ['chat'] },
      { symbol: 'ɑ̃', examples: ['sans', 'enfant'] },   // nasal
      { symbol: 'e', examples: ['des'] },
      { symbol: 'ə', examples: ['le', 'petit'] },       // schwa
      { symbol: 'ɛ', examples: ['mer', 'tres'] },
      { symbol: 'i', examples: ['nuit'] },
      { symbol: 'o', examples: ['mot'] },
      { symbol: 'ɔ̃', examples: ['bon', 'nom'] },        // nasal
      { symbol: 'u', examples: ['tu', 'lune'] },
      { symbol: 'y', examples: ['lune', 'tu'] },         // anterior redondeada
      { symbol: 'œ̃', examples: ['un', 'parfum'] },      // nasal
    ],
    consonantHighlights: [
      { written: 'r', ipa: 'ʁ', description: 'R uvular /ʁ/ (gutural)' },
      { written: 'ch', ipa: 'ʃ', description: '/ʃ/ como "sh"' },
      { written: 'j', ipa: 'ʒ', description: '/ʒ/ sonora' },
      { written: 'gn', ipa: 'ɲ', description: 'Nasal palatal' },
      { written: 'ill', ipa: 'j', description: '/j/ semivocal' },
    ],
    rules: [
      { pattern: /eau/g, replace: 'o', note: 'eau → /o/' },
      { pattern: /ai/gi, replace: 'e', note: 'ai → /ɛ/' },
      { pattern: /ain/gi, replace: 'an', note: 'ain → nasal /ɛ̃/' },
      { pattern: /oin/gi, replace: 'wan', note: 'oin → /wɛ̃/' },
      { pattern: /on/gi, replace: 'on', note: 'on → nasal /ɔ̃/' },
      { pattern: /an/gi, replace: 'an', note: 'an → nasal /ɑ̃/' },
      { pattern: /in/gi, replace: 'an', note: 'in → nasal /ɛ̃/' },
      { pattern: /un/gi, replace: 'un', note: 'un → nasal /œ̃/' },
      { pattern: /gn/g, replace: 'ny', note: 'gn → /ɲ/' },
      { pattern: /ch/g, replace: 'sh' },
      { pattern: /j/g, replace: 'zh' },
      { pattern: /qu/g, replace: 'k' },
      { pattern: /ille/gi, replace: 'iy' },
      { pattern: /r/g, replace: 'R', note: 'r → /ʁ/ (uvular)' },
      { pattern: /h/g, replace: '' },
      { pattern: /eau/g, replace: 'o' },
    ],
    vowelMap: { a: 'a', e: 'e', i: 'i', o: 'o', u: 'u', y: 'u' },
  },

  it: {
    code: 'it',
    bcp47: 'it-IT',
    speechRate: 0.98,
    vowelSystem: [
      { symbol: 'a', examples: ['acqua'] },
      { symbol: 'e', examples: ['tre'] },
      { symbol: 'ɛ', examples: ['sette'] },
      { symbol: 'i', examples: ['sei'] },
      { symbol: 'o', examples: ['sole'] },
      { symbol: 'ɔ', examples: ['otto'] },
      { symbol: 'u', examples: ['tu'] },
    ],
    consonantHighlights: [
      { written: 'gn', ipa: 'ɲ', description: 'Nasal palatal' },
      { written: 'gl', ipa: 'ʎ', description: 'Lateral palatal' },
      { written: 'c/c', ipa: 'tʃ', description: 'cuesta → /tʃ/' },
      { written: 'double', ipa: 'ː', description: 'Consonantes dobles (geminadas)' },
    ],
    rules: [
      { pattern: /gn/g, replace: 'ny' },
      { pattern: /gli/g, replace: 'lyi' },
      { pattern: /ce/gi, replace: 'che' },
      { pattern: /ci/gi, replace: 'chi' },
      { pattern: /ge/gi, replace: 'je' },
      { pattern: /gi/gi, replace: 'ji' },
      { pattern: /qu/g, replace: 'ku' },
      { pattern: /h/g, replace: '' },
    ],
    vowelMap: { a: 'a', e: 'e', i: 'i', o: 'o', u: 'u' },
  },

  sc: {
    code: 'sc',
    bcp47: 'sc-IT',
    fallbackBcp47: 'it-IT',
    speechRate: 0.95,
    vowelSystem: [
      { symbol: 'a', examples: ['abba'] },
      { symbol: 'e', examples: ['tres'] },
      { symbol: 'i', examples: ['pius'] },
      { symbol: 'o', examples: ['sole'] },
      { symbol: 'u', examples: ['luna'] },
    ],
    consonantHighlights: [
      { written: 'c', ipa: 'k', description: 'Conserva /k/ ante e,i (caelum → kelu)' },
      { written: 'g', ipa: 'g', description: 'Conserva /g/ ante e,i' },
    ],
    rules: [
      { pattern: /ce/gi, replace: 'ke', note: 'sardo conserva /k/' },
      { pattern: /ci/gi, replace: 'ki' },
      { pattern: /ge/gi, replace: 'ge' },
      { pattern: /gi/gi, replace: 'gi' },
      { pattern: /qu/g, replace: 'ku' },
      { pattern: /h/g, replace: '' },
    ],
    vowelMap: { a: 'a', e: 'e', i: 'i', o: 'o', u: 'u' },
  },

  ro: {
    code: 'ro',
    bcp47: 'ro-RO',
    speechRate: 0.98,
    vowelSystem: [
      { symbol: 'a', examples: ['apă'] },
      { symbol: 'ɨ', examples: ['mânca'] },  // central cerrada
      { symbol: 'e', examples: ['trei'] },
      { symbol: 'i', examples: ['zi'] },
      { symbol: 'o', examples: ['soare'] },
      { symbol: 'u', examples: ['tu'] },
    ],
    consonantHighlights: [
      { written: 'ș', ipa: 'ʃ', description: '/ʃ/ como sh' },
      { written: 'ț', ipa: 'ts', description: '/ts/ africada' },
      { written: 'ă', ipa: 'ə', description: 'Schwa /ə/' },
      { written: 'î/â', ipa: 'ɨ', description: 'Vocal central cerrada /ɨ/' },
    ],
    rules: [
      { pattern: /ș/g, replace: 'sh' },
      { pattern: /ț/g, replace: 'ts' },
      { pattern: /ă/g, replace: 'e', note: 'ă → /ə/' },
      { pattern: /î/g, replace: 'i', note: 'î → /ɨ/' },
      { pattern: /â/g, replace: 'i' },
      { pattern: /h/g, replace: '' },
    ],
    vowelMap: { a: 'a', e: 'e', i: 'i', o: 'o', u: 'u' },
  },
};

// ---------- Función principal: transcribir a "fonemas híbridos" ----------

export interface TranscriptionResult {
  ipa: string;           // transcripción IPA aproximada
  simplified: string;    // versión simplificada legible por TTS
  rules: { matched: string; replaced: string; note?: string }[];
}

export function transcribeToPhonemes(form: string, langCode: string): TranscriptionResult {
  const phon = PHONETICS[langCode];
  if (!phon) {
    return { ipa: form, simplified: form, rules: [] };
  }
  let result = form.toLowerCase();
  const applied: { matched: string; replaced: string; note?: string }[] = [];
  for (const rule of phon.rules) {
    const before = result;
    result = result.replace(rule.pattern, rule.replace);
    if (before !== result) {
      applied.push({
        matched: rule.pattern.source,
        replaced: rule.replace,
        note: rule.note,
      });
    }
  }
  // IPA simplificada: usar los reemplazos como base
  return {
    ipa: result,
    simplified: result,
    rules: applied,
  };
}

// ---------- Síntesis de la lengua híbrida ----------

export interface HybridSynthesisResult {
  hybridForm: string;         // forma léxica escrita resultante
  hybridPhonemes: string;     // secuencia de fonemas simplificada
  hybridIPA: string;          // IPA aproximada
  bcp47Guess: string;         // mejor código BCP-47 para TTS
  rules: { from: string; to: string; reason: string }[];
  // Para cada fonema de la forma original, qué reglas se aplicaron
  perLanguage: { code: string; form: string; phonemes: string }[];
}

// Combina linealmente las formas léxicas de varias lenguas-base.
// Estrategia:
//   1. Para cada lengua, transcribir a fonemas simplificados
//   2. Para cada posición, elegir el fonema de la lengua con mayor peso α
//   3. Si los pesos están cerca, mezclar (preferir el más "marcado" fonéticamente)
//   4. Reconstruir la forma escrita y la IPA
export function synthesizeHybrid(
  bases: { code: string; form: string; weight: number }[]
): HybridSynthesisResult {
  // Transcribir cada forma
  const transcriptions = bases.map(b => ({
    code: b.code,
    form: b.form,
    weight: b.weight,
    ...transcribeToPhonemes(b.form, b.code),
  }));

  if (transcriptions.length === 0) {
    return {
      hybridForm: '',
      hybridPhonemes: '',
      hybridIPA: '',
      bcp47Guess: 'es-ES',
      rules: [],
      perLanguage: [],
    };
  }

  // Normalizar pesos
  const totalWeight = transcriptions.reduce((s, t) => s + Math.max(0, t.weight), 0) || 1;
  const normalized = transcriptions.map(t => ({ ...t, w: Math.max(0, t.weight) / totalWeight }));

  // Tomar la longitud máxima
  const maxLen = Math.max(...normalized.map(t => t.simplified.length));

  // Para cada posición, votar por el fonema
  let hybridPhonemes = '';
  const rules: { from: string; to: string; reason: string }[] = [];

  for (let i = 0; i < maxLen; i++) {
    // Recolectar los fonemas de cada lengua en esta posición (con su peso)
    const candidates: { phoneme: string; weight: number; code: string }[] = [];
    for (const t of normalized) {
      if (i < t.simplified.length) {
        candidates.push({
          phoneme: t.simplified[i],
          weight: t.w,
          code: t.code,
        });
      }
    }
    if (candidates.length === 0) continue;

    // Votar ponderada: agrupar por fonema y sumar pesos
    const votes: Record<string, { weight: number; codes: string[] }> = {};
    for (const c of candidates) {
      const p = c.phoneme.toLowerCase();
      if (!votes[p]) votes[p] = { weight: 0, codes: [] };
      votes[p].weight += c.weight;
      if (!votes[p].codes.includes(c.code)) votes[p].codes.push(c.code);
    }
    // Elegir el fonema ganador
    const winner = Object.entries(votes).sort((a, b) => b[1].weight - a[1].weight)[0];
    if (!winner) continue;
    const [phoneme, info] = winner;

    hybridPhonemes += phoneme;

    // Registrar regla si no es la opción obvia
    if (candidates.length > 1 && info.codes.length > 0) {
      const total = candidates.reduce((s, c) => s + c.weight, 0);
      const reason = `Posición ${i + 1}: «${phoneme}» gana con ${(info.weight * 100).toFixed(0)}% (de ${info.codes.join(', ')})`;
      rules.push({
        from: candidates.map(c => c.phoneme).join('|'),
        to: phoneme,
        reason,
      });
    }
  }

  // Reconstruir forma escrita: usar el fonema simplificado
  const hybridForm = hybridPhonemes;

  // IPA aproximada (los fonemas ya son compatibles con IPA básica)
  const hybridIPA = '/' + hybridPhonemes + '/';

  // Mejor BCP-47: el de la lengua con mayor peso
  const topLang = normalized.slice().sort((a, b) => b.w - a.w)[0];
  const bcp47Guess = topLang
    ? PHONETICS[topLang.code]?.bcp47 ?? PHONETICS[topLang.code]?.fallbackBcp47 ?? 'es-ES'
    : 'es-ES';

  return {
    hybridForm,
    hybridPhonemes,
    hybridIPA,
    bcp47Guess,
    rules,
    perLanguage: normalized.map(t => ({
      code: t.code,
      form: t.form,
      phonemes: t.simplified,
    })),
  };
}
