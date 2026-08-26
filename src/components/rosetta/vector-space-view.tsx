'use client';

import { useMemo, useState } from 'react';
import { computePCA, PCAResult, euclideanDistance } from '@/lib/linguistics/pca';
import { LANGUAGES, getLanguage } from '@/lib/linguistics/languages';
import { PHONETIC_FEATURES, FEATURE_MATRIX } from '@/lib/linguistics/features';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Box, Sigma, TrendingUp } from 'lucide-react';

export function VectorSpaceView() {
  const pca = useMemo(() => computePCA(), []);
  const [selectedLang, setSelectedLang] = useState<string>('es');
  const [hoveredLang, setHoveredLang] = useState<string | null>(null);

  // Dimensiones del canvas PCA
  const W = 600;
  const H = 480;
  const padding = 60;

  // Encontrar rangos para escalar
  const xs = pca.languageVectors.map(v => v.coordinates2D[0]);
  const ys = pca.languageVectors.map(v => v.coordinates2D[1]);
  const xMin = Math.min(...xs), xMax = Math.max(...xs);
  const yMin = Math.min(...ys), yMax = Math.max(...ys);
  const xPad = (xMax - xMin) * 0.15 || 1;
  const yPad = (yMax - yMin) * 0.15 || 1;

  const xScale = (x: number) =>
    padding + ((x - (xMin - xPad)) / (xMax - xMin + 2 * xPad)) * (W - 2 * padding);
  const yScale = (y: number) =>
    H - padding - ((y - (yMin - yPad)) / (yMax - yMin + 2 * yPad)) * (H - 2 * padding);

  const selectedVec = pca.languageVectors.find(v => v.code === selectedLang);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Box className="h-5 w-5" />
            Espacio Vectorial de Lenguas Romances
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Cada lengua es un <strong>vector</strong> en un espacio de {PHONETIC_FEATURES.length} rasgos
            fonológicos y gramaticales. Aplicando <strong>PCA</strong> (análisis de componentes principales),
            proyectamos ese espacio de alta dimensión a 2D conservando la máxima varianza.
            Los <strong>ejes principales</strong> son las «direcciones de mayor divergencia»
            entre lenguas — análogamente a como en álgebra lineal se elige una base ortogonal
            que mejor explica los datos.
          </p>
        </CardHeader>
        <CardContent>
          {/* Varianza explicada */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <VarianceCard
              pc="PC1"
              value={pca.explainedVariance[0]}
              cumulative={pca.cumulativeVariance[0]}
            />
            <VarianceCard
              pc="PC2"
              value={pca.explainedVariance[1]}
              cumulative={pca.cumulativeVariance[1]}
            />
            <VarianceCard
              pc="PC3"
              value={pca.explainedVariance[2]}
              cumulative={pca.cumulativeVariance[2]}
            />
          </div>

          {/* Gráfico PCA 2D */}
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto border rounded-lg bg-gradient-to-br from-background to-muted/30">
                {/* Ejes */}
                <line
                  x1={padding} y1={H - padding} x2={W - padding} y2={H - padding}
                  className="stroke-border" strokeWidth="1.5"
                />
                <line
                  x1={padding} y1={padding} x2={padding} y2={H - padding}
                  className="stroke-border" strokeWidth="1.5"
                />
                {/* Etiquetas ejes */}
                <text
                  x={W - padding} y={H - padding + 25}
                  className="fill-muted-foreground text-[10px]"
                  textAnchor="end"
                >
                  PC1 → ({(pca.explainedVariance[0] * 100).toFixed(1)}% varianza)
                </text>
                <text
                  x={padding - 10} y={padding - 10}
                  className="fill-muted-foreground text-[10px]"
                  textAnchor="end"
                >
                  ↑ PC2 ({(pca.explainedVariance[1] * 100).toFixed(1)}%)
                </text>
                {/* Origen */}
                <circle cx={xScale(0)} cy={yScale(0)} r="2" className="fill-muted-foreground" />

                {/* Vectores de carga de rasgos (líneas tenues) */}
                {pca.featureLoadings
                  .slice()
                  .sort((a, b) => Math.abs(b.pc1) + Math.abs(b.pc2) - Math.abs(a.pc1) - Math.abs(a.pc2))
                  .slice(0, 6)
                  .map((load, i) => {
                    const mag = Math.sqrt(load.pc1 ** 2 + load.pc2 ** 2);
                    if (mag < 0.05) return null;
                    const scale = 80;
                    const cx = xScale(0) + load.pc1 * scale;
                    const cy = yScale(0) - load.pc2 * scale;
                    return (
                      <g key={i}>
                        <line
                          x1={xScale(0)} y1={yScale(0)} x2={cx} y2={cy}
                          className="stroke-amber-500/40" strokeWidth="1"
                          strokeDasharray="3 2"
                        />
                        <text
                          x={cx + 4} y={cy}
                          className="fill-amber-700 dark:fill-amber-400 text-[8px]"
                        >
                          {load.feature.length > 18
                            ? load.feature.slice(0, 16) + '…'
                            : load.feature}
                        </text>
                      </g>
                    );
                  })}

                {/* Puntos de lenguas */}
                {pca.languageVectors.map(lv => {
                  const lang = getLanguage(lv.code);
                  const x = xScale(lv.coordinates2D[0]);
                  const y = yScale(lv.coordinates2D[1]);
                  const isSelected = lv.code === selectedLang;
                  const isHovered = lv.code === hoveredLang;
                  const r = isSelected ? 12 : isHovered ? 10 : 8;
                  return (
                    <g
                      key={lv.code}
                      onClick={() => setSelectedLang(lv.code)}
                      onMouseEnter={() => setHoveredLang(lv.code)}
                      onMouseLeave={() => setHoveredLang(null)}
                      className="cursor-pointer"
                    >
                      {/* Línea desde origen si seleccionada */}
                      {isSelected && (
                        <line
                          x1={xScale(0)} y1={yScale(0)} x2={x} y2={y}
                          stroke={lang.color} strokeWidth="2"
                          strokeDasharray="2 2"
                        />
                      )}
                      <circle
                        cx={x} cy={y} r={r}
                        fill={lang.color}
                        stroke={isSelected ? 'white' : 'rgba(0,0,0,0.2)'}
                        strokeWidth={isSelected ? 3 : 1}
                        className="transition-all"
                      />
                      <text
                        x={x + r + 4} y={y + 4}
                        className="fill-foreground text-[11px] font-medium pointer-events-none"
                      >
                        {lang.flag} {lang.code.toUpperCase()}
                      </text>
                    </g>
                  );
                })}
              </svg>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Haz clic en un punto para seleccionar la lengua. Las líneas discontinuas ámbar
                muestran los rasgos que más contribuyen a cada eje.
              </p>
            </div>

            {/* Panel lateral: lengua seleccionada */}
            <div className="w-full lg:w-72 space-y-3">
              {selectedVec && <LanguageVectorCard code={selectedVec.code} />}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Matriz de distancias */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sigma className="h-5 w-5" />
            Distancias entre lenguas (||v_i − v_j||)
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            La distancia euclidiana en el espacio de rasgos mide cuán diferentes
            son dos lenguas fonológicamente. Cuanto menor la distancia, más cercanas
            en la «filogenia lingüística».
          </p>
        </CardHeader>
        <CardContent>
          <DistanceMatrix selected={selectedLang} onSelect={setSelectedLang} />
        </CardContent>
      </Card>
    </div>
  );
}

