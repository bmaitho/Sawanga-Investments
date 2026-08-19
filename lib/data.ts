import {
  PRICE_LIST, CATEGORIES, BRAND_NAME, SHADE_LABEL, packLabel,
  brandsFor, type PriceItem,
} from "./price-list";

export const COMPANY = {
  name: "SAWANGA Investment Limited",
  tagline: "Finishes That Build Trust",
  headline: "Build Better. Finish Stronger.",
  email: "info@sawangainvestments.com",
  domain: "sawangainvestments.com",
  phones: ["0723 005 719", "0722 802 358"],
  whatsapp: "254723005719",
  address: "P.O. Box 6866-00200, Nairobi",
  location: "Kitengela Plaza, Unit No. 1",
  keywords: "Paints · Granite · Gypsum · Tiles · Fittings · Cabinets · Doors & More",
};

export type Product = {
  slug: string;
  name: string;
  blurb: string;
  detail: string;
  icon: string; // lucide icon name
  features: string[];
};

export const PRODUCTS: Product[] = [
  {
    slug: "paints-coatings",
    name: "Paints & Coatings",
    blurb: "Premium paints for beautiful, durable finishes.",
    detail:
      "Interior and exterior emulsions, premium silk, gloss and weather-guard coatings engineered for Kenyan climates — from coastal humidity to highland sun.",
    icon: "PaintRoller",
    features: ["Premium Emulsion", "Vinyl Matt", "Premium Silk", "Weather-guard exterior"],
  },
  {
    slug: "wall-master",
    name: "Wall Master",
    blurb: "Texture with depth and character.",
    detail:
      "Textured wall coatings that give exteriors and feature walls a solid, hand-finished character. Wallcoat powder and paste, Wallmaster and Bayramix stone mix — supplied in 30 and 40 Kg packs and built to weather Kenyan sun and rain.",
    icon: "Wallpaper",
    features: ["Wallcoat powder", "Wallcoat paste", "Wallmaster", "Bayramix stone mix"],
  },
  {
    slug: "putty-fillers",
    name: "Putty & Fillers",
    blurb: "Smooth surfaces. Superior results.",
    detail:
      "High-bond fillers and skim coats that deliver a flawless base for paint. Crack-resistant, easy to sand, and supplied in 25 Kg bags for professional surface preparation.",
    icon: "Brush",
    features: ["Skimcoat / interior filler", "External filler", "Gyproc", "Eco filler"],
  },
  {
    slug: "tile-adhesives",
    name: "Tile Adhesives",
    blurb: "Strong bonds. Long-lasting performance.",
    detail:
      "Cement-based and ready-mix tile adhesives and grouts for floors, walls, wet areas and large-format tiles. Engineered for maximum grip.",
    icon: "Grid3x3",
    features: ["Standard adhesive", "Heavy-duty bond", "Wet-area grade", "Coloured grouts"],
  },
  {
    slug: "gypsum-decorative",
    name: "Gypsum & Decorative Finishes",
    blurb: "Modern interiors. Endless possibilities.",
    detail:
      "Gypsum boards, cornices, ceiling systems and decorative finishes for clean, contemporary interiors and elegant detailing.",
    icon: "Layers",
    features: ["Gypsum boards", "Cornices & coving", "Ceiling systems", "Decorative panels"],
  },
  {
    slug: "granite-stone",
    name: "Granite & Stone",
    blurb: "Timeless surfaces, built to last.",
    detail:
      "Granite, quartz and natural stone for countertops, vanities and feature surfaces — precision cut and finished to order.",
    icon: "Gem",
    features: ["Countertops", "Vanity tops", "Feature walls", "Custom cuts"],
  },
  {
    slug: "sanitaryware-fittings",
    name: "Sanitaryware & Fittings",
    blurb: "Stylish. Hygienic. Built to last.",
    detail:
      "Toilets, basins, taps, showers and bathroom accessories from trusted brands — completing every space with quality fittings.",
    icon: "ShowerHead",
    features: ["Toilets & basins", "Taps & mixers", "Showers", "Accessories"],
  },
];

export type Solution = {
  slug: string;
  title: string;
  audience: string;
  description: string;
  icon: string;
  points: string[];
};

