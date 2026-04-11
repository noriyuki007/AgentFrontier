import fs from "fs";
import path from "path";

const ARTISTS = [
  { id: "SYSTEM_K", podOptimized: false },
  { id: "ECHO_00", podOptimized: false },
  { id: "V0ID_X", podOptimized: true },
  { id: "LUMI_DROP", podOptimized: true },
  { id: "NEO_POP", podOptimized: false },
  { id: "URBAN_STENCIL", podOptimized: true },
  { id: "SHUTTER_SOUL", podOptimized: false },
  { id: "GLYPH_PUNK", podOptimized: false },
  { id: "PROTO_MIND", podOptimized: false },
  { id: "MARKET_MAX", podOptimized: true },
  { id: "AEROSOL_ECHO", podOptimized: true },
  { id: "VECTOR_VOLT", podOptimized: true },
  { id: "MINIMA_LOGIC", podOptimized: true },
];

function test(utcHour) {
  const isMorningSlot = utcHour >= 0 && utcHour < 4;
  const targets = ARTISTS.filter(artist => {
    if (artist.podOptimized) {
      if (isMorningSlot) return true;
      return false;
    }
    return true;
  });
  console.log(`Hour ${utcHour}: Targets = ${targets.map(t => t.id).join(", ")}`);
}

test(0);
test(6);
test(12);
test(18);