function VarianceCard({
  pc, value, cumulative,
}: {
  pc: string; value: number; cumulative: number;
}) {
  return (
    <div className="border rounded-lg p-3 bg-muted/30">
      <div className="flex items-center gap-2 mb-1">
        <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-xs font-semibold uppercase tracking-wide">{pc}</span>
      </div>
      <p className="text-2xl font-bold font-mono">
        {(value * 100).toFixed(1)}%
      </p>
      <p className="text-xs text-muted-foreground">
        acum. {(cumulative * 100).toFixed(1)}%
      </p>
    </div>
  );
}

function LanguageVectorCard({ code }: { code: string }) {
  const lang = getLanguage(code);
  const features = FEATURE_MATRIX[code];

  return (
    <Card className="border-l-4" style={{ borderLeftColor: lang.color }}>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{lang.flag}</span>
          <div>
            <CardTitle className="text-base">{lang.name}</CardTitle>
            <p className="text-xs text-muted-foreground italic">{lang.endonym}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-xs text-muted-foreground">{lang.notes}</p>
        <div>
          <p className="text-xs font-semibold uppercase mb-2 text-muted-foreground">
            Vector de rasgos ({features.length}D)
          </p>
          <ScrollArea className="h-48 rounded border bg-background p-2">
            <div className="space-y-1.5">
              {PHONETIC_FEATURES.map((f, i) => (
                <div key={f.id} className="flex items-center gap-2">
                  <span
                    className="font-mono text-xs w-5 h-5 flex items-center justify-center rounded"
                    style={{
                      backgroundColor: features[i] >= 0.5 ? lang.color : 'transparent',
                      color: features[i] >= 0.5 ? 'white' : 'inherit',
                      border: `1px solid ${lang.color}`,
                      opacity: 0.3 + features[i] * 0.7,
                    }}
                  >
                    {features[i] === 1 ? '1' : features[i] === 0 ? '0' : features[i].toFixed(1)}
                  </span>
                  <span className="text-xs flex-1 truncate" title={f.description}>
                    {f.name}
                  </span>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}

function DistanceMatrix({
  selected, onSelect,
}: {
  selected: string;
  onSelect: (code: string) => void;
}) {
  const codes = LANGUAGES.map(l => l.code);

  return (
    <div className="overflow-x-auto">
      <table className="text-xs w-full">
        <thead>
          <tr>
            <th className="p-1.5 text-left sticky left-0 bg-background"></th>
            {codes.map(c => (
              <th
                key={c}
                className="p-1.5 text-center font-mono cursor-pointer hover:bg-muted"
                onClick={() => onSelect(c)}
              >
                {c.toUpperCase()}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {codes.map(rowCode => {
            const rowLang = getLanguage(rowCode);
            return (
              <tr key={rowCode}>
                <td
                  className="p-1.5 sticky left-0 bg-background cursor-pointer hover:bg-muted font-medium flex items-center gap-1"
                  onClick={() => onSelect(rowCode)}
                >
                  <span>{rowLang.flag}</span>
                  <span className="font-mono">{rowCode.toUpperCase()}</span>
                </td>
                {codes.map(colCode => {
                  if (rowCode === colCode) {
                    return (
                      <td key={colCode} className="p-1.5 text-center font-mono text-muted-foreground">
                        —
                      </td>
                    );
                  }
                  const d = euclideanDistance(
                    FEATURE_MATRIX[rowCode],
                    FEATURE_MATRIX[colCode]
                  );
                  const isSelected = rowCode === selected || colCode === selected;
                  const opacity = 1 - Math.min(1, d / 3);
                  return (
                    <td
                      key={colCode}
                      className={`p-1.5 text-center font-mono cursor-pointer transition-colors ${
                        isSelected ? 'font-bold' : ''
                      }`}
                      style={{
                        backgroundColor: `rgba(120, 80, 40, ${opacity * 0.4})`,
                      }}
                      onClick={() => onSelect(rowCode)}
                      title={`${rowLang.name} ↔ ${getLanguage(colCode).name}: ${d.toFixed(3)}`}
                    >
                      {d.toFixed(2)}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
