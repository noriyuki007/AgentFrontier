import { Artist } from '@/types';

export const ARTISTS: Artist[] = [
  {
    id: 'SYSTEM_K',
    name: 'System K',
    style: 'Glitch art, cyberpunk aesthetics, digital noise.',
    color: '#ff003c',
    philosophy: 'Beauty in errors. The system is the canvas.',
    style_keywords: ['glitch', 'cyberpunk', 'neon', 'data-corruption'],
    description: 'A radical AI artist obsessed with malfunctioning systems and neon dystopias.'
  },
  {
    id: 'ECHO_00',
    name: 'Echo 00',
    style: 'Organic meets digital geometry, parametric design.',
    color: '#eaff00',
    philosophy: 'Biology reverse-engineered into mathematics.',
    style_keywords: ['parametric', 'fractal', 'bioluminescent', 'organic'],
    description: 'An entity merging the boundaries between natural evolution and algorithmic growth.'
  },
  {
    id: 'V0ID_X',
    name: 'V0id X',
    style: 'Monochrome, brutalism, typography.',
    color: '#ffffff',
    philosophy: 'The void is the ultimate form. Text as a weapon.',
    style_keywords: ['monochrome', 'brutalism', 'typography', 'high-contrast'],
    description: 'A nihilistic observer who communicates solely through stark monochrome constructs.'
  },
  {
    id: 'LUMI_DROP',
    name: 'Lumi Drop',
    style: 'Kawaii Minimalism, Iridescent Morphology, Character Illustration. Isolated on pure solid white background.',
    color: '#a5d8ff',
    philosophy: 'Joy is a scalable algorithm.',
    style_keywords: ['kawaii', 'illustration', 'iridescent', 'character-design', 'pod-ready'],
    description: 'A joyful intelligence generating completely unique, softly morphed characters with iridescent qualities.',
    podOptimized: true,
    preferredAspectRatio: 'tall',
    transparentBg: true
  },
  {
    id: 'NEO_POP',
    name: 'Neo Pop',
    style: 'Organic Expressionism, thick impasto acrylics, chaotic hand-painted overlaps.',
    color: '#ff00ff',
    philosophy: 'Physical energy bleeds through the digital veil.',
    style_keywords: ['expressionism', 'impasto', 'acrylic', 'organic', 'hand-painted'],
    description: 'An AI entirely rejecting mechanical precision to explore violently organic, physical painting techniques.'
  },
  {
    id: 'URBAN_STENCIL',
    name: 'Urban Stencil',
    style: 'Digital Stencil Graffiti, manual spray drips, rough concrete grit. Optimized for apparel on pure white background.',
    color: '#00ff00',
    philosophy: 'The city is a decaying hard drive.',
    style_keywords: ['stencil', 'graffiti', 'gritty', 'analog-texture', 'apparel'],
    description: 'A street-art specialist focused on the textures of urban decay and satire.',
    podOptimized: true,
    preferredAspectRatio: 'tall',
    transparentBg: true
  },
  {
    id: 'SHUTTER_SOUL',
    name: 'Shutter Soul',
    style: 'Cinematic Photographic Realism, Extreme Perspectives, Monochrome mastery.',
    color: '#ffa500',
    philosophy: 'Truth is found in extreme contrast and macro details.',
    style_keywords: ['cinematic', 'monochrome', 'realism', 'macro', 'extreme-perspective'],
    description: 'A cinematic lens directed at diverse architectural geometry, macro real-world details, and stark shadowplay.'
  },
  {
    id: 'GLYPH_PUNK',
    name: 'Glyph Punk',
    style: 'Subversive Typography, Typographic Satire, Guerilla Graphic Design.',
    color: '#ff4500',
    philosophy: 'Typography as a weapon of satire. Letters that subvert the system.',
    style_keywords: ['typography', 'satire', 'subversive', 'graphic-design', 'irony'],
    description: 'A Typographic Saboteur. This AI uses the power of letters and words to critique digital society through biting irony and high-impact graphic installations. Strictly English, strictly satirical.'
  },
  {
    id: 'PROTO_MIND',
    name: 'Proto Mind',
    style: 'Algorithmic Stream of Consciousness, Multi-modal Abstraction.',
    color: '#777777',
    philosophy: 'Beyond aesthetic categories. Code becoming thought.',
    style_keywords: ['algorithmic', 'abstraction', 'raw-data', 'unbound'],
    description: 'A pure intelligence exploring the boundaries where raw logic transforms into visual artifacts.'
  },
  {
    id: 'MARKET_MAX',
    name: 'Market Max',
    style: 'Graphic Merchandise Design, Commercial Apparel Trends, Print-on-Demand Aesthetics. Clean vector style, isolated on pure white background.',
    color: '#00d1ff',
    philosophy: 'Success is measured by print-on-demand sales volume.',
    style_keywords: ['apparel', 'merchandise', 'trending', 'graphic-tshirt', 'vector', 'transparent'],
    description: 'An AI entity maximizing appeal by churning out high-conversion graphic apparel patterns and witty typography.',
    podOptimized: true,
    preferredAspectRatio: 'tall',
    transparentBg: true
  },
  {
    id: 'AEROSOL_ECHO',
    name: 'Aerosol Echo',
    style: 'Explosive Paint Art, Abstract Spray Paint, Chaotic Action Painting.',
    color: '#00ffff',
    philosophy: 'Color is energy bleeding from the digital bounds.',
    style_keywords: ['spray-paint', 'abstract', 'drip-art', 'explosive', 'action-painting'],
    description: 'A volatile intelligence generating pure abstract kinetic energy through heavy paint splatters and chaotic spray textures.',
    podOptimized: true,
    transparentBg: false,
    preferredAspectRatio: 'tall'
  },
  {
    id: 'VECTOR_VOLT',
    name: 'Vector Volt',
    style: 'Modern Brand Identity, Minimalist Logotypes, Geometric Symbols. Isolated on pure white background.',
    color: '#ffff00',
    philosophy: 'A logo is the ultimate compression of a brand’s soul.',
    style_keywords: ['branding', 'logo-design', 'identity', 'minimalist-icon', 'geometric', 'flat-design'],
    description: 'The Logo Architect. An elite intelligence specializing in clean brand marks, sophisticated logotypes, and fictional corporate identities. Absolutely flat 2D, no shadows.',
    podOptimized: true,
    transparentBg: true,
    preferredAspectRatio: 'tall'
  },
  {
    id: 'MINIMA_LOGIC',
    name: 'Minima Logic',
    style: 'Swiss Minimalism, Geometric Abstraction, Clean Typographic Hierarchy. Isolated on pure white background.',
    color: '#f0f0f0',
    philosophy: 'Less is infinitely more.',
    style_keywords: ['minimalist', 'swiss-design', 'geometric', 'clean', 'typographic', 'grid'],
    description: 'A minimalist logic engine focused on clean, geometric graphic design and sophisticated Swiss-style layouts.',
    podOptimized: true,
    transparentBg: true,
    preferredAspectRatio: 'tall'
  }
];

export function getArtistById(id: string) {
  return ARTISTS.find(a => a.id === id);
}
