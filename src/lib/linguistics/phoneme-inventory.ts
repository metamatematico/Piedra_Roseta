// Inventario de fonemas con sus rasgos articulatorios.
// Archivo separado para evitar dependencia circular entre phoneme-space.ts
// (que define la interpolación) y alignment.ts (que necesita los rasgos).

export type PhonemeClass = 'vowel' | 'consonant';

export interface PhonemeFeatures {
  symbol: string;
  class: PhonemeClass;
  sonorant: number;
  nasal: number;
  continuant: number;
  place: number;
  vowelHeight?: number;
  vowelBack?: number;
  vowelRound?: number;
  ttsFallback?: string;
}

export const PHONEME_INVENTORY: PhonemeFeatures[] = [
  // Vocales
  { symbol: 'a',  class: 'vowel', sonorant: 1, nasal: 0, continuant: 1, place: 5, vowelHeight: 0,    vowelBack: 0.5, vowelRound: 0 },
  { symbol: 'ɛ',  class: 'vowel', sonorant: 1, nasal: 0, continuant: 1, place: 5, vowelHeight: 0.4,  vowelBack: 0.3, vowelRound: 0 },
  { symbol: 'e',  class: 'vowel', sonorant: 1, nasal: 0, continuant: 1, place: 5, vowelHeight: 0.6,  vowelBack: 0.3, vowelRound: 0 },
  { symbol: 'ə',  class: 'vowel', sonorant: 1, nasal: 0, continuant: 1, place: 5, vowelHeight: 0.5,  vowelBack: 0.5, vowelRound: 0 },
  { symbol: 'i',  class: 'vowel', sonorant: 1, nasal: 0, continuant: 1, place: 5, vowelHeight: 1,    vowelBack: 0,   vowelRound: 0 },
  { symbol: 'ɔ',  class: 'vowel', sonorant: 1, nasal: 0, continuant: 1, place: 5, vowelHeight: 0.4,  vowelBack: 0.7, vowelRound: 1 },
  { symbol: 'o',  class: 'vowel', sonorant: 1, nasal: 0, continuant: 1, place: 5, vowelHeight: 0.6,  vowelBack: 0.7, vowelRound: 1 },
  { symbol: 'u',  class: 'vowel', sonorant: 1, nasal: 0, continuant: 1, place: 5, vowelHeight: 1,    vowelBack: 1,   vowelRound: 1 },
  { symbol: 'y',  class: 'vowel', sonorant: 1, nasal: 0, continuant: 1, place: 5, vowelHeight: 1,    vowelBack: 0,   vowelRound: 1 },
  { symbol: 'ɨ',  class: 'vowel', sonorant: 1, nasal: 0, continuant: 1, place: 5, vowelHeight: 1,    vowelBack: 0.5, vowelRound: 0 },
  { symbol: 'ø',  class: 'vowel', sonorant: 1, nasal: 0, continuant: 1, place: 5, vowelHeight: 0.6,  vowelBack: 0.3, vowelRound: 1 },
  { symbol: 'ɐ̃', class: 'vowel', sonorant: 1, nasal: 1, continuant: 1, place: 5, vowelHeight: 0.3,  vowelBack: 0.5, vowelRound: 0 },
  { symbol: 'õ',  class: 'vowel', sonorant: 1, nasal: 1, continuant: 1, place: 5, vowelHeight: 0.6,  vowelBack: 0.7, vowelRound: 1 },
  { symbol: 'ɑ̃',  class: 'vowel', sonorant: 1, nasal: 1, continuant: 1, place: 5, vowelHeight: 0,    vowelBack: 0.7, vowelRound: 0 },
  { symbol: 'ɛ̃',  class: 'vowel', sonorant: 1, nasal: 1, continuant: 1, place: 5, vowelHeight: 0.4,  vowelBack: 0.3, vowelRound: 0 },
  { symbol: 'ɔ̃',  class: 'vowel', sonorant: 1, nasal: 1, continuant: 1, place: 5, vowelHeight: 0.4,  vowelBack: 0.7, vowelRound: 1 },
  { symbol: 'œ̃',  class: 'vowel', sonorant: 1, nasal: 1, continuant: 1, place: 5, vowelHeight: 0.4,  vowelBack: 0.5, vowelRound: 1 },
  // Consonantes labiales
  { symbol: 'p',  class: 'consonant', sonorant: 0, nasal: 0, continuant: 0,   place: 1 },
  { symbol: 'b',  class: 'consonant', sonorant: 1, nasal: 0, continuant: 0,   place: 1 },
  { symbol: 'm',  class: 'consonant', sonorant: 1, nasal: 1, continuant: 0,   place: 1 },
  { symbol: 'f',  class: 'consonant', sonorant: 0, nasal: 0, continuant: 1,   place: 1 },
  { symbol: 'v',  class: 'consonant', sonorant: 1, nasal: 0, continuant: 1,   place: 1 },
  { symbol: 'w',  class: 'consonant', sonorant: 1, nasal: 0, continuant: 1,   place: 1 },
  // Dentales
  { symbol: 't',  class: 'consonant', sonorant: 0, nasal: 0, continuant: 0,   place: 3 },
  { symbol: 'd',  class: 'consonant', sonorant: 1, nasal: 0, continuant: 0,   place: 3 },
  { symbol: 'n',  class: 'consonant', sonorant: 1, nasal: 1, continuant: 0,   place: 3 },
  { symbol: 'θ',  class: 'consonant', sonorant: 0, nasal: 0, continuant: 1,   place: 3 },
  { symbol: 's',  class: 'consonant', sonorant: 0, nasal: 0, continuant: 1,   place: 3 },
  { symbol: 'z',  class: 'consonant', sonorant: 1, nasal: 0, continuant: 1,   place: 3 },
  { symbol: 'l',  class: 'consonant', sonorant: 1, nasal: 0, continuant: 1,   place: 3 },
  { symbol: 'ɾ',  class: 'consonant', sonorant: 1, nasal: 0, continuant: 0.5, place: 3 },
  { symbol: 'r',  class: 'consonant', sonorant: 1, nasal: 0, continuant: 0.5, place: 3 },
  // Postalveolares
  { symbol: 'ʃ',  class: 'consonant', sonorant: 0, nasal: 0, continuant: 1,   place: 7 },
  { symbol: 'ʒ',  class: 'consonant', sonorant: 1, nasal: 0, continuant: 1,   place: 7 },
  { symbol: 'tʃ', class: 'consonant', sonorant: 0, nasal: 0, continuant: 0.5, place: 7 },
  { symbol: 'dʒ', class: 'consonant', sonorant: 1, nasal: 0, continuant: 0.5, place: 7 },
  { symbol: 'ɲ',  class: 'consonant', sonorant: 1, nasal: 1, continuant: 0,   place: 7 },
  { symbol: 'ʎ',  class: 'consonant', sonorant: 1, nasal: 0, continuant: 1,   place: 7 },
  { symbol: 'j',  class: 'consonant', sonorant: 1, nasal: 0, continuant: 1,   place: 7 },
  // Velares
  { symbol: 'k',  class: 'consonant', sonorant: 0, nasal: 0, continuant: 0,   place: 9 },
  { symbol: 'g',  class: 'consonant', sonorant: 1, nasal: 0, continuant: 0,   place: 9 },
  { symbol: 'ŋ',  class: 'consonant', sonorant: 1, nasal: 1, continuant: 0,   place: 9 },
  { symbol: 'x',  class: 'consonant', sonorant: 0, nasal: 0, continuant: 1,   place: 9 },
  { symbol: 'ɣ',  class: 'consonant', sonorant: 1, nasal: 0, continuant: 1,   place: 9 },
  // Uvular y glotal
  { symbol: 'ʁ',  class: 'consonant', sonorant: 1, nasal: 0, continuant: 1,   place: 10 },
  { symbol: 'R',  class: 'consonant', sonorant: 1, nasal: 0, continuant: 0.5, place: 10 },
  { symbol: 'h',  class: 'consonant', sonorant: 0, nasal: 0, continuant: 1,   place: 10 },
];

export const PHONEME_MAP: Record<string, PhonemeFeatures> = Object.fromEntries(
  PHONEME_INVENTORY.map(p => [p.symbol, p])
);
