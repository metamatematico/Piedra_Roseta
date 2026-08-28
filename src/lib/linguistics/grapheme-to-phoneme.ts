// Mapeo grafema → fonema. Archivo separado para evitar dependencia circular
// entre phoneme-space.ts (que define el inventario fonético) y alignment.ts
// (que necesita convertir formas léxicas a fonemas para comparar lenguas).

// Mapa grafema → fonema (por orden de prioridad: dígrafos y trígrafos primero)
const DEFAULT_GRAPHEME_TO_PHONEME: Record<string, string> = {
  // Vocales
  a: 'a', á: 'a', à: 'a', â: 'a', ä: 'a',
  e: 'e', é: 'e', è: 'ɛ', ê: 'ɛ', ë: 'e',
  i: 'i', í: 'i', ï: 'i', î: 'i',
  o: 'o', ó: 'o', ò: 'ɔ', ô: 'o', ö: 'o',
  u: 'u', ú: 'u', ù: 'u', ü: 'y', û: 'u',
  y: 'i',
  // Consonantes simples
  b: 'b', c: 'k', d: 'd', f: 'f', g: 'g',
  h: '',
  j: 'x',
  k: 'k', l: 'l', m: 'm', n: 'n',
  p: 'p', q: 'k', r: 'r', s: 's', t: 't',
  v: 'b', w: 'w', x: 'ks', z: 'θ',
  // Dígrafos y trígrafos (se procesan antes que las letras sueltas)
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
  'ja': 'x', 'je': 'x', 'ji': 'x', 'jo': 'x', 'ju': 'x',
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
  'an': 'ɑ̃',
  'en': 'ɑ̃',
  'in': 'ɛ̃',
  'on': 'ɔ̃',
  'un': 'œ̃',
  'ain': 'ɛ̃',
  // Portuguesas
  'ão': 'ɐ̃',
  'ãe': 'ɐ̃',
  'õe': 'õ',
  // Rumanas
  'ă': 'ə',
  'â': 'ɨ',
  'î': 'ɨ',
  'ș': 'ʃ',
  'ț': 'ts',
};

// Convierte una forma escrita a una secuencia de fonemas IPA.
// Maneja dígrafos y trígrafos con prioridad (longest-match first).
export function graphemesToPhonemes(form: string, _langCode: string): string[] {
  const lower = form.toLowerCase();
  const phonemes: string[] = [];
  let i = 0;
  while (i < lower.length) {
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
      i++;
    }
  }
  return phonemes;
}
