'use client';

import { useState, useMemo } from 'react';
import { reconstructFromBases } from '@/lib/linguistics/pca';
import { LANGUAGES, getLanguage } from '@/lib/linguistics/languages';
import { PHONETIC_FEATURES, FEATURE_MATRIX } from '@/lib/linguistics/features';
import { SWADESH } from '@/lib/linguistics/swadesh';
import { PHONETICS } from '@/lib/linguistics/phonetics';
import { synthesizeHybridPhonetic, graphemesToPhonemes } from '@/lib/linguistics/phoneme-space';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Sparkles, Wand2, FlaskConical, Plus, X, Volume2, Ear, Activity } from 'lucide-react';
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
  { name: 'Esp. 70% + Fr. 30%', bases: [{ code: 'es', weight: 0.7 }, { code: 'fr', weight: 0.3 }] },
  { name: 'Esp. 30% + Fr. 70%', bases: [{ code: 'es', weight: 0.3 }, { code: 'fr', weight: 0.7 }] },
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

  // SÍNTESIS FONÉTICA INTERPOLADA (la nueva, que sí produce fonemas nuevos)
  const hybrid = useMemo(() => {
    const basesWithForms = bases
      .filter(b => b.weight > 0)
      .map(b => {
        const form = b.code === 'la' ? currentEntry.latin : currentEntry.forms[b.code] ?? '';
        return { code: b.code, form, weight: b.weight };
      })
      .filter(b => b.form.length > 0);
    return synthesizeHybridPhonetic(basesWithForms);
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
      const phonemes = graphemesToPhonemes(form, b.code);
      const phon = PHONETICS[b.code];
      return {
        code: b.code,
        form,
        phonemes,
        ipa: '/' + phonemes.join('') + '/',
        bcp47: phon?.bcp47 ?? 'es-ES',
        fallback: phon?.fallbackBcp47,
      };
    });
  }, [bases, currentEntry]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FlaskConical className="h-5 w-5" />
            Sintetizador Fonético Interpolado
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Aquí sí surge una lengua nueva: cada fonema se <strong>interpola linealmente</strong>
            en un espacio de rasgos articulatorios (lugar, modo, sonoridad, nasalidad, altura
            vocálica...). Mezclar /o/ + /u/ al 50% produce un fonema intermedio como /o̞/,
            no uno de los dos. <strong>Escucha la diferencia.</strong>
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

          {/* RESULTADO: lengua híbrida interpolada */}
          <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-emerald-200 dark:border-emerald-900">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Sparkles className="h-4 w-4" />
                Lengua híbrida interpolada
              </CardTitle>
              <p className="text-xs text-muted-foreground">
                «{currentEntry.gloss}» · etimón latino: <code className="font-mono">{currentEntry.latin}</code>
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Forma híbrida con audio */}
              <div className="text-center py-6 rounded-lg bg-background/60 border-2 border-emerald-300 dark:border-emerald-700">
                <p className="text-xs uppercase text-muted-foreground mb-2">
                  Forma sintetizada (¡es una lengua nueva!)
                </p>
                <div className="flex items-center justify-center gap-4 mb-3">
                  <p className="font-serif text-5xl">{hybrid.writtenForm || '—'}</p>
                  <SpeakButton
                    text={hybrid.ttsString || hybrid.writtenForm}
                    lang={hybrid.bcp47Guess}
                    rate={0.75}
                    size="lg"
                    variant="default"
                  />
                </div>
                <p className="font-mono text-lg text-emerald-700 dark:text-emerald-400">
                  {hybrid.ipaString}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {hybrid.summary}
                </p>
              </div>

              {/* Visualización fonema por fonema (con barras de mezcla) */}
              <div>
                <p className="text-xs uppercase text-muted-foreground mb-2 flex items-center gap-1">
                  <Activity className="h-3 w-3" />
                  Descomposición fonética (interpolación)
                </p>
                <div className="space-y-2">
                  {hybrid.phonemes.map((ph, i) => (
                    <div
                      key={i}
                      className={`rounded border p-3 ${
                        ph.isInterpolated
                          ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700'
                          : 'bg-background border-border'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-2xl font-bold">
                            /{ph.symbol}/
                          </span>
                          {ph.isInterpolated && (
                            <Badge variant="secondary" className="text-xs">
                              <Sparkles className="h-3 w-3 mr-1" />
                              interpolado
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          pos {i + 1}
                        </span>
                      </div>
                      {/* Barras de mezcla por lengua */}
                      <div className="flex h-3 rounded overflow-hidden border">
                        {ph.sources.map((s, j) => {
                          const lang = getLanguage(bases[j]?.code ?? 'es');
                          return (
                            <div
                              key={j}
                              style={{
                                width: `${s.weight * 100}%`,
                                backgroundColor: lang.color,
                              }}
                              title={`${lang.name}: /${s.symbol}/ → ${(s.weight * 100).toFixed(0)}%`}
                            />
                          );
                        })}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1.5">
                        {ph.blendDescription}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Comparación: cada lengua base + la híbrida */}
              <div>
                <p className="text-xs uppercase text-muted-foreground mb-2">
                  Comparación auditiva
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
                              {t.ipa}
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
                        <p className="font-serif text-xl">{hybrid.writtenForm || '—'}</p>
                        <p className="font-mono text-xs text-emerald-700 dark:text-emerald-400">
                          {hybrid.ipaString}
                        </p>
                      </div>
                      <SpeakButton
                        text={hybrid.ttsString || hybrid.writtenForm}
                        lang={hybrid.bcp47Guess}
                        rate={0.75}
                      />
                    </div>
                  </div>
                </div>
              </div>
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
                  <strong className="text-foreground">¿Por qué ahora sí suena distinto?</strong>{' '}
                  Cada fonema es un vector de rasgos articulatorios (lugar, modo, sonoridad,
                  nasalidad, altura vocálica, etc.). Al combinar <code className="font-mono">español "noche" /notʃe/</code> +{' '}
                  <code className="font-mono">francés "nuit" /nɥi/</code> al 50%, cada posición se interpola:
                </p>
                <ul className="list-disc pl-5 space-y-1 ml-2">
                  <li>Pos 1: /n/ + /n/ → /n/ (idéntica, sin mezcla)</li>
                  <li>Pos 2: /o/ + /ɥ/ → fonema intermedio entre vocal posterior redondeada y semivocal anterior redondeada</li>
                  <li>Pos 3: /tʃ/ + /i/ → resultado intermedio entre africada palatal y vocal cerrada anterior</li>
                  <li>Pos 4: /e/ + (vacío) → /e/ (solo español aporta)</li>
                </ul>
                <p>
                  La voz del navegador (Web Speech API) pronuncia el resultado con la fonética
                  de la lengua dominante, pero la <strong>forma misma es nueva</strong>: no
                  existe en ninguna lengua romance real.
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
