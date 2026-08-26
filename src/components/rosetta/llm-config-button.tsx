'use client';

import { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Settings, Check, AlertCircle, ExternalLink, Trash2 } from 'lucide-react';
import { PROVIDERS, LLMSettings, loadSettings, saveSettings, clearSettings, isConfigured, getProvider, ProviderId, DEFAULT_SETTINGS } from '@/lib/llm/providers';

export function LLMConfigButton() {
  // Estado inicial consistente entre SSR y cliente
  const [settings, setSettings] = useState<LLMSettings>(DEFAULT_SETTINGS);
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  // Cargar settings solo cuando el diálogo se abre (no al montar)
  const handleOpenChange = useCallback((nextOpen: boolean) => {
    if (nextOpen) {
      setSettings(loadSettings());
    }
    setOpen(nextOpen);
  }, []);

  const provider = getProvider(settings.provider);
  const configured = isConfigured(settings);

  const handleSave = () => {
    saveSettings(settings);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setOpen(false);
    }, 800);
  };

  const handleClear = () => {
    clearSettings();
    setSettings({ provider: 'zai' });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2" title="Configurar proveedor de IA">
          <Settings className="h-4 w-4" />
          <span className="hidden sm:inline">Configurar IA</span>
          {configured && (
            <Badge variant="secondary" className="ml-1 h-5 text-xs gap-1">
              <Check className="h-3 w-3" /> {provider.label.split(' ')[0]}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Configurar motor de IA</DialogTitle>
          <DialogDescription>
            Elige qué proveedor de LLM usar para el asistente Rosetta y los ejercicios adaptativos.
            Tus credenciales se guardan solo en tu navegador (localStorage), nunca en el servidor.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Selector de proveedor */}
          <div>
            <Label className="text-xs uppercase text-muted-foreground mb-2 block">
              Proveedor
            </Label>
            <Select
              value={settings.provider}
              onValueChange={(v: ProviderId) => {
                const p = getProvider(v);
                setSettings({
                  provider: v,
                  model: p.defaultModel,
                  apiKey: '',
                  baseUrl: '',
                });
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PROVIDERS.map(p => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1.5">{provider.description}</p>
            <a
              href={provider.docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:underline inline-flex items-center gap-1 mt-1"
            >
              Cómo obtener una API key <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          {/* API Key */}
          {provider.needsApiKey && (
            <div>
              <Label htmlFor="apikey" className="text-xs uppercase text-muted-foreground mb-2 block">
                API Key
              </Label>
              <Input
                id="apikey"
                type="password"
                placeholder={provider.apiKeyPlaceholder}
                value={settings.apiKey ?? ''}
                onChange={e => setSettings({ ...settings, apiKey: e.target.value })}
              />
              <p className="text-xs text-muted-foreground mt-1">
                🔒 Se almacena solo en este navegador. No se envía a ningún servidor кроме de las llamadas a la API.
              </p>
            </div>
          )}

          {/* Base URL (solo para openai-compatible) */}
          {provider.needsBaseUrl && (
            <div>
              <Label htmlFor="baseurl" className="text-xs uppercase text-muted-foreground mb-2 block">
                Base URL
              </Label>
              <Input
                id="baseurl"
                placeholder={provider.baseUrlPlaceholder}
                value={settings.baseUrl ?? ''}
                onChange={e => setSettings({ ...settings, baseUrl: e.target.value })}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Ej: Groq = https://api.groq.com/openai/v1 · Together = https://api.together.xyz/v1
              </p>
            </div>
          )}

          {/* Modelo */}
          <div>
            <Label htmlFor="model" className="text-xs uppercase text-muted-foreground mb-2 block">
              Modelo
            </Label>
            <Select
              value={settings.model ?? provider.defaultModel}
              onValueChange={v => setSettings({ ...settings, model: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {provider.modelOptions.map(m => (
                  <SelectItem key={m} value={m}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Estado */}
          <div className={`rounded-lg p-3 text-sm ${
            configured
              ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
              : 'bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
          }`}>
            {configured ? (
              <span className="flex items-center gap-2">
                <Check className="h-4 w-4" /> Configurado con {provider.label} · {settings.model}
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4" /> Sin configurar — el asistente funcionará en modo offline.
              </span>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={handleClear} className="mr-auto">
            <Trash2 className="h-4 w-4 mr-1" /> Borrar
          </Button>
          <Button onClick={handleSave} className="gap-2">
            {saved ? (
              <><Check className="h-4 w-4" /> Guardado</>
            ) : (
              'Guardar'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
