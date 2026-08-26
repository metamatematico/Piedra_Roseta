// Espacio de rasgos fonéticos para interpolación real.
// Cada fonema es un vector de rasgos articulatorios:
//   - sonoridad (0=sordo, 1=sonoro)
//   - nasalidad (0=oral, 1=nasal)
//   - continuante (0=stop/africada, 1=fricap/approx)
//   - lugar de articulación (escala 0-10: 1=labial, 3=dental, 5=alveolar, 7=postalveolar, 9=velar, 10=uvular)
//   - altura vocálica (0=abierta, 1=cerrada; solo para vocales)
//   - anterioridad (0=posterior, 1=anterior; solo para vocales)
//   - redondeamiento (0=no redondeada, 1=redondeada; solo para vocales)
//
// Esto permite INTERPOLAR fonemas: si combinamos /o/ (velar, semiabierta, redondeada)
// con /u/ (velar, cerrada, redondeada) al 50%, obtenemos un fonema intermedio
// (semi-cerrada redondeada) que se aproxima a /o̞/ o /ʊ/.

export type PhonemeClass = 'vowel' | 'consonant';

export interface PhonemeFeatures {
  symbol: string;        // IPA simplificada para TTS
  class: PhonemeClass;
  sonorant: number;      // 0=sordo, 1=sonoro
  nasal: number;         // 0=oral, 1=nasal
  continuant: number;    // 0=stop, 0.5=africada, 1=fricativa/aproximante
  place: number;         // 1=labial, 3=dental, 5=alveolar, 7=palatal, 9=velar, 10=uvular
  vowelHeight?: number;  // 0=abierta, 0.5=media, 1=cerrada
  vowelBack?: number;    // 0=anterior, 1=posterior
  vowelRound?: number;   // 0=no redondeada, 1=redondeada
  // Para TTS: símbolo alternativo que el navegador puede pronunciar
  ttsFallback?: string;
}

