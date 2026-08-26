'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ConceptView } from '@/components/rosetta/concept-view';
import { RosettaView } from '@/components/rosetta/rosetta-view';
import { VectorSpaceView } from '@/components/rosetta/vector-space-view';
import { SynthesizerView } from '@/components/rosetta/synthesizer-view';
import { LearnView } from '@/components/rosetta/learn-view';
import { BookOpen, Languages, Box, FlaskConical, Brain } from 'lucide-react';

export default function Home() {
  const [tab, setTab] = useState('concept');

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b bg-gradient-to-r from-amber-50 via-stone-50 to-rose-50 dark:from-amber-950/20 dark:via-stone-950/20 dark:to-rose-950/20">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">🪨</span>
            <div>
              <h1 className="font-serif text-3xl font-bold tracking-tight">
                Sistema Piedra Roseta
              </h1>
              <p className="text-sm text-muted-foreground">
                Álgebra lineal aplicada al aprendizaje de familias lingüísticas
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6">
        <Tabs value={tab} onValueChange={setTab} className="space-y-6">
          <TabsList className="grid grid-cols-2 sm:grid-cols-5 w-full">
            <TabsTrigger value="concept" className="gap-1.5">
              <BookOpen className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Concepto</span>
            </TabsTrigger>
            <TabsTrigger value="rosetta" className="gap-1.5">
              <Languages className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Piedra Roseta</span>
            </TabsTrigger>
            <TabsTrigger value="vector" className="gap-1.5">
              <Box className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Espacio Vectorial</span>
            </TabsTrigger>
            <TabsTrigger value="synth" className="gap-1.5">
              <FlaskConical className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Sintetizador</span>
            </TabsTrigger>
            <TabsTrigger value="learn" className="gap-1.5">
              <Brain className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Aprender</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="concept" className="mt-0">
            <ConceptView />
          </TabsContent>
          <TabsContent value="rosetta" className="mt-0">
            <RosettaView />
          </TabsContent>
          <TabsContent value="vector" className="mt-0">
            <VectorSpaceView />
          </TabsContent>
          <TabsContent value="synth" className="mt-0">
            <SynthesizerView />
          </TabsContent>
          <TabsContent value="learn" className="mt-0">
            <LearnView />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t mt-auto bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center text-xs text-muted-foreground">
          <p>
            Sistema Piedra Roseta · Lingüística matemática interactiva ·
            Datos basados en WALS, PHOIBLE y listas de Swadesh
          </p>
          <p className="mt-1">
            PCA implementado desde cero (power iteration + deflación) ·
            Sin dependencias externas de ML
          </p>
        </div>
      </footer>
    </div>
  );
}
