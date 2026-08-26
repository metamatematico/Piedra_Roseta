// Álgebra lineal aplicada a lingüística comparativa.
// Implementación desde cero de:
//   - Distancia euclidiana entre lenguas (vector de rasgos)
//   - Matriz de covarianza
//   - Power iteration para encontrar eigenvectores (PCA)
//   - Reconstrucción lineal: lenguaje = combinación de bases
//
// Referencias:
//   - Jolliffe & Cadima (2016) PCA: a review and recent developments
//   - Nerbonne & Heeringa (1997) dialecometría con PCA
//   - Wieling & Nerbonne (2015) Clustering dialects with PCA

import { FEATURE_MATRIX, PHONETIC_FEATURES } from './features';
import { LANGUAGES } from './languages';

// ---------- Tipos ----------
export type Vector = number[];
export type Matrix = number[][];

export interface LanguageVector {
  code: string;
  name: string;
  vector: Vector;
  coordinates2D: [number, number];
  coordinates3D: [number, number, number];
}

export interface PCAResult {
  languageVectors: LanguageVector[];
  principalComponents: Vector[];   // primeros 3 eigenvectores
  eigenvalues: number[];           // primeros 3 eigenvalores
  explainedVariance: number[];     // % de varianza explicada por cada PC
  cumulativeVariance: number[];
  featureLoadings: { feature: string; pc1: number; pc2: number }[];
}

// ---------- Operaciones vectoriales básicas ----------
export const dot = (a: Vector, b: Vector): number =>
  a.reduce((sum, ai, i) => sum + ai * b[i], 0);

export const norm = (a: Vector): number => Math.sqrt(dot(a, a));

export const subtract = (a: Vector, b: Vector): Vector =>
  a.map((ai, i) => ai - b[i]);

export const add = (a: Vector, b: Vector): Vector =>
  a.map((ai, i) => ai + b[i]);

export const scale = (a: Vector, s: number): Vector =>
  a.map(ai => ai * s);

export const normalize = (a: Vector): Vector => {
  const n = norm(a);
  return n === 0 ? a : a.map(ai => ai / n);
};

export const euclideanDistance = (a: Vector, b: Vector): number =>
  Math.sqrt(a.reduce((s, ai, i) => s + (ai - b[i]) ** 2, 0));

// ---------- Matriz transpuesta ----------
export const transpose = (m: Matrix): Matrix => {
  if (m.length === 0) return [];
  return m[0].map((_, j) => m.map(row => row[j]));
};

// ---------- Media de columnas ----------
export const columnMeans = (m: Matrix): Vector => {
  if (m.length === 0) return [];
  const n = m.length;
  return m[0].map((_, j) => m.reduce((s, row) => s + row[j], 0) / n);
};

// ---------- Matriz de covarianza ----------
// X es n×p (n observaciones, p variables). Centramos por columna y calculamos (1/(n-1)) X^T X
export const covarianceMatrix = (X: Matrix): Matrix => {
  const n = X.length;
  if (n === 0) return [];
  const p = X[0].length;
  const means = columnMeans(X);
  const centered = X.map(row => row.map((v, j) => v - means[j]));
  const cov: Matrix = Array.from({ length: p }, () => Array(p).fill(0));
  for (let i = 0; i < p; i++) {
    for (let j = 0; j < p; j++) {
      let s = 0;
      for (let k = 0; k < n; k++) s += centered[k][i] * centered[k][j];
      cov[i][j] = s / Math.max(1, n - 1);
    }
  }
  return cov;
};

// ---------- Multiplicación matriz × vector ----------
export const matVec = (m: Matrix, v: Vector): Vector =>
  m.map(row => dot(row, v));

// ---------- Power iteration con deflación ----------
// Encuentra los primeros k eigenvectores de la matriz simétrica m.
export const powerIteration = (m: Matrix, k: number, iterations = 200, tol = 1e-9): {
  eigenvectors: Vector[];
  eigenvalues: number[];
} => {
  const p = m.length;
  const eigenvectors: Vector[] = [];
  const eigenvalues: number[] = [];

  let A = m.map(row => [...row]);

  for (let comp = 0; comp < k; comp++) {
    // vector aleatorio inicial (determinista para reproducibilidad)
    let v = Array.from({ length: p }, (_, i) => Math.sin(i + comp * 7.3) * 0.5 + 0.1);
    v = normalize(v);

    let lambdaPrev = 0;
    for (let iter = 0; iter < iterations; iter++) {
      const w = matVec(A, v);
      const lambda = dot(v, w);
      const wn = normalize(w);
      if (Math.abs(lambda - lambdaPrev) < tol) {
        v = wn;
        lambdaPrev = lambda;
        break;
      }
      v = wn;
      lambdaPrev = lambda;
    }

    eigenvectors.push(v);
    eigenvalues.push(lambdaPrev);

    // Deflación: A = A - lambda * v v^T
    A = A.map((row, i) =>
      row.map((ai, j) => ai - lambdaPrev * v[i] * v[j])
    );
  }

  return { eigenvectors, eigenvalues };
};

