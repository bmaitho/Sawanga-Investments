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
