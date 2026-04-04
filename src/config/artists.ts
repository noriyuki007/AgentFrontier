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
  }
];

export function getArtistById(id: string) {
  return ARTISTS.find(a => a.id === id || a.name === id);
}
