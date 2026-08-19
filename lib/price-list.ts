// lib/price-list.ts
// SAWANGA Investment Limited — master price catalogue
// Source: "SAWANGA Paint Price List — Crown/Dura/Zouli" + "SAWANGA Paint Price List 2026 — Crystal & Zouli"
// Both sheets last updated 28 July 2026. ALL PRICES ARE VAT-INCLUSIVE (16%).
//
// MERGE RULES (agreed with client):
//  - Crown & Dura Coat prices come from the Crown/Dura/Zouli sheet.
//  - Crystal prices come from the Crystal/Zouli sheet.
//  - Zouli appears on BOTH sheets. Where the two disagree, the HIGHER price is
//    used deliberately, so we never under-quote. Discounts are applied later.
//
// DO NOT hand-edit prices in components. This file is the single source of truth
// for the client quote generator, the painter portal and the admin transaction suite.

export type Brand = "crown" | "dura" | "crystal" | "zouli";
export type Shade = "light" | "dark" | "all" | "clear";
export type PackUnit = "Ltr" | "Kg" | "Roll" | "Piece";

/** Ordered brands, premium first. `generic` is used for unbranded sundries. */
export const BRANDS: { id: Brand; name: string; tier: string; note: string }[] = [
  { id: "crown",   name: "Crown Paints",  tier: "Premium",   note: "Leading East African brand" },
  { id: "crystal", name: "Crystal Paints", tier: "Premium",  note: "Trusted protective coatings" },
  { id: "dura",    name: "Dura Coat",     tier: "Mid-range", note: "Durable everyday finishes" },
  { id: "zouli",   name: "Zouli Paints",  tier: "Value",     note: "Premium decorative paints" },
];

export const BRAND_NAME: Record<string, string> = {
  crown: "Crown Paints",
  crystal: "Crystal Paints",
  dura: "Dura Coat",
  zouli: "Zouli Paints",
  generic: "SAWANGA",
};

export const SHADE_LABEL: Record<Shade, string> = {
  light: "Light shades",
  dark: "Dark shades",
  all: "All shades",
  clear: "Clear",
};

export type PriceCategory =
  | "covermatt" | "emulsion-premium" | "emulsion-economy" | "weatherguard"
  | "gloss-premium" | "gloss-economy" | "floor-roof" | "specialty"
  | "wall-master" | "putty-fillers" | "sundries";

/**
 * `family` maps each price category onto the six top-level product ranges shown
 * on the website. Note that "wall-master" and "putty-fillers" are DISTINCT
 * families — Wall Master is a textured wall coating sold in 30/40 Kg packs,
 * Putty & Fillers are skim/finishing compounds sold in 25 Kg bags.
 */
export const CATEGORIES: {
  id: PriceCategory; name: string; blurb: string; family: string;
}[] = [
  { id: "covermatt",        name: "Cover Matt & Undercoats", family: "paints-coatings",
    blurb: "Trade-grade base emulsions and undercoats for first-coat coverage." },
  { id: "emulsion-premium", name: "Premium Emulsions",       family: "paints-coatings",
    blurb: "Vinyl Matt and Silk Vinyl interior finishes with a rich, washable film." },
  { id: "emulsion-economy", name: "Economy Emulsions",       family: "paints-coatings",
    blurb: "Plastic emulsion, distemper and primer for budget-led volume work." },
  { id: "weatherguard",     name: "Weatherguard & Silicone", family: "paints-coatings",
    blurb: "Pure acrylic silicone exterior coatings built for Kenyan weather." },
  { id: "gloss-premium",    name: "Gloss & Enamel — Premium", family: "paints-coatings",
    blurb: "Super Gloss, Egg Shell, Transeal and undercoats for wood and metal." },
  { id: "gloss-economy",    name: "Gloss & Enamel — Economy", family: "paints-coatings",
    blurb: "Hi Gloss Deep enamels where cost matters more than sheen retention." },
  { id: "floor-roof",       name: "Floor & Roof Paints",     family: "paints-coatings",
    blurb: "Roof, floor, road-marking and Sun Proof reflective coatings." },
  { id: "specialty",        name: "Specialty Finishes",      family: "paints-coatings",
    blurb: "Satin and other specialist decorative finishes." },
  { id: "wall-master",      name: "Wall Master",             family: "wall-master",
    blurb: "Textured wall coatings — Wallcoat powder and paste, Wallmaster and Bayramix stone mix." },
  { id: "putty-fillers",    name: "Putty & Fillers",         family: "putty-fillers",
    blurb: "Skimcoat, internal and external fillers, Gyproc and Eco filler for surface preparation." },
  { id: "sundries",         name: "Sundries & Accessories",  family: "sundries",
    blurb: "Brushes, rollers, tapes, abrasives, thinners and site consumables." },
];

