'use client';

import { useState, useMemo } from 'react';
import { reconstructFromBases } from '@/lib/linguistics/pca';
import { LANGUAGES, getLanguage } from '@/lib/linguistics/languages';
import { PHONETIC_FEATURES, FEATURE_MATRIX } from '@/lib/linguistics/features';
import { SWADESH } from '@/lib/linguistics/swadesh';
import { PHONETICS, synthesizeHybrid, transcribeToPhonemes } from '@/lib/linguistics/phonetics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Sparkles, Wand2, FlaskConical, Plus, X, Volume2, Ear } from 'lucide-react';
import { SpeakButton } from './speak-button';
import { AssistantChat } from './assistant-chat';

interface BaseWeight {
  code: string;
  weight: number;
}

const DEFAULT_BASES: BaseWeight[] = [
  { code: 'es', weight: 1.0 },
  { code: 'fr', weight: 1.0 },
];

const PRESET_RECIPES = [
  { name: 'Español ↔ Francés (50/50)', bases: [{ code: 'es', weight: 1 }, { code: 'fr', weight: 1 }] },
  { name: 'Ibérico puro', bases: [{ code: 'es', weight: 1 }, { code: 'pt', weight: 1 }, { code: 'gl', weight: 0.5 }] },
  { name: 'Galo + Ítalo', bases: [{ code: 'fr', weight: 1 }, { code: 'it', weight: 1 }] },
  { name: 'Latín + moderno', bases: [{ code: 'la', weight: 1.5 }, { code: 'es', weight: 0.5 }, { code: 'fr', weight: 0.5 }] },
  { name: 'Extremo oriente', bases: [{ code: 'ro', weight: 1 }, { code: 'it', weight: 0.5 }] },
  { name: 'Sardo conservador', bases: [{ code: 'sc', weight: 1 }, { code: 'la', weight: 1 }] },
];

