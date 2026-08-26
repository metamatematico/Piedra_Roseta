'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, Loader2, Sparkles, X } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface AssistantChatProps {
  context?: {
    selectedLanguage?: string;
    selectedConcept?: string;
    tab?: string;
  };
}

const SUGGESTIONS = [
  '¿Por qué el francés es tan diferente del español?',
  '¿Qué es PCA y para qué sirve en lingüística?',
  '¿Cómo elijo lenguas-base en el Sintetizador?',
  'Dame un ejemplo de cambio fonético regular.',
];

export function AssistantChat({ context }: AssistantChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const newMessages: ChatMessage[] = [...messages, { role: 'user', content: trimmed }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/llm/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, context }),
      });
      const data = await res.json();
      const response = data.response ?? 'Lo siento, no pude responder. Intenta reformular.';
      setMessages([...newMessages, { role: 'assistant', content: response }]);
    } catch (e) {
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: '⚠️ Ocurrió un error de conexión. Intenta de nuevo en un momento.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <Card className="border-2 border-amber-300 dark:border-amber-700 bg-gradient-to-br from-amber-50 to-rose-50 dark:from-amber-950/30 dark:to-rose-950/30">
        <CardContent className="pt-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🪨</span>
            <div>
              <p className="font-semibold">¿Dudas? Pregunta a Rosetta</p>
              <p className="text-sm text-muted-foreground">
                Asistente pedagógico con IA — explica patrones fonéticos, conceptos matemáticos y te guía por el sistema.
              </p>
            </div>
          </div>
          <Button onClick={() => setOpen(true)} className="gap-2">
            <MessageCircle className="h-4 w-4" />
            Abrir chat
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-amber-300 dark:border-amber-700">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <span className="text-2xl">🪨</span>
            Rosetta · Asistente pedagógico
          </CardTitle>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        {context?.tab && (
          <p className="text-xs text-muted-foreground italic">
            Contexto: pestaña «{context.tab}»
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        <ScrollArea className="h-72 rounded border bg-muted/20 p-3">
          <div ref={scrollRef} className="space-y-3">
            {messages.length === 0 && (
              <div className="text-center py-6 space-y-3">
                <Sparkles className="h-6 w-6 mx-auto text-amber-500" />
                <p className="text-sm text-muted-foreground">
                  ¡Hola! Soy Rosetta. Pregúntame sobre cualquier lengua, concepto o
                  idea matemática del sistema. Algunas ideas:
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {SUGGESTIONS.map(s => (
                    <Button
                      key={s}
                      variant="outline"
                      size="sm"
                      className="text-xs h-7"
                      onClick={() => send(s)}
                    >
                      {s}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg p-3 text-sm ${
                    m.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted border'
                  }`}
                >
                  {m.role === 'assistant' && (
                    <p className="text-xs font-semibold mb-1 opacity-70">🪨 Rosetta</p>
                  )}
                  <p className="whitespace-pre-wrap">{m.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-muted border rounded-lg p-3 flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Rosetta está pensando…
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <form
          onSubmit={e => {
            e.preventDefault();
            send(input);
          }}
          className="flex gap-2"
        >
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Escribe tu pregunta sobre lingüística romance…"
            disabled={loading}
          />
          <Button type="submit" disabled={loading || !input.trim()} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