// Tabla de fonemas de referencia con sus rasgos.
// Esta es la "base ortonormal" del espacio fonético romance.
export const PHONEME_INVENTORY: PhonemeFeatures[] = [
  // ---------- Vocales ----------
  { symbol: 'a',  class: 'vowel', sonorant: 1, nasal: 0, continuant: 1, place: 5, vowelHeight: 0,    vowelBack: 0.5, vowelRound: 0 },
  { symbol: 'ɛ',  class: 'vowel', sonorant: 1, nasal: 0, continuant: 1, place: 5, vowelHeight: 0.4,  vowelBack: 0.3, vowelRound: 0 },
  { symbol: 'e',  class: 'vowel', sonorant: 1, nasal: 0, continuant: 1, place: 5, vowelHeight: 0.6,  vowelBack: 0.3, vowelRound: 0 },
  { symbol: 'ə',  class: 'vowel', sonorant: 1, nasal: 0, continuant: 1, place: 5, vowelHeight: 0.5,  vowelBack: 0.5, vowelRound: 0 },
  { symbol: 'i',  class: 'vowel', sonorant: 1, nasal: 0, continuant: 1, place: 5, vowelHeight: 1,    vowelBack: 0,   vowelRound: 0 },
  { symbol: 'ɔ',  class: 'vowel', sonorant: 1, nasal: 0, continuant: 1, place: 5, vowelHeight: 0.4,  vowelBack: 0.7, vowelRound: 1 },
  { symbol: 'o',  class: 'vowel', sonorant: 1, nasal: 0, continuant: 1, place: 5, vowelHeight: 0.6,  vowelBack: 0.7, vowelRound: 1 },
  { symbol: 'u',  class: 'vowel', sonorant: 1, nasal: 0, continuant: 1, place: 5, vowelHeight: 1,    vowelBack: 1,   vowelRound: 1 },
  { symbol: 'y',  class: 'vowel', sonorant: 1, nasal: 0, continuant: 1, place: 5, vowelHeight: 1,    vowelBack: 0,   vowelRound: 1 }, // francesa
  { symbol: 'ɨ',  class: 'vowel', sonorant: 1, nasal: 0, continuant: 1, place: 5, vowelHeight: 1,    vowelBack: 0.5, vowelRound: 0 }, // rumana
  // Vocales nasales (nasal=1)
  { symbol: 'ɑ̃',  class: 'vowel', sonorant: 1, nasal: 1, continuant: 1, place: 5, vowelHeight: 0,    vowelBack: 0.7, vowelRound: 0 },
  { symbol: 'ɛ̃',  class: 'vowel', sonorant: 1, nasal: 1, continuant: 1, place: 5, vowelHeight: 0.4,  vowelBack: 0.3, vowelRound: 0 },
  { symbol: 'ɔ̃',  class: 'vowel', sonorant: 1, nasal: 1, continuant: 1, place: 5, vowelHeight: 0.4,  vowelBack: 0.7, vowelRound: 1 },
  { symbol: 'œ̃',  class: 'vowel', sonorant: 1, nasal: 1, continuant: 1, place: 5, vowelHeight: 0.4,  vowelBack: 0.5, vowelRound: 1 },

  // ---------- Consonantes ----------
  // Labiales
  { symbol: 'p',  class: 'consonant', sonorant: 0, nasal: 0, continuant: 0,   place: 1 },
  { symbol: 'b',  class: 'consonant', sonorant: 1, nasal: 0, continuant: 0,   place: 1 },
  { symbol: 'm',  class: 'consonant', sonorant: 1, nasal: 1, continuant: 0,   place: 1 },
  { symbol: 'f',  class: 'consonant', sonorant: 0, nasal: 0, continuant: 1,   place: 1 },
  { symbol: 'v',  class: 'consonant', sonorant: 1, nasal: 0, continuant: 1,   place: 1 },
  { symbol: 'w',  class: 'consonant', sonorant: 1, nasal: 0, continuant: 1,   place: 1 }, // semivocal
  // Dentales
  { symbol: 't',  class: 'consonant', sonorant: 0, nasal: 0, continuant: 0,   place: 3 },
  { symbol: 'd',  class: 'consonant', sonorant: 1, nasal: 0, continuant: 0,   place: 3 },
  { symbol: 'n',  class: 'consonant', sonorant: 1, nasal: 1, continuant: 0,   place: 3 },
  { symbol: 'θ',  class: 'consonant', sonorant: 0, nasal: 0, continuant: 1,   place: 3 }, // española z
  { symbol: 's',  class: 'consonant', sonorant: 0, nasal: 0, continuant: 1,   place: 3 },
  { symbol: 'z',  class: 'consonant', sonorant: 1, nasal: 0, continuant: 1,   place: 3 },
  { symbol: 'l',  class: 'consonant', sonorant: 1, nasal: 0, continuant: 1,   place: 3 }, // lateral
  { symbol: 'ɾ',  class: 'consonant', sonorant: 1, nasal: 0, continuant: 0.5, place: 3 }, // vibrante simple
  { symbol: 'r',  class: 'consonant', sonorant: 1, nasal: 0, continuant: 0.5, place: 3 }, // vibrante múltiple
  // Alveolopalatales / postalveolares
  { symbol: 'ʃ',  class: 'consonant', sonorant: 0, nasal: 0, continuant: 1,   place: 7 },
  { symbol: 'ʒ',  class: 'consonant', sonorant: 1, nasal: 0, continuant: 1,   place: 7 },
  { symbol: 'tʃ', class: 'consonant', sonorant: 0, nasal: 0, continuant: 0.5, place: 7 }, // africada ch
  { symbol: 'dʒ', class: 'consonant', sonorant: 1, nasal: 0, continuant: 0.5, place: 7 },
  // Palatales
  { symbol: 'ɲ',  class: 'consonant', sonorant: 1, nasal: 1, continuant: 0,   place: 7 }, // ñ
  { symbol: 'ʎ',  class: 'consonant', sonorant: 1, nasal: 0, continuant: 1,   place: 7 }, // ll
  { symbol: 'j',  class: 'consonant', sonorant: 1, nasal: 0, continuant: 1,   place: 7 }, // semivocal
  // Velares
  { symbol: 'k',  class: 'consonant', sonorant: 0, nasal: 0, continuant: 0,   place: 9 },
  { symbol: 'g',  class: 'consonant', sonorant: 1, nasal: 0, continuant: 0,   place: 9 },
  { symbol: 'ŋ',  class: 'consonant', sonorant: 1, nasal: 1, continuant: 0,   place: 9 },
  { symbol: 'x',  class: 'consonant', sonorant: 0, nasal: 0, continuant: 1,   place: 9 }, // jota española
  { symbol: 'ɣ',  class: 'consonant', sonorant: 1, nasal: 0, continuant: 1,   place: 9 }, // g suave
  // Uvular
  { symbol: 'ʁ',  class: 'consonant', sonorant: 1, nasal: 0, continuant: 1,   place: 10 }, // R francesa
  { symbol: 'R',  class: 'consonant', sonorant: 1, nasal: 0, continuant: 0.5, place: 10 }, // R portuguesa vibrante
  // Glotal
  { symbol: 'h',  class: 'consonant', sonorant: 0, nasal: 0, continuant: 1,   place: 10 },
];