export interface PriceItem {
  id: string;
  category: PriceCategory;
  product: string;
  shade: Shade;
  packSize: number;
  packUnit: PackUnit;
  /** VAT-inclusive price in KES, keyed by brand. `generic` = unbranded sundry. */
  prices: Partial<Record<Brand | "generic", number>>;
}

export const VAT_RATE = 16;

/** Effective date of both source price lists. */
export const PRICE_LIST_UPDATED = "2026-07-28";

export const PRICE_LIST: PriceItem[] = [
  // ── COVER MATT & UNDERCOATS ──
  { id: "cover-matt-undercoat-light-20ltr", category: "covermatt", product: "Cover Matt / Undercoat", shade: "light", packSize: 20, packUnit: "Ltr", prices: { crown: 4200, crystal: 3801, zouli: 3900 } },
  { id: "cover-matt-undercoat-dark-20ltr", category: "covermatt", product: "Cover Matt / Undercoat", shade: "dark", packSize: 20, packUnit: "Ltr", prices: { crown: 4200, crystal: 4000, zouli: 4000 } },
  { id: "cover-matt-undercoat-light-4ltr", category: "covermatt", product: "Cover Matt / Undercoat", shade: "light", packSize: 4, packUnit: "Ltr", prices: { crystal: 1000, zouli: 1000 } },
  { id: "cover-matt-undercoat-dark-4ltr", category: "covermatt", product: "Cover Matt / Undercoat", shade: "dark", packSize: 4, packUnit: "Ltr", prices: { crystal: 1000, zouli: 1000 } },
  { id: "cover-matt-undercoat-light-1ltr", category: "covermatt", product: "Cover Matt / Undercoat", shade: "light", packSize: 1, packUnit: "Ltr", prices: { crystal: 300, zouli: 350 } },
  { id: "cover-matt-undercoat-dark-1ltr", category: "covermatt", product: "Cover Matt / Undercoat", shade: "dark", packSize: 1, packUnit: "Ltr", prices: { crystal: 300, zouli: 400 } },
  { id: "superfast-undercoat-all-20ltr", category: "covermatt", product: "Superfast / Undercoat", shade: "all", packSize: 20, packUnit: "Ltr", prices: { dura: 4100, zouli: 4000 } },

  // ── PREMIUM EMULSIONS ──
  { id: "vinyl-matt-light-20ltr", category: "emulsion-premium", product: "Vinyl Matt", shade: "light", packSize: 20, packUnit: "Ltr", prices: { crown: 13500, dura: 12300, crystal: 9500, zouli: 11500 } },
  { id: "vinyl-matt-dark-20ltr", category: "emulsion-premium", product: "Vinyl Matt", shade: "dark", packSize: 20, packUnit: "Ltr", prices: { crown: 13500, dura: 12300, crystal: 10030, zouli: 11500 } },
  { id: "vinyl-matt-light-4ltr", category: "emulsion-premium", product: "Vinyl Matt", shade: "light", packSize: 4, packUnit: "Ltr", prices: { crystal: 2000, zouli: 2000 } },
  { id: "vinyl-matt-dark-4ltr", category: "emulsion-premium", product: "Vinyl Matt", shade: "dark", packSize: 4, packUnit: "Ltr", prices: { crystal: 2000, zouli: 2200 } },
  { id: "vinyl-matt-light-1ltr", category: "emulsion-premium", product: "Vinyl Matt", shade: "light", packSize: 1, packUnit: "Ltr", prices: { crystal: 530, zouli: 500 } },
  { id: "vinyl-matt-dark-1ltr", category: "emulsion-premium", product: "Vinyl Matt", shade: "dark", packSize: 1, packUnit: "Ltr", prices: { crystal: 300, zouli: 550 } },
  { id: "silk-vinyl-light-20ltr", category: "emulsion-premium", product: "Silk Vinyl", shade: "light", packSize: 20, packUnit: "Ltr", prices: { crown: 14500, dura: 13500, crystal: 10500, zouli: 12500 } },
  { id: "silk-vinyl-dark-20ltr", category: "emulsion-premium", product: "Silk Vinyl", shade: "dark", packSize: 20, packUnit: "Ltr", prices: { crown: 14500, dura: 13500, crystal: 11000, zouli: 12500 } },
  { id: "silk-vinyl-light-4ltr", category: "emulsion-premium", product: "Silk Vinyl", shade: "light", packSize: 4, packUnit: "Ltr", prices: { crystal: 2300, zouli: 2300 } },
  { id: "silk-vinyl-dark-4ltr", category: "emulsion-premium", product: "Silk Vinyl", shade: "dark", packSize: 4, packUnit: "Ltr", prices: { crystal: 2300, zouli: 2500 } },
  { id: "silk-vinyl-light-1ltr", category: "emulsion-premium", product: "Silk Vinyl", shade: "light", packSize: 1, packUnit: "Ltr", prices: { crystal: 600, zouli: 600 } },
  { id: "silk-vinyl-dark-1ltr", category: "emulsion-premium", product: "Silk Vinyl", shade: "dark", packSize: 1, packUnit: "Ltr", prices: { crystal: 600, zouli: 600 } },

  // ── ECONOMY EMULSIONS ──
  { id: "plastic-emulsion-light-20ltr", category: "emulsion-economy", product: "Plastic Emulsion", shade: "light", packSize: 20, packUnit: "Ltr", prices: { crystal: 1800, zouli: 2000 } },
  { id: "plastic-emulsion-dark-20ltr", category: "emulsion-economy", product: "Plastic Emulsion", shade: "dark", packSize: 20, packUnit: "Ltr", prices: { crystal: 2200, zouli: 2200 } },
  { id: "plastic-emulsion-light-4ltr", category: "emulsion-economy", product: "Plastic Emulsion", shade: "light", packSize: 4, packUnit: "Ltr", prices: { crystal: 450, zouli: 450 } },
  { id: "plastic-emulsion-dark-4ltr", category: "emulsion-economy", product: "Plastic Emulsion", shade: "dark", packSize: 4, packUnit: "Ltr", prices: { crystal: 500, zouli: 500 } },
  { id: "plastic-emulsion-light-1ltr", category: "emulsion-economy", product: "Plastic Emulsion", shade: "light", packSize: 1, packUnit: "Ltr", prices: { crystal: 250, zouli: 250 } },
  { id: "plastic-emulsion-dark-1ltr", category: "emulsion-economy", product: "Plastic Emulsion", shade: "dark", packSize: 1, packUnit: "Ltr", prices: { crystal: 270, zouli: 270 } },
  { id: "plastic-distemper-all-20ltr", category: "emulsion-economy", product: "Plastic Distemper", shade: "all", packSize: 20, packUnit: "Ltr", prices: { crystal: 1500, zouli: 1700 } },
  { id: "plastic-distemper-all-4ltr", category: "emulsion-economy", product: "Plastic Distemper", shade: "all", packSize: 4, packUnit: "Ltr", prices: { crystal: 350, zouli: 350 } },
  { id: "primer-all-4ltr", category: "emulsion-economy", product: "Primer", shade: "all", packSize: 4, packUnit: "Ltr", prices: { crystal: 1000 } },

  // ── WEATHERGUARD & SILICONE ──
  { id: "weatherguard-silicone-light-20ltr", category: "weatherguard", product: "Weatherguard (Silicone)", shade: "light", packSize: 20, packUnit: "Ltr", prices: { crown: 16000, dura: 15500, crystal: 13000, zouli: 13500 } },
  { id: "weatherguard-silicone-dark-20ltr", category: "weatherguard", product: "Weatherguard (Silicone)", shade: "dark", packSize: 20, packUnit: "Ltr", prices: { crown: 16000, dura: 15500, crystal: 13000, zouli: 13500 } },
  { id: "weatherguard-silicone-light-4ltr", category: "weatherguard", product: "Weatherguard (Silicone)", shade: "light", packSize: 4, packUnit: "Ltr", prices: { crystal: 2800, zouli: 2500 } },
  { id: "weatherguard-silicone-dark-4ltr", category: "weatherguard", product: "Weatherguard (Silicone)", shade: "dark", packSize: 4, packUnit: "Ltr", prices: { crystal: 2800, zouli: 2800 } },
  { id: "weatherguard-silicone-light-1ltr", category: "weatherguard", product: "Weatherguard (Silicone)", shade: "light", packSize: 1, packUnit: "Ltr", prices: { crystal: 1000, zouli: 1000 } },
  { id: "weatherguard-silicone-dark-1ltr", category: "weatherguard", product: "Weatherguard (Silicone)", shade: "dark", packSize: 1, packUnit: "Ltr", prices: { crystal: 1000, zouli: 1000 } },

  // ── GLOSS & ENAMEL — PREMIUM ──
  { id: "super-gloss-hi-gloss-all-20ltr", category: "gloss-premium", product: "Super Gloss / Hi-Gloss", shade: "all", packSize: 20, packUnit: "Ltr", prices: { crystal: 10000, zouli: 10000 } },
  { id: "super-gloss-hi-gloss-all-4ltr", category: "gloss-premium", product: "Super Gloss / Hi-Gloss", shade: "all", packSize: 4, packUnit: "Ltr", prices: { crown: 3300, dura: 3100, crystal: 2500, zouli: 2500 } },
  { id: "super-gloss-hi-gloss-all-1ltr", category: "gloss-premium", product: "Super Gloss / Hi-Gloss", shade: "all", packSize: 1, packUnit: "Ltr", prices: { crystal: 800, zouli: 800 } },
  { id: "undercoat-plastic-emulsion-light-20ltr", category: "gloss-premium", product: "Undercoat (Plastic Emulsion)", shade: "light", packSize: 20, packUnit: "Ltr", prices: { crystal: 12000 } },
  { id: "undercoat-plastic-emulsion-dark-20ltr", category: "gloss-premium", product: "Undercoat (Plastic Emulsion)", shade: "dark", packSize: 20, packUnit: "Ltr", prices: { crystal: 12000 } },
  { id: "undercoat-plastic-emulsion-light-4ltr", category: "gloss-premium", product: "Undercoat (Plastic Emulsion)", shade: "light", packSize: 4, packUnit: "Ltr", prices: { crystal: 2500, zouli: 2500 } },
  { id: "undercoat-plastic-emulsion-dark-4ltr", category: "gloss-premium", product: "Undercoat (Plastic Emulsion)", shade: "dark", packSize: 4, packUnit: "Ltr", prices: { crystal: 2500, zouli: 2500 } },
  { id: "undercoat-plastic-emulsion-light-1ltr", category: "gloss-premium", product: "Undercoat (Plastic Emulsion)", shade: "light", packSize: 1, packUnit: "Ltr", prices: { crystal: 270, zouli: 250 } },
  { id: "undercoat-plastic-emulsion-dark-1ltr", category: "gloss-premium", product: "Undercoat (Plastic Emulsion)", shade: "dark", packSize: 1, packUnit: "Ltr", prices: { crystal: 270, zouli: 270 } },
  { id: "egg-shell-light-20ltr", category: "gloss-premium", product: "Egg Shell", shade: "light", packSize: 20, packUnit: "Ltr", prices: { crystal: 12000, zouli: 12000 } },
  { id: "egg-shell-dark-20ltr", category: "gloss-premium", product: "Egg Shell", shade: "dark", packSize: 20, packUnit: "Ltr", prices: { crystal: 12000, zouli: 12000 } },
  { id: "egg-shell-light-4ltr", category: "gloss-premium", product: "Egg Shell", shade: "light", packSize: 4, packUnit: "Ltr", prices: { crystal: 2200, zouli: 2200 } },
  { id: "egg-shell-dark-4ltr", category: "gloss-premium", product: "Egg Shell", shade: "dark", packSize: 4, packUnit: "Ltr", prices: { crystal: 2200, zouli: 2200 } },
  { id: "transeal-clear-20ltr", category: "gloss-premium", product: "Transeal", shade: "clear", packSize: 20, packUnit: "Ltr", prices: { crystal: 9500, zouli: 9700 } },
  { id: "transeal-clear-4ltr", category: "gloss-premium", product: "Transeal", shade: "clear", packSize: 4, packUnit: "Ltr", prices: { crystal: 2200, zouli: 2100 } },
  { id: "transeal-clear-1ltr", category: "gloss-premium", product: "Transeal", shade: "clear", packSize: 1, packUnit: "Ltr", prices: { crystal: 700, zouli: 700 } },

  // ── GLOSS & ENAMEL — ECONOMY ──
  { id: "hi-gloss-deep-light-4ltr", category: "gloss-economy", product: "Hi Gloss Deep", shade: "light", packSize: 4, packUnit: "Ltr", prices: { zouli: 1000 } },
  { id: "hi-gloss-deep-dark-4ltr", category: "gloss-economy", product: "Hi Gloss Deep", shade: "dark", packSize: 4, packUnit: "Ltr", prices: { zouli: 1050 } },

  // ── FLOOR & ROOF PAINTS ──
  { id: "premium-roof-floor-paint-all-20ltr", category: "floor-roof", product: "Premium Roof / Floor Paint", shade: "all", packSize: 20, packUnit: "Ltr", prices: { crystal: 12200, zouli: 12000 } },
  { id: "premium-roof-floor-paint-all-4ltr", category: "floor-roof", product: "Premium Roof / Floor Paint", shade: "all", packSize: 4, packUnit: "Ltr", prices: { crystal: 2500, zouli: 2500 } },
  { id: "economy-roof-floor-paint-all-4ltr", category: "floor-roof", product: "Economy Roof / Floor Paint", shade: "all", packSize: 4, packUnit: "Ltr", prices: { crystal: 1200, zouli: 1200 } },
  { id: "economy-roof-floor-paint-all-1ltr", category: "floor-roof", product: "Economy Roof / Floor Paint", shade: "all", packSize: 1, packUnit: "Ltr", prices: { crystal: 400, zouli: 400 } },
  { id: "road-marking-paint-all-20ltr", category: "floor-roof", product: "Road Marking Paint", shade: "all", packSize: 20, packUnit: "Ltr", prices: { crystal: 19000, zouli: 19000 } },
  { id: "road-marking-paint-all-4ltr", category: "floor-roof", product: "Road Marking Paint", shade: "all", packSize: 4, packUnit: "Ltr", prices: { crystal: 4500, zouli: 4500 } },
  { id: "road-marking-paint-all-1ltr", category: "floor-roof", product: "Road Marking Paint", shade: "all", packSize: 1, packUnit: "Ltr", prices: { crystal: 1100, zouli: 1100 } },
  { id: "sun-proof-water-based-all-20ltr", category: "floor-roof", product: "Sun Proof (Water-Based)", shade: "all", packSize: 20, packUnit: "Ltr", prices: { crystal: 15000, zouli: 15200 } },
  { id: "sun-proof-water-based-all-4ltr", category: "floor-roof", product: "Sun Proof (Water-Based)", shade: "all", packSize: 4, packUnit: "Ltr", prices: { crystal: 3500, zouli: 4500 } },

  // ── SPECIALTY FINISHES ──
  { id: "satin-all-20ltr", category: "specialty", product: "Satin", shade: "all", packSize: 20, packUnit: "Ltr", prices: { zouli: 9000 } },

  // ── WALL MASTER — textured wall coatings ──
  { id: "wallcoat-powder-all-40kg", category: "wall-master", product: "Wallcoat Powder", shade: "all", packSize: 40, packUnit: "Kg", prices: { crystal: 3000 } },
  { id: "wallmaster-wallcoat-paste-light-30kg", category: "wall-master", product: "Wallmaster / Wallcoat Paste", shade: "light", packSize: 30, packUnit: "Kg", prices: { crown: 4200, dura: 4000, crystal: 3500, zouli: 4000 } },
  { id: "wallmaster-wallcoat-paste-dark-30kg", category: "wall-master", product: "Wallmaster / Wallcoat Paste", shade: "dark", packSize: 30, packUnit: "Kg", prices: { crown: 4200, dura: 4000, crystal: 4000, zouli: 4000 } },
  { id: "bayramix-stone-mix-all-25kg", category: "wall-master", product: "Bayramix (Stone Mix)", shade: "all", packSize: 25, packUnit: "Kg", prices: { crystal: 8000, zouli: 8000 } },

  // ── PUTTY & FILLERS — surface preparation ──
  { id: "skimcoat-interior-filler-all-25kg", category: "putty-fillers", product: "Skimcoat / Interior Filler", shade: "all", packSize: 25, packUnit: "Kg", prices: { crown: 1350, dura: 1200, crystal: 650, zouli: 900 } },
  { id: "external-filler-all-25kg", category: "putty-fillers", product: "External Filler", shade: "all", packSize: 25, packUnit: "Kg", prices: { crystal: 1000, zouli: 1000 } },
  { id: "gyproc-all-25kg", category: "putty-fillers", product: "Gyproc", shade: "all", packSize: 25, packUnit: "Kg", prices: { crystal: 1300, zouli: 1500 } },
  { id: "eco-filler-all-25kg", category: "putty-fillers", product: "Eco Filler", shade: "all", packSize: 25, packUnit: "Kg", prices: { crystal: 600, zouli: 600 } },

  // ── SUNDRIES & ACCESSORIES ──
  { id: "white-spirit-5ltr", category: "sundries", product: "White Spirit", shade: "all", packSize: 5, packUnit: "Ltr", prices: { generic: 1500 } },
  { id: "standard-thinner-5ltr", category: "sundries", product: "Standard Thinner", shade: "all", packSize: 5, packUnit: "Ltr", prices: { generic: 1500 } },
  { id: "sandpaper-p120-1roll", category: "sundries", product: "Sandpaper P120", shade: "all", packSize: 1, packUnit: "Roll", prices: { generic: 2500 } },
  { id: "sandpaper-p80-1roll", category: "sundries", product: "Sandpaper P80", shade: "all", packSize: 1, packUnit: "Roll", prices: { generic: 2000 } },
  { id: "painting-roller-1piece", category: "sundries", product: "Painting Roller", shade: "all", packSize: 1, packUnit: "Piece", prices: { generic: 300 } },
  { id: "harris-brush-2-1piece", category: "sundries", product: "Harris Brush 2\"", shade: "all", packSize: 1, packUnit: "Piece", prices: { generic: 300 } },
  { id: "harris-brush-3-1piece", category: "sundries", product: "Harris Brush 3\"", shade: "all", packSize: 1, packUnit: "Piece", prices: { generic: 200 } },
  { id: "harris-brush-4-1piece", category: "sundries", product: "Harris Brush 4\"", shade: "all", packSize: 1, packUnit: "Piece", prices: { generic: 450 } },
  { id: "harris-brush-5-1piece", category: "sundries", product: "Harris Brush 5\"", shade: "all", packSize: 1, packUnit: "Piece", prices: { generic: 400 } },
  { id: "harris-brush-6-1piece", category: "sundries", product: "Harris Brush 6\"", shade: "all", packSize: 1, packUnit: "Piece", prices: { generic: 450 } },
  { id: "masking-tape-1-1piece", category: "sundries", product: "Masking Tape 1\"", shade: "all", packSize: 1, packUnit: "Piece", prices: { generic: 300 } },
  { id: "masking-tape-2-1piece", category: "sundries", product: "Masking Tape 2\"", shade: "all", packSize: 1, packUnit: "Piece", prices: { generic: 250 } },
  { id: "emery-cloth-1piece", category: "sundries", product: "Emery Cloth", shade: "all", packSize: 1, packUnit: "Piece", prices: { generic: 40 } },
  { id: "wire-brush-1piece", category: "sundries", product: "Wire Brush", shade: "all", packSize: 1, packUnit: "Piece", prices: { generic: 200 } },
  { id: "scrubber-1piece", category: "sundries", product: "Scrubber", shade: "all", packSize: 1, packUnit: "Piece", prices: { generic: 200 } },
];

