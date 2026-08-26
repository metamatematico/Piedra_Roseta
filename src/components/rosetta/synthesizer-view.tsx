'use client';

import { useState, useMemo } from 'react';
import { reconstructFromBases } from '@/lib/linguistics/pca';
import { LANGUAGES, getLanguage } from '@/lib/linguistics/languages';
import { PHONETIC_FEATURES, FEATURE_MATRIX } from '@/lib/linguistics/features';
import { SWADESH } from '@/lib/linguistics/swadesh';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Sparkles, Wand2, FlaskConical, Plus, X } from 'lucide-react';

interface BaseWeight {
  code: string;
  weight: number;
}

const DEFAULT_BASES: BaseWeight[] = [
  { code: 'la', weight: 1.0 },
  { code: 'es', weight: 0.5 },
  { code: 'fr', weight: 0.3 },
];

export function SynthesizerView() {
  const [bases, setBases] = useState<BaseWeight[]>(DEFAULT_BASES);
  const [targetLang, setTargetLang] = useState<string>('ca');
  const [pickedWord, setPickedWord] = useState<string>('water');

  // Síntesis
  const reconstruction = useMemo(
    () => reconstructFromBases(bases, targetLang),
    [bases, targetLang]
  );

  // Reconstrucción del vector objetivo (para comparar)
  const targetReconstruction = useMemo(
    () => reconstructFromBases([{ code: targetLang, weight: 1 }], targetLang),
    [targetLang]
  );

  const addBase = (code: string) => {
    if (bases.find(b => b.code === code)) return;
    setBases([...bases, { code, weight: 0.5 }]);
  };

  const removeBase = (code: string) => {
    setBases(bases.filter(b => b.code !== code));
  };

  const updateWeight = (code: string, weight: number) => {
    setBases(bases.map(b => (b.code === code ? { ...b, weight } : b)));
  };

  // Para cada palabra Swadesh, predecir la "forma" sintetizada:
  // tomamos la lengua base con mayor peso y la mezclamos con el sonido de las demás
  const synthesizedWord = useMemo(() => {
    const entry = SWADESH.find(e => e.id === pickedWord);
    if (!entry) return '';
    // heurística: si latín tiene peso > 0.5, mostramos forma latina + sufijo romance más cercano
    // si no, mezclamos las dos lenguas de mayor peso
    const sorted = [...bases].sort((a, b) => b.weight - a.weight);
    const topLang = sorted[0];
    if (!topLang) return '';
    if (topLang.code === 'la') {
      return entry.latin;
    }
    return entry.forms[topLang.code] ?? entry.latin;
  }, [bases, pickedWord]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FlaskConical className="h-5 w-5" />
            Sintetizador Lineal de Lenguas
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Si tratamos cada lengua como un <strong>vector</strong> en el espacio de rasgos,
            podemos escribir <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">v_sintetizado = α₁·v_b1 + α₂·v_b2 + ...</code>
            Igual que en álgebra lineal: si {`{b₁, b₂, ...}`} forman una <strong>base</strong>,
            cualquier otra lengua se puede expresar como combinación lineal de ellas.
            ¡Esto es la generación lineal de lenguas!
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Editor de bases */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold uppercase tracking-wide">
                Lenguas-base y pesos (α)
              </h3>
              <Badge variant="outline" className="font-mono">
                {bases.length} base{bases.length !== 1 ? 's' : ''}
              </Badge>
            </div>

            <div className="space-y-3">
              {bases.map(b => {
                const lang = getLanguage(b.code);
                return (
                  <div
                    key={b.code}
                    className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30"
                  >
                    <span
                      className="w-3 h-12 rounded-full"
                      style={{ backgroundColor: lang.color }}
                    />
                    <span className="text-xl">{lang.flag}</span>
                    <div className="flex-1">
                      <div className="flex items-baseline justify-between mb-1">
                        <span className="font-medium">{lang.name}</span>
                        <span className="font-mono text-xs">
                          α = {b.weight.toFixed(2)}
                        </span>
                      </div>
                      <Slider
                        value={[b.weight]}
                        onValueChange={v => updateWeight(b.code, v[0])}
                        min={0}
                        max={2}
                        step={0.05}
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeBase(b.code)}
                      className="h-8 w-8"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                );
              })}
            </div>

            {/* Añadir bases */}
            <div className="mt-3 flex flex-wrap gap-2">
              {LANGUAGES
                .filter(l => !bases.find(b => b.code === l.code))
                .map(lang => (
                  <Button
                    key={lang.code}
                    variant="outline"
                    size="sm"
                    onClick={() => addBase(lang.code)}
                    className="gap-1.5"
                  >
                    <Plus className="h-3 w-3" />
                    <span>{lang.flag}</span>
                    <span className="text-xs">{lang.code.toUpperCase()}</span>
                  </Button>
                ))}
            </div>
          </div>

          {/* Fórmula matemática */}
          <div className="rounded-lg bg-gradient-to-br from-stone-100 to-amber-50 dark:from-stone-900 dark:to-amber-950/30 p-4 border font-mono text-sm">
            <div className="text-xs uppercase text-muted-foreground mb-2">
              Combinación lineal actual
            </div>
            <div className="overflow-x-auto">
              <span className="font-bold">v_sint</span> ={' '}
              {bases.map((b, i) => (
                <span key={b.code}>
                  {i > 0 && <span className="text-muted-foreground"> + </span>}
                  <span className="text-amber-700 dark:text-amber-400">{b.weight.toFixed(2)}</span>
                  <span className="text-muted-foreground">·</span>
                  <span className="font-bold">v<sub>{b.code}</sub></span>
                </span>
              ))}
            </div>
          </div>

          {/* Lengua objetivo */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide mb-3">
              Lengua a aproximar
            </h3>
            <div className="flex flex-wrap gap-2">
              {LANGUAGES.map(lang => (
                <Button
                  key={lang.code}
                  variant={targetLang === lang.code ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTargetLang(lang.code)}
                  className="gap-1.5"
                >
                  <span>{lang.flag}</span>
                  <span className="text-xs">{lang.code.toUpperCase()}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Resultado: comparación de vectores */}
          <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-emerald-200 dark:border-emerald-900">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Sparkles className="h-4 w-4" />
                Resultado de la síntesis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs uppercase text-muted-foreground mb-2">
                    Error de reconstrucción
                  </p>
                  <p className="text-4xl font-bold font-mono text-emerald-700 dark:text-emerald-400">
                    {reconstruction.reconstructionError.toFixed(3)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    distancia euclidiana ||v_sint − v_{targetLang}||
                    {' '}
                    {reconstruction.reconstructionError < 0.5 ? '★ excelente' : ''}
                    {reconstruction.reconstructionError >= 0.5 && reconstruction.reconstructionError < 1.0 ? 'aceptable' : ''}
                    {reconstruction.reconstructionError >= 1.0 ? 'pobre' : ''}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase text-muted-foreground mb-2">
                    Idioma predicho
                  </p>
                  <p className="text-3xl font-bold">{getLanguage(targetLang).flag} {getLanguage(targetLang).name}</p>
                </div>
              </div>

              {/* Tabla comparativa de rasgos */}
              <div>
                <p className="text-xs uppercase text-muted-foreground mb-2">
                  Comparación rasgo por rasgo
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1.5 max-h-64 overflow-y-auto">
                  {PHONETIC_FEATURES.map((f, i) => {
                    const synth = reconstruction.reconstructedFeatures[f.id];
                    const target = FEATURE_MATRIX[targetLang][i];
                    const diff = Math.abs(synth - target);
                    return (
                      <div
                        key={f.id}
                        className="flex items-center gap-2 p-1.5 rounded border text-xs"
                        style={{
                          backgroundColor: diff < 0.2 ? 'rgba(16,185,129,0.1)' : diff < 0.5 ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)',
                        }}
                      >
                        <span className="flex-1 truncate" title={f.description}>{f.name}</span>
                        <span className="font-mono">
                          {synth.toFixed(2)} vs {target.toFixed(1)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Síntesis léxica */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Wand2 className="h-4 w-4" />
                Síntesis léxica (heurística)
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Dada la combinación actual, «predice» la forma léxica para un concepto.
                La lengua con mayor peso determina la forma principal.
              </p>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {SWADESH.map(e => (
                  <Button
                    key={e.id}
                    variant={pickedWord === e.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPickedWord(e.id)}
                  >
                    {e.gloss}
                  </Button>
                ))}
              </div>
              <div className="rounded-lg bg-muted/50 p-4 text-center">
                <p className="text-xs uppercase text-muted-foreground mb-1">
                  «{SWADESH.find(e => e.id === pickedWord)?.gloss}» sintetizado
                </p>
                <p className="font-serif text-3xl">{synthesizedWord}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  (basado en la lengua con mayor peso α)
                </p>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
