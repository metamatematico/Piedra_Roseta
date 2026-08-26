'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowRight, BookOpen, Languages, Box, FlaskConical, Brain } from 'lucide-react';

interface SplashScreenProps {
  onEnter: () => void;
}

const PHASES = [
  {
    icon: '🪨',
    title: 'La piedra que descifró una civilización',
    body: 'En 1799, un soldado francés en Egipto encontró una piedra con el mismo texto escrito tres veces: en jeroglífico, demótico y griego. Comparando las tres versiones, los eruditos pudieron descifrar por fin la escritura de los antiguos egipcios. Esa piedra se llamó Piedra de Roseta.',
  },
  {
    icon: '🧮',
    title: 'Y si la piedra no fuera una, sino muchas?',
    body: 'Imagina que cada lengua es una «piedra Roseta»: una ventana a un mismo significado expresado de mil maneras. Si reuniéramos suficientes piedras — suficientes lenguas — podríamos descubrir los patrones ocultos que las conectan. Eso es exactamente lo que hace este sistema, pero con matemáticas.',
  },
  {
    icon: '📐',
    title: 'Cada lengua es un vector',
    body: 'En álgebra lineal, un vector es una lista de números. Aquí, cada lengua se representa como un vector de 19 rasgos fonológicos (vocales nasales, consonantes dobles, etc.). Las lenguas parecidas tienen vectores parecidos. Y si un conjunto de lenguas forma una «base», podemos expresar cualquier otra como combinación lineal de ellas.',
  },
  {
    icon: '🌍',
    title: 'Tu viaje por las lenguas romances',
    body: 'Empezaremos con 10 lenguas hijas del latín: español, portugués, gallego, catalán, occitano, francés, italiano, sardo y rumano. Verás cómo se parecen, cómo se diferencian, y cómo el francés se volvió tan raro. Tendrás un asistente — Rosetta — que te acompañará en cada paso.',
  },
];

export function SplashScreen({ onEnter }: SplashScreenProps) {
  const [phase, setPhase] = useState(0);
  const [visible, setVisible] = useState(true);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onEnter, 400);
  };

  const next = () => {
    if (phase < PHASES.length - 1) {
      setPhase(phase + 1);
    } else {
      handleClose();
    }
  };

  // Tecla Enter avanza
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        next();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [phase]);

  const current = PHASES[phase];

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-amber-50 via-stone-50 to-rose-50 dark:from-amber-950/40 dark:via-stone-950 dark:to-rose-950/40 transition-opacity duration-400 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Decoración de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 text-9xl opacity-5 animate-pulse">🪨</div>
        <div className="absolute bottom-10 right-10 text-9xl opacity-5 animate-pulse" style={{ animationDelay: '1s' }}>🏛️</div>
        <div className="absolute top-1/3 right-1/4 text-7xl opacity-5 animate-pulse" style={{ animationDelay: '2s' }}>📜</div>
      </div>

      <div className="relative w-full max-w-3xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-7xl mb-4 animate-bounce" style={{ animationDuration: '2s' }}>🪨</div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold mb-2 bg-gradient-to-r from-amber-700 via-stone-800 to-rose-700 bg-clip-text text-transparent">
            Sistema Piedra Roseta
          </h1>
          <p className="text-sm text-muted-foreground italic">
            Álgebra lineal aplicada al aprendizaje de familias lingüísticas
          </p>
        </div>

        {/* Card principal con la fase actual */}
        <div
          key={phase}
          className="bg-background/80 backdrop-blur rounded-2xl border-2 border-amber-200 dark:border-amber-800 shadow-xl p-8 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500"
        >
          <div className="flex items-start gap-4 mb-4">
            <span className="text-5xl flex-shrink-0">{current.icon}</span>
            <div className="flex-1">
              <h2 className="font-serif text-2xl font-semibold mb-3">{current.title}</h2>
              <p className="text-base leading-relaxed text-muted-foreground">
                {current.body}
              </p>
            </div>
          </div>
        </div>

        {/* Indicador de progreso */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {PHASES.map((_, i) => (
            <button
              key={i}
              onClick={() => setPhase(i)}
              className={`h-2 rounded-full transition-all ${
                i === phase
                  ? 'w-8 bg-amber-600'
                  : i < phase
                  ? 'w-2 bg-amber-400'
                  : 'w-2 bg-amber-200 dark:bg-amber-900'
              }`}
              aria-label={`Ir a la sección ${i + 1}`}
            />
          ))}
        </div>

        {/* Botones */}
        <div className="flex items-center justify-between gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="text-muted-foreground"
          >
            Saltar introducción
          </Button>
          <div className="flex items-center gap-2">
            {phase > 0 && (
              <Button
                variant="outline"
                onClick={() => setPhase(phase - 1)}
              >
                ← Atrás
              </Button>
            )}
            <Button onClick={next} className="gap-2" size="lg">
              {phase < PHASES.length - 1 ? (
                <>
                  Continuar
                  <ArrowRight className="h-4 w-4" />
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Comenzar a explorar
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Vista previa de los módulos */}
        {phase === PHASES.length - 1 && (
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-5 gap-2 animate-in fade-in duration-700">
            {[
              { icon: BookOpen, label: 'Concepto' },
              { icon: Languages, label: 'Piedra Roseta' },
              { icon: Box, label: 'Espacio Vectorial' },
              { icon: FlaskConical, label: 'Sintetizador' },
              { icon: Brain, label: 'Aprender' },
            ].map((m, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-1 p-3 rounded-lg bg-background/60 border border-amber-200/50 dark:border-amber-800/50"
              >
                <m.icon className="h-5 w-5 text-amber-700 dark:text-amber-400" />
                <span className="text-xs text-center font-medium">{m.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Créditos */}
      <div className="absolute bottom-4 left-0 right-0 text-center text-xs text-muted-foreground">
        <p>
          Sistema desarrollado por <strong>Leonardo Jiménez Martínez</strong> · Centro de Biomatemáticas BIOMAT
          {' '}·{' '}
          con asistencia de <strong>GLM (Z.ai)</strong>
        </p>
      </div>
    </div>
  );
}
