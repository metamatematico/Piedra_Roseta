# 🪨 Sistema Piedra Roseta

**Álgebra lineal aplicada al aprendizaje de familias lingüísticas**

Sistema web interactivo que trata las lenguas como vectores en un espacio de rasgos
fonológicos y gramaticales, permitiendo aplicar álgebra lineal (PCA, combinaciones
lineales, bases) para aprender familias completas de lenguas a partir de un conjunto
mínimo de «lenguas-base».

Caso demostrativo: **10 lenguas romances** (latín + español, portugués, gallego,
catalán, occitano, francés, italiano, sardo, rumano).

---

## 👥 Autoría

- **Leonardo Jiménez Martínez** — Centro de Biomatemáticas **BIOMAT**
- **GLM (Z.ai)** — Asistencia de IA en el desarrollo

---

## ✨ Características

### Cortinilla pedagógica de entrada

Al entrar por primera vez, el sistema muestra una **introducción animada en 4 fases**
que explica desde cero:
1. Qué fue la piedra de Rosetta original
2. La idea matemática de tratar lenguas como vectores
3. Cómo el álgebra lineal permite «generar» lenguas
4. Qué encontrará el usuario en cada pestaña

(Puede saltarse y volverse a ver haciendo clic en el logo del header.)

### 5 módulos interactivos

1. **Concepto** — Marco teórico: por qué una lengua es un vector, qué es una base
   lingüística, referencias científicas.
2. **Piedra Roseta** — Vista comparativa multilingüe: 40 conceptos de la lista de
   Swadesh mostrados paralelamente en 10 lenguas, con latín como ancestro común.
3. **Espacio Vectorial** — Visualización PCA 2D interactiva implementada desde cero
   (power iteration + deflación), con matriz de distancias euclidianas y vectores
   de carga de cada rasgo fonológico.
4. **Sintetizador** — Editor de bases con pesos α (sliders) que aplica la fórmula
   `v = α₁·b₁ + α₂·b₂ + …` para generar una lengua híbrida y mide el error de
   reconstrucción frente a cualquier lengua objetivo.
5. **Aprender** — Quiz adaptativo con IA: 5 niveles de dificultad, ajuste automático
   según desempeño, explicaciones pedagógicas personalizadas cuando fallas.

### Asistente pedagógico «Rosetta» 🪨

Chat con IA disponible en todas las pestañas. **Contextual**: sabe en qué pestaña
estás, qué lengua o concepto tienes seleccionado, y responde dudas de lingüística
romance o de álgebra lineal en lenguaje simple. El system prompt del asistente
incluye el estado completo del sistema para que pueda «navegar» conceptualmente
entre las 5 pestañas.

---

## 🤖 Configuración del LLM (multi-provider)

El sistema soporta **4 proveedores de IA** intercambiables. Las credenciales se
guardan en `localStorage` del navegador (nunca en el servidor) y se envían al
backend como header `x-llm-config` (base64 JSON).

Para configurar, haz clic en el botón **«Configurar IA»** (arriba a la derecha).

| Proveedor | Modelo recomendado | ¿API key? | Notas |
|-----------|---------------------|-----------|-------|
| **Anthropic Claude** | `claude-sonnet-4-5-20250929` | Sí (`sk-ant-...`) | Recomendado para razonamiento pedagógico |
| **OpenAI** | `gpt-4o-mini` | Sí (`sk-...`) | GPT-4o y GPT-3.5 también disponibles |
| **Compatible OpenAI** | `llama-3.3-70b-versatile` | Sí + baseUrl | Groq, Together, OpenRouter, etc. |
| **Z.ai (GLM)** | `glm-4.6` | No (auto) | Solo en el sandbox Z.ai |

**Sin configurar**, el sistema funciona en **modo offline**: las páginas estáticas
y el quiz con fallback local siguen operativos; el asistente da respuestas
predefinidas sobre temas comunes.

### Cómo obtener una API key de Anthropic

1. Ve a https://console.anthropic.com/settings/keys
2. Crea una nueva key (empieza con `sk-ant-...`)
3. Pégala en el modal «Configurar IA» del sistema
4. Selecciona el modelo (recomendado: `claude-sonnet-4-5-20250929`)
5. Guarda. ¡Listo! El asistente y los ejercicios adaptativos usarán Claude.