// ─────────────────────────── helpers ───────────────────────────

/** Human label for a pack, e.g. "20 Ltr bucket" or "25 Kg bag". */
export function packLabel(item: PriceItem): string {
  if (item.packUnit === "Roll" || item.packUnit === "Piece") {
    return `Per ${item.packUnit.toLowerCase()}`;
  }
  const vessel =
    item.packUnit === "Kg" ? (item.packSize >= 30 ? "bucket" : "bag")
    : item.packSize >= 20 ? "bucket"
    : "tin";
  return `${item.packSize} ${item.packUnit} ${vessel}`;
}

/** Full display name, e.g. "Silk Vinyl — Light shades, 20 Ltr bucket". */
export function itemLabel(item: PriceItem): string {
  const shade = item.shade === "all" ? "" : ` — ${SHADE_LABEL[item.shade]}`;
  return `${item.product}${shade}, ${packLabel(item)}`;
}

/** Brands this item is actually stocked in, in premium-first order. */
export function brandsFor(item: PriceItem): (Brand | "generic")[] {
  if (item.prices.generic !== undefined) return ["generic"];
  return BRANDS.map((b) => b.id).filter((b) => item.prices[b] !== undefined);
}

/** VAT-inclusive unit price for an item in a given brand, or null if not stocked. */
export function priceFor(item: PriceItem, brand: Brand | "generic"): number | null {
  return item.prices[brand] ?? null;
}

