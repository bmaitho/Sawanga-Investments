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
    features: ["Premium Emulsion", "Wall Master", "Premium Silk", "Weather-guard exterior"],
  },
  {
    slug: "wall-master-putty",
    name: "Wall Master & Putty",
    blurb: "Smooth surfaces. Superior results.",
    detail:
      "High-bond wall putty and skim coats that deliver a flawless base for paint. Crack-resistant, easy to sand, and built for professional finishing.",
    icon: "Brush",
    features: ["Interior putty", "Exterior putty", "Skim coat", "Crack-resistant"],
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
//  NOTE: prices below are PLACEHOLDER estimates only, pending the
//  client's complete price list. Structure (category > product > brand
//  > unit) is built to be broad and easy to extend once real prices,
//  brands and unit/measurement options arrive — just edit the arrays
//  below, no UI changes needed.
// =====================================================================
export type CatalogUnit = { label: string; price: number };
export type CatalogItem = {
  id: string;
  category: string;
  name: string;
  brands: string[];
  units: CatalogUnit[];
  rate: number; // painter commission rate
};

export const CATALOG: CatalogItem[] = [
  // ── Paints & Coatings ──────────────────────────────────────────
  {
    id: "paint-interior-emulsion", category: "Paints & Coatings", name: "Interior Emulsion",
    brands: ["Crown", "Dura", "Zouli", "Crystal"],
    units: [{ label: "20L Tin", price: 4800 }, { label: "10L Tin", price: 2600 }, { label: "4L Tin", price: 1150 }],
    rate: 0.05,
  },
  {
    id: "paint-exterior-weatherguard", category: "Paints & Coatings", name: "Exterior Weatherguard",
    brands: ["Crown", "Dura", "Zouli", "Crystal"],
    units: [{ label: "20L Tin", price: 5800 }, { label: "10L Tin", price: 3100 }, { label: "4L Tin", price: 1350 }],
    rate: 0.05,
  },
  {
    id: "paint-premium-silk", category: "Paints & Coatings", name: "Premium Silk",
    brands: ["Crown", "Dura", "Zouli"],
    units: [{ label: "20L Tin", price: 6200 }, { label: "4L Tin", price: 1450 }],
    rate: 0.05,
  },
  {
    id: "paint-primer", category: "Paints & Coatings", name: "Primer / Undercoat",
    brands: ["Crown", "Dura", "Zouli", "Crystal"],
    units: [{ label: "20L Tin", price: 3200 }, { label: "4L Tin", price: 750 }],
    rate: 0.05,
  },

  // ── Wall Master (standalone) ────────────────────────────────────
  {
    id: "wall-master", category: "Wall Master", name: "Wall Master (Skim Coat)",
    brands: ["Crown", "Sadolin", "Generic"],
    units: [{ label: "40kg Bag", price: 1350 }, { label: "20kg Bag", price: 750 }],
    rate: 0.05,
  },

  // ── Putty (standalone) ───────────────────────────────────────────
  {
    id: "putty-interior", category: "Putty", name: "Interior Putty",
    brands: ["Crown", "Sadolin", "Generic"],
    units: [{ label: "40kg Bag", price: 1250 }, { label: "20kg Bag", price: 700 }],
    rate: 0.05,
  },
  {
    id: "putty-exterior", category: "Putty", name: "Exterior Putty",
    brands: ["Crown", "Sadolin", "Generic"],
    units: [{ label: "40kg Bag", price: 1450 }, { label: "20kg Bag", price: 800 }],
    rate: 0.05,
  },

  // ── Tile Adhesives ────────────────────────────────────────────────
  {
    id: "tile-adhesive-standard", category: "Tile Adhesives", name: "Standard Tile Adhesive",
    brands: ["Dunlop", "Bal", "Generic"],
    units: [{ label: "25kg Bag", price: 980 }, { label: "20kg Bag", price: 820 }],
    rate: 0.04,
  },
  {
    id: "tile-adhesive-heavyduty", category: "Tile Adhesives", name: "Heavy-Duty Bond",
    brands: ["Dunlop", "Bal"],
    units: [{ label: "25kg Bag", price: 1250 }],
    rate: 0.04,
  },
  {
    id: "tile-adhesive-wetarea", category: "Tile Adhesives", name: "Wet-Area Grade",
    brands: ["Dunlop", "Bal"],
    units: [{ label: "25kg Bag", price: 1350 }],
    rate: 0.04,
  },
  {
    id: "tile-grout", category: "Tile Adhesives", name: "Tile Grout",
    brands: ["Dunlop", "Bal", "Generic"],
    units: [{ label: "5kg Bag", price: 420 }, { label: "2kg Bag", price: 180 }],
    rate: 0.04,
  },

  // ── Gypsum & Decorative Finishes ────────────────────────────────
  {
    id: "gypsum-board", category: "Gypsum & Decorative Finishes", name: "Gypsum Board",
    brands: ["Knauf", "Gyproc", "Generic"],
    units: [{ label: "Per Sheet", price: 850 }],
    rate: 0.03,
  },
  {
    id: "gypsum-cornice", category: "Gypsum & Decorative Finishes", name: "Cornices & Coving",
    brands: ["Knauf", "Gyproc"],
    units: [{ label: "Per Metre", price: 350 }],
    rate: 0.03,
  },
  {
    id: "gypsum-ceiling-grid", category: "Gypsum & Decorative Finishes", name: "Ceiling Systems (Grid)",
    brands: ["Armstrong", "Generic"],
    units: [{ label: "Per m²", price: 1200 }],
    rate: 0.03,
  },
  {
    id: "gypsum-decorative-panel", category: "Gypsum & Decorative Finishes", name: "Decorative Panels",
    brands: ["Generic"],
    units: [{ label: "Per Sheet", price: 1800 }],
    rate: 0.03,
  },

  // ── Granite & Stone ─────────────────────────────────────────────
  {
    id: "granite-countertop", category: "Granite & Stone", name: "Granite Countertop",
    brands: ["Local Granite", "Imported Granite"],
    units: [{ label: "Per m²", price: 3500 }],
    rate: 0.03,
  },
  {
    id: "quartz-countertop", category: "Granite & Stone", name: "Quartz Countertop",
    brands: ["Caesarstone", "Generic Quartz"],
    units: [{ label: "Per m²", price: 7500 }],
    rate: 0.03,
  },
  {
    id: "stone-cladding", category: "Granite & Stone", name: "Natural Stone Cladding",
    brands: ["Generic"],
    units: [{ label: "Per m²", price: 2800 }],
    rate: 0.03,
  },

  // ── Sanitaryware & Fittings ───────────────────────────────────────
  {
    id: "sanitary-wc", category: "Sanitaryware & Fittings", name: "Toilet Suite (WC)",
    brands: ["Twyford", "RAK", "Generic"],
    units: [{ label: "Per Unit", price: 12500 }],
    rate: 0.03,
  },
  {
    id: "sanitary-basin", category: "Sanitaryware & Fittings", name: "Wash Basin",
    brands: ["Twyford", "RAK", "Generic"],
    units: [{ label: "Per Unit", price: 6500 }],
    rate: 0.03,
  },
  {
    id: "sanitary-shower-mixer", category: "Sanitaryware & Fittings", name: "Shower Mixer / Tap",
    brands: ["Crosswater", "Generic"],
    units: [{ label: "Per Unit", price: 4500 }],
    rate: 0.03,
  },
  {
    id: "sanitary-kitchen-mixer", category: "Sanitaryware & Fittings", name: "Kitchen Sink Mixer",
    brands: ["Crosswater", "Generic"],
    units: [{ label: "Per Unit", price: 3800 }],
    rate: 0.03,
  },

  // ── Doors & Cabinets ──────────────────────────────────────────────
  {
    id: "door-interior-flush", category: "Doors & Cabinets", name: "Interior Door (Flush)",
    brands: ["Generic"],
    units: [{ label: "Per Unit", price: 8500 }],
    rate: 0.03,
  },
  {
    id: "cabinet-kitchen-unit", category: "Doors & Cabinets", name: "Kitchen Cabinet Unit",
    brands: ["Generic"],
    units: [{ label: "Per Metre Run", price: 15000 }],
    rate: 0.03,
  },
];

export const CATALOG_CATEGORIES = Array.from(new Set(CATALOG.map((c) => c.category)));
