# 🪨 Sistema Piedra Roseta

**Álgebra lineal aplicada al aprendizaje de familias lingüísticas**

Sistema web interactivo que trata las lenguas como vectores en un espacio de rasgos
fonológicos y gramaticales, permitiendo aplicar álgebra lineal (PCA, combinaciones
lineales, bases) para aprender familias completas de lenguas a partir de un conjunto
mínimo de «lenguas-base».

Caso demostrativo: **10 lenguas romances** (latín + español, portugués, gallego,
catalán, occitano, francés, italiano, sardo, rumano).

---

## ✨ Características

### 5 módulos interactivos

1. **Concepto** — Marco teórico: por qué una lengua es un vector, qué es una base
   lingüística, referencias científicas (Nerbonne, Wieling, Swadesh, WALS, PHOIBLE).
2. **Piedra Roseta** — Vista comparativa multilingüe: 40 conceptos de la lista de
   Swadesh mostrados paralelamente en 10 lenguas, con latín como ancestro común.
3. **Espacio Vectorial** — Visualización PCA 2D interactiva implementada desde cero
   (power iteration + deflación), con matriz de distancias euclidianas entre lenguas
   y vectores de carga de cada rasgo fonológico.
4. **Sintetizador** — Editor de bases con pesos α (sliders) que aplica la fórmula
   `v = α₁·b₁ + α₂·b₂ + …` para generar una lengua híbrida y mide el error de
   reconstrucción frente a cualquier lengua objetivo.
5. **Aprender** — Quiz adaptativo con IA: 5 niveles de dificultad, ajuste automático
   según desempeño, explicaciones pedagógicas personalizadas generadas por LLM cuando
   fallas, y chat con «Rosetta», el asistente pedagógico.

### Asistente pedagógico «Rosetta»

Chat con IA disponible en todas las pestañas. Contextual: sabe en qué pestaña estás,
qué lengua o concepto tienes seleccionado, y responde dudas de lingüística romance
o de álgebra lineal en lenguaje simple.

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
- **IA**: z-ai-web-dev-sdk (LLM en el backend únicamente)
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
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## ☁️ Despliegue en Vercel

1. Sube este repositorio a GitHub.
2. En [vercel.com](https://vercel.com), importa el repo.
3. Vercel detecta automáticamente Next.js — no requiere configuración extra.
4. (Opcional) Si necesitas base de datos, añade una variable de entorno
   `DATABASE_URL` en Vercel con una URL de Prisma-compatible (PostgreSQL, MySQL,
   o SQLite para desarrollo).
5. Deploy. ✅

> El SDK `z-ai-web-dev-sdk` se configura automáticamente en entornos Z.ai.
> Si despliegas fuera del ecosistema Z.ai, necesitarás configurar las credenciales
> del SDK según su documentación.

---

## 📁 Estructura del proyecto

```
src/
├── app/
│   ├── api/llm/
│   │   ├── exercise/     # Genera ejercicios adaptativos
│   │   ├── explain/      # Explica respuestas correctas/incorrectas
│   │   └── chat/         # Asistente pedagógico Rosetta
│   ├── page.tsx          # Página principal con 5 tabs
│   └── layout.tsx
├── components/
│   ├── rosetta/
│   │   ├── concept-view.tsx
│   │   ├── rosetta-view.tsx
│   │   ├── vector-space-view.tsx
│   │   ├── synthesizer-view.tsx
│   │   ├── learn-view.tsx
│   │   └── assistant-chat.tsx
│   └── ui/               # shadcn/ui components
├── hooks/
│   └── use-adaptive-exercise.ts
└── lib/
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

## 🎯 Próximos pasos sugeridos

- Añadir más lenguas romances menores (asturiano, aragonés, ladino, francoprovenzal)
- Ampliar a otras familias (germánicas, eslavas) para verificar la generalidad del método
- Implementar persistencia de progreso del estudiante (Prisma + SQLite)
- Exportar/importar combinaciones de bases como JSON
- Añadir modo «aula» para profesores con seguimiento de estudiantes

---

## 📄 Licencia

MIT — libre uso educativo y de investigación.