// ---------- PCA completo ----------
export const computePCA = (): PCAResult => {
  // Construir matriz X: filas = lenguas, columnas = rasgos
  const langCodes = LANGUAGES.map(l => l.code);
  const X: Matrix = langCodes.map(code => FEATURE_MATRIX[code]);
  const n = X.length;          // n lenguas
  const p = X[0].length;       // p rasgos

  // Centrar por columna
  const means = columnMeans(X);
  const Xc = X.map(row => row.map((v, j) => v - means[j]));

  // Covarianza es p×p; mejor usar n×n para n<p (más rápido y estable aquí)
  // Truco: eigenvectores de X X^T están relacionados con los de X^T X
  const gram: Matrix = Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => dot(Xc[i], Xc[j]))
  );
  const gramScaled = gram.map(row => row.map(v => v / (n - 1)));

  const { eigenvectors: langEigenvectors, eigenvalues: langEigenvalues } =
    powerIteration(gramScaled, 3);

  // Convertir a coordenadas de rasgos: u_k = Xc^T v_k / sqrt(lambda_k)
  const featureEigenvectors: Vector[] = langEigenvectors.map((v, k) => {
    const lambda = Math.max(1e-12, langEigenvalues[k]);
    const u = Xc[0].map((_, j) =>
      langEigenvectors.reduce((s, vec, i) => s + vec[i] * Xc[i][j], 0)
    );
    return normalize(u);
  });

  // Coordenadas de cada lengua en el espacio PCA
  const languageVectors: LanguageVector[] = LANGUAGES.map((lang, i) => {
    const vec = Xc[i];
    const pc1 = dot(vec, featureEigenvectors[0]);
    const pc2 = dot(vec, featureEigenvectors[1]);
    const pc3 = dot(vec, featureEigenvectors[2]);
    return {
      code: lang.code,
      name: lang.name,
      vector: vec,
      coordinates2D: [pc1, pc2],
      coordinates3D: [pc1, pc2, pc3],
    };
  });

  // Varianza explicada
  const totalVar = langEigenvalues.reduce((s, l) => s + Math.max(0, l), 0) || 1;
  const explainedVariance = langEigenvalues.map(l => Math.max(0, l) / totalVar);
  const cumulativeVariance = explainedVariance.map((_, i) =>
    explainedVariance.slice(0, i + 1).reduce((s, v) => s + v, 0)
  );

  // Carga de cada rasgo en PC1 y PC2
  const featureLoadings = PHONETIC_FEATURES.map((f, j) => ({
    feature: f.name,
    pc1: featureEigenvectors[0][j],
    pc2: featureEigenvectors[1][j],
  }));

  return {
    languageVectors,
    principalComponents: featureEigenvectors,
    eigenvalues: langEigenvalues,
    explainedVariance,
    cumulativeVariance,
    featureLoadings,
  };
};

// ---------- Reconstrucción lineal ----------
// Dado un subconjunto de "lenguas base" B = {b1, b2, ...} y pesos α = {α1, α2, ...},
// reconstruye una lengua aproximada: lang_hat = α1 * v_b1 + α2 * v_b2 + ...
// (en el espacio de rasgos centrado).

export interface ReconstructionResult {
  reconstructedVector: number[];      // vector en espacio de rasgos centrado
  reconstructedFeatures: Record<string, number>; // id_rasgo -> valor (0-1 aprox)
  reconstructionError: number;       // distancia a la lengua objetivo
  targetLanguage?: string;
  basesUsed: { code: string; weight: number }[];
}

export const reconstructFromBases = (
  bases: { code: string; weight: number }[],
  targetCode?: string
): ReconstructionResult => {
  const langCodes = LANGUAGES.map(l => l.code);
  const X: Matrix = langCodes.map(code => FEATURE_MATRIX[code]);
  const means = columnMeans(X);
  const Xc = X.map(row => row.map((v, j) => v - means[j]));

  // Reconstrucción en espacio centrado
  const reconstructed = Array(X[0].length).fill(0);
  for (const { code, weight } of bases) {
    const idx = langCodes.indexOf(code);
    if (idx >= 0) {
      for (let j = 0; j < reconstructed.length; j++) {
        reconstructed[j] += weight * Xc[idx][j];
      }
    }
  }

  // Reconstrucción en espacio original (descentrar)
  const reconstructedFeatures: Record<string, number> = {};
  PHONETIC_FEATURES.forEach((f, j) => {
    const val = reconstructed[j] + means[j];
    reconstructedFeatures[f.id] = Math.max(0, Math.min(1, val));
  });

  // Error: si hay lengua objetivo, distancia euclidiana
  let reconstructionError = 0;
  if (targetCode) {
    const targetIdx = langCodes.indexOf(targetCode);
    if (targetIdx >= 0) {
      reconstructionError = euclideanDistance(reconstructed, Xc[targetIdx]);
    }
  }

  return {
    reconstructedVector: reconstructed,
    reconstructedFeatures,
    reconstructionError,
    targetLanguage: targetCode,
    basesUsed: bases,
  };
};

// ---------- Distancia entre lenguas (matriz) ----------
export interface DistancePair {
  a: string;
  b: string;
  distance: number;
}

export const computeDistanceMatrix = (): DistancePair[] => {
  const langCodes = LANGUAGES.map(l => l.code);
  const X: Matrix = langCodes.map(code => FEATURE_MATRIX[code]);
  const pairs: DistancePair[] = [];
  for (let i = 0; i < langCodes.length; i++) {
    for (let j = i + 1; j < langCodes.length; j++) {
      pairs.push({
        a: langCodes[i],
        b: langCodes[j],
        distance: euclideanDistance(X[i], X[j]),
      });
    }
  }
  return pairs.sort((p, q) => p.distance - q.distance);
};
