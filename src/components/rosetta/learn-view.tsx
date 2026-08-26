'use client';

import { useEffect, useState } from 'react';
import { useAdaptiveExercise } from '@/hooks/use-adaptive-exercise';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Brain, Check, X, RefreshCw, Trophy, Lightbulb, Sparkles, Loader2, TrendingUp, BookOpen } from 'lucide-react';
import { getLanguage } from '@/lib/linguistics/languages';
import { AssistantChat } from './assistant-chat';

export function LearnView() {
  const adaptive = useAdaptiveExercise({ initialLevel: 1 });
  const [hintVisible, setHintVisible] = useState(false);
  const [extraExplanation, setExtraExplanation] = useState<string | null>(null);
  const [askingExplain, setAskingExplain] = useState(false);

  // Cargar primer ejercicio al montar
  useEffect(() => {
    adaptive.loadNext();
  }, []);

  // Resetear pista cuando cambia el ejercicio
  useEffect(() => {
    setHintVisible(false);
    setExtraExplanation(null);
  }, [adaptive.exercise]);

  const accuracy = adaptive.score.total > 0
    ? (adaptive.score.correct / adaptive.score.total) * 100
    : 0;

  const handleAnswer = async (i: number) => {
    await adaptive.answer(i);
    // Si el usuario falla, pedir explicación extra al LLM
    if (adaptive.exercise && !adaptive.exercise.options[i].correct) {
      setAskingExplain(true);
      try {
        const res = await fetch('/api/llm/explain', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            conceptId: adaptive.exercise.conceptId,
            answerText: adaptive.exercise.options[i].text,
            correct: false,
          }),
        });
        const data = await res.json();
        if (data.explanation) setExtraExplanation(data.explanation);
      } catch {
        // fallback silencioso
      } finally {
        setAskingExplain(false);
      }
    }
  };

  const ex = adaptive.exercise;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Aprendizaje Adaptativo con IA
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            El sistema <strong>ajusta la dificultad automáticamente</strong> según tu desempeño:
            aciertas 3 seguidas → sube de nivel; fallas 2 → baja. Cada ejercicio es generado
            por un LLM especializado en lingüística románica y se complementa con explicaciones
            pedagógicas personalizadas cuando fallas.
          </p>
        </CardHeader>
        <CardContent>
          {/* Estadísticas + nivel */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <StatCard
              label="Nivel"
              value={`${adaptive.level}/5`}
              icon={<TrendingUp className="h-4 w-4" />}
              highlight
            />
            <StatCard
              label="Aciertos"
              value={`${adaptive.score.correct}/${adaptive.score.total}`}
              icon={<Check className="h-4 w-4" />}
            />
            <StatCard
              label="Precisión"
              value={`${accuracy.toFixed(0)}%`}
              icon={<Trophy className="h-4 w-4" />}
            />
            <StatCard
              label="Racha / Mejor"
              value={`${adaptive.streak} / ${adaptive.bestStreak}`}
              icon={<RefreshCw className="h-4 w-4" />}
            />
          </div>

          <Progress value={accuracy} className="mb-6" />

          <div className="text-xs text-muted-foreground mb-4 italic">
            <Sparkles className="inline h-3 w-3 mr-1" />
            {levelDescription(adaptive.level)}
          </div>

          {/* Ejercicio */}
          {adaptive.loading && !ex && (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
              <p className="text-sm text-muted-foreground">Generando ejercicio adaptativo…</p>
            </div>
          )}

          {adaptive.error && (
            <div className="rounded-lg border border-red-300 bg-red-50 dark:bg-red-950/30 p-4 text-sm">
              <p className="font-semibold text-red-700 dark:text-red-400 mb-1">Error:</p>
              <p className="text-muted-foreground">{adaptive.error}</p>
              <Button size="sm" className="mt-3" onClick={() => adaptive.loadNext()}>
                Reintentar
              </Button>
            </div>
          )}

          {ex && !adaptive.loading && (
            <div className="space-y-4">
              <div className="rounded-lg bg-muted/30 p-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="text-xs">
                    {kindLabel(ex.kind)} · nivel {ex.difficulty}
                  </Badge>
                  {ex.hint && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs h-7"
                      onClick={() => setHintVisible(v => !v)}
                    >
                      <Lightbulb className="h-3 w-3 mr-1" />
                      {hintVisible ? 'Ocultar pista' : 'Ver pista'}
                    </Button>
                  )}
                </div>
                <p className="text-base font-medium">{ex.prompt}</p>
                {hintVisible && ex.hint && (
                  <div className="mt-2 rounded bg-amber-50 dark:bg-amber-950/30 p-2 text-xs text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                    💡 {ex.hint}
                  </div>
                )}
              </div>

              {/* Pista visual */}
              {'lang' in (ex.given ?? {}) && ex.given && (
                <div className="rounded-lg border-2 border-amber-200 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/20 p-4 text-center">
                  <p className="text-xs uppercase text-muted-foreground mb-1">
                    {getLanguage((ex.given as any).lang).name}
                  </p>
                  <p className="font-serif text-3xl">{(ex.given as any).form}</p>
                </div>
              )}
              {'forms' in (ex.given ?? {}) && ex.given && (
                <div className="rounded-lg border-2 border-amber-200 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/20 p-4 text-center">
                  <p className="text-xs uppercase text-muted-foreground mb-2">
                    Formas romances de un mismo concepto
                  </p>
                  <p className="font-serif text-2xl">{(ex.given as any).forms.join(' / ')}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    (en {(ex.given as any).langs.map((c: string) => getLanguage(c).name).join(', ')})
                  </p>
                </div>
              )}

              {/* Opciones */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {ex.options.map((opt, i) => {
                  const isCorrect = opt.correct;
                  const isSelected = adaptive.selectedAnswer === i;
                  let className = '';
                  if (adaptive.selectedAnswer !== null) {
                    if (isCorrect) {
                      className = 'bg-emerald-500 hover:bg-emerald-500 text-white border-emerald-600';
                    } else if (isSelected) {
                      className = 'bg-red-500 hover:bg-red-500 text-white border-red-600';
                    }
                  }
                  return (
                    <Button
                      key={i}
                      variant="outline"
                      className={`h-auto py-4 justify-start text-left ${className}`}
                      onClick={() => handleAnswer(i)}
                      disabled={adaptive.selectedAnswer !== null}
                    >
                      <div className="flex items-center gap-3 w-full">
                        {adaptive.selectedAnswer !== null && isCorrect && <Check className="h-4 w-4 flex-shrink-0" />}
                        {adaptive.selectedAnswer !== null && isSelected && !isCorrect && <X className="h-4 w-4 flex-shrink-0" />}
                        <div className="flex-1">
                          <p className="font-serif text-lg">{opt.text}</p>
                          {opt.sub && <p className="text-xs opacity-70">{opt.sub}</p>}
                        </div>
                      </div>
                    </Button>
                  );
                })}
              </div>

              {/* Feedback */}
              {adaptive.selectedAnswer !== null && (
                <div className="space-y-3">
                  <div className="rounded-lg p-4 border-2 bg-muted/40">
                    <div className="flex items-center gap-2 mb-2">
                      {adaptive.selectedAnswer !== null && ex.options[adaptive.selectedAnswer].correct ? (
                        <>
                          <Check className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                          <p className="font-semibold text-emerald-700 dark:text-emerald-400">¡Correcto!</p>
                        </>
                      ) : (
                        <>
                          <X className="h-5 w-5 text-red-600 dark:text-red-400" />
                          <p className="font-semibold text-red-700 dark:text-red-400">Incorrecto</p>
                        </>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{adaptive.lastExplanation}</p>

                    {askingExplain && (
                      <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Rosetta está preparando una explicación adicional…
                      </div>
                    )}

                    {extraExplanation && (
                      <div className="mt-3 rounded bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 p-3 text-xs">
                        <p className="font-semibold mb-1 flex items-center gap-1">
                          <BookOpen className="h-3 w-3" /> Rosetta explica:
                        </p>
                        <p className="text-muted-foreground">{extraExplanation}</p>
                      </div>
                    )}
                  </div>

                  <Button onClick={() => adaptive.loadNext()} className="w-full" size="lg">
                    Siguiente pregunta →
                  </Button>
                </div>
              )}
            </div>
          )}

          {adaptive.score.total > 5 && (
            <div className="mt-4 text-center">
              <Button variant="ghost" size="sm" onClick={() => adaptive.reset()}>
                <RefreshCw className="h-3 w-3 mr-1" />
                Reiniciar progreso
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Patrones fonéticos de referencia */}
      <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900">
        <CardContent className="pt-6 space-y-3">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h3 className="font-semibold">Patrones de cambio fonético comunes</h3>
          </div>
          <ul className="text-sm space-y-1.5 text-muted-foreground">
            <li>• Latín <code className="font-mono">CT</code> → it. <strong>tt</strong>, es. <strong>ch</strong>, fr. <strong>it</strong> (OCTO → otto/ocho/huit)</li>
            <li>• Latín <code className="font-mono">PL/CL/FL</code> → es. <strong>ll</strong>, it. <strong>pi/chi/fi</strong>, fr. <strong>pl/cl/fl</strong> (CLAVE → llave/chiave/clef)</li>
            <li>• Latín <code className="font-mono">A</code> tónica libre → fr. <strong>e</strong>, otras la conservan (PATRE → père/padre/pai)</li>
            <li>• Latín <code className="font-mono">U</code> breve → es. <strong>o</strong>, pt. <strong>o</strong>, it. <strong>o</strong> (LUNA → luna, pero SOL → sol)</li>
            <li>• Vocal nasal final → pt. mantiene til, fr. nasaliza (PANE → pão/pain)</li>
          </ul>
        </CardContent>
      </Card>

      {/* Asistente pedagógico Rosetta */}
      <AssistantChat context={{ tab: 'Aprender' }} />
    </div>
  );
}

function kindLabel(kind: string): string {
  switch (kind) {
    case 'cognate-match': return 'Emparejar cognado';
    case 'identify-ancestor': return 'Reconstruir etimón';
    case 'which-is-not': return 'Detectar intruso';
    case 'explain-pattern': return 'Explicar patrón';
    case 'predict-evolution': return 'Predecir evolución';
    default: return kind;
  }
}

function levelDescription(level: number): string {
  const descs: Record<number, string> = {
    1: 'Nivel principiante: reconocimiento de cognados obvios.',
    2: 'Nivel básico: identificar la raíz latina a partir de formas modernas.',
    3: 'Nivel intermedio: detectar intrusos entre cognados.',
    4: 'Nivel avanzado: explicar por qué dos formas son cognados.',
    5: 'Nivel experto: predecir cómo evolucionaría una forma latina.',
  };
  return descs[level] ?? descs[1];
}

function StatCard({
  label, value, icon, highlight,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  highlight?: boolean;
}) {
  return (
    <div
      className={`border rounded-lg p-3 bg-background ${
        highlight ? 'border-amber-300 dark:border-amber-700 bg-amber-50/50 dark:bg-amber-950/20' : ''
      }`}
    >
      <div className="flex items-center gap-2 mb-1 text-muted-foreground">
        {icon}
        <span className="text-xs uppercase">{label}</span>
      </div>
      <p className="text-xl font-bold font-mono">{value}</p>
    </div>
  );
}
