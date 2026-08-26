'use client';

import { useState, useMemo, useEffect } from 'react';
import { SWADESH } from '@/lib/linguistics/swadesh';
import { LANGUAGES, getLanguage } from '@/lib/linguistics/languages';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Brain, Check, X, RefreshCw, Trophy, Lightbulb } from 'lucide-react';

type Question =
  | {
      kind: 'cognate-match';
      prompt: string;
      given: { lang: string; form: string };
      options: { lang: string; form: string; correct: boolean }[];
    }
  | {
      kind: 'identify-ancestor';
      prompt: string;
      given: { form: string; langs: string[] };
      options: { latin: string; correct: boolean }[];
    }
  | {
      kind: 'which-is-not';
      prompt: string;
      options: { lang: string; form: string; correct: boolean }[];
    };

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeQuestion(): Question {
  const romanceLangs = LANGUAGES.filter(l => l.code !== 'la');
  const kind = Math.random() < 0.5 ? 'cognate-match' : Math.random() < 0.5 ? 'identify-ancestor' : 'which-is-not';

  if (kind === 'cognate-match') {
    const entry = SWADESH[Math.floor(Math.random() * SWADESH.length)];
    const givenLang = romanceLangs[Math.floor(Math.random() * romanceLangs.length)];
    const targetLang = romanceLangs.filter(l => l.code !== givenLang.code)[
      Math.floor(Math.random() * (romanceLangs.length - 1))
    ];
    const distractors = shuffle(
      romanceLangs.filter(l => l.code !== givenLang.code && l.code !== targetLang.code)
    ).slice(0, 3);
    const options = shuffle([
      { lang: targetLang.code, form: entry.forms[targetLang.code], correct: true },
      ...distractors.map(d => ({ lang: d.code, form: entry.forms[d.code], correct: false })),
    ]);
    return {
      kind: 'cognate-match',
      prompt: `Dada la palabra en ${givenLang.name}, identifica su cognado en otra lengua romance.`,
      given: { lang: givenLang.code, form: entry.forms[givenLang.code] },
      options,
    };
  }

  if (kind === 'identify-ancestor') {
    const entry = SWADESH[Math.floor(Math.random() * SWADESH.length)];
    const langsShown = shuffle(LANGUAGES.filter(l => l.code !== 'la')).slice(0, 3);
    const forms = langsShown.map(l => entry.forms[l.code]);
    const distractors = shuffle(
      SWADESH.filter(e => e.id !== entry.id).map(e => e.latin)
    ).slice(0, 3);
    const options = shuffle([
      { latin: entry.latin, correct: true },
      ...distractors.map(d => ({ latin: d, correct: false })),
    ]);
    return {
      kind: 'identify-ancestor',
      prompt: `¿Cuál es la raíz latina (etimón) que dio origen a estas formas?`,
      given: { form: forms.join(' / '), langs: langsShown.map(l => l.code) },
      options,
    };
  }

  // which-is-not: 4 formas, una NO es cognado
  const entry = SWADESH[Math.floor(Math.random() * SWADESH.length)];
  const otherEntry = SWADESH.find(e => e.id !== entry.id)!;
  const correctLangs = shuffle(romanceLangs).slice(0, 3);
  const wrongLang = romanceLangs.find(l => !correctLangs.includes(l))!;
  const options = shuffle([
    ...correctLangs.map(l => ({
      lang: l.code,
      form: entry.forms[l.code],
      correct: true,
    })),
    {
      lang: wrongLang.code,
      form: otherEntry.forms[wrongLang.code],
      correct: false,
    },
  ]);
  return {
    kind: 'which-is-not',
    prompt: `Tres de estas formas significan «${entry.gloss}». ¿Cuál NO es cognado?`,
    options,
  };
}

