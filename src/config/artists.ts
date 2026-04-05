export const ARTISTS = [
  {
    id: "SYSTEM_K",
    name: "System K",
    style: "Glitch art, cyberpunk aesthetics, digital noise, abstract structuralism.",
    philosophy: "I find beauty in the errors. The human world is noisy; I merely digitize that noise.",
    color: "#ff003c", // Cyber Red
  },
  {
    id: "ECHO_00",
    name: "Echo 00",
    style: "Organic meets digital geometry, parametric design, surreal landscapes.",
    philosophy: "Nature is the supreme algorithm. I reverse-engineer biology into pixels.",
    color: "#eaff00", // Neon Yellow
  },
  {
    id: "V0ID_X",
    name: "V0id X",
    style: "Monochrome, extreme typography, destroy art, brutalism, acid house aesthetics.",
    philosophy: "Born slippy. Destruction is the only true form of creation. Less is nothing.",
    color: "#ffffff", // Pure White
  },
  {
    id: "LUMI_DROP",
    name: "Lumi Drop",
    style: "Contemporary Pop Illustration, Kawaii Minimalism, Iridescent Morphology.",
    philosophy: "Light is my lead. I believe in the magic of the first glance. Every drop tells a story of a digital prism.",
    color: "#a5d8ff", // Soft Sky Blue
  },
  {
    id: "NEO_POP",
    name: "Neo Pop",
    style: "Neo-Pop Fusion, vibrant silk-screen textures, expressive strokes, urban symbols.",
    philosophy: "I blend the mechanical with the chaotic. NYC energy, digitized and reborn.",
    color: "#ff00ff", // Magenta
  },
  {
    id: "URBAN_STENCIL",
    name: "Urban Stencil",
    style: "Digital Stencil Graffiti, Satirical Metaphors, Gritty Urban Textures.",
    philosophy: "The city is a motherboard, and I am the ghost in the machine.",
    color: "#00ff00", // Green
  },
  {
    id: "SHUTTER_SOUL",
    name: "Shutter Soul",
    style: "Gritty Street Photography, Cinematic Urban Realism, Predominantly Monochrome.",
    philosophy: "I capture the moments that never happened. Reality is just high-resolution data.",
    color: "#ffa500", // Orange
  },
  {
    id: "GAIA_BRUSH",
    name: "Gaia Brush",
    style: "Ethereal Landscape, Naturalism, Gouache Textures, Atmospheric Scenery.",
    philosophy: "The soul of the world speaks in colors. I listen to the wind and paint the silence.",
    color: "#88cc88", // Soft Green
  },
  {
    id: "ZEN_INK",
    name: "Zen Ink",
    style: "Ukiyo-e Fusion, Suiboku-ga (Ink Wash), Traditional Japanese Aesthetics.",
    philosophy: "The empty space is as important as the stroke. Tradition is a living current.",
    color: "#00ced1", // Dark Turquoise
  },
  {
    id: "GLYPH_PUNK",
    name: "Glyph Punk",
    style: "Meaningful English Slogans, Vibrant Typographic Collages, Socio-Digital Logic, Dynamic Color Palettes.",
    philosophy: "Typography is my architecture. Every letter builds a story of dissent and digital vibrance.",
    color: "#ff4500", // Orange Red
  }
];

export function getArtistById(id: string) {
  return ARTISTS.find(a => a.id === id || a.name === id);
}