---

## 🧮 Fundamento matemático

Cada lengua se codifica como un vector binario en un espacio de 19 dimensiones
(rasgos fonológicos y gramaticales):

```
v_español  = (1, 1, 0, 0, …, 1)
v_francés  = (0, 1, 1, 1, …, 1)
v_italiano = (1, 1, 0, 1, …, 1)
```

Aplicando **PCA** (análisis de componentes principales) encontramos los ejes de
máxima variación, que definen una nueva base ortogonal en la que «explicar» la
diversidad lingüística con menos dimensiones. Si encontramos un conjunto pequeño
de lenguas-base `B = {b₁, b₂, …, bₖ}`, entonces cualquier otra lengua romance se
puede escribir como `v = α₁·b₁ + α₂·b₂ + … + αₖ·bₖ`.

Esto es la **generación lineal de lenguas**.

---

## 🛠 Stack técnico

- **Framework**: Next.js 16 (App Router) + TypeScript 5
- **UI**: Tailwind CSS 4 + shadcn/ui + Lucide icons
- **IA**: sistema multi-provider (Anthropic, OpenAI, Z.ai, compatibles OpenAI)
- **Visualización**: SVG nativo (sin librerías de charting)
- **PCA**: implementación desde cero (sin dependencias ML externas)

---

## 🚀 Desarrollo local

```bash
# Instalar dependencias
bun install

# Modo desarrollo
bun run dev

# Verificar lint
bun run lint

# Build de producción
bun run build
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## ☁️ Despliegue en Vercel

1. Sube este repositorio a GitHub.
2. En [vercel.com](https://vercel.com), importa el repo.
3. Vercel detecta automáticamente Next.js — no requiere configuración extra.
4. Deploy. ✅
5. Una vez desplegado, entra a la app, haz clic en **«Configurar IA»** y pega tu
   API key de Anthropic (u otro proveedor).

> Las API keys se guardan en el navegador del usuario, no en el servidor.
> No necesitas configurar variables de entorno en Vercel para que funcione.

---

## 📁 Estructura del proyecto

```
src/
├── app/
│   ├── api/llm/
│   │   ├── exercise/     # Genera ejercicios adaptativos
│   │   ├── explain/      # Explica respuestas correctas/incorrectas
│   │   └── chat/         # Asistente pedagógico Rosetta
│   ├── page.tsx          # Página principal con 5 tabs + splash
│   └── layout.tsx
├── components/
│   ├── rosetta/
│   │   ├── splash-screen.tsx        # Cortinilla pedagógica de entrada
│   │   ├── llm-config-button.tsx    # Modal de configuración multi-provider
│   │   ├── assistant-chat.tsx       # Chat con Rosetta
│   │   ├── concept-view.tsx
│   │   ├── rosetta-view.tsx
│   │   ├── vector-space-view.tsx
│   │   ├── synthesizer-view.tsx
│   │   └── learn-view.tsx
│   └── ui/               # shadcn/ui components
├── hooks/
│   └── use-adaptive-exercise.ts
└── lib/
    ├── llm/
    │   ├── providers.ts  # 4 providers + persistencia en localStorage
    │   └── client.ts     # Cliente unificado con fallback en cascada
    ├── linguistics/
    │   ├── languages.ts  # 10 lenguas romances + metadatos
    │   ├── swadesh.ts    # 40 conceptos en 10 lenguas
    │   ├── features.ts   # 19 rasgos fonológicos × 10 lenguas
    │   └── pca.ts        # Álgebra lineal + PCA desde cero
    └── utils.ts
```

---

## 📚 Referencias científicas

- **Nerbonne & Heeringa (1997)** — Dialectometría con PCA
- **Wieling & Nerbonne (2015)** — Clustering dialectal con PCA
- **Jolliffe & Cadima (2016)** — Revisión moderna de PCA
- **Swadesh (1952)** — Lista léxica para comparación lingüística
- **WALS** (Dryer & Haspelmath, eds.) — World Atlas of Language Structures
- **PHOIBLE 2.0** (Moran & McCloy, eds.) — Phonetics Information Base and Lexicon

---

## 📄 Licencia

MIT — libre uso educativo y de investigación.

Copyright (c) 2026 Leonardo Jiménez Martínez · Centro de Biomatemáticas BIOMAT