export function SynthesizerView() {
  const [bases, setBases] = useState<BaseWeight[]>(DEFAULT_BASES);
  const [targetLang, setTargetLang] = useState<string>('ca');
  const [pickedWord, setPickedWord] = useState<string>('water');

  const reconstruction = useMemo(
    () => reconstructFromBases(bases, targetLang),
    [bases, targetLang]
  );

  const currentEntry = useMemo(
    () => SWADESH.find(e => e.id === pickedWord) ?? SWADESH[0],
    [pickedWord]
  );

  // SÍNTESIS FONÉTICA REAL: combinar las formas léxicas
  const hybridSynthesis = useMemo(() => {
    const basesWithForms = bases
      .filter(b => b.weight > 0)
      .map(b => {
        const form = b.code === 'la' ? currentEntry.latin : currentEntry.forms[b.code] ?? '';
        return { code: b.code, form, weight: b.weight };
      })
      .filter(b => b.form.length > 0);
    return synthesizeHybrid(basesWithForms);
  }, [bases, currentEntry]);

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

  const applyPreset = (preset: typeof PRESET_RECIPES[number]) => {
    setBases(preset.bases.map(b => ({ ...b })));
  };

  // Transcripción fonética de cada lengua base (para mostrar)
  const baseTranscriptions = useMemo(() => {
    return bases.map(b => {
      const form = b.code === 'la' ? currentEntry.latin : currentEntry.forms[b.code] ?? '';
      const trans = transcribeToPhonemes(form, b.code);
      const phon = PHONETICS[b.code];
      return {
        code: b.code,
        form,
        phonemes: trans.simplified,
        ipa: trans.ipa,
        bcp47: phon?.bcp47 ?? 'es-ES',
        fallback: phon?.fallbackBcp47,
        rules: trans.rules,
      };
    });
  }, [bases, currentEntry]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FlaskConical className="h-5 w-5" />
            Sintetizador Fonético de Lenguas
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Combina <strong>linealmente</strong> las formas léxicas de varias lenguas-base.
            El sistema aplica las reglas fonéticas de cada lengua, vota ponderadamente por
            cada fonema según los pesos α, y produce una <strong>lengua híbrida pronunciable</strong>.
            ¡Escúchala y compárala con las originales!
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Recetas predefinidas */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide mb-3 text-muted-foreground">
              Recetas rápidas
            </h3>
            <div className="flex flex-wrap gap-2">
              {PRESET_RECIPES.map(r => (
                <Button
                  key={r.name}
                  variant="outline"
                  size="sm"
                  onClick={() => applyPreset(r)}
                  className="text-xs"
                >
                  {r.name}
                </Button>
              ))}
            </div>
          </div>

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
                const phon = PHONETICS[b.code];
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

          {/* Selector de concepto */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide mb-3">
              Concepto a sintetizar
            </h3>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-1">
              {SWADESH.map(e => (
                <Button
                  key={e.id}
                  variant={pickedWord === e.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPickedWord(e.id)}
                  className="text-xs"
                >
                  {e.gloss}
                </Button>
              ))}
            </div>
          </div>

          {/* Resultado: forma híbrida + audio */}
          <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-emerald-200 dark:border-emerald-900">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Sparkles className="h-4 w-4" />
                Lengua híbrida sintetizada
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                «{currentEntry.gloss}» · etimón latino: <code className="font-mono">{currentEntry.latin}</code>
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Forma híbrida con audio */}
              <div className="text-center py-4 rounded-lg bg-background/60 border">
                <p className="text-xs uppercase text-muted-foreground mb-2">
                  Forma sintetizada
                </p>
                <div className="flex items-center justify-center gap-3 mb-2">
                  <p className="font-serif text-4xl">{hybridSynthesis.hybridForm || '—'}</p>
                  <SpeakButton
                    text={hybridSynthesis.hybridForm}
                    lang={hybridSynthesis.bcp47Guess}
                    size="lg"
                    variant="default"
                  />
                </div>
                <p className="font-mono text-sm text-emerald-700 dark:text-emerald-400">
                  {hybridSynthesis.hybridIPA}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Pronunciada con voz {hybridSynthesis.bcp47Guess}
                </p>
              </div>

              {/* Comparación: cada lengua base + la híbrida */}
              <div>
                <p className="text-xs uppercase text-muted-foreground mb-2">
                  Comparación fonética
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {baseTranscriptions.map(t => {
                    const lang = getLanguage(t.code);
                    return (
                      <div
                        key={t.code}
                        className="rounded border p-3 bg-background/60"
                        style={{ borderLeftWidth: '4px', borderLeftColor: lang.color }}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold flex items-center gap-1">
                            {lang.flag} {lang.name}
                          </span>
                          <span className="font-mono text-xs text-muted-foreground">
                            α = {bases.find(b => b.code === t.code)?.weight.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex-1">
                            <p className="font-serif text-xl">{t.form}</p>
                            <p className="font-mono text-xs text-muted-foreground">
                              /{t.phonemes}/
                            </p>
                          </div>
                          <SpeakButton
                            text={t.form}
                            lang={t.bcp47}
                            fallbackLang={t.fallback}
                            rate={0.85}
                          />
                        </div>
                      </div>
                    );
                  })}
                  {/* Celda híbrida destacada */}
                  <div
                    className="rounded border-2 border-emerald-400 p-3 bg-emerald-50 dark:bg-emerald-950/30"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold flex items-center gap-1">
                        ✨ Híbrido
                      </span>
                      <span className="font-mono text-xs text-emerald-700 dark:text-emerald-400">
                        síntesis
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1">
                        <p className="font-serif text-xl">{hybridSynthesis.hybridForm || '—'}</p>
                        <p className="font-mono text-xs text-emerald-700 dark:text-emerald-400">
                          {hybridSynthesis.hybridIPA}
                        </p>
                      </div>
                      <SpeakButton
                        text={hybridSynthesis.hybridForm}
                        lang={hybridSynthesis.bcp47Guess}
                        rate={0.85}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Reglas aplicadas */}
              {hybridSynthesis.rules.length > 0 && (
                <div>
                  <p className="text-xs uppercase text-muted-foreground mb-2 flex items-center gap-1">
                    <Wand2 className="h-3 w-3" /> Reglas de síntesis (votación ponderada)
                  </p>
                  <div className="space-y-1 max-h-40 overflow-y-auto">
                    {hybridSynthesis.rules.slice(0, 8).map((r, i) => (
                      <div
                        key={i}
                        className="text-xs font-mono p-2 rounded bg-background/60 border"
                      >
                        <span className="text-muted-foreground">{r.reason}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Lengua objetivo */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide mb-3">
              Comparar con lengua real
            </h3>
            <div className="flex flex-wrap gap-2 mb-3">
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
            <div className="rounded-lg border p-4 bg-muted/30">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase text-muted-foreground">
                    {getLanguage(targetLang).name} · «{currentEntry.gloss}»
                  </p>
                  <p className="font-serif text-3xl">
                    {targetLang === 'la' ? currentEntry.latin : currentEntry.forms[targetLang]}
                  </p>
                </div>
                <SpeakButton
                  text={targetLang === 'la' ? currentEntry.latin : currentEntry.forms[targetLang]}
                  lang={PHONETICS[targetLang]?.bcp47 ?? 'es-ES'}
                  fallbackLang={PHONETICS[targetLang]?.fallbackBcp47}
                  rate={0.85}
                  size="lg"
                  variant="default"
                />
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs uppercase text-muted-foreground">Error de reconstrucción</p>
                  <p className="font-mono text-lg">
                    {reconstruction.reconstructionError.toFixed(3)}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase text-muted-foreground">
                    ¿La híbrida se parece?
                  </p>
                  <p className="text-sm">
                    {reconstruction.reconstructionError < 0.5 ? '★ Muy parecida' :
                     reconstruction.reconstructionError < 1.0 ? 'Aproximada' : 'Divergente'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Aviso pedagógico */}
          <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900">
            <CardContent className="pt-6 flex items-start gap-3">
              <Ear className="h-5 w-5 flex-shrink-0 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div className="text-sm text-muted-foreground space-y-2">
                <p>
                  <strong className="text-foreground">¿Qué estás escuchando?</strong> La forma
                  híbrida es una <em>combinación lineal real</em>: para cada posición de fonema,
                  el sistema vota ponderadamente entre las lenguas-base según sus pesos α.
                </p>
                <p>
                  Por ejemplo, al combinar <code className="font-mono">español "agua"</code> +{' '}
                  <code className="font-mono">francés "eau"</code> con pesos iguales, las
                  primeras posiciones (a-g-u) vienen del español (más largo), pero si el francés
                  tuviera mayor peso, la forma se acortaría hacia "o".
                </p>
                <p>
                  La voz se sintetiza con el motor TTS de tu navegador (Web Speech API). La
                  calidad varía según el idioma: las lenguas mayores (es, fr, it, pt) suelen tener
                  voces nativas, mientras que el latín, sardo u occitano usan fallback a lenguas
                  cercanas.
                </p>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      <AssistantChat
        context={{
          tab: 'Sintetizador',
          selectedLanguage: targetLang,
          selectedConcept: pickedWord,
        }}
      />
    </div>
  );
}
