'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Microscope, BarChart3, Network, Download, Database, TrendingUp, GitCompare, Activity } from 'lucide-react';
import { LANGUAGES, getLanguage } from '@/lib/linguistics/languages';
import { SWADESH } from '@/lib/linguistics/swadesh';
import { FEATURE_MATRIX, PHONETIC_FEATURES } from '@/lib/linguistics/features';
import { computePCA } from '@/lib/linguistics/pca';
import { computeLanguageSimilarity } from '@/lib/linguistics/alignment';
import { AssistantChat } from './assistant-chat';

export function ResearchView() {
  return (
    <div className="space-y-6">
      <Card className="border-2 border-indigo-200 dark:border-indigo-800 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/30 dark:via-purple-950/30 dark:to-pink-950/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Microscope className="h-5 w-5" />
            Laboratorio de Investigación
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Herramientas para investigadores en lingüística comparativa y matemática aplicada.
            Métricas cuantitativas, redes de similitud, análisis de componentes principales,
            y exportación de datos para papers y reproducibilidad.
          </p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="similarity" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
              <TabsTrigger value="similarity" className="gap-1.5 text-xs">
                <Network className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Similitud</span>
              </TabsTrigger>
              <TabsTrigger value="pca" className="gap-1.5 text-xs">
                <BarChart3 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">PCA</span>
              </TabsTrigger>
              <TabsTrigger value="features" className="gap-1.5 text-xs">
                <Activity className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Rasgos</span>
              </TabsTrigger>
              <TabsTrigger value="export" className="gap-1.5 text-xs">
                <Download className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Exportar</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="similarity" className="mt-4">
              <SimilarityTab />
            </TabsContent>
            <TabsContent value="pca" className="mt-4">
              <PcaTab />
            </TabsContent>
            <TabsContent value="features" className="mt-4">
              <FeaturesTab />
            </TabsContent>
            <TabsContent value="export" className="mt-4">
              <ExportTab />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <AssistantChat context={{ tab: 'Investigación' }} />
    </div>
  );
}

// ---------- Tab: Similitud ----------