// Mapa de símbolos de fonemas a sus rasgos
const PHONEME_MAP: Record<string, PhonemeFeatures> = Object.fromEntries(
  PHONEME_INVENTORY.map(p => [p.symbol, p])
);

// ---------- Mapeo grafema → fonema (por idioma) ----------
// Tabla simplificada: para cada letra del alfabeto romance, su fonema base.
// Las reglas específicas por idioma ya viven en phonetics.ts; aquí damos el
// mapeo a fonemas IPA universales.

const DEFAULT_GRAPHEME_TO_PHONEME: Record<string, string> = {
  // Vocales
  a: 'a', á: 'a', à: 'a', â: 'a', ä: 'a',
  e: 'e', é: 'e', è: 'ɛ', ê: 'ɛ', ë: 'e',
  i: 'i', í: 'i', ï: 'i', î: 'i',
  o: 'o', ó: 'o', ò: 'ɔ', ô: 'o', ö: 'o',
  u: 'u', ú: 'u', ù: 'u', ü: 'y', û: 'u',
  y: 'i', // default
  // Consonantes simples
  b: 'b', c: 'k', d: 'd', f: 'f', g: 'g',
  h: '',  // muda en su mayoría
  j: 'x', // española por defecto
  k: 'k', l: 'l', m: 'm', n: 'n',
  p: 'p', q: 'k', r: 'r', s: 's', t: 't',
  v: 'b', w: 'w', x: 'ks', z: 'θ',
  // Dígrafos (se procesan antes que las letras sueltas)
  'ch': 'tʃ',
  'sh': 'ʃ',
  'zh': 'ʒ',
  'll': 'ʎ',
  'ny': 'ɲ',
  'ñ': 'ɲ',
  'nh': 'ɲ',
  'lh': 'ʎ',
  'gn': 'ɲ',
  'qu': 'k',
  'gu': 'g',
  'ce': 'se',
  'ci': 'si',
  'ge': 'x',
  'gi': 'x',
  'ja': 'x',
  'je': 'x',
  'ji': 'x',
  'jo': 'x',
  'ju': 'x',
  'rr': 'r',
  'ss': 's',
  'ç': 's',
  // Francesas
  'eau': 'o',
  'ai': 'e',
  'ei': 'e',
  'au': 'o',
  'oi': 'wa',
  'ou': 'u',
  'eu': 'ø',
  'œ': 'ø',
  // Nasales francesas (se manejan en reglas)
  'an': 'ɑ̃',
  'en': 'ɑ̃',
  'in': 'ɛ̃',
  'on': 'ɔ̃',
  'un': 'œ̃',
  'ain': 'ɛ̃',
  // Portuguese
  'ão': 'ɐ̃',
  'ãe': 'ɐ̃',
  'õe': 'õ',
  'nh': 'ɲ',
  'lh': 'ʎ',
  // Rumanas
  'ă': 'ə',
  'â': 'ɨ',
  'î': 'ɨ',
  'ș': 'ʃ',
  'ț': 'ts',
};

