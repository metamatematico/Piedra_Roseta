// Alineamiento fonético global con Needleman-Wunsch.
// Permite alinear dos secuencias de fonemas maximizando la similitud,
// insertando gaps cuando una lengua tiene fonemas que la otra no tiene.
//
// Esto es CRÍTICO para la síntesis híbrida: antes alineábamos por posición
// simple (posición 1 con 1, 2 con 2...), lo que producía resultados pobres
// cuando las lenguas tenían longitudes muy distintas (español "noche" 4 fonemas
// vs francés "nuit" 3 fonemas). Con Needleman-Wunsch, el sistema decide
// óptimamente qué fonemas se alinean con cuáles, y dónde insertar gaps.

import { graphemesToPhonemes } from './grapheme-to-phoneme';
import { PHONEME_MAP, PhonemeFeatures } from './phoneme-inventory';

export interface AlignmentCell {
  phoneme: string | null;   // null = gap
  features: PhonemeFeatures | null;
  weight: number;
}

export interface AlignmentResult {
  // Secuencias alineadas (con gaps representados como null)
  aligned: { symbol: string | null; weight: number }[][];
  // Score de la alineación
  score: number;
  // Porcentaje de similitud
  similarity: number;
}

// ---------- Matriz de similitud entre fonemas ----------

// Devuelve un score de similitud entre dos fonemas (mayor = más parecidos).
function phonemeSimilarity(a: string | null, b: string | null): number {
  // Gap penalty (penalización por hueco)
  if (a === null || b === null) return -2;

  const fa = PHONEME_MAP[a];
  const fb = PHONEME_MAP[b];
  if (!fa || !fb) {
    // Si no reconocemos el fonema, similitud por carácter
    return a === b ? 2 : -1;
  }

  // Mismos fonemas → match perfecto
  if (a === b) return 5;

  // Si uno es vocal y el otro consonante → penalty alto
  if (fa.class !== fb.class) return -3;

  // Para vocales: comparar altura, anterioridad, redondeamiento, nasalidad
  if (fa.class === 'vowel') {
    let score = 0;
    if (fa.vowelHeight !== undefined && fb.vowelHeight !== undefined) {
      score += (1 - Math.abs(fa.vowelHeight - fb.vowelHeight)) * 2;
    }
    if (fa.vowelBack !== undefined && fb.vowelBack !== undefined) {
      score += (1 - Math.abs(fa.vowelBack - fb.vowelBack)) * 2;
    }
    if (fa.vowelRound !== undefined && fb.vowelRound !== undefined) {
      score += (1 - Math.abs(fa.vowelRound - fb.vowelRound));
    }
    if (fa.nasal === fb.nasal) score += 1; else score -= 1;
    return score;
  }

  // Para consonantes: comparar lugar, sonoridad, nasalidad, continuante
  let score = 0;
  // Lugar: en escala 1-10, distancia de 2 = similar
  const placeDiff = Math.abs(fa.place - fb.place);
  score += Math.max(0, 3 - placeDiff);
  // Sonoridad: si coinciden, +
  if (fa.sonorant === fb.sonorant) score += 1; else score -= 1;
  // Nasalidad
  if (fa.nasal === fb.nasal) score += 1; else score -= 1;
  // Continuante
  score += Math.max(0, 1 - Math.abs(fa.continuant - fb.continuant));

  return score;
}

// ---------- Needleman-Wunsch ----------