function SimilarityTab() {
  const [selectedLang, setSelectedLang] = useState<string>('es');

  // Calcular similitud entre todas las parejas de lenguas
  const similarityData = useMemo(() => {
    const pairs: { a: string; b: string; similarity: number }[] = [];
    for (let i = 0; i < LANGUAGES.length; i++) {
      for (let j = i + 1; j < LANGUAGES.length; j++) {
        const la = LANGUAGES[i];
        const lb = LANGUAGES[j];
        const formsA: Record<string, string> = {};
        const formsB: Record<string, string> = {};
        for (const entry of SWADESH) {
          if (la.code === 'la') {
            formsA[entry.id] = entry.latin;
          } else {
            formsA[entry.id] = entry.forms[la.code] ?? '';
          }
          if (lb.code === 'la') {
            formsB[entry.id] = entry.latin;
          } else {
            formsB[entry.id] = entry.forms[lb.code] ?? '';
          }
        }
        const sim = computeLanguageSimilarity(formsA, formsB, la.code, lb.code);
        pairs.push({ a: la.code, b: lb.code, similarity: sim.similarity });
      }
    }
    return pairs.sort((x, y) => y.similarity - x.similarity);
  }, []);

  // Top parejas más similares
  const topSimilar = similarityData.slice(0, 10);
  const topDifferent = similarityData.slice(-10).reverse();

  // Parejas de la lengua seleccionada
  const selectedPairs = similarityData
    .filter(p => p.a === selectedLang || p.b === selectedLang)
    .map(p => ({
      other: p.a === selectedLang ? p.b : p.a,
      similarity: p.similarity,
    }))
    .sort((a, b) => b.similarity - a.similarity);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Network className="h-4 w-4" /> Top 10 lenguas más similares
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Basado en similitud fonética entre {SWADESH.length} conceptos Swadesh, alineados con Needleman-Wunsch.
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {topSimilar.map((p, i) => (
              <PairBar
                key={i}
                rank={i + 1}
                a={p.a}
                b={p.b}
                value={p.similarity}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <GitCompare className="h-4 w-4" /> Similitudes de {getLanguage(selectedLang).name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {LANGUAGES.filter(l => l.code !== 'la').map(lang => (
              <Button
                key={lang.code}
                variant={selectedLang === lang.code ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedLang(lang.code)}
                className="gap-1.5"
              >
                <span>{lang.flag}</span>
                <span className="text-xs">{lang.code.toUpperCase()}</span>
              </Button>
            ))}
          </div>
          <div className="space-y-2">
            {selectedPairs.map((p, i) => (
              <PairBar
                key={i}
                rank={i + 1}
                a={selectedLang}
                b={p.other}
                value={p.similarity}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-4 w-4" /> Top 10 lenguas más divergentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {topDifferent.map((p, i) => (
              <PairBar
                key={i}
                rank={i + 1}
                a={p.a}
                b={p.b}
                value={p.similarity}
                inverted
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function PairBar({
  rank, a, b, value, inverted = false,
}: {
  rank: number; a: string; b: string; value: number; inverted?: boolean;
}) {
  const la = getLanguage(a);
  const lb = getLanguage(b);
  const pct = (value * 100).toFixed(1);
  const color = inverted ? '#dc2626' : '#16a34a';
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-mono w-6 text-muted-foreground">{rank}.</span>
      <div className="flex items-center gap-1.5 w-32">
        <span>{la.flag}</span>
        <span className="text-xs">{la.code.toUpperCase()}</span>
        <span className="text-xs text-muted-foreground">↔</span>
        <span>{lb.flag}</span>
        <span className="text-xs">{lb.code.toUpperCase()}</span>
      </div>
      <div className="flex-1 h-3 bg-muted rounded overflow-hidden">
        <div
          className="h-full transition-all"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <span className="font-mono text-sm w-12 text-right">{pct}%</span>
    </div>
  );
}

// ---------- Tab: PCA ----------

function PcaTab() {
  const pca = useMemo(() => computePCA(), []);
  const topFeatures = pca.featureLoadings
    .map((f, i) => ({ ...f, absLoad: Math.abs(f.pc1) + Math.abs(f.pc2), index: i }))
    .sort((a, b) => b.absLoad - a.absLoad)
    .slice(0, 8);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <BarChart3 className="h-4 w-4" /> Varianza explicada por componente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {['PC1', 'PC2', 'PC3'].map((label, i) => (
              <div key={label}>
                <div className="flex justify-between mb-1">
                  <span className="text-xs font-mono">{label}</span>
                  <span className="text-xs font-mono">
                    {(pca.explainedVariance[i] * 100).toFixed(2)}%
                    <span className="text-muted-foreground ml-2">
                      (acum: {(pca.cumulativeVariance[i] * 100).toFixed(2)}%)
                    </span>
                  </span>
                </div>
                <div className="h-6 bg-muted rounded overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all"
                    style={{ width: `${pca.explainedVariance[i] * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            PC1 + PC2 capturan el {(pca.cumulativeVariance[1] * 100).toFixed(1)}% de la varianza fonética entre las 10 lenguas.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Rasgos que más contribuyen a PC1 y PC2</CardTitle>
          <p className="text-xs text-muted-foreground">
            Los rasgos con mayor |load| determinan la dirección de divergencia fonética.
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {topFeatures.map((f, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                <span className="text-xs font-mono w-6 text-muted-foreground">{i + 1}.</span>
                <span className="flex-1 truncate" title={PHONETIC_FEATURES[f.index].description}>
                  {f.feature}
                </span>
                <div className="flex gap-2 font-mono text-xs">
                  <span className={f.pc1 > 0 ? 'text-emerald-600' : 'text-red-600'}>
                    PC1: {f.pc1.toFixed(3)}
                  </span>
                  <span className={f.pc2 > 0 ? 'text-emerald-600' : 'text-red-600'}>
                    PC2: {f.pc2.toFixed(3)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Coordenadas de cada lengua en PC1/PC2</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {pca.languageVectors.map(lv => {
              const lang = getLanguage(lv.code);
              return (
                <div key={lv.code} className="flex items-center gap-2 text-xs font-mono">
                  <span className="w-16 flex items-center gap-1">
                    {lang.flag} {lv.code.toUpperCase()}
                  </span>
                  <span className="w-20">PC1: {lv.coordinates2D[0].toFixed(3)}</span>
                  <span className="w-20">PC2: {lv.coordinates2D[1].toFixed(3)}</span>
                  <span className="w-20">PC3: {lv.coordinates3D[2].toFixed(3)}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ---------- Tab: Rasgos ----------

function FeaturesTab() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Activity className="h-4 w-4" /> Matriz de rasgos fonológicos
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Cada lengua representada como vector binario de {PHONETIC_FEATURES.length} rasgos.
            Esta es la base matemática del sistema.
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="text-xs">
              <thead>
                <tr>
                  <th className="sticky left-0 bg-background p-2 text-left">Rasgo</th>
                  {LANGUAGES.map(l => (
                    <th key={l.code} className="p-2 text-center">{l.flag}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PHONETIC_FEATURES.map((f, i) => (
                  <tr key={f.id} className="hover:bg-muted/30">
                    <td className="p-2 sticky left-0 bg-background" title={f.description}>
                      {f.name}
                    </td>
                    {LANGUAGES.map(l => {
                      const val = FEATURE_MATRIX[l.code][i];
                      return (
                        <td
                          key={l.code}
                          className="p-2 text-center font-mono"
                          style={{
                            backgroundColor: val >= 0.5
                              ? `rgba(99, 102, 241, ${0.2 + val * 0.5})`
                              : `rgba(239, 68, 68, ${0.05 + (1 - val) * 0.1})`,
                          }}
                        >
                          {val === 1 ? '1' : val === 0 ? '0' : val.toFixed(1)}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Catálogo de rasgos ({PHONETIC_FEATURES.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {PHONETIC_FEATURES.map((f, i) => (
              <div key={f.id} className="rounded border p-2 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold">{f.name}</span>
                  <Badge variant="outline" className="text-xs">{f.category}</Badge>
                </div>
                <p className="text-muted-foreground">{f.description}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Cobertura: {LANGUAGES.filter(l => FEATURE_MATRIX[l.code][i] >= 0.5).length}/{LANGUAGES.length} lenguas
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ---------- Tab: Exportar ----------

function ExportTab() {
  const exportData = (format: 'json' | 'csv' | 'bib') => {
    let content = '';
    let filename = '';
    let mime = '';

    if (format === 'json') {
      const data = {
        meta: {
          version: '6.0',
          authors: 'Leonardo Jiménez Martínez · BIOMAT · con GLM (Z.ai)',
          date: new Date().toISOString(),
          description: 'Sistema Piedra Roseta — datos lingüísticos exportados',
        },
        languages: LANGUAGES,
        phoneticFeatures: PHONETIC_FEATURES,
        featureMatrix: FEATURE_MATRIX,
        swadesh: SWADESH,
      };
      content = JSON.stringify(data, null, 2);
      filename = 'piedra-roseta-datos.json';
      mime = 'application/json';
    } else if (format === 'csv') {
      const header = ['concept_id', 'gloss', 'latin', ...LANGUAGES.map(l => l.code)].join(',');
      const rows = SWADESH.map(e => [
        e.id, e.gloss, e.latin,
        ...LANGUAGES.map(l => l.code === 'la' ? e.latin : (e.forms[l.code] ?? '')),
      ].map(s => `"${String(s).replace(/"/g, '""')}"`).join(','));
      content = [header, ...rows].join('\n');
      filename = 'piedra-roseta-swadesh.csv';
      mime = 'text/csv';
    } else if (format === 'bib') {
      content = `@software{piedra_roseta,
  title = {Sistema Piedra Roseta: álgebra lineal aplicada al aprendizaje de familias lingüísticas},
  author = {Jiménez Martínez, Leonardo and GLM (Z.ai)},
  organization = {Centro de Biomatemáticas BIOMAT},
  year = {2026},
  url = {https://github.com/metamatematico/Piedra_Roseta},
  version = {6.0},
  note = {Sistema interactivo para el aprendizaje de lenguas romances mediante PCA y combinaciones lineales}
}

@article{nerbonne1997,
  author = {Nerbonne, John and Heeringa, Wilbert},
  title = {Measuring Dialect Distance Phonetically},
  year = {1997},
  journal = {ACL Workshop on Computational Phonology}
}

@article{wieling2015,
  author = {Wieling, Martijn and Nerbonne, John},
  title = {Clustering Dialects with PCA},
  year = {2015}
}

@article{jolliffe2016,
  author = {Jolliffe, Ian T. and Cadima, Jorge},
  title = {Principal component analysis: a review and recent developments},
  journal = {Philosophical Transactions of the Royal Society A},
  year = {2016}
}

@misc{wals,
  author = {Dryer, Matthew S. and Haspelmath, Martin},
  title = {The World Atlas of Language Structures Online},
  year = {2013},
  url = {https://wals.info}
}

@misc{phoible,
  author = {Moran, Steven and McCloy, Daniel},
  title = {PHOIBLE 2.0},
  year = {2019},
  url = {https://phoible.org}
}`;
      filename = 'piedra-roseta.bib';
      mime = 'text/x-bibtex';
    }

    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Database className="h-4 w-4" /> Exportar datos para reproducibilidad
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Descarga los datos lingüísticos en formatos estándar para usarlos en tu investigación,
            papers, o herramientas externas (R, Python, Praat, etc.).
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <ExportCard
              title="JSON completo"
              description="Todos los datos (lenguas, rasgos, matriz, Swadesh) en un único JSON."
              format="JSON"
              onClick={() => exportData('json')}
            />
            <ExportCard
              title="CSV (Swadesh)"
              description="Tabla Swadesh lista para Excel, R, pandas. Una fila por concepto."
              format="CSV"
              onClick={() => exportData('csv')}
            />
            <ExportCard
              title="BibTeX"
              description="Referencias bibliográficas del sistema y papers citados."
              format="BibTeX"
              onClick={() => exportData('bib')}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Estadísticas del dataset</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <Stat label="Lenguas" value={LANGUAGES.length.toString()} />
            <Stat label="Conceptos" value={SWADESH.length.toString()} />
            <Stat label="Rasgos fonéticos" value={PHONETIC_FEATURES.length.toString()} />
            <Stat label="Formas léxicas" value={(SWADESH.length * (LANGUAGES.length - 1) + SWADESH.length).toString()} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Cómo citar</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-xs bg-muted/50 p-3 rounded font-mono whitespace-pre-wrap">
{`Jiménez Martínez, L. & GLM (Z.ai). (2026).
Sistema Piedra Roseta: álgebra lineal aplicada al
aprendizaje de familias lingüísticas [software]. v6.0.
Centro de Biomatemáticas BIOMAT.
https://github.com/metamatematico/Piedra_Roseta`}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}

function ExportCard({
  title, description, format, onClick,
}: {
  title: string; description: string; format: string; onClick: () => void;
}) {
  return (
    <div className="rounded border p-3 hover:border-primary transition-colors">
      <div className="flex items-center justify-between mb-2">
        <Badge variant="secondary" className="text-xs font-mono">{format}</Badge>
        <Download className="h-3 w-3 text-muted-foreground" />
      </div>
      <p className="font-medium text-sm mb-1">{title}</p>
      <p className="text-xs text-muted-foreground mb-3">{description}</p>
      <Button size="sm" className="w-full" onClick={onClick}>
        Descargar
      </Button>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border p-3 bg-muted/30">
      <p className="text-2xl font-bold font-mono">{value}</p>
      <p className="text-xs text-muted-foreground uppercase tracking-wide">{label}</p>
    </div>
  );
}