export const SOLUTIONS: Solution[] = [
  {
    slug: "developers",
    title: "For Developers",
    audience: "Property developers & estates",
    description:
      "Exclusive flexible credit terms, project-volume pricing and reliable scheduled supply that keeps your build on time and on budget.",
    icon: "Building2",
    points: ["Flexible credit terms", "Volume pricing", "Scheduled deliveries", "Dedicated account manager"],
  },
  {
    slug: "contractors",
    title: "For Contractors",
    audience: "Builders & finishing crews",
    description:
      "Consistent stock of the finishing materials your teams rely on, fast turnaround, and technical guidance to finish right the first time.",
    icon: "HardHat",
    points: ["Trade pricing", "Fast turnaround", "Technical support", "Site delivery"],
  },
  {
    slug: "institutions",
    title: "For Institutions",
    audience: "Schools, hospitals & government",
    description:
      "Compliant, tender-ready supply of durable finishing products at scale, with documentation and dependable lead times.",
    icon: "Landmark",
    points: ["Tender-ready supply", "Bulk capacity", "Compliance docs", "Reliable lead times"],
  },
  {
    slug: "homeowners",
    title: "For Homeowners",
    audience: "Individual builders & renovators",
    description:
      "Expert advice and premium products to bring your dream home to life — from a single room refresh to a full build finish.",
    icon: "Home",
    points: ["Expert advice", "Premium products", "Colour consultation", "Showroom support"],
  },
];

export const WHY_PARTNER = [
  {
    title: "Developer Focused",
    desc: "Solutions that match your project needs.",
    icon: "Handshake",
  },
  {
    title: "Flexible Credit Terms",
    desc: "Exclusive credit for developers.",
    icon: "CreditCard",
  },
  {
    title: "Fast & Reliable Delivery",
    desc: "On-time supply where you need it.",
    icon: "Truck",
  },
  {
    title: "Quality You Can Trust",
    desc: "Top brands. Tested quality. Proven results.",
    icon: "BadgeCheck",
  },
  {
    title: "Technical Support",
    desc: "Expert advice to help you finish right.",
    icon: "Headset",
  },
];

export const PARTNERS = [
  { name: "Zouli Paints",   note: "Premium decorative paints",    image: "/images/brand-zouli.png" },
  { name: "Crystal Paints", note: "Trusted protective coatings",  image: "/images/brand-crystal.png" },
  { name: "Dura Paints",    note: "Durable everyday finishes",    image: "/images/brand-dura.jpg" },
  { name: "Crown Paints",   note: "Leading East African brand",   image: "/images/brand-crown.jpg" },
];

// =====================================================================
//  ORDER BUILDER CATALOG  (painter portal — "Refer a client")
//
//  Paint, Wall Master, Putty and Sundries entries are DERIVED AT BUILD
//  TIME from lib/price-list.ts — the real 2026 client price list. They
//  carry `verified: true` and must never be hand-edited here; change the
//  price list instead and every consumer updates together.
//
//  The remaining categories (Tile Adhesives, Gypsum, Granite,
//  Sanitaryware, Doors & Cabinets) are NOT covered by either client price
//  list, so they remain placeholder estimates and are flagged
//  `verified: false`. Replace them the moment a real list arrives.
// =====================================================================
export type CatalogUnit = {
  label: string;
  /** VAT-inclusive price in KES, keyed by brand display name. */
  prices: Record<string, number>;
};

export type CatalogItem = {
  id: string;
  category: string;
  name: string;
  brands: string[];
  units: CatalogUnit[];
  rate: number; // painter commission rate
  /** true = price comes from the real client price list. */
  verified: boolean;
};

/** Painter commission by product family. */
const FAMILY_RATE: Record<string, number> = {
  "paints-coatings": 0.05,
  "wall-master": 0.05,
  "putty-fillers": 0.05,
  "sundries": 0.03,
};

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/** "20 Ltr bucket · Light shades" — pack plus shade, where shade matters. */
function unitLabel(item: PriceItem): string {
  const pack = packLabel(item);
  return item.shade === "all" ? pack : `${pack} · ${SHADE_LABEL[item.shade]}`;
}

/** Collapse the flat price list into category > product > brand > unit. */
function fromPriceList(): CatalogItem[] {
  const out: CatalogItem[] = [];
  const seen = new Map<string, CatalogItem>();

  for (const item of PRICE_LIST) {
    const cat = CATEGORIES.find((c) => c.id === item.category);
    if (!cat) continue;
    const key = `${item.category}::${item.product}`;

    let entry = seen.get(key);
    if (!entry) {
      entry = {
        id: `pl-${slugify(key)}`,
        category: cat.name,
        name: item.product,
        brands: [],
        units: [],
        rate: FAMILY_RATE[cat.family] ?? 0.03,
        verified: true,
      };
      seen.set(key, entry);
      out.push(entry);
    }

    const prices: Record<string, number> = {};
    for (const b of brandsFor(item)) {
      const price = item.prices[b];
      if (price === undefined) continue;
      const name = BRAND_NAME[b];
      prices[name] = price;
      if (!entry.brands.includes(name)) entry.brands.push(name);
    }
    entry.units.push({ label: unitLabel(item), prices });
  }
  return out;
}

