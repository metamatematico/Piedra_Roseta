'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Sigma, Layers, Globe, ArrowRight } from 'lucide-react';

export function ConceptView() {
  return (
    <div className="space-y-6">
      {/* Hero */}
      <Card className="border-2 border-amber-200 dark:border-amber-900 bg-gradient-to-br from-amber-50 via-stone-50 to-rose-50 dark:from-amber-950/30 dark:via-stone-950/30 dark:to-rose-950/30">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="bg-background">Sistema interactivo</Badge>
            <Badge variant="outline" className="bg-background">Lingüística matemática</Badge>
          </div>
          <CardTitle className="font-serif text-4xl">
            🪨 Sistema Piedra Roseta
          </CardTitle>
          <p className="text-muted-foreground text-lg mt-2 max-w-3xl">
            Aprende conjuntos grandes de lenguas tratándolas como vectores en un espacio
            de rasgos. Encuentra las «lenguas-base» (como una base vectorial) y genera
            linealmente todas las demás — igual que en álgebra lineal.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ConceptCard
              icon={<Globe className="h-6 w-6" />}
              title="10 lenguas romances"
              body="Latín (ancestro) + español, portugués, gallego, catalán, occitano, francés, italiano, sardo y rumano."
            />
            <ConceptCard
              icon={<Sigma className="h-6 w-6" />}
              title="40 conceptos Swadesh"
              body="Lista de vocabulario básico universal: pronombres, números, animales, cuerpo, verbos. La base comparativa estándar."
            />
            <ConceptCard
              icon={<Layers className="h-6 w-6" />}
              title="19 rasgos fonológicos"
              body="Cada lengua se codifica como vector binario: vocales nasales, /ʎ/, /ɲ/, geminación, casos, etc. (basado en WALS y PHOIBLE)."
            />
          </div>
        </CardContent>
      </Card>

      {/* Marco teórico */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              La idea matemática
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-relaxed">
            <p>
              En álgebra lineal, cualquier vector de un espacio se puede escribir como
              combinación lineal de una <strong>base</strong>: un conjunto mínimo de
              vectores linealmente independientes.
            </p>
            <p>
              Aplicamos esta idea a la lingüística: cada lengua es un <em>vector</em> en
              un espacio cuyas dimensiones son rasgos fonológicos, gramaticales y léxicos.
              Las lenguas cercanas en ese espacio comparten más rasgos; las lejanas, menos.
            </p>
            <div className="bg-muted/50 rounded p-4 font-mono text-xs">
              <p><strong>v</strong><sub>español</sub> = (1, 1, 0, 0, …, 1)</p>
              <p><strong>v</strong><sub>francés</sub>  = (0, 1, 1, 1, …, 1)</p>
              <p><strong>v</strong><sub>italiano</sub> = (1, 1, 0, 1, …, 1)</p>
              <p className="mt-2 text-muted-foreground">
                donde cada coordenada es un rasgo fonológico o gramatical.
              </p>
            </div>
            <p>
              Si las lenguas viven en un espacio vectorial, podemos aplicar <strong>PCA</strong>
              (análisis de componentes principales) para encontrar los ejes de máxima variación.
              Esos ejes definen una nueva base ortogonal en la que «explicar» la diversidad
              lingüística con menos dimensiones.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              La idea lingüística
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm leading-relaxed">
            <p>
              La <strong>piedra de Rosetta</strong> original fue clave para descifrar los
              jeroglíficos porque presentaba el mismo texto en tres escrituras. Aquí
              ampliamos la metáfora: una «piedra Roseta» generalizada es cualquier
              sistema que muestre paralelamente muchas lenguas.
            </p>
            <p>
              Las lenguas romances son un caso ideal porque:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Comparten un ancestro común bien documentado (latín).</li>
              <li>Tienen una filogenia clara y relativamente reciente (~2000 años).</li>
              <li>Los cambios fonéticos siguen leyes regulares (neogramáticos).</li>
              <li>Existen corpus estandarizados (REW, WALS, PHOIBLE, Swadesh).</li>
            </ul>
            <p>
              Esto permite reconstruir el <strong>protorromance</strong> y modelar las
              transformaciones como una matriz de cambio aplicada al latín.
            </p>
            <div className="bg-amber-50 dark:bg-amber-950/30 rounded p-3 text-xs">
              <strong>Idea clave:</strong> si encontramos un conjunto pequeño de lenguas-base
              {` B = {b₁, b₂, …, bₖ}`}, entonces cualquier otra lengua romance se puede
              escribir como v = α₁b₁ + α₂b₂ + … + αₖbₖ. Esto es la «generación lineal de lenguas».
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Referencias */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Investigación de referencia</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <ReferenceItem
              authors="Nerbonne & Heeringa (1997)"
              title="Dialectometry with PCA"
              note="Métrica de distancia dialectal basada en diferencias fonéticas + PCA."
            />
            <ReferenceItem
              authors="Wieling & Nerbonne (2015)"
              title="Clustering dialects with PCA"
              note="Aplicación de PCA a rasgos fonológicos para agrupar dialectos."
            />
            <ReferenceItem
              authors="Jolliffe & Cadima (2016)"
              title="Principal Component Analysis: review"
              note="Revisión moderna de PCA y sus aplicaciones en ciencias."
            />
            <ReferenceItem
              authors="Swadesh (1952)"
              title="Lexico-statistic dating of prehistory"
              note="Lista de 200 palabras estables para comparación lingüística."
            />
            <ReferenceItem
              authors="Dryer & Haspelmath (eds., WALS)"
              title="World Atlas of Language Structures"
              note="Base de datos de rasgos gramaticales de ~2700 lenguas."
            />
            <ReferenceItem
              authors="Moran & McCloy (eds., PHOIBLE 2.0)"
              title="Phonetics Information Base and Lexicon"
              note="Inventario fonológico de ~3000 lenguas, vectorizable."
            />
          </div>
        </CardContent>
      </Card>

      {/* Cómo usar */}
      <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRight className="h-5 w-5" />
            Cómo usar este sistema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="space-y-3 text-sm">
            <StepItem
              n={1}
              title="Piedra Roseta"
              body="Empieza por explorar conceptos paralelos en varias lenguas. Mira los patrones
                    fonéticos (latín AQUA → agua/água/aigua/eau/acqua/apă)."
            />
            <StepItem
              n={2}
              title="Espacio Vectorial"
              body="Visualiza las lenguas como puntos en un plano PCA. Verás cómo el francés se
                    separa del grupo ibérico, y el rumano queda aislado."
            />
            <StepItem
              n={3}
              title="Sintetizador"
              body="Elige lenguas-base y pesos α. El sistema calculará la lengua resultante y te
                    dirá cuánto se parece a cada lengua real."
            />
            <StepItem
              n={4}
              title="Aprender"
              body="Pon a prueba tu comprensión con preguntas de cognados, etimología y detección
                    de intrusos. Cada error refuerza un patrón fonético."
            />
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}

function ConceptCard({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="rounded-lg border bg-background/70 p-4">
      <div className="flex items-center gap-2 mb-2 text-amber-700 dark:text-amber-400">
        {icon}
        <h3 className="font-semibold">{title}</h3>
      </div>
      <p className="text-sm text-muted-foreground">{body}</p>
    </div>
  );
}

function ReferenceItem({ authors, title, note }: { authors: string; title: string; note: string }) {
  return (
    <div className="border-l-2 border-amber-300 dark:border-amber-700 pl-3 py-1">
      <p className="font-medium">{authors}</p>
      <p className="text-muted-foreground italic">{title}</p>
      <p className="text-xs text-muted-foreground mt-1">{note}</p>
    </div>
  );
}

function StepItem({ n, title, body }: { n: number; title: string; body: string }) {
  return (
    <li className="flex gap-3">
      <span className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-sm font-bold">
        {n}
      </span>
      <div>
        <p className="font-semibold">{title}</p>
        <p className="text-muted-foreground">{body}</p>
      </div>
    </li>
  );
}
