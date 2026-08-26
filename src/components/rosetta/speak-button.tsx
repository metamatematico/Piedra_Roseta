'use client';

import { Button } from '@/components/ui/button';
import { Volume2, Square, Loader2 } from 'lucide-react';
import { useSpeech } from '@/hooks/use-speech';
import { useState } from 'react';

interface SpeakButtonProps {
  text: string;
  lang?: string;        // BCP-47
  fallbackLang?: string;
  rate?: number;
  size?: 'sm' | 'default' | 'lg' | 'icon';
  variant?: 'default' | 'outline' | 'ghost' | 'secondary' | 'destructive';
  label?: string;
  className?: string;
}

export function SpeakButton({
  text,
  lang = 'es-ES',
  fallbackLang,
  rate = 0.9,
  size = 'icon',
  variant = 'ghost',
  label,
  className,
}: SpeakButtonProps) {
  const { speak, cancel, speaking, supported } = useSpeech();
  const [clicked, setClicked] = useState(false);

  if (!supported) {
    return null;  // no mostrar si no hay TTS
  }

  const isThisSpeaking = speaking && clicked;

  const handleSpeak = () => {
    if (isThisSpeaking) {
      cancel();
      setClicked(false);
    } else {
      setClicked(true);
      speak(text, { lang, fallbackLang, rate });
      // Reset después de un tiempo por si onend no dispara
      setTimeout(() => setClicked(false), 8000);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleSpeak}
      className={className}
      title={`Escuchar en ${lang}`}
      aria-label={`Escuchar ${text}`}
    >
      {isThisSpeaking ? (
        <Square className="h-4 w-4 fill-current" />
      ) : (
        <Volume2 className="h-4 w-4" />
      )}
      {label && <span className="ml-1 text-xs">{label}</span>}
    </Button>
  );
}