// Convierte una forma escrita a una secuencia de fonemas IPA.
export function graphemesToPhonemes(form: string, _langCode: string): string[] {
  const lower = form.toLowerCase();
  const phonemes: string[] = [];
  let i = 0;
  while (i < lower.length) {
    // Probar dígrafos/trígrafos primero (hasta 3 chars)
    let matched = false;
    for (let len = Math.min(3, lower.length - i); len >= 1; len--) {
      const chunk = lower.slice(i, i + len);
      const ph = DEFAULT_GRAPHEME_TO_PHONEME[chunk];
      if (ph !== undefined) {
        if (ph) phonemes.push(ph);
        i += len;
        matched = true;
        break;
      }
    }
    if (!matched) {
      // Carácter desconocido: saltar
      i++;
    }
  }
  return phonemes;
}

// ---------- Interpolación de fonemas ----------

export interface InterpolatedPhoneme {
  symbol: string;          // símbolo IPA del fonema más cercano al resultado
  ttsSymbol: string;       // símbolo para TTS (a veces distinto a IPA)
  features: PhonemeFeatures;
  isInterpolated: boolean; // true si el resultado es una mezcla, no un fonema puro
  blendDescription: string;// explicación humana
  // Para visualización: qué se mezcló
  sources: { symbol: string; weight: number }[];
}

// Interpola linealmente varios fonemas según sus pesos.
// El resultado es un vector de rasgos que luego se mapea al fonema más cercano.
export function interpolatePhonemes(
  candidates: { symbol: string; weight: number }[]
): InterpolatedPhoneme {
  const valid = candidates
    .map(c => ({ ...c, feat: PHONEME_MAP[c.symbol] }))
    .filter(c => c.feat && c.weight > 0);

  if (valid.length === 0) {
    // Devolver algo neutral
    return {
      symbol: 'ə',
      ttsSymbol: 'e',
      features: PHONEME_MAP['ə'],
      isInterpolated: false,
      blendDescription: 'fonema neutral',
      sources: [],
    };
  }

  // Normalizar pesos
  const total = valid.reduce((s, c) => s + c.weight, 0) || 1;

  // Interpolación lineal de cada rasgo
  const blended: PhonemeFeatures = {
    symbol: '',  // se calculará abajo
    class: valid[0].feat.class,
    sonorant: 0, nasal: 0, continuant: 0, place: 0,
  };
  for (const c of valid) {
    const w = c.weight / total;
    blended.sonorant += c.feat.sonorant * w;
    blended.nasal += c.feat.nasal * w;
    blended.continuant += c.feat.continuant * w;
    blended.place += c.feat.place * w;
    if (c.feat.vowelHeight !== undefined) {
      blended.vowelHeight = (blended.vowelHeight ?? 0) + c.feat.vowelHeight * w;
    }
    if (c.feat.vowelBack !== undefined) {
      blended.vowelBack = (blended.vowelBack ?? 0) + c.feat.vowelBack * w;
    }
    if (c.feat.vowelRound !== undefined) {
      blended.vowelRound = (blended.vowelRound ?? 0) + c.feat.vowelRound * w;
    }
  }

  // Encontrar el fonema del inventario más cercano al vector interpolado
  const closest = findClosestPhoneme(blended);

  // ¿Es una mezcla real (interpola entre fonemas distintos)?
  const uniqueSymbols = Array.from(new Set(valid.map(c => c.symbol)));
  const isInterpolated = uniqueSymbols.length > 1;

  // Descripción humana
  let blendDescription = '';
  if (isInterpolated) {
    const parts = valid
      .slice()
      .sort((a, b) => b.weight - a.weight)
      .map(c => `${(c.weight / total * 100).toFixed(0)}% /${c.symbol}/`);
    blendDescription = `Mezcla: ${parts.join(' + ')} → /${closest.symbol}/`;
  } else {
    blendDescription = `Fonema puro: /${closest.symbol}/`;
  }

  return {
    symbol: closest.symbol,
    ttsSymbol: closest.ttsFallback ?? closest.symbol,
    features: closest,
    isInterpolated,
    blendDescription,
    sources: valid.map(c => ({ symbol: c.symbol, weight: c.weight / total })),
  };
}

