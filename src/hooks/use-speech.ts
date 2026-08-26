'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export interface SpeakOptions {
  lang?: string;          // BCP-47 (es-ES, fr-FR, etc.)
  rate?: number;          // 0.1 a 10 (default 1)
  pitch?: number;         // 0 a 2 (default 1)
  volume?: number;        // 0 a 1 (default 1)
  fallbackLang?: string;  // si lang no está disponible
}

export interface UseSpeechReturn {
  speak: (text: string, opts?: SpeakOptions) => void;
  cancel: () => void;
  speaking: boolean;
  supported: boolean;
  voices: SpeechSynthesisVoice[];
  availableLangs: string[];  // BCP-47 codes disponibles
  getBestVoice: (lang: string, fallback?: string) => SpeechSynthesisVoice | null;
}

export function useSpeech(): UseSpeechReturn {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [speaking, setSpeaking] = useState(false);
  const [supported] = useState(() =>
    typeof window !== 'undefined' && 'speechSynthesis' in window
  );
  const currentUtterance = useRef<SpeechSynthesisUtterance | null>(null);

  // Cargar voces (pueden llegar de forma asíncrona)
  useEffect(() => {
    if (!supported) return;

    const loadVoices = () => {
      const v = window.speechSynthesis.getVoices();
      if (v.length > 0) {
        setVoices(v);
      }
    };

    loadVoices();
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
    // Algunos navegadores necesitan un pequeño delay
    const t = setTimeout(loadVoices, 250);

    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
      clearTimeout(t);
    };
  }, [supported]);

  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      if (supported && typeof window !== 'undefined') {
        window.speechSynthesis.cancel();
      }
    };
  }, [supported]);

  const getBestVoice = useCallback(
    (lang: string, fallback?: string): SpeechSynthesisVoice | null => {
      if (voices.length === 0) return null;

      // 1. Match exacto
      let v = voices.find(v => v.lang === lang);
      if (v) return v;

      // 2. Mismo idioma base (parte antes del -)
      const base = lang.split('-')[0].toLowerCase();
      v = voices.find(v => v.lang.toLowerCase().startsWith(base));
      if (v) return v;

      // 3. Fallback
      if (fallback) {
        v = voices.find(v => v.lang === fallback);
        if (v) return v;
        const fbBase = fallback.split('-')[0].toLowerCase();
        v = voices.find(v => v.lang.toLowerCase().startsWith(fbBase));
        if (v) return v;
      }

      // 4. Cualquier voz romance como último recurso
      const romances = ['es', 'fr', 'it', 'pt', 'ro', 'ca'];
      for (const r of romances) {
        v = voices.find(v => v.lang.toLowerCase().startsWith(r));
        if (v) return v;
      }

      return voices[0] ?? null;
    },
    [voices]
  );

  const speak = useCallback(
    (text: string, opts: SpeakOptions = {}) => {
      if (!supported || !text.trim()) return;

      // Cancelar cualquier reproducción previa
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      const lang = opts.lang ?? 'es-ES';
      utterance.lang = lang;
      utterance.rate = opts.rate ?? 1;
      utterance.pitch = opts.pitch ?? 1;
      utterance.volume = opts.volume ?? 1;

      const voice = getBestVoice(lang, opts.fallbackLang);
      if (voice) {
        utterance.voice = voice;
      }

      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);

      currentUtterance.current = utterance;
      window.speechSynthesis.speak(utterance);
    },
    [supported, getBestVoice]
  );

  const cancel = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, [supported]);

  const availableLangs = Array.from(new Set(voices.map(v => v.lang))).sort();

  return {
    speak,
    cancel,
    speaking,
    supported,
    voices,
    availableLangs,
    getBestVoice,
  };
}
