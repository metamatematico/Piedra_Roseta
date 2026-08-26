// Lenguas romances con metadatos lingüísticos
// Fuente: Glottolog, WALS, Ethnologue (simplificado para fines didácticos)

export interface LanguageInfo {
  code: string;
  name: string;
  endonym: string; // nombre en la propia lengua
  family: string;
  speakers: string;
  region: string;
  color: string; // para visualizaciones
  flag: string; // emoji bandera principal
  latinVulgarGroup: 'iberian' | 'gallo' | 'italian' | 'eastern' | 'ancestor';
  notes: string;
}

export const LANGUAGES: LanguageInfo[] = [
  {
    code: 'la',
    name: 'Latín',
    endonym: 'Lingua Latina',
    family: 'Indoeuropea · Itálica',
    speakers: '— (lengua extinta como L1)',
    region: 'Imperio Romano',
    color: '#92400e',
    flag: '🏛️',
    latinVulgarGroup: 'ancestor',
    notes: 'Ancestro común (protorromance). Sirve como origen desde el cual se derivan linealmente las demás lenguas.',
  },
  {
    code: 'es',
    name: 'Español',
    endonym: 'Español / Castellano',
    family: 'Indoeuropea · Itálica · Romance',
    speakers: '~560 millones',
    region: 'España, Hispanoamérica',
    color: '#dc2626',
    flag: '🇪🇸',
    latinVulgarGroup: 'iberian',
    notes: 'Romance ibérico occidental. Conserva las cinco vocales del latín vulgar pero simplifica el sistema de casos.',
  },
  {
    code: 'pt',
    name: 'Portugués',
    endonym: 'Português',
    family: 'Indoeuropea · Itálica · Romance',
    speakers: '~280 millones',
    region: 'Portugal, Brasil, África',
    color: '#16a34a',
    flag: '🇵🇹',
    latinVulgarGroup: 'iberian',
    notes: 'Romance ibérico occidental. Conserva nasales y sibilantes que el español perdió.',
  },
  {
    code: 'gl',
    name: 'Gallego',
    endonym: 'Galego',
    family: 'Indoeuropea · Itálica · Romance',
    speakers: '~3 millones',
    region: 'Galicia, España',
    color: '#0891b2',
    flag: '🌊',
    latinVulgarGroup: 'iberian',
    notes: 'Hermano cercano del portugués. Conserva nasales etimológicas en escritura pero no en pronunciación.',
  },
  {
    code: 'ca',
    name: 'Catalán',
    endonym: 'Català',
    family: 'Indoeuropea · Itálica · Romance',
    speakers: '~10 millones',
    region: 'Cataluña, Comunidad Valenciana, Baleares',
    color: '#db2777',
    flag: '🎗️',
    latinVulgarGroup: 'gallo',
    notes: 'Puente entre ibérico y galorromance. Tiene un sistema vocálico completo de 8 vocales tónicas.',
  },
  {
    code: 'oc',
    name: 'Occitano',
    endonym: 'Occitan',
    family: 'Indoeuropea · Itálica · Romance',
    speakers: '~2 millones',
    region: 'Sur de Francia, Valles de Italia',
    color: '#7c3aed',
    flag: '🌼',
    latinVulgarGroup: 'gallo',
    notes: 'Incluye el provenzal. Conserva /ca/ y /ga/ latinas (no palatalizadas como en francés).',
  },
  {
    code: 'fr',
    name: 'Francés',
    endonym: 'Français',
    family: 'Indoeuropea · Itálica · Romance',
    speakers: '~320 millones',
    region: 'Francia, Bélgica, Canadá, África',
    color: '#0ea5e9',
    flag: '🇫🇷',
    latinVulgarGroup: 'gallo',
    notes: 'El más divergente fonéticamente. Perdió acento lexical, palatalizó /ca/ → /ʃa/, desarrolló nasales fonémicas.',
  },
  {
    code: 'it',
    name: 'Italiano',
    endonym: 'Italiano',
    family: 'Indoeuropea · Itálica · Romance',
    speakers: '~85 millones',
    region: 'Italia, Suiza, San Marino',
    color: '#15803d',
    flag: '🇮🇹',
    latinVulgarGroup: 'italian',
    notes: 'Conserva consonantes dobles (geminate) y el sistema vocálico de 7 fonemas. Muy cercano al latín en léxico.',
  },
  {
    code: 'sc',
    name: 'Sardo',
    endonym: 'Sardu',
    family: 'Indoeuropea · Itálica · Romance',
    speakers: '~1 millón',
    region: 'Cerdeña, Italia',
    color: '#a16207',
    flag: '🐴',
    latinVulgarGroup: 'italian',
    notes: 'Considerado el romance más conservador. Conserva /k/ y /g/ ante /e/, /i/ latinas (caelum → kelu).',
  },
  {
    code: 'ro',
    name: 'Rumano',
    endonym: 'Română',
    family: 'Indoeuropea · Itálica · Romance',
    speakers: '~25 millones',
    region: 'Rumania, Moldavia',
    color: '#eab308',
    flag: '🇷🇴',
    latinVulgarGroup: 'eastern',
    notes: 'Romance oriental. Único con caso nominal/neutro plural. Influencia eslava y turca en léxico.',
  },
];

export const getLanguage = (code: string): LanguageInfo => {
  const l = LANGUAGES.find(l => l.code === code);
  if (!l) throw new Error(`Lengua no encontrada: ${code}`);
  return l;
};

export const ROMANCE_LANGUAGES = LANGUAGES.filter(l => l.code !== 'la');
