// Lista de Swadesh reducida — 40 conceptos básicos en 10 lenguas romances + latín
// Fuentes: comparación de léxicos etimológicos (REW, DCECH, TLFI) — versión simplificada
// para fines didácticos. Cada cognado comparte raíz latina común.

export interface SwadeshEntry {
  id: string;
  gloss: string;      // glosa en español
  english: string;    // glosa en inglés (referencia)
  latin: string;
  forms: Record<string, string>; // code -> forma
  etymon: string;     // raíz latina
  semanticField: string;
}

export const SWADESH: SwadeshEntry[] = [
  // Pronombres y demostrativos
  {
    id: 'I', gloss: 'yo', english: 'I',
    latin: 'ego',
    forms: { es: 'yo', pt: 'eu', gl: 'eu', ca: 'jo', oc: 'ieu', fr: 'je', it: 'io', sc: 'eo', ro: 'eu' },
    etymon: 'EGO',
    semanticField: 'pronombres',
  },
  {
    id: 'you', gloss: 'tú', english: 'thou',
    latin: 'tu',
    forms: { es: 'tú', pt: 'tu', gl: 'ti', ca: 'tu', oc: 'tu', fr: 'tu', it: 'tu', sc: 'tu', ro: 'tu' },
    etymon: 'TU',
    semanticField: 'pronombres',
  },
  {
    id: 'we', gloss: 'nosotros', english: 'we',
    latin: 'nos',
    forms: { es: 'nosotros', pt: 'nós', gl: 'nós', ca: 'nosaltres', oc: 'nosautres', fr: 'nous', it: 'noi', sc: 'nois', ro: 'noi' },
    etymon: 'NOS',
    semanticField: 'pronombres',
  },
  {
    id: 'this', gloss: 'esto', english: 'this',
    latin: 'iste / hoc',
    forms: { es: 'esto', pt: 'isto', gl: 'isto', ca: 'això', oc: 'aquò', fr: 'ceci', it: 'questo', sc: 'custu', ro: 'acesta' },
    etymon: 'ISTE / HOC',
    semanticField: 'pronombres',
  },
  {
    id: 'who', gloss: 'quién', english: 'who',
    latin: 'quis',
    forms: { es: 'quién', pt: 'quem', gl: 'quen', ca: 'qui', oc: 'qui', fr: 'qui', it: 'chi', sc: 'ite', ro: 'cine' },
    etymon: 'QUIS',
    semanticField: 'pronombres',
  },
  {
    id: 'what', gloss: 'qué', english: 'what',
    latin: 'quid',
    forms: { es: 'qué', pt: 'que', gl: 'que', ca: 'què', oc: 'qué', fr: 'que', it: 'che', sc: 'ite', ro: 'ce' },
    etymon: 'QUID',
    semanticField: 'pronombres',
  },

  // Números
  {
    id: 'one', gloss: 'uno', english: 'one',
    latin: 'unus',
    forms: { es: 'uno', pt: 'um', gl: 'un', ca: 'un', oc: 'un', fr: 'un', it: 'uno', sc: 'unu', ro: 'un' },
    etymon: 'UNUS',
    semanticField: 'números',
  },
  {
    id: 'two', gloss: 'dos', english: 'two',
    latin: 'duo',
    forms: { es: 'dos', pt: 'dois', gl: 'dous', ca: 'dos', oc: 'dos', fr: 'deux', it: 'due', sc: 'duos', ro: 'doi' },
    etymon: 'DUO',
    semanticField: 'números',
  },
  {
    id: 'three', gloss: 'tres', english: 'three',
    latin: 'tres',
    forms: { es: 'tres', pt: 'três', gl: 'tres', ca: 'tres', oc: 'tres', fr: 'trois', it: 'tre', sc: 'tres', ro: 'trei' },
    etymon: 'TRES',
    semanticField: 'números',
  },
  {
    id: 'five', gloss: 'cinco', english: 'five',
    latin: 'quinque',
    forms: { es: 'cinco', pt: 'cinco', gl: 'cinco', ca: 'cinc', oc: 'cinc', fr: 'cinq', it: 'cinque', sc: 'chimbe', ro: 'cinci' },
    etymon: 'QUINQUE',
    semanticField: 'números',
  },

  // Adjetivos
  {
    id: 'big', gloss: 'grande', english: 'big',
    latin: 'magnus',
    forms: { es: 'grande', pt: 'grande', gl: 'grande', ca: 'gran', oc: 'gran', fr: 'grand', it: 'grande', sc: 'mannu', ro: 'mare' },
    etymon: 'MAGNUS / GRANDIS',
    semanticField: 'adjetivos',
  },
  {
    id: 'small', gloss: 'pequeño', english: 'small',
    latin: 'parvus',
    forms: { es: 'pequeño', pt: 'pequeno', gl: 'pequeno', ca: 'petit', oc: 'pichon', fr: 'petit', it: 'piccolo', sc: 'minore', ro: 'mic' },
    etymon: 'PARVUS / PETITUS',
    semanticField: 'adjetivos',
  },
  {
    id: 'long', gloss: 'largo', english: 'long',
    latin: 'longus',
    forms: { es: 'largo', pt: 'longo', gl: 'longo', ca: 'llarg', oc: 'long', fr: 'long', it: 'lungo', sc: 'longu', ro: 'lung' },
    etymon: 'LONGUS',
    semanticField: 'adjetivos',
  },
  {
    id: 'good', gloss: 'bueno', english: 'good',
    latin: 'bonus',
    forms: { es: 'bueno', pt: 'bom', gl: 'bo', ca: 'bo', oc: 'bon', fr: 'bon', it: 'buono', sc: 'bonu', ro: 'bun' },
    etymon: 'BONUS',
    semanticField: 'adjetivos',
  },

  // Sustantivos — naturaleza
  {
    id: 'sun', gloss: 'sol', english: 'sun',
    latin: 'sol',
    forms: { es: 'sol', pt: 'sol', gl: 'sol', ca: 'sol', oc: 'solelh', fr: 'soleil', it: 'sole', sc: 'sole', ro: 'soare' },
    etymon: 'SOL',
    semanticField: 'naturaleza',
  },
  {
    id: 'moon', gloss: 'luna', english: 'moon',
    latin: 'luna',
    forms: { es: 'luna', pt: 'lua', gl: 'lúa', ca: 'lluna', oc: 'luna', fr: 'lune', it: 'luna', sc: 'luna', ro: 'lună' },
    etymon: 'LUNA',
    semanticField: 'naturaleza',
  },
  {
    id: 'star', gloss: 'estrella', english: 'star',
    latin: 'stella',
    forms: { es: 'estrella', pt: 'estrela', gl: 'estrela', ca: 'estrella', oc: 'estela', fr: 'étoile', it: 'stella', sc: 'istedda', ro: 'stea' },
    etymon: 'STELLA',
    semanticField: 'naturaleza',
  },
  {
    id: 'water', gloss: 'agua', english: 'water',
    latin: 'aqua',
    forms: { es: 'agua', pt: 'água', gl: 'auga', ca: 'aigua', oc: 'aiga', fr: 'eau', it: 'acqua', sc: 'abba', ro: 'apă' },
    etymon: 'AQUA',
    semanticField: 'naturaleza',
  },
  {
    id: 'fire', gloss: 'fuego', english: 'fire',
    latin: 'focus',
    forms: { es: 'fuego', pt: 'fogo', gl: 'fogo', ca: 'foc', oc: 'fuòc', fr: 'feu', it: 'fuoco', sc: 'fogu', ro: 'foc' },
    etymon: 'FOCUS',
    semanticField: 'naturaleza',
  },
  {
    id: 'earth', gloss: 'tierra', english: 'earth',
    latin: 'terra',
    forms: { es: 'tierra', pt: 'terra', gl: 'terra', ca: 'terra', oc: 'tèrra', fr: 'terre', it: 'terra', sc: 'terra', ro: 'pământ' },
    etymon: 'TERRA',
    semanticField: 'naturaleza',
  },
  {
    id: 'stone', gloss: 'piedra', english: 'stone',
    latin: 'petra',
    forms: { es: 'piedra', pt: 'pedra', gl: 'pedra', ca: 'pedra', oc: 'pèira', fr: 'pierre', it: 'pietra', sc: 'pedra', ro: 'piatră' },
    etymon: 'PETRA',
    semanticField: 'naturaleza',
  },
  {
    id: 'tree', gloss: 'árbol', english: 'tree',
    latin: 'arbor',
    forms: { es: 'árbol', pt: 'árvore', gl: 'árbore', ca: 'arbre', oc: 'arbre', fr: 'arbre', it: 'albero', sc: 'àrbore', ro: 'arbore' },
    etymon: 'ARBOR',
    semanticField: 'naturaleza',
  },
  {
    id: 'rain', gloss: 'lluvia', english: 'rain',
    latin: 'pluvia',
    forms: { es: 'lluvia', pt: 'chuva', gl: 'chuvia', ca: 'pluja', oc: 'pluèja', fr: 'pluie', it: 'pioggia', sc: 'proida', ro: 'ploaie' },
    etymon: 'PLUVIA',
    semanticField: 'naturaleza',
  },
  {
    id: 'night', gloss: 'noche', english: 'night',
    latin: 'nox',
    forms: { es: 'noche', pt: 'noite', gl: 'noite', ca: 'nit', oc: 'nuèit', fr: 'nuit', it: 'notte', sc: 'notte', ro: 'noapte' },
    etymon: 'NOX / NOCTEM',
    semanticField: 'naturaleza',
  },
  {
    id: 'mountain', gloss: 'monte', english: 'mountain',
    latin: 'mons',
    forms: { es: 'monte', pt: 'monte', gl: 'monte', ca: 'muntanya', oc: 'montanha', fr: 'montagne', it: 'monte', sc: 'monte', ro: 'munte' },
    etymon: 'MONS / MONTANEA',
    semanticField: 'naturaleza',
  },

  // Sustantivos — animales y personas
  {
    id: 'man', gloss: 'hombre', english: 'man',
    latin: 'homo',
    forms: { es: 'hombre', pt: 'homem', gl: 'home', ca: 'home', oc: 'òme', fr: 'homme', it: 'uomo', sc: 'òmine', ro: 'om' },
    etymon: 'HOMO',
    semanticField: 'personas',
  },
  {
    id: 'woman', gloss: 'mujer', english: 'woman',
    latin: 'mulier',
    forms: { es: 'mujer', pt: 'mulher', gl: 'muller', ca: 'dona', oc: 'femna', fr: 'femme', it: 'donna', sc: 'femina', ro: 'femeie' },
    etymon: 'MULIER / FEMINA',
    semanticField: 'personas',
  },
  {
    id: 'fish', gloss: 'pez', english: 'fish',
    latin: 'piscis',
    forms: { es: 'pez', pt: 'peixe', gl: 'peixe', ca: 'peix', oc: 'peis', fr: 'poisson', it: 'pesce', sc: 'pische', ro: 'pește' },
    etymon: 'PISCIS',
    semanticField: 'animales',
  },
  {
    id: 'bird', gloss: 'pájaro', english: 'bird',
    latin: 'avis / passer',
    forms: { es: 'pájaro', pt: 'pássaro', gl: 'paxaro', ca: 'ocell', oc: 'aucèl', fr: 'oiseau', it: 'uccello', sc: 'puddu', ro: 'pasăre' },
    etymon: 'PASSER / AVICELLUS',
    semanticField: 'animales',
  },
  {
    id: 'dog', gloss: 'perro', english: 'dog',
    latin: 'canis',
    forms: { es: 'perro', pt: 'cão', gl: 'can', ca: 'gos', oc: 'can', fr: 'chien', it: 'cane', sc: 'cane', ro: 'câine' },
    etymon: 'CANIS',
    semanticField: 'animales',
  },

  // Partes del cuerpo
  {
    id: 'hand', gloss: 'mano', english: 'hand',
    latin: 'manus',
    forms: { es: 'mano', pt: 'mão', gl: 'man', ca: 'mà', oc: 'man', fr: 'main', it: 'mano', sc: 'manu', ro: 'mână' },
    etymon: 'MANUS',
    semanticField: 'cuerpo',
  },
  {
    id: 'foot', gloss: 'pie', english: 'foot',
    latin: 'pes / pedem',
    forms: { es: 'pie', pt: 'pé', gl: 'pé', ca: 'peu', oc: 'pè', fr: 'pied', it: 'piede', sc: 'pee', ro: 'picior' },
    etymon: 'PEDEM',
    semanticField: 'cuerpo',
  },
  {
    id: 'heart', gloss: 'corazón', english: 'heart',
    latin: 'cor / cordis',
    forms: { es: 'corazón', pt: 'coração', gl: 'corazón', ca: 'cor', oc: 'còr', fr: 'cœur', it: 'cuore', sc: 'coru', ro: 'inimă' },
    etymon: 'COR / CORDIS',
    semanticField: 'cuerpo',
  },
  {
    id: 'blood', gloss: 'sangre', english: 'blood',
    latin: 'sanguis',
    forms: { es: 'sangre', pt: 'sangue', gl: 'sangue', ca: 'sang', oc: 'sang', fr: 'sang', it: 'sangue', sc: 'sanguine', ro: 'sânge' },
    etymon: 'SANGUIS / SANGUEM',
    semanticField: 'cuerpo',
  },

  // Verbos
  {
    id: 'eat', gloss: 'comer', english: 'eat',
    latin: 'comedere / manducare',
    forms: { es: 'comer', pt: 'comer', gl: 'comer', ca: 'menjar', oc: 'manjar', fr: 'manger', it: 'mangiare', sc: 'pappare', ro: 'mânca' },
    etymon: 'MANDUCARE / COMEDERE',
    semanticField: 'verbos',
  },
  {
    id: 'drink', gloss: 'beber', english: 'drink',
    latin: 'bibere',
    forms: { es: 'beber', pt: 'beber', gl: 'beber', ca: 'beure', oc: 'beure', fr: 'boire', it: 'bere', sc: 'bìere', ro: 'bea' },
    etymon: 'BIBERE',
    semanticField: 'verbos',
  },
  {
    id: 'see', gloss: 'ver', english: 'see',
    latin: 'videre',
    forms: { es: 'ver', pt: 'ver', gl: 'ver', ca: 'veure', oc: 'veire', fr: 'voir', it: 'vedere', sc: 'bìdere', ro: 'vedea' },
    etymon: 'VIDERE',
    semanticField: 'verbos',
  },
  {
    id: 'sleep', gloss: 'dormir', english: 'sleep',
    latin: 'dormire',
    forms: { es: 'dormir', pt: 'dormir', gl: 'dormir', ca: 'dormir', oc: 'dormir', fr: 'dormir', it: 'dormire', sc: 'dormire', ro: 'dormi' },
    etymon: 'DORMIRE',
    semanticField: 'verbos',
  },
  {
    id: 'come', gloss: 'venir', english: 'come',
    latin: 'venire',
    forms: { es: 'venir', pt: 'vir', gl: 'vir', ca: 'venir', oc: 'venir', fr: 'venir', it: 'venire', sc: 'bènnere', ro: 'veni' },
    etymon: 'VENIRE',
    semanticField: 'verbos',
  },
  {
    id: 'die', gloss: 'morir', english: 'die',
    latin: 'mori',
    forms: { es: 'morir', pt: 'morrer', gl: 'morrer', ca: 'morir', oc: 'morir', fr: 'mourir', it: 'morire', sc: 'mòrrere', ro: 'muri' },
    etymon: 'MORI',
    semanticField: 'verbos',
  },
];

export const SEMANTIC_FIELDS = Array.from(new Set(SWADESH.map(e => e.semanticField)));
