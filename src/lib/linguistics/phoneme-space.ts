// Espacio de rasgos fonéticos para interpolación real.
// Cada fonema es un vector de rasgos articulatorios (definidos en phoneme-inventory.ts).
// Este módulo contiene la lógica de interpolación y síntesis híbrida.

import { PhonemeFeatures, PHONEME_MAP, PHONEME_INVENTORY } from './phoneme-inventory';
import { graphemesToPhonemes } from './grapheme-to-phoneme';

// Re-export para compatibilidad con código existente
export { graphemesToPhonemes };
export type { PhonemeFeatures } from './phoneme-inventory';
export { PHONEME_MAP, PHONEME_INVENTORY } from './phoneme-inventory';

// ---------- Interpolación de fonemas ----------

export interface InterpolatedPhoneme {
  symbol: string;
  ttsSymbol: string;
  features: PhonemeFeatures;
  isInterpolated: boolean;
  blendDescription: string;
  sources: { symbol: string; weight: number }[];
}

export function interpolatePhonemes(
  candidates: { symbol: string; weight: number }[]
): InterpolatedPhoneme {
  const valid = candidates
    .map(c => ({ ...c, feat: PHONEME_MAP[c.symbol] }))
    .filter(c => c.feat && c.weight > 0);

  if (valid.length === 0) {
    return {
      symbol: 'ə',
      ttsSymbol: 'e',
      features: PHONEME_MAP['ə'],
      isInterpolated: false,
      blendDescription: 'fonema neutral',
      sources: [],
    };
  }

  const total = valid.reduce((s, c) => s + c.weight, 0) || 1;

  const blended: PhonemeFeatures = {
    symbol: '',
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

  const closest = findClosestPhoneme(blended);
  const uniqueSymbols = Array.from(new Set(valid.map(c => c.symbol)));
  const isInterpolated = uniqueSymbols.length > 1;

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

// ---------- Síntesis híbrida ----------

export interface HybridPhoneticResult {
  phonemes: InterpolatedPhoneme[];
  ttsString: string;
  writtenForm: string;
  ipaString: string;
  bcp47Guess: string;
  summary: string;
  perLanguage: { code: string; form: string; phonemes: string[] }[];
}

// Importa la alineación múltiple (Needleman-Wunsch) de alignment.ts
import { alignMultipleSequences } from './alignment';

export function synthesizeHybridPhonetic(
  bases: { code: string; form: string; weight: number }[]
): HybridPhoneticResult {
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

  // Alineación múltiple con Needleman-Wunsch
  const { aligned: alignedMatrix, length: alignedLength } =
    alignMultipleSequences(perLanguage.map(p => p.phonemes));

  // Interpolar fonema por fonema
  const interpolatedPhonemes: InterpolatedPhoneme[] = [];
  for (let pos = 0; pos < alignedLength; pos++) {
    const candidates: { symbol: string; weight: number }[] = [];
    for (let li = 0; li < perLanguage.length; li++) {
      const symbol = alignedMatrix[li][pos];
      if (symbol !== null) {
        candidates.push({
          symbol,
          weight: perLanguage[li].weight,
        });
      }
    }
    if (candidates.length === 0) continue;
    interpolatedPhonemes.push(interpolatePhonemes(candidates));
  }

  const ttsString = interpolatedPhonemes.map(p => p.ttsSymbol).join('');
  const ipaString = '/' + interpolatedPhonemes.map(p => p.symbol).join('') + '/';
  const writtenForm = interpolatedPhonemes.map(p => phonemeToAscii(p.symbol)).join('');

  const dominant = perLanguage.slice().sort((a, b) => b.weight - a.weight)[0];
  const bcp47Guess = getBcp47ForLang(dominant.code);

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

function phonemeToAscii(symbol: string): string {
  const map: Record<string, string> = {
    'a': 'a', 'ɛ': 'e', 'e': 'e', 'ə': 'e', 'i': 'i',
    'ɔ': 'o', 'o': 'o', 'u': 'u', 'y': 'u', 'ɨ': 'i', 'ø': 'eu',
    'ɐ̃': 'an', 'õ': 'on', 'ɑ̃': 'an', 'ɛ̃': 'in', 'ɔ̃': 'on', 'œ̃': 'un',
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