// Distancia euclidiana entre dos vectores de rasgos.
function featureDistance(a: PhonemeFeatures, b: PhonemeFeatures): number {
  const keys: (keyof PhonemeFeatures)[] = [
    'sonorant', 'nasal', 'continuant', 'place',
    'vowelHeight', 'vowelBack', 'vowelRound',
  ];
  let sum = 0;
  for (const k of keys) {
    const av = (a[k] as number | undefined) ?? 0;
    const bv = (b[k] as number | undefined) ?? 0;
    sum += (av - bv) ** 2;
  }
  return Math.sqrt(sum);
}

function findClosestPhoneme(target: PhonemeFeatures): PhonemeFeatures {
  // Buscar solo en la misma clase (vocal/consonante)
  const candidates = PHONEME_INVENTORY.filter(p => p.class === target.class);
  let best = candidates[0];
  let bestDist = Infinity;
  for (const p of candidates) {
    const d = featureDistance(target, p);
    if (d < bestDist) {
      bestDist = d;
      best = p;
    }
  }
  return best;
}

// ---------- Síntesis híbrida (versión interpolada) ----------

export interface HybridPhoneticResult {
  // Forma híbrida como secuencia de fonemas
  phonemes: InterpolatedPhoneme[];
  // Para TTS: secuencia de símbolos concatenados
  ttsString: string;
  // Forma escrita (aproximada) basada en los símbolos
  writtenForm: string;
  // IPA
  ipaString: string;
  // Mejor BCP-47 para TTS
  bcp47Guess: string;
  // Descripción del proceso
  summary: string;
  // Por cada lengua: su forma original + fonemas
  perLanguage: { code: string; form: string; phonemes: string[] }[];
}

// Longitud objetivo: media ponderada de las longitudes de las lenguas base
function computeTargetLength(bases: { phonemes: string[]; weight: number }[]): number {
  const totalW = bases.reduce((s, b) => s + b.weight, 0) || 1;
  const avg = bases.reduce((s, b) => s + b.phonemes.length * b.weight, 0) / totalW;
  return Math.max(1, Math.round(avg));
}

// Alinea las secuencias de fonemas por posición (alineación simple por índice).
// En una versión más sofisticada usaríamos alineamiento dinámico (Needleman-Wunsch).
function alignSequences(
  sequences: string[][],
  targetLength: number
): string[][] {
  if (sequences.length === 0) return [];
  // Para cada posición 0..targetLength-1, recolectar el fonema de cada lengua
  // Si la lengua tiene menos fonemas, repetir el último o dejar vacío
  const aligned: string[][] = [];
  for (let pos = 0; pos < targetLength; pos++) {
    const atPos: string[] = [];
    for (const seq of sequences) {
      if (pos < seq.length) {
        atPos.push(seq[pos]);
      } else {
        // Si la lengua se acabó, no contribuimos
      }
    }
    aligned.push(atPos);
  }
  return aligned;
}