export function alignTwoSequences(
  seq1: string[],
  seq2: string[]
): { aligned1: (string | null)[]; aligned2: (string | null)[]; score: number } {
  const n = seq1.length;
  const m = seq2.length;
  const gap = -2;

  // Matriz de scores
  const dp: number[][] = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));
  for (let i = 0; i <= n; i++) dp[i][0] = i * gap;
  for (let j = 0; j <= m; j++) dp[0][j] = j * gap;

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      const match = dp[i - 1][j - 1] + phonemeSimilarity(seq1[i - 1], seq2[j - 1]);
      const del = dp[i - 1][j] + gap;
      const ins = dp[i][j - 1] + gap;
      dp[i][j] = Math.max(match, del, ins);
    }
  }

  // Traceback
  const aligned1: (string | null)[] = [];
  const aligned2: (string | null)[] = [];
  let i = n, j = m;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && dp[i][j] === dp[i - 1][j - 1] + phonemeSimilarity(seq1[i - 1], seq2[j - 1])) {
      aligned1.unshift(seq1[i - 1]);
      aligned2.unshift(seq2[j - 1]);
      i--; j--;
    } else if (i > 0 && dp[i][j] === dp[i - 1][j] + gap) {
      aligned1.unshift(seq1[i - 1]);
      aligned2.unshift(null);
      i--;
    } else {
      aligned1.unshift(null);
      aligned2.unshift(seq2[j - 1]);
      j--;
    }
  }

  return { aligned1, aligned2, score: dp[n][m] };
}

// ---------- Alineamiento múltiple (heurística: alinear por pares contra el más largo) ----------

export interface MultiAlignmentResult {
  // aligned[k][i] = símbolo del fonema k-ésimo en la posición i, o null si gap
  aligned: (string | null)[][];
  // Por cada posición, cuántas lenguas contribuyen
  coverage: number[];
  // Longitud del alineamiento (número de posiciones)
  length: number;
}

export function alignMultipleSequences(sequences: string[][]): MultiAlignmentResult {
  if (sequences.length === 0) {
    return { aligned: [], coverage: [], length: 0 };
  }
  if (sequences.length === 1) {
    return {
      aligned: [sequences[0]],
      coverage: sequences[0].map(() => 1),
      length: sequences[0].length,
    };
  }

  // Heurística progresiva: elegir la secuencia más larga como referencia
  // y alinear todas las demás contra ella.
  let refIdx = 0;
  let maxLen = 0;
  sequences.forEach((s, i) => {
    if (s.length > maxLen) {
      maxLen = s.length;
      refIdx = i;
    }
  });

  const reference = sequences[refIdx];
  const alignments: (string | null)[][] = sequences.map((s, i) => {
    if (i === refIdx) return [...reference];
    const { aligned2 } = alignTwoSequences(reference, s);
    return aligned2;
  });

  // La longitud del alineamiento = longitud de la referencia (porque la usamos de ancla)
  const length = reference.length;
  const coverage = Array(length).fill(0);
  for (let pos = 0; pos < length; pos++) {
    for (let li = 0; li < alignments.length; li++) {
      if (alignments[li][pos] !== null) coverage[pos]++;
    }
  }

  return { aligned: alignments, coverage, length };
}

// ---------- Similarity matrix entre lenguas ----------

export interface LanguagePairSimilarity {
  a: string;
  b: string;
  similarity: number;  // 0-1
  rawScore: number;
  maxScore: number;
}

// Calcula similitud entre dos lenguas basada en sus formas léxicas
export function computeLanguageSimilarity(
  formsA: { [conceptId: string]: string },
  formsB: { [conceptId: string]: string },
  langCodeA: string,
  langCodeB: string
): LanguagePairSimilarity {
  let totalScore = 0;
  let totalMax = 0;
  let count = 0;
  for (const conceptId of Object.keys(formsA)) {
    const formA = formsA[conceptId];
    const formB = formsB[conceptId];
    if (!formA || !formB) continue;

    // Convertir a fonemas (importación directa desde grapheme-to-phoneme)
    const phonA = graphemesToPhonemes(formA, langCodeA);
    const phonB = graphemesToPhonemes(formB, langCodeB);
    if (phonA.length === 0 || phonB.length === 0) continue;

    const { score } = alignTwoSequences(phonA, phonB);
    // Score máximo posible = longitud mínima * 5 (match perfecto)
    const maxForThis = Math.min(phonA.length, phonB.length) * 5;
    totalScore += score;
    totalMax += maxForThis;
    count++;
  }

  const similarity = count > 0 && totalMax > 0
    ? Math.max(0, totalScore / totalMax)
    : 0;

  return {
    a: langCodeA,
    b: langCodeB,
    similarity,
    rawScore: totalScore,
    maxScore: totalMax,
  };
}
