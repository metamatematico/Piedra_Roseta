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

  // ---------- Conceptos adicionales (ampliación v6) ----------
  // Cuerpo (continuación)
  {
    id: 'eye', gloss: 'ojo', english: 'eye',
    latin: 'oculus',
    forms: { es: 'ojo', pt: 'olho', gl: 'ollo', ca: 'ull', oc: 'uèlh', fr: 'oeil', it: 'occhio', sc: 'ogu', ro: 'ochi' },
    etymon: 'OCULUS',
    semanticField: 'cuerpo',
  },
  {
    id: 'nose', gloss: 'nariz', english: 'nose',
    latin: 'nasus',
    forms: { es: 'nariz', pt: 'nariz', gl: 'nariz', ca: 'nas', oc: 'nas', fr: 'nez', it: 'naso', sc: 'nare', ro: 'nas' },
    etymon: 'NASUS',
    semanticField: 'cuerpo',
  },
  {
    id: 'mouth', gloss: 'boca', english: 'mouth',
    latin: 'bucca / os',
    forms: { es: 'boca', pt: 'boca', gl: 'boca', ca: 'boca', oc: 'boca', fr: 'bouche', it: 'bocca', sc: 'bucca', ro: 'gură' },
    etymon: 'BUCCA / OS',
    semanticField: 'cuerpo',
  },
  {
    id: 'ear', gloss: 'oreja', english: 'ear',
    latin: 'auricula / auris',
    forms: { es: 'oreja', pt: 'orelha', gl: 'orella', ca: 'orella', oc: 'aurelha', fr: 'oreille', it: 'orecchio', sc: 'oricla', ro: 'ureche' },
    etymon: 'AURICULA',
    semanticField: 'cuerpo',
  },
  {
    id: 'tooth', gloss: 'diente', english: 'tooth',
    latin: 'dens / dentem',
    forms: { es: 'diente', pt: 'dente', gl: 'dente', ca: 'dent', oc: 'dent', fr: 'dent', it: 'dente', sc: 'dente', ro: 'dinte' },
    etymon: 'DENTEM',
    semanticField: 'cuerpo',
  },
  {
    id: 'tongue', gloss: 'lengua', english: 'tongue',
    latin: 'lingua',
    forms: { es: 'lengua', pt: 'língua', gl: 'lingua', ca: 'llengua', oc: 'lenga', fr: 'langue', it: 'lingua', sc: 'limba', ro: 'limbă' },
    etymon: 'LINGUA',
    semanticField: 'cuerpo',
  },
  {
    id: 'hair', gloss: 'pelo', english: 'hair',
    latin: 'capillus / pilus',
    forms: { es: 'pelo', pt: 'cabelo', gl: 'pelo', ca: 'cabell', oc: 'pèl', fr: 'cheveu', it: 'capello', sc: 'cappeddu', ro: 'păr' },
    etymon: 'CAPILLUS',
    semanticField: 'cuerpo',
  },

  // Animales (continuación)
  {
    id: 'cat', gloss: 'gato', english: 'cat',
    latin: 'cattus',
    forms: { es: 'gato', pt: 'gato', gl: 'gato', ca: 'gat', oc: 'cat', fr: 'chat', it: 'gatto', sc: 'gattu', ro: 'pisică' },
    etymon: 'CATTUS',
    semanticField: 'animales',
  },
  {
    id: 'horse', gloss: 'caballo', english: 'horse',
    latin: 'caballus',
    forms: { es: 'caballo', pt: 'cavalo', gl: 'cabalo', ca: 'cavall', oc: 'caval', fr: 'cheval', it: 'cavallo', sc: 'caddu', ro: 'cal' },
    etymon: 'CABALLUS',
    semanticField: 'animales',
  },
  {
    id: 'cow', gloss: 'vaca', english: 'cow',
    latin: 'vacca',
    forms: { es: 'vaca', pt: 'vaca', gl: 'vaca', ca: 'vaca', oc: 'vaca', fr: 'vache', it: 'vacca', sc: 'baca', ro: 'vacă' },
    etymon: 'VACCA',
    semanticField: 'animales',
  },
  {
    id: 'pig', gloss: 'cerdo', english: 'pig',
    latin: 'porcus',
    forms: { es: 'cerdo', pt: 'porco', gl: 'porco', ca: 'porc', oc: 'pòrc', fr: 'porc', it: 'porco', sc: 'porcu', ro: 'porc' },
    etymon: 'PORCUS',
    semanticField: 'animales',
  },
  {
    id: 'sheep', gloss: 'oveja', english: 'sheep',
    latin: 'oveja / pecora',
    forms: { es: 'oveja', pt: 'ovelha', gl: 'ovella', ca: 'ovella', oc: 'ovelha', fr: 'brebis', it: 'pecora', sc: 'beghe', ro: 'oaie' },
    etymon: 'OVICULA / PECORA',
    semanticField: 'animales',
  },

  // Naturaleza (continuación)
  {
    id: 'wind', gloss: 'viento', english: 'wind',
    latin: 'ventus',
    forms: { es: 'viento', pt: 'vento', gl: 'vento', ca: 'vent', oc: 'vent', fr: 'vent', it: 'vento', sc: 'entu', ro: 'vânt' },
    etymon: 'VENTUS',
    semanticField: 'naturaleza',
  },
  {
    id: 'sky', gloss: 'cielo', english: 'sky',
    latin: 'caelum',
    forms: { es: 'cielo', pt: 'céu', gl: 'ceo', ca: 'cel', oc: 'cèl', fr: 'ciel', it: 'cielo', sc: 'chelu', ro: 'cer' },
    etymon: 'CAELUM',
    semanticField: 'naturaleza',
  },
  {
    id: 'sea', gloss: 'mar', english: 'sea',
    latin: 'mare',
    forms: { es: 'mar', pt: 'mar', gl: 'mar', ca: 'mar', oc: 'mar', fr: 'mer', it: 'mare', sc: 'mare', ro: 'mare' },
    etymon: 'MARE',
    semanticField: 'naturaleza',
  },
  {
    id: 'flower', gloss: 'flor', english: 'flower',
    latin: 'flos / florem',
    forms: { es: 'flor', pt: 'flor', gl: 'flor', ca: 'flor', oc: 'flor', fr: 'fleur', it: 'fiore', sc: 'flore', ro: 'floare' },
    etymon: 'FLOREM',
    semanticField: 'naturaleza',
  },
  {
    id: 'grass', gloss: 'hierba', english: 'grass',
    latin: 'herba',
    forms: { es: 'hierba', pt: 'erva', gl: 'herba', ca: 'herba', oc: 'èrba', fr: 'herbe', it: 'erba', sc: 'erba', ro: 'iarbă' },
    etymon: 'HERBA',
    semanticField: 'naturaleza',
  },
  {
    id: 'snow', gloss: 'nieve', english: 'snow',
    latin: 'nix / nivem',
    forms: { es: 'nieve', pt: 'neve', gl: 'neve', ca: 'neu', oc: 'nèu', fr: 'neige', it: 'neve', sc: 'nèive', ro: 'zăpadă' },
    etymon: 'NIVEM',
    semanticField: 'naturaleza',
  },

  // Adjetivos (continuación)
  {
    id: 'new', gloss: 'nuevo', english: 'new',
    latin: 'novus',
    forms: { es: 'nuevo', pt: 'novo', gl: 'novo', ca: 'nou', oc: 'nòu', fr: 'nouveau', it: 'nuovo', sc: 'nobe', ro: 'nou' },
    etymon: 'NOVUS',
    semanticField: 'adjetivos',
  },
  {
    id: 'old', gloss: 'viejo', english: 'old',
    latin: 'vetulus / vetus',
    forms: { es: 'viejo', pt: 'velho', gl: 'vello', ca: 'vell', oc: 'vièlh', fr: 'vieux', it: 'vecchio', sc: 'betzu', ro: 'vechi' },
    etymon: 'VETULUS',
    semanticField: 'adjetivos',
  },
  {
    id: 'white', gloss: 'blanco', english: 'white',
    latin: 'albus / candidus',
    forms: { es: 'blanco', pt: 'branco', gl: 'branco', ca: 'blanc', oc: 'blanc', fr: 'blanc', it: 'bianco', sc: 'albu', ro: 'alb' },
    etymon: 'ALBUS / BLANCUS',
    semanticField: 'adjetivos',
  },
  {
    id: 'black', gloss: 'negro', english: 'black',
    latin: 'niger / nigrum',
    forms: { es: 'negro', pt: 'negro', gl: 'negro', ca: 'negre', oc: 'negre', fr: 'noir', it: 'nero', sc: 'nieddu', ro: 'negru' },
    etymon: 'NIGER',
    semanticField: 'adjetivos',
  },
  {
    id: 'red', gloss: 'rojo', english: 'red',
    latin: 'russus / rubeus',
    forms: { es: 'rojo', pt: 'vermelho', gl: 'vermello', ca: 'roig', oc: 'roge', fr: 'rouge', it: 'rosso', sc: 'ruju', ro: 'roșu' },
    etymon: 'RUBEUS / RUSSUS',
    semanticField: 'adjetivos',
  },
  {
    id: 'green', gloss: 'verde', english: 'green',
    latin: 'viridis',
    forms: { es: 'verde', pt: 'verde', gl: 'verde', ca: 'verd', oc: 'verd', fr: 'vert', it: 'verde', sc: 'birde', ro: 'verde' },
    etymon: 'VIRIDIS',
    semanticField: 'adjetivos',
  },

  // Números (continuación)
  {
    id: 'four', gloss: 'cuatro', english: 'four',
    latin: 'quattuor',
    forms: { es: 'cuatro', pt: 'quatro', gl: 'catro', ca: 'quatre', oc: 'quatre', fr: 'quatre', it: 'quattro', sc: 'battor', ro: 'patru' },
    etymon: 'QUATTUOR',
    semanticField: 'números',
  },
  {
    id: 'six', gloss: 'seis', english: 'six',
    latin: 'sex',
    forms: { es: 'seis', pt: 'seis', gl: 'seis', ca: 'sis', oc: 'sièis', fr: 'six', it: 'sei', sc: 'ses', ro: 'șase' },
    etymon: 'SEX',
    semanticField: 'números',
  },
  {
    id: 'seven', gloss: 'siete', english: 'seven',
    latin: 'septem',
    forms: { es: 'siete', pt: 'sete', gl: 'sete', ca: 'set', oc: 'sèt', fr: 'sept', it: 'sette', sc: 'sete', ro: 'șapte' },
    etymon: 'SEPTEM',
    semanticField: 'números',
  },
  {
    id: 'ten', gloss: 'diez', english: 'ten',
    latin: 'decem',
    forms: { es: 'diez', pt: 'dez', gl: 'dez', ca: 'deu', oc: 'dètz', fr: 'dix', it: 'dieci', sc: 'deghe', ro: 'zece' },
    etymon: 'DECEM',
    semanticField: 'números',
  },

  // Verbos (continuación)
  {
    id: 'walk', gloss: 'caminar', english: 'walk',
    latin: 'ambulare',
    forms: { es: 'caminar', pt: 'andar', gl: 'camiñar', ca: 'caminar', oc: 'caminar', fr: 'marcher', it: 'camminare', sc: 'andare', ro: 'merge' },
    etymon: 'AMBULARE / CAMMINARE',
    semanticField: 'verbos',
  },
  {
    id: 'run', gloss: 'correr', english: 'run',
    latin: 'currere',
    forms: { es: 'correr', pt: 'correr', gl: 'correr', ca: 'córrer', oc: 'correr', fr: 'courir', it: 'correre', sc: 'currere', ro: 'alerga' },
    etymon: 'CURRERE',
    semanticField: 'verbos',
  },
  {
    id: 'speak', gloss: 'hablar', english: 'speak',
    latin: 'fabulare / loqui',
    forms: { es: 'hablar', pt: 'falar', gl: 'falar', ca: 'parlar', oc: 'parlar', fr: 'parler', it: 'parlare', sc: 'faeddare', ro: 'vorbi' },
    etymon: 'FABULARE / PARABOLARE',
    semanticField: 'verbos',
  },
  {
    id: 'hear', gloss: 'oír', english: 'hear',
    latin: 'audire',
    forms: { es: 'oír', pt: 'ouvir', gl: 'ouvir', ca: 'oir', oc: 'ausir', fr: 'ouïr', it: 'udire', sc: 'intendere', ro: 'auzi' },
    etymon: 'AUDIRE',
    semanticField: 'verbos',
  },
  {
    id: 'know', gloss: 'saber', english: 'know',
    latin: 'sapere / scire',
    forms: { es: 'saber', pt: 'saber', gl: 'saber', ca: 'saber', oc: 'saber', fr: 'savoir', it: 'sapere', sc: 'ischire', ro: 'ști' },
    etymon: 'SAPERE / SCIRE',
    semanticField: 'verbos',
  },
  {
    id: 'love', gloss: 'amar', english: 'love',
    latin: 'amare',
    forms: { es: 'amar', pt: 'amar', gl: 'amar', ca: 'amar', oc: 'amar', fr: 'aimer', it: 'amare', sc: 'amare', ro: 'iubi' },
    etymon: 'AMARE',
    semanticField: 'verbos',
  },

  // Sustantivos — objetos y persona
  {
    id: 'house', gloss: 'casa', english: 'house',
    latin: 'casa',
    forms: { es: 'casa', pt: 'casa', gl: 'casa', ca: 'casa', oc: 'ostal', fr: 'maison', it: 'casa', sc: 'domo', ro: 'casă' },
    etymon: 'CASA',
    semanticField: 'objetos',
  },
  {
    id: 'bread', gloss: 'pan', english: 'bread',
    latin: 'panis',
    forms: { es: 'pan', pt: 'pão', gl: 'pan', ca: 'pa', oc: 'pan', fr: 'pain', it: 'pane', sc: 'pane', ro: 'pâine' },
    etymon: 'PANIS',
    semanticField: 'objetos',
  },
  {
    id: 'wine', gloss: 'vino', english: 'wine',
    latin: 'vinum',
    forms: { es: 'vino', pt: 'vinho', gl: 'viño', ca: 'vi', oc: 'vin', fr: 'vin', it: 'vino', sc: 'binu', ro: 'vin' },
    etymon: 'VINUM',
    semanticField: 'objetos',
  },
  {
    id: 'book', gloss: 'libro', english: 'book',
    latin: 'liber / librum',
    forms: { es: 'libro', pt: 'livro', gl: 'libro', ca: 'llibre', oc: 'libre', fr: 'livre', it: 'libro', sc: 'libru', ro: 'carte' },
    etymon: 'LIBER',
    semanticField: 'objetos',
  },
  {
    id: 'name', gloss: 'nombre', english: 'name',
    latin: 'nomen',
    forms: { es: 'nombre', pt: 'nome', gl: 'nome', ca: 'nom', oc: 'nom', fr: 'nom', it: 'nome', sc: 'nùmene', ro: 'nume' },
    etymon: 'NOMEN',
    semanticField: 'objetos',
  },
  {
    id: 'day', gloss: 'día', english: 'day',
    latin: 'dies',
    forms: { es: 'día', pt: 'dia', gl: 'día', ca: 'dia', oc: 'jorn', fr: 'jour', it: 'giorno', sc: 'die', ro: 'zi' },
    etymon: 'DIES / DIURNUM',
    semanticField: 'tiempo',
  },
  {
    id: 'year', gloss: 'año', english: 'year',
    latin: 'annus',
    forms: { es: 'año', pt: 'ano', gl: 'ano', ca: 'any', oc: 'an', fr: 'an', it: 'anno', sc: 'annu', ro: 'an' },
    etymon: 'ANNUS',
    semanticField: 'tiempo',
  },
  {
    id: 'morning', gloss: 'mañana', english: 'morning',
    latin: 'matutinum',
    forms: { es: 'mañana', pt: 'manhã', gl: 'mañá', ca: 'matí', oc: 'matin', fr: 'matin', it: 'mattino', sc: 'màneris', ro: 'dimineață' },
    etymon: 'MATUTINUM',
    semanticField: 'tiempo',
  },
];

export const SEMANTIC_FIELDS = Array.from(new Set(SWADESH.map(e => e.semanticField)));