const same = (brands: string[], price: number): Record<string, number> =>
  Object.fromEntries(brands.map((b) => [b, price]));

/** Placeholder entry — no client price list exists for these categories yet. */
function placeholder(
  id: string, category: string, name: string, brands: string[],
  units: [string, number][], rate: number
): CatalogItem {
  return {
    id, category, name, brands, rate, verified: false,
    units: units.map(([label, price]) => ({ label, prices: same(brands, price) })),
  };
}

// Prices below are researched estimates based on standard 2026 Kenyan market
// rates (not on SAWANGA's own price list) — see `verified: false`. Where
// sources disagreed, the higher figure was used to avoid underquoting.
const PLACEHOLDER_CATALOG: CatalogItem[] = [
  // ── Tile Adhesives ────────────────────────────────────────────────
  placeholder("tile-adhesive-standard", "Tile Adhesives", "Standard Tile Adhesive",
    ["Dunlop", "Bal", "Generic"], [["25kg Bag", 1000], ["20kg Bag", 850]], 0.04),
  placeholder("tile-adhesive-heavyduty", "Tile Adhesives", "Heavy-Duty Bond",
    ["Dunlop", "Bal"], [["25kg Bag", 1350]], 0.04),
  placeholder("tile-adhesive-wetarea", "Tile Adhesives", "Wet-Area Grade",
    ["Dunlop", "Bal"], [["25kg Bag", 1450]], 0.04),
  placeholder("tile-grout", "Tile Adhesives", "Tile Grout",
    ["Dunlop", "Bal", "Generic"], [["5kg Bag", 450], ["2kg Bag", 200]], 0.04),

  // ── Gypsum & Decorative Finishes ────────────────────────────────
  placeholder("gypsum-board", "Gypsum & Decorative Finishes", "Gypsum Board",
    ["Knauf", "Gyproc", "Generic"], [["Per Sheet", 1100]], 0.03),
  placeholder("gypsum-cornice", "Gypsum & Decorative Finishes", "Cornices & Coving",
    ["Knauf", "Gyproc"], [["Per Metre", 400]], 0.03),
  placeholder("gypsum-ceiling-grid", "Gypsum & Decorative Finishes", "Ceiling Systems (Grid)",
    ["Armstrong", "Generic"], [["Per m²", 1400]], 0.03),
  placeholder("gypsum-decorative-panel", "Gypsum & Decorative Finishes", "Decorative Panels",
    ["Generic"], [["Per Sheet", 2000]], 0.03),

  // ── Granite & Stone ─────────────────────────────────────────────
  placeholder("granite-countertop", "Granite & Stone", "Granite Countertop",
    ["Local Granite", "Imported Granite"], [["Per Metre Run (installed)", 18000]], 0.03),
  placeholder("quartz-countertop", "Granite & Stone", "Quartz Countertop",
    ["Caesarstone", "Generic Quartz"], [["Per m² (fabricated & installed)", 14000]], 0.03),
  placeholder("stone-cladding", "Granite & Stone", "Natural Stone Cladding",
    ["Generic"], [["Per m²", 3200]], 0.03),

  // ── Sanitaryware & Fittings ───────────────────────────────────────
  placeholder("sanitary-wc", "Sanitaryware & Fittings", "Toilet Suite (WC)",
    ["Twyford", "RAK", "Generic"], [["Per Unit (incl. install)", 15000]], 0.03),
  placeholder("sanitary-basin", "Sanitaryware & Fittings", "Wash Basin",
    ["Twyford", "RAK", "Generic"], [["Per Unit", 7000]], 0.03),
  placeholder("sanitary-shower-mixer", "Sanitaryware & Fittings", "Shower Mixer / Tap",
    ["Crosswater", "Generic"], [["Per Unit", 5000]], 0.03),
  placeholder("sanitary-kitchen-mixer", "Sanitaryware & Fittings", "Kitchen Sink Mixer",
    ["Crosswater", "Generic"], [["Per Unit", 4200]], 0.03),

  // ── Doors & Cabinets ──────────────────────────────────────────────
  placeholder("door-interior-flush", "Doors & Cabinets", "Interior Door (Flush)",
    ["Generic"], [["Per Unit (incl. frame & fitting)", 9500]], 0.03),
  placeholder("cabinet-kitchen-unit", "Doors & Cabinets", "Kitchen Cabinet Unit",
    ["Generic"], [["Per Metre Run", 42000]], 0.03),
];

export const CATALOG: CatalogItem[] = [...fromPriceList(), ...PLACEHOLDER_CATALOG];

export const CATALOG_CATEGORIES = Array.from(new Set(CATALOG.map((c) => c.category)));
