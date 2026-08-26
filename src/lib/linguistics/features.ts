// Matriz de rasgos fonológicos y gramaticales por lengua romance.
// Inspirado en WALS, PHOIBLE y la literatura comparativa (Posner, 1996; Ledgeway, 2012).
// Cada rasgo es binario: 1 (presente), 0 (ausente), 0.5 (parcial/dialectal)

export interface PhoneticFeature {
  id: string;
  name: string;
  description: string;
  category: 'vocalico' | 'consonantico' | 'prosodico' | 'gramatical';
}

export const PHONETIC_FEATURES: PhoneticFeature[] = [
  // Vocálicos
  {
    id: 'nasal_vowels',
    name: 'Vocales nasales fonémicas',
    description: 'Existencia de fonemas vocálicos nasales contrastivos (/ɑ̃/ vs /ɑ/)',
    category: 'vocalico',
  },
  {
    id: 'five_vowel_system',
    name: 'Sistema de 5 vocales',
    description: 'Mantiene el sistema latino /a e i o u/ sin diptongación masiva',
    category: 'vocalico',
  },
  {
    id: 'vowel_diphthong',
    name: 'Diptongación de E/O breves',
    description: 'PEDE → pie / pied / piede (ruptura de vocales breves tónicas)',
    category: 'vocalico',
  },
  {
    id: 'central_vowel',
    name: 'Vocal central /ə/ o /ɨ/',
    description: 'Vocal schwa (francés, occitano) o /ɨ/ (rumano) en posición átona',
    category: 'vocalico',
  },
  {
    id: 'open_close_distinction',
    name: 'Distinción vocal abierta/cerrada',
    description: 'Contraste fonológico entre /e/~/ɛ/ y /o/~/ɔ/',
    category: 'vocalico',
  },

  // Consonántico
  {
    id: 'palatal_lateral',
    name: 'Lateral palatal /ʎ/',
    description: 'Fonema /ʎ/ (ll) distinto de /j/ (y)',
    category: 'consonantico',
  },
  {
    id: 'palatal_nasal',
    name: 'Nasal palatal /ɲ/',
    description: 'Fonema /ɲ/ (ñ/gn/nn) como en español "año"',
    category: 'consonantico',
  },
  {
    id: 'voiced_sibilants',
    name: 'Sibilantes sonoras /z/ /dz/',
    description: 'Distinción sorda/sonora en sibilantes (casa/caza en portugués)',
    category: 'consonantico',
  },
  {
    id: 'theta',
    name: 'Interdental /θ/',
    description: 'Fonema interdental sordo (español norte, no en latinoamericano)',
    category: 'consonantico',
  },
  {
    id: 'uvular_r',
    name: 'R uvular /ʁ/',
    description: 'R posterior uvular (francés, occitano) en lugar de vibrante alveolar',
    category: 'consonantico',
  },
  {
    id: 'gemination',
    name: 'Consonantes dobles (geminadas)',
    description: 'Contrast fonológico de longitud consonántica (it. fatto vs fato)',
    category: 'consonantico',
  },
  {
    id: 'flap_trill_distinction',
    name: 'Distinción /ɾ/ vs /r/',
    description: 'Una vibrante simple vs múltiple (pero vs perro)',
    category: 'consonantico',
  },

  // Prosódico
  {
    id: 'lexical_stress',
    name: 'Acento lexical móvil',
    description: 'El acento distingue palabras (sábio/sabío)',
    category: 'prosodico',
  },
  {
    id: 'fixed_stress',
    name: 'Acento fijo (paroxítono)',
    description: 'Acento siempre en penúltima sílaba (polaco, no romance)',
    category: 'prosodico',
  },

  // Gramatical
  {
    id: 'noun_cases',
    name: 'Casos nominales',
    description: 'Sistema de casos (nominativo/genitivo/dativo)',
    category: 'gramatical',
  },
  {
    id: 'two_genders',
    name: 'Dos géneros (masc/fem)',
    description: 'Sistema binario masculino/femenino (lat. 3 géneros → 2)',
    category: 'gramatical',
  },
  {
    id: 'verb_conjugations',
    name: 'Cuatro conjugaciones verbales',
    description: 'Mantiene -are/-ere/-ire (lat. también -ēre breve)',
    category: 'gramatical',
  },
  {
    id: 'compound_past',
    name: 'Pasado compuesto (haber + participio)',
    description: 'Construcción analítica tipo "he comido" para pasado perfecto',
    category: 'gramatical',
  },
];

// Matriz lengua × rasgo. Filas = lenguas (orden de LANGUAGES en languages.ts)
// Columnas = rasgos (orden de PHONETIC_FEATURES)
// lat  es  pt  gl  ca  oc  fr  it  sc  ro
export const FEATURE_MATRIX: Record<string, number[]> = {
  la: [0,   1,   0,   0,   0,   0,   0,   0,   0,   0,   1,   1,   1,   0,   0,   1,   0,   1,   0],
  es: [0,   1,   0,   0,   0,   1,   1,   0,   0.5, 0,   0,   1,   1,   0,   0,   0,   1,   1,   1],
  pt: [1,   1,   0,   0,   0,   0,   1,   1,   0,   0,   0,   1,   1,   0,   0,   0,   1,   1,   1],
  gl: [0,   1,   0,   0,   0,   1,   1,   1,   0,   0,   0,   1,   1,   0,   0,   0,   1,   1,   1],
  ca: [0,   0.5, 0.5, 0,   1,   1,   1,   0,   0,   0,   1,   1,   1,   0,   0,   0,   1,   1,   1],
  oc: [0.5, 0.5, 0.5, 0.5, 1,   1,   1,   0,   0,   0.5, 1,   1,   1,   0,   0,   0,   1,   1,   1],
  fr: [1,   0,   1,   1,   1,   1,   1,   0,   0,   1,   0,   0,   1,   0,   0,   0,   1,   1,   1],
  it: [0,   1,   0.5, 1,   1,   1,   1,   1,   0,   0,   1,   0,   1,   0,   0,   0,   1,   1,   1],
  sc: [0,   1,   0,   0,   0,   0,   0,   0,   0,   0,   0,   0,   1,   0,   0,   0,   1,   1,   0],
  ro: [1,   1,   0,   1,   0,   1,   1,   1,   0,   0,   0,   0,   1,   0,   0,   1,   1,   1,   1],
};

// Verificación de dimensiones
export const NUM_LANGUAGES = Object.keys(FEATURE_MATRIX).length;
export const NUM_FEATURES = PHONETIC_FEATURES.length;
