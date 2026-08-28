'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ConceptView } from '@/components/rosetta/concept-view';
import { RosettaView } from '@/components/rosetta/rosetta-view';
import { VectorSpaceView } from '@/components/rosetta/vector-space-view';
import { SynthesizerView } from '@/components/rosetta/synthesizer-view';
import { LearnView } from '@/components/rosetta/learn-view';
import { ResearchView } from '@/components/rosetta/research-view';
import { SplashScreen } from '@/components/rosetta/splash-screen';
import { LLMConfigButton } from '@/components/rosetta/llm-config-button';
import { BookOpen, Languages, Box, FlaskConical, Brain, Microscope } from 'lucide-react';

const SPLASH_KEY = 'piedra-roseta-splash-seen';

// Inicializador perezoso: se ejecuta solo en el primer render del cliente
function getInitialSplash(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return !window.localStorage.getItem(SPLASH_KEY);
  } catch {
    return true;
  }
}

export default function Home() {
  const [tab, setTab] = useState('concept');
  const [showSplash, setShowSplash] = useState(getInitialSplash);

  const handleEnter = () => {
    setShowSplash(false);
    try {
      window.localStorage.setItem(SPLASH_KEY, '1');
    } catch {}
  };

  const replaySplash = () => {
    setShowSplash(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-amber-50/30 via-stone-50 to-rose-50/30 dark:from-amber-950/10 dark:via-stone-950 dark:to-rose-950/10">
      {/* Header */}
      <header className="border-b bg-gradient-to-r from-amber-50/80 via-stone-50/80 to-rose-50/80 dark:from-amber-950/20 dark:via-stone-950/20 dark:to-rose-950/20 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <button
            onClick={replaySplash}
            className="flex items-center gap-3 group"
            title="Ver introducción de nuevo"
          >
            <span className="text-3xl group-hover:scale-110 transition-transform">🪨</span>
            <div className="text-left">
              <h1 className="font-serif text-xl sm:text-2xl font-bold tracking-tight leading-none bg-gradient-to-r from-amber-700 via-stone-800 to-rose-700 bg-clip-text text-transparent">
                Sistema Piedra Roseta
              </h1>
              <p className="text-[10px] sm:text-xs text-muted-foreground">
                Leonardo Jiménez Martínez · BIOMAT · con GLM (Z.ai)
              </p>
            </div>
          </button>
          <LLMConfigButton />
        </div>
      </header>

      {/* Splash screen */}
      {showSplash && <SplashScreen onEnter={handleEnter} />}

      {/* Main */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6">
        <Tabs value={tab} onValueChange={setTab} className="space-y-6">
          <TabsList className="grid grid-cols-3 sm:grid-cols-6 w-full gap-1">
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
            <TabsTrigger value="research" className="gap-1.5">
              <Microscope className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Investigación</span>
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
          <TabsContent value="research" className="mt-0">
            <ResearchView />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t mt-auto bg-gradient-to-r from-amber-50/50 via-stone-50/50 to-rose-50/50 dark:from-amber-950/10 dark:via-stone-950/10 dark:to-rose-950/10">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center text-xs text-muted-foreground space-y-1">
          <p>
            <strong>Sistema Piedra Roseta</strong> · Lingüística matemática interactiva
          </p>
          <p>
            Desarrollado por <strong>Leonardo Jiménez Martínez</strong> · Centro de Biomatemáticas BIOMAT
            {' '}·{' '}
            con asistencia de <strong>GLM (Z.ai)</strong>
          </p>
          <p className="opacity-70">
            PCA + Needleman-Wunsch + Interpolación fonética vectorial · {80}+ conceptos Swadesh · 10 lenguas romances
          </p>
        </div>
      </footer>
    </div>
  );
}
