// Sistema multi-provider de LLM con configuración persistida en localStorage.
// Soporta:
//   - z-ai-web-dev-sdk (default del sandbox)
//   - Anthropic Claude (vía API REST nativa)
//   - OpenAI (vía API REST nativa)
//   - Cualquier proveedor compatible con OpenAI (Groq, Together, OpenRouter, etc.)
//
// Las API keys se guardan en localStorage del navegador (solo cliente) y se envían
// al endpoint /api/llm/* como header `x-llm-config` (base64 JSON).
// El servidor nunca persiste las keys.

export type ProviderId = 'zai' | 'anthropic' | 'openai' | 'openai-compatible';

export interface ProviderConfig {
  id: ProviderId;
  label: string;
  description: string;
  needsApiKey: boolean;
  apiKeyPlaceholder?: string;
  defaultModel: string;
  modelOptions: string[];
  needsBaseUrl?: boolean;
  baseUrlPlaceholder?: string;
  docsUrl: string;
}

export const PROVIDERS: ProviderConfig[] = [
  {
    id: 'zai',
    label: 'Z.ai (GLM)',
    description: 'SDK z-ai-web-dev-sdk. Disponible por defecto en el sandbox Z.ai. Sin API key necesaria aquí.',
    needsApiKey: false,
    defaultModel: 'glm-4.6',
    modelOptions: ['glm-4.6', 'glm-4.5', 'glm-4'],
    docsUrl: 'https://z.ai',
  },
  {
    id: 'anthropic',
    label: 'Anthropic Claude',
    description: 'Modelos Claude (Sonnet, Haiku, Opus). Recomendado para razonamiento pedagógico. Requiere API key.',
    needsApiKey: true,
    apiKeyPlaceholder: 'sk-ant-...',
    defaultModel: 'claude-sonnet-4-5-20250929',
    modelOptions: [
      'claude-sonnet-4-5-20250929',
      'claude-3-7-sonnet-20250219',
      'claude-3-5-haiku-20241022',
      'claude-3-5-sonnet-20241022',
      'claude-opus-4-20250514',
    ],
    docsUrl: 'https://console.anthropic.com/settings/keys',
  },
  {
    id: 'openai',
    label: 'OpenAI',
    description: 'Modelos GPT de OpenAI. Requiere API key.',
    needsApiKey: true,
    apiKeyPlaceholder: 'sk-...',
    defaultModel: 'gpt-4o-mini',
    modelOptions: ['gpt-4o-mini', 'gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo'],
    docsUrl: 'https://platform.openai.com/api-keys',
  },
  {
    id: 'openai-compatible',
    label: 'Compatible con OpenAI (Groq, Together, OpenRouter…)',
    description: 'Cualquier proveedor con API compatible con OpenAI. Especifica baseUrl y API key.',
    needsApiKey: true,
    needsBaseUrl: true,
    apiKeyPlaceholder: 'sk-...',
    baseUrlPlaceholder: 'https://api.groq.com/openai/v1',
    defaultModel: 'llama-3.3-70b-versatile',
    modelOptions: ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant'],
    docsUrl: 'https://platform.openai.com/docs/api-reference',
  },
];

export interface LLMSettings {
  provider: ProviderId;
  apiKey?: string;
  model?: string;
  baseUrl?: string;
}

const STORAGE_KEY = 'piedra-roseta-llm-settings';

export const DEFAULT_SETTINGS: LLMSettings = {
  provider: 'zai',
};

// ---------- Cliente ----------

export function loadSettings(): LLMSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(s: LLMSettings): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
}

export function clearSettings(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(STORAGE_KEY);
}

// Serialización para enviar al servidor como header
export function encodeSettingsHeader(s: LLMSettings): string {
  return Buffer.from(JSON.stringify(s)).toString('base64');
}

// ---------- Servidor: decodificación ----------

export function decodeSettingsHeader(header?: string | null): LLMSettings | null {
  if (!header) return null;
  try {
    const json = Buffer.from(header, 'base64').toString('utf-8');
    return JSON.parse(json) as LLMSettings;
  } catch {
    return null;
  }
}

// ---------- Helper para validación ----------

export function isConfigured(s: LLMSettings): boolean {
  const provider = PROVIDERS.find(p => p.id === s.provider);
  if (!provider) return false;
  if (provider.needsApiKey && !s.apiKey) return false;
  if (provider.needsBaseUrl && !s.baseUrl) return false;
  return true;
}

export function getProvider(id: ProviderId): ProviderConfig {
  const p = PROVIDERS.find(p => p.id === id);
  if (!p) throw new Error(`Provider desconocido: ${id}`);
  return p;
}
