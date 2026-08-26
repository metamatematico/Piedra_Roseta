'use client';

import { useState, useCallback, useRef } from 'react';
import type { Exercise } from '@/app/api/llm/exercise/route';

interface HistoryItem {
  conceptId: string;
  correct: boolean;
  level: number;
  timestamp: number;
}

interface UseAdaptiveExerciseOptions {
  initialLevel?: 1 | 2 | 3 | 4 | 5;
  // Si el usuario acierta 3 seguidas, sube de nivel; si falla 2 seguidas, baja
  upStreak?: number;
  downStreak?: number;
}

interface AdaptiveState {
  exercise: Exercise | null;
  level: number;
  score: { correct: number; total: number };
  streak: number;
  bestStreak: number;
  history: HistoryItem[];
  loading: boolean;
  error: string | null;
  selectedAnswer: number | null;
  lastExplanation: string | null;
}

export function useAdaptiveExercise(opts: UseAdaptiveExerciseOptions = {}) {
  const initialLevel = opts.initialLevel ?? 1;
  const upStreak = opts.upStreak ?? 3;
  const downStreak = opts.downStreak ?? 2;

  const [state, setState] = useState<AdaptiveState>({
    exercise: null,
    level: initialLevel,
    score: { correct: 0, total: 0 },
    streak: 0,
    bestStreak: 0,
    history: [],
    loading: false,
    error: null,
    selectedAnswer: null,
    lastExplanation: null,
  });

  const reqIdRef = useRef(0);

  const fetchExercise = useCallback(async (level: number, history: HistoryItem[]) => {
    const id = ++reqIdRef.current;
    setState(s => ({ ...s, loading: true, error: null }));
    try {
      const res = await fetch('/api/llm/exercise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          level,
          history: history.map(h => ({ conceptId: h.conceptId, correct: h.correct })),
        }),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`HTTP ${res.status}: ${txt}`);
      }
      const exercise = (await res.json()) as Exercise;
      if (id !== reqIdRef.current) return; // respuesta obsoleta
      setState(s => ({
        ...s,
        exercise,
        loading: false,
        selectedAnswer: null,
        lastExplanation: null,
      }));
    } catch (e: any) {
      if (id !== reqIdRef.current) return;
      setState(s => ({ ...s, loading: false, error: e?.message ?? 'Error' }));
    }
  }, []);

  const loadNext = useCallback(async () => {
    await fetchExercise(state.level, state.history);
  }, [state.level, state.history, fetchExercise]);

  const answer = useCallback(async (optionIndex: number) => {
    if (state.selectedAnswer !== null || !state.exercise) return;
    const opt = state.exercise.options[optionIndex];
    if (!opt) return;

    const correct = opt.correct;
    const newStreak = correct ? state.streak + 1 : 0;
    const newBestStreak = Math.max(state.bestStreak, newStreak);
    const newScore = {
      correct: state.score.correct + (correct ? 1 : 0),
      total: state.score.total + 1,
    };
    const newHistory = [
      ...state.history,
      {
        conceptId: state.exercise.conceptId,
        correct,
        level: state.level,
        timestamp: Date.now(),
      },
    ].slice(-30);

    // Adaptación de nivel
    let newLevel = state.level;
    if (correct && newStreak >= upStreak && state.level < 5) {
      newLevel = state.level + 1;
    } else if (!correct && newStreak === 0 && state.streak === 0 && state.level > 1) {
      // falló y la racha anterior ya estaba en 0 → bajamos
      // (más simple: si falla 2 veces seguidas, baja)
      const recentFails = newHistory.slice(-2).filter(h => !h.correct).length;
      if (recentFails >= downStreak) {
        newLevel = state.level - 1;
      }
    }

    setState(s => ({
      ...s,
      selectedAnswer: optionIndex,
      streak: newStreak,
      bestStreak: newBestStreak,
      score: newScore,
      history: newHistory,
      level: newLevel,
      lastExplanation: opt.explanation,
    }));
  }, [state, upStreak, downStreak]);

  const reset = useCallback(() => {
    reqIdRef.current++;
    setState({
      exercise: null,
      level: initialLevel,
      score: { correct: 0, total: 0 },
      streak: 0,
      bestStreak: 0,
      history: [],
      loading: false,
      error: null,
      selectedAnswer: null,
      lastExplanation: null,
    });
  }, [initialLevel]);

  return {
    ...state,
    loadNext,
    answer,
    reset,
  };
}