export function synthesizeHybridPhonetic(
  bases: { code: string; form: string; weight: number }[]
): HybridPhoneticResult {
  // 1. Convertir cada forma a fonemas
  const perLanguage = bases.map(b => ({
    code: b.code,
    form: b.form,
    weight: b.weight,
    phonemes: graphemesToPhonemes(b.form, b.code),
  })).filter(b => b.phonemes.length > 0);

  if (perLanguage.length === 0) {
    return {
      phonemes: [],
      ttsString: '',
      writtenForm: '',
      ipaString: '',
      bcp47Guess: 'es-ES',
      summary: 'Sin fonemas para sintetizar',
      perLanguage: [],
    };
  }

  // 2. Longitud objetivo (media ponderada)
  const targetLength = computeTargetLength(perLanguage);

  // 3. Alinear por posición
  const aligned = alignSequences(perLanguage.map(p => p.phonemes), targetLength);

  // 4. Para cada posición, interpolar fonemas
  const interpolatedPhonemes: InterpolatedPhoneme[] = [];
  for (let pos = 0; pos < aligned.length; pos++) {
    const atPos = aligned[pos];
    if (atPos.length === 0) continue;
    // Recolectar candidatos con sus pesos
    const candidates: { symbol: string; weight: number }[] = [];
    for (let li = 0; li < perLanguage.length; li++) {
      if (pos < perLanguage[li].phonemes.length) {
        candidates.push({
          symbol: perLanguage[li].phonemes[pos],
          weight: perLanguage[li].weight,
        });
      }
    }
    if (candidates.length === 0) continue;
    interpolatedPhonemes.push(interpolatePhonemes(candidates));
  }

  // 5. Construir strings finales
  const ttsString = interpolatedPhonemes
    .map(p => p.ttsSymbol)
    .join('');

  const ipaString = '/' + interpolatedPhonemes
    .map(p => p.symbol)
    .join('') + '/';

  // Forma escrita: usar representación ASCII de los fonemas
  const writtenForm = interpolatedPhonemes
    .map(p => phonemeToAscii(p.symbol))
    .join('');

  // BCP-47 de la lengua dominante
  const totalWeight = perLanguage.reduce((s, p) => s + p.weight, 0) || 1;
  const dominant = perLanguage.slice().sort((a, b) => b.weight - a.weight)[0];
  const bcp47Guess = getBcp47ForLang(dominant.code);

  // Resumen
  const interpolatedCount = interpolatedPhonemes.filter(p => p.isInterpolated).length;
  const summary = `${interpolatedPhonemes.length} fonemas · ${interpolatedCount} interpolados · dominante: ${dominant.code.toUpperCase()}`;

  return {
    phonemes: interpolatedPhonemes,
    ttsString,
    writtenForm,
    ipaString,
    bcp47Guess,
    summary,
    perLanguage: perLanguage.map(p => ({
      code: p.code,
      form: p.form,
      phonemes: p.phonemes,
    })),
  };
}

// Mapea un símbolo IPA a una representación ASCII amigable para TTS.
function phonemeToAscii(symbol: string): string {
  const map: Record<string, string> = {
    'a': 'a', 'ɛ': 'e', 'e': 'e', 'ə': 'e', 'i': 'i',
    'ɔ': 'o', 'o': 'o', 'u': 'u', 'y': 'u', 'ɨ': 'i',
    'ɑ̃': 'an', 'ɛ̃': 'in', 'ɔ̃': 'on', 'œ̃': 'un',
    'p': 'p', 'b': 'b', 'm': 'm', 'f': 'f', 'v': 'v', 'w': 'u',
    't': 't', 'd': 'd', 'n': 'n', 'θ': 'z', 's': 's', 'z': 'z',
    'l': 'l', 'ɾ': 'r', 'r': 'r',
    'ʃ': 'sh', 'ʒ': 'zh', 'tʃ': 'ch', 'dʒ': 'y',
    'ɲ': 'ny', 'ʎ': 'ly', 'j': 'y',
    'k': 'k', 'g': 'g', 'ŋ': 'n', 'x': 'j', 'ɣ': 'g',
    'ʁ': 'r', 'R': 'r', 'h': '',
  };
  return map[symbol] ?? symbol;
}

function getBcp47ForLang(code: string): string {
  const map: Record<string, string> = {
    la: 'it-IT', es: 'es-ES', pt: 'pt-PT', gl: 'pt-PT',
    ca: 'ca-ES', oc: 'fr-FR', fr: 'fr-FR', it: 'it-IT',
    sc: 'it-IT', ro: 'ro-RO',
  };
  return map[code] ?? 'es-ES';
}
