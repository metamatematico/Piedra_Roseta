'use client';

import { useState, useMemo } from 'react';
import { SWADESH, SEMANTIC_FIELDS } from '@/lib/linguistics/swadesh';
import { LANGUAGES, getLanguage } from '@/lib/linguistics/languages';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Languages, BookOpen, ArrowRight } from 'lucide-react';
import { AssistantChat } from './assistant-chat';
import { SpeakButton } from './speak-button';
import { PHONETICS } from '@/lib/linguistics/phonetics';

export function RosettaView() {
  const [selectedField, setSelectedField] = useState<string>('naturaleza');
  const [selectedConceptId, setSelectedConceptId] = useState<string>('water');
  const [activeLangs, setActiveLangs] = useState<string[]>(['la', 'es', 'pt', 'fr', 'it', 'ro']);

  const entries = useMemo(
    () => SWADESH.filter(e => e.semanticField === selectedField),
    [selectedField]
  );

  const currentEntry = useMemo(
    () => SWADESH.find(e => e.id === selectedConceptId) ?? entries[0],
    [selectedConceptId, entries]
  );

  const toggleLang = (code: string) => {
    setActiveLangs(prev =>
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
  };

  return (
    <div className="space-y-6">
      {/* Controles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Languages className="h-5 w-5" />
            Piedra Roseta Comparativa
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Como la piedra original (que mostraba el mismo texto en jeroglífico, demótico y griego),
            aquí ves un mismo concepto expresado simultáneamente en varias lenguas romances.
            La columna de la izquierda muestra el <strong>latín</strong>, ancestro común.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2 items-end">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Campo semántico
              </label>
              <Select value={selectedField} onValueChange={setSelectedField}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SEMANTIC_FIELDS.map(f => (
                    <SelectItem key={f} value={f}>{f}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1 block">
                Concepto
              </label>
              <Select value={selectedConceptId} onValueChange={setSelectedConceptId}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {entries.map(e => (
                    <SelectItem key={e.id} value={e.id}>{e.gloss}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Chips de lenguas activas */}
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">
              Lenguas visibles (clic para activar/desactivar)
            </label>
            <div className="flex flex-wrap gap-2">
              {LANGUAGES.map(lang => {
                const active = activeLangs.includes(lang.code);
                return (
                  <Button
                    key={lang.code}
                    variant={active ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => toggleLang(lang.code)}
                    className="gap-1.5"
                    style={active ? { backgroundColor: lang.color } : {}}
                  >
                    <span>{lang.flag}</span>
                    <span className="text-xs">{lang.name}</span>
                  </Button>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* La piedra Roseta */}
      {currentEntry && (
        <Card className="overflow-hidden border-2 border-amber-200 dark:border-amber-900">
          <CardHeader className="bg-gradient-to-r from-amber-50 to-stone-50 dark:from-amber-950/30 dark:to-stone-950/30">
            <div className="flex items-baseline justify-between flex-wrap gap-2">
              <div>
                <CardTitle className="font-serif text-3xl">
                  «{currentEntry.gloss}»
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Concepto · {currentEntry.english} · campo: {currentEntry.semanticField}
                </p>
              </div>
              <Badge variant="outline" className="font-mono text-xs">
                ETYM: {currentEntry.etymon}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
              {/* Columna latín siempre primero */}
              <RosettaColumn
                code="la"
                form={currentEntry.latin}
                isAncestor
              />
              {LANGUAGES
                .filter(l => l.code !== 'la' && activeLangs.includes(l.code))
                .map(lang => (
                  <RosettaColumn
                    key={lang.code}
                    code={lang.code}
                    form={currentEntry.forms[lang.code]}
                  />
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de conceptos navegables */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <BookOpen className="h-5 w-5" />
            Otros conceptos del campo «{selectedField}»
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-32">
            <div className="flex flex-wrap gap-2">
              {entries.map(e => (
                <Button
                  key={e.id}
                  variant={e.id === selectedConceptId ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedConceptId(e.id)}
                  className="gap-1"
                >
                  {e.gloss}
                  <ArrowRight className="h-3 w-3 opacity-50" />
                </Button>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Nota explicativa */}
      <Card className="bg-stone-50 dark:bg-stone-900/50">
        <CardContent className="pt-6 text-sm text-muted-foreground space-y-2">
          <p className="font-medium text-foreground">¿Por qué esto es una «piedra Roseta»?</p>
          <p>
            La piedra de Rosetta permitió descifrar los jeroglíficos porque presentaba
            <em> el mismo texto en tres escrituras</em>. Aquí aplicamos la misma idea
            pero a nivel <strong>comparativo-estructural</strong>: cada concepto es un
            «texto» paralelo, y al verlos juntos emergen los patrones de cambio fonético
            (latín AQUA → agua / água / aigua / eau / acqua / apă).
          </p>
          <p>
            En la siguiente pestaña verás cómo estas correspondencias se pueden modelar
            matemáticamente como <strong>vectores</strong> en un espacio de rasgos,
            permitiendo aplicar álgebra lineal para encontrar las «lenguas base» que
            generan linealmente todas las demás.
          </p>
        </CardContent>
      </Card>

      <AssistantChat
        context={{
          tab: 'Piedra Roseta',
          selectedConcept: selectedConceptId,
        }}
      />
    </div>
  );
}

function RosettaColumn({
  code,
  form,
  isAncestor = false,
}: {
  code: string;
  form: string;
  isAncestor?: boolean;
}) {
  const lang = getLanguage(code);
  const phon = PHONETICS[code];
  return (
    <div
      className={`p-5 border-r border-b last:border-r-0 transition-colors hover:bg-stone-50 dark:hover:bg-stone-900/30 ${
        isAncestor ? 'bg-amber-50/50 dark:bg-amber-950/20' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{lang.flag}</span>
          <span className="text-xs font-semibold uppercase tracking-wide">
            {lang.name}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <SpeakButton
            text={form}
            lang={phon?.bcp47 ?? 'es-ES'}
            fallbackLang={phon?.fallbackBcp47}
            rate={0.85}
            size="sm"
          />
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: lang.color }}
          />
        </div>
      </div>
      <p className="font-serif text-2xl mb-1 break-words">
        {form}
      </p>
      <p className="text-xs text-muted-foreground italic">
        {lang.endonym}
      </p>
      {isAncestor && (
        <Badge variant="secondary" className="mt-2 text-xs">
          ★ ancestro común
        </Badge>
      )}
    </div>
  );
}