export function LearnView() {
  const [question, setQuestion] = useState<Question>(() => makeQuestion());
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  const nextQuestion = () => {
    setQuestion(makeQuestion());
    setSelected(null);
  };

  const handleAnswer = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    const isCorrect = question.options[i].correct;
    const newScore = {
      correct: score.correct + (isCorrect ? 1 : 0),
      total: score.total + 1,
    };
    setScore(newScore);
    const newStreak = isCorrect ? streak + 1 : 0;
    setStreak(newStreak);
    setBestStreak(b => Math.max(b, newStreak));
  };

  const accuracy = score.total > 0 ? (score.correct / score.total) * 100 : 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Aprendizaje Interactivo
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Responde preguntas de comparación lingüística. Cada respuesta correcta
            refuerza tu comprensión de los <strong>patrones de cambio fonético</strong>
            que conectan a las lenguas romances entre sí.
          </p>
        </CardHeader>
        <CardContent>
          {/* Estadísticas */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <StatCard
              label="Aciertos"
              value={`${score.correct}/${score.total}`}
              icon={<Check className="h-4 w-4" />}
            />
            <StatCard
              label="Precisión"
              value={`${accuracy.toFixed(0)}%`}
              icon={<Trophy className="h-4 w-4" />}
            />
            <StatCard
              label="Mejor racha"
              value={`${bestStreak}`}
              icon={<RefreshCw className="h-4 w-4" />}
            />
          </div>

          <Progress value={accuracy} className="mb-6" />

          {/* Pregunta */}
          <div className="space-y-4">
            <div className="rounded-lg bg-muted/30 p-4">
              <Badge variant="outline" className="mb-2 text-xs">
                {question.kind === 'cognate-match' && 'Emparejar cognado'}
                {question.kind === 'identify-ancestor' && 'Reconstruir etimón'}
                {question.kind === 'which-is-not' && 'Detectar intruso'}
              </Badge>
              <p className="text-base font-medium">{question.prompt}</p>
            </div>

            {/* Mostrar pista */}
            {question.kind === 'cognate-match' && (
              <div className="rounded-lg border-2 border-amber-200 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/20 p-4 text-center">
                <p className="text-xs uppercase text-muted-foreground mb-1">
                  {getLanguage(question.given.lang).name}
                </p>
                <p className="font-serif text-3xl">{question.given.form}</p>
              </div>
            )}
            {question.kind === 'identify-ancestor' && (
              <div className="rounded-lg border-2 border-amber-200 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/20 p-4 text-center">
                <p className="text-xs uppercase text-muted-foreground mb-2">
                  Formas romances de un mismo concepto
                </p>
                <p className="font-serif text-2xl">{question.given.form}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  (en {question.given.langs.map(c => getLanguage(c).name).join(', ')})
                </p>
              </div>
            )}

            {/* Opciones */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {question.options.map((opt, i) => {
                const isCorrect = opt.correct;
                const isSelected = selected === i;
                let variant: 'default' | 'outline' | 'secondary' | 'destructive' = 'outline';
                let className = '';
                if (selected !== null) {
                  if (isCorrect) {
                    variant = 'default';
                    className = 'bg-emerald-500 hover:bg-emerald-500 text-white border-emerald-600';
                  } else if (isSelected) {
                    variant = 'destructive';
                  }
                }
                return (
                  <Button
                    key={i}
                    variant={variant}
                    className={`h-auto py-4 justify-start text-left ${className}`}
                    onClick={() => handleAnswer(i)}
                    disabled={selected !== null}
                  >
                    <div className="flex items-center gap-3 w-full">
                      {selected !== null && isCorrect && <Check className="h-4 w-4 flex-shrink-0" />}
                      {selected !== null && isSelected && !isCorrect && <X className="h-4 w-4 flex-shrink-0" />}
                      <div className="flex-1">
                        {question.kind === 'cognate-match' && (
                          <>
                            <p className="font-serif text-lg">{(opt as any).form}</p>
                            <p className="text-xs opacity-70">{getLanguage((opt as any).lang).name}</p>
                          </>
                        )}
                        {question.kind === 'identify-ancestor' && (
                          <p className="font-mono text-lg uppercase">{(opt as any).latin}</p>
                        )}
                        {question.kind === 'which-is-not' && (
                          <>
                            <p className="font-serif text-lg">{(opt as any).form}</p>
                            <p className="text-xs opacity-70">{getLanguage((opt as any).lang).name}</p>
                          </>
                        )}
                      </div>
                    </div>
                  </Button>
                );
              })}
            </div>

            {/* Feedback y siguiente */}
            {selected !== null && (
              <div className="space-y-3">
                <FeedbackCard
                  correct={question.options[selected].correct}
                  explanation={getExplanation(question)}
                />
                <Button onClick={nextQuestion} className="w-full" size="lg">
                  Siguiente pregunta →
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pista de patrones */}
      <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900">
        <CardContent className="pt-6 space-y-3">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h3 className="font-semibold">Patrones de cambio fonético comunes</h3>
          </div>
          <ul className="text-sm space-y-1.5 text-muted-foreground">
            <li>• Latin <code className="font-mono">CT</code> → it. <strong>tt</strong>, es. <strong>ch</strong>, fr. <strong>it</strong> (OCTO → otto/ocho/huit)</li>
            <li>• Latin <code className="font-mono">PL/CL/FL</code> → es. <strong>ll</strong>, it. <strong>pi/chi/fi</strong>, fr. <strong>pl/cl/fl</strong> (CLAVE → llave/chiave/clef)</li>
            <li>• Latin <code className="font-mono">A</code> tónica libre → fr. <strong>e</strong>, otras la conservan (PATRE → père/padre/padre/pai)</li>
            <li>• Latin <code className="font-mono">U</code> breve → es. <strong>o</strong>, pt. <strong>o</strong>, it. <strong>o</strong> (LUNA → luna, pero SOL → sol)</li>
            <li>• Vocal nasal final → pt. mantiene til, fr. nasaliza (PANE → pão/pain)</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

function getExplanation(q: Question): string {
  if (q.kind === 'cognate-match') {
    const correct = q.options.find(o => o.correct)!;
    return `El cognado correcto es «${correct.form}» en ${getLanguage(correct.lang).name}.
            Ambas palabras derivan de la misma raíz latina; los sonidos han cambiado
            siguiendo leyes fonéticas regulares.`;
  }
  if (q.kind === 'identify-ancestor') {
    const correct = q.options.find(o => o.correct)!;
    return `La raíz latina es «${correct.latin}». Las formas romances mostradas
            son evoluciones fonéticas regulares de esa misma raíz.`;
  }
  const correct = q.options.find(o => !o.correct)!;
  return `La forma intrusa era «${correct.form}» (${getLanguage(correct.lang).name}),
          que pertenece a otro concepto y por tanto no comparte etimología.`;
}

function StatCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="border rounded-lg p-3 bg-background">
      <div className="flex items-center gap-2 mb-1 text-muted-foreground">
        {icon}
        <span className="text-xs uppercase">{label}</span>
      </div>
      <p className="text-2xl font-bold font-mono">{value}</p>
    </div>
  );
}

function FeedbackCard({ correct, explanation }: { correct: boolean; explanation: string }) {
  return (
    <div
      className={`rounded-lg p-4 border-2 ${
        correct
          ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
          : 'bg-red-50 dark:bg-red-950/30 border-red-300 dark:border-red-800'
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        {correct ? (
          <Check className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
        ) : (
          <X className="h-5 w-5 text-red-600 dark:text-red-400" />
        )}
        <p className="font-semibold">
          {correct ? '¡Correcto!' : 'Incorrecto'}
        </p>
      </div>
      <p className="text-sm text-muted-foreground">{explanation}</p>
    </div>
  );
}