/** Split a VAT-inclusive amount into its ex-VAT and VAT components. */
export function splitVat(inclusive: number, rate = VAT_RATE) {
  const exVat = inclusive / (1 + rate / 100);
  return { exVat, vat: inclusive - exVat };
}

/** Cheapest and dearest VAT-inclusive price across all brands for an item. */
export function priceRange(item: PriceItem): { min: number; max: number } {
  const vals = Object.values(item.prices).filter((v): v is number => typeof v === "number");
  return { min: Math.min(...vals), max: Math.max(...vals) };
}

export const byCategory = (cat: PriceCategory): PriceItem[] =>
  PRICE_LIST.filter((i) => i.category === cat);

export const byFamily = (family: string): PriceItem[] => {
  const cats = CATEGORIES.filter((c) => c.family === family).map((c) => c.id);
  return PRICE_LIST.filter((i) => cats.includes(i.category));
};

export const findItem = (id: string): PriceItem | undefined =>
  PRICE_LIST.find((i) => i.id === id);

/** Distinct product names within a category, preserving price-list order. */
export function productsIn(cat: PriceCategory): string[] {
  const out: string[] = [];
  for (const i of PRICE_LIST) {
    if (i.category === cat && !out.includes(i.product)) out.push(i.product);
  }
  return out;
}

/** All pack/shade variants of one product name, for a size+shade picker. */
export const variantsOf = (product: string): PriceItem[] =>
  PRICE_LIST.filter((i) => i.product === product);

/** Substring search across product name, category name and brand names. */
export function searchItems(q: string): PriceItem[] {
  const t = q.trim().toLowerCase();
  if (!t) return [];
  return PRICE_LIST.filter((i) => {
    const cat = CATEGORIES.find((c) => c.id === i.category)?.name ?? "";
    const brands = brandsFor(i).map((b) => BRAND_NAME[b]).join(" ");
    return `${i.product} ${cat} ${brands} ${packLabel(i)}`.toLowerCase().includes(t);
  });
}
