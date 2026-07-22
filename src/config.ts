// ============================================================
//  STUDIO FRAME — SITE CONFIGURATION
//  Edit everything here. No need to touch components.
// ============================================================

export const site = {
  name: 'Studio Frame',
  tagline: 'Wall Art That Speaks.',
  // WhatsApp number in international format, no + or spaces
  whatsapp: '923272506521',
  currency: 'Rs.',
  freeShippingThreshold: 5000,
  shippingFlat: 250,
  email: 'hello@studioframe.pk',
  cities: [
    'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad',
    'Multan', 'Peshawar', 'Quetta', 'Hyderabad', 'Sialkot',
    'Gujranwala', 'Bahawalpur', 'Sukkur', 'Mardan', 'Sargodha',
    'Mirpur', 'Abbottabad', 'Muzaffarabad', 'Rahim Yar Khan', 'Sahiwal',
  ],
};

// ---- Materials ----
export type MaterialId = 'metal' | 'wood' | 'canvas';
export interface Material {
  id: MaterialId;
  name: string;
  blurb: string;
  multiplier: number; // multiplies base price
}
export const materials: Record<MaterialId, Material> = {
  metal: { id: 'metal', name: 'Metal', blurb: 'Brushed aluminium plate — Displate-grade finish.', multiplier: 1.4 },
  wood: { id: 'wood', name: 'Wood', blurb: 'FSC birch panel, warm grain texture.', multiplier: 1.15 },
  canvas: { id: 'canvas', name: 'Canvas', blurb: 'Cotton canvas, gallery wrapped.', multiplier: 1 },
};

// ---- Sizes ----
export interface Size {
  id: string;
  label: string;   // display
  code: string;    // 3-letter code used in product code
  basePrice: number;
}
export const sizes: Size[] = [
  { id: 'a5', label: 'A5 · 5.8×8.3"', code: 'A5', basePrice: 1490 },
  { id: 'a4', label: 'A4 · 8.3×11.7"', code: 'A4', basePrice: 2490 },
  { id: 'a3', label: 'A3 · 11.7×16.5"', code: 'A3', basePrice: 3990 },
  { id: '12x16', label: '12×16"', code: '12I', basePrice: 3490 },
  { id: '16x20', label: '16×20"', code: '16I', basePrice: 4990 },
  { id: '18x24', label: '18×24"', code: '18I', basePrice: 6490 },
];

export function getSize(id: string): Size {
  return sizes.find((s) => s.id === id) ?? sizes[1];
}
export function getMaterial(id: MaterialId): Material {
  return materials[id];
}

// ---- Pricing ----
export function priceFor(sizeId: string, materialId: MaterialId): number {
  const s = getSize(sizeId);
  const m = getMaterial(materialId);
  return Math.round((s.basePrice * m.multiplier) / 10) * 10;
}

// ---- Product code format: SIZE-CAT-NN-M  (e.g. A4-ANI-01-M) ----
export function productCode(categoryCode: string, index: number, sizeId: string, materialId: MaterialId): string {
  const s = getSize(sizeId).code;
  const m = materialId[0].toUpperCase();
  const n = String(index).padStart(2, '0');
  return `${s}-${categoryCode}-${n}-${m}`;
}

// ============================================================
//  CATEGORIES
// ============================================================
export interface Category {
  slug: string;
  name: string;
  code: string; // 3-letter code for product codes
  tagline: string;
  description: string;
  gradient: [string, string];
  motif: string; // emoji-free SVG keyword used by Artwork
  accent: string;
}

export const categories: Category[] = [
  {
    slug: 'anime', name: 'Anime', code: 'ANI',
    tagline: 'From the frame to your wall.',
    description: 'Iconic moments from the series you live for — licensed-style poster art on premium metal, wood and canvas.',
    gradient: ['#3A1C71', '#D76D77'], motif: 'burst', accent: '#D76D77',
  },
  {
    slug: 'movies', name: 'Movies', code: 'MOV',
    tagline: 'Cinema, framed.',
    description: 'Poster-grade artwork from the films that stayed with you. Cinematic colour, museum-grade print.',
    gradient: ['#0F2027', '#2C5364'], motif: 'film', accent: '#2C5364',
  },
  {
    slug: 'sports', name: 'Sports', code: 'SPT',
    tagline: 'Legends, immortalised.',
    description: 'The moments that defined the game. Action poses, iconic stances, stadium silhouettes.',
    gradient: ['#F12711', '#F5AF19'], motif: 'chevron', accent: '#F5AF19',
  },
  {
    slug: 'home-decor', name: 'Home Decor', code: 'DEC',
    tagline: 'Walls with warmth.',
    description: 'Botanicals, abstracts and minimalist line art designed to anchor a room.',
    gradient: ['#0B486B', '#56AB2F'], motif: 'leaf', accent: '#56AB2F',
  },
  {
    slug: 'marvel-dc', name: 'Marvel / DC', code: 'MDC',
    tagline: 'Heroes, assembled.',
    description: 'Comic-book classics and cinematic key art from the universes you grew up with.',
    gradient: ['#ED213A', '#932503'], motif: 'shield', accent: '#ED213A',
  },
  {
    slug: 'custom-prints', name: 'Custom Prints', code: 'CUS',
    tagline: 'Your wall, your story.',
    description: 'Upload your photo or artwork — we print it on your chosen material and size.',
    gradient: ['#7B2FF7', '#F107A3'], motif: 'spark', accent: '#F107A3',
  },
];

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

// ============================================================
//  PRODUCTS
//  Each product references a category slug. `index` within its
//  category becomes the NN in the product code.
// ============================================================
export interface Product {
  id: string;
  category: string; // category slug
  title: string;
  subtitle: string;
  palette: [string, string, string]; // artwork colours
  motif: string;
  price: number; // starting price (A4 canvas)
  tags: string[];
}

// helper to keep product definitions compact
function p(category: string, title: string, subtitle: string, palette: [string, string, string], motif: string, price: number, tags: string[] = []): Omit<Product, 'id'> {
  return { category, title, subtitle, palette, motif, price, tags };
}

const rawProducts: Omit<Product, 'id'>[] = [
  // ---- ANIME (15) ----
  p('anime', 'Crimson Dawn', 'A lone swordsman at sunrise', ['#7F1D1D', '#FBBF24', '#1E293B'], 'burst', 2490, ['action', 'solo', 'sunrise']),
  p('anime', 'Ocean of Stars', 'A girl reaching for the sky', ['#0EA5E9', '#1E3A8A', '#FDE68A'], 'burst', 2690, ['sky', 'dream', 'blue']),
  p('anime', 'Thunder Step', 'Speed in a single stride', ['#F59E0B', '#7C2D12', '#0F172A'], 'chevron', 2390, ['speed', 'yellow']),
  p('anime', 'Silent Sakura', 'Petals over a quiet village', ['#F472B6', '#831843', '#FEF3C7'], 'leaf', 2590, ['calm', 'pink', 'village']),
  p('anime', 'Iron Resolve', 'The mecha that stood last', ['#475569', '#0F172A', '#EF4444'], 'shield', 2890, ['mecha', 'red', 'robot']),
  p('anime', 'Fox Spirit', 'Nine tails at dusk', ['#F97316', '#7C2D12', '#1C1917'], 'burst', 2790, ['spirit', 'orange']),
  p('anime', 'Blade of Dawn', 'The cut that split the sky', ['#DC2626', '#FCD34D', '#111827'], 'burst', 2990, ['sword', 'action']),
  p('anime', 'Moonlit Vow', 'A promise under a full moon', ['#6366F1', '#1E1B4B', '#E0E7FF'], 'leaf', 2590, ['night', 'blue']),
  p('anime', 'Ember Eyes', 'The flame that never dies', ['#EA580C', '#7F1D1D', '#0C0A09'], 'burst', 2890, ['fire', 'demon']),
  p('anime', 'Garden of Echoes', 'Memories in full bloom', ['#10B981', '#064E3B', '#FCE7F3'], 'leaf', 2490, ['soft', 'green']),
  p('anime', 'Steel Heart', 'The knight who chose love', ['#94A3B8', '#1E293B', '#F87171'], 'shield', 2790, ['knight', 'romance']),
  p('anime', 'Phantom Drift', 'A ghost ship through clouds', ['#0891B2', '#0E7490', '#E2E8F0'], 'film', 2690, ['sea', 'mystery']),
  p('anime', 'Crimson Lotus', 'The bloom after the battle', ['#BE123C', '#831843', '#FECDD3'], 'leaf', 2590, ['flower', 'red']),
  p('anime', 'Skybound', 'The boy who chased horizons', ['#3B82F6', '#1D4ED8', '#FEF9C3'], 'burst', 2490, ['sky', 'adventure']),
  p('anime', 'Last Stand', 'The final frame of the war', ['#B91C1C', '#450A0A', '#FBBF24'], 'chevron', 2990, ['war', 'epic']),

  // ---- MOVIES (15) ----
  p('movies', 'Neon Boulevard', 'A rain-soaked night in LA', ['#EC4899', '#1E1B4B', '#FDE047'], 'film', 2890, ['noir', 'city', 'rain']),
  p('movies', 'Desert Mirage', 'A sci-fi epic across the dunes', ['#D97706', '#78350F', '#FEF3C7'], 'chevron', 2990, ['sci-fi', 'desert']),
  p('movies', 'Midnight Express', 'The train that never stops', ['#1E40AF', '#0C4A6E', '#E0E7FF'], 'film', 2790, ['thriller', 'train']),
  p('movies', 'Golden Hour Heist', 'The last job at sunset', ['#F59E0B', '#7C2D12', '#111827'], 'film', 2890, ['crime', 'sunset']),
  p('movies', 'Frozen Outpost', 'Survival at forty below', ['#0EA5E9', '#0C4A6E', '#E0F2FE'], 'shield', 2690, ['survival', 'ice']),
  p('movies', 'Crimson Dynasty', 'An empire of blood and silk', ['#B91C1C', '#450A0A', '#FCD34D'], 'shield', 2990, ['epic', 'royal']),
  p('movies', 'Starfall', 'A war among the stars', ['#6366F1', '#312E81', '#FDE68A'], 'burst', 3090, ['space', 'epic']),
  p('movies', 'The Quiet Lake', 'A horror in still water', ['#0F766E', '#134E4A', '#A7F3D0'], 'film', 2590, ['horror', 'lake']),
  p('movies', 'Concrete Jungle', 'The city as a character', ['#475569', '#1E293B', '#F59E0B'], 'film', 2790, ['urban', 'grit']),
  p('movies', 'Velvet Heist', 'A smooth crime in a smooth city', ['#7E22CE', '#3B0764', '#FBCFE8'], 'film', 2890, ['style', 'purple']),
  p('movies', 'Wasteland Riders', 'The road warriors return', ['#B45309', '#451A03', '#FDE68A'], 'chevron', 2990, ['post-apoc', 'cars']),
  p('movies', 'The Last Letter', 'A romance told in postage', ['#DC2626', '#7F1D1D', '#FEF3C7'], 'leaf', 2490, ['romance', 'soft']),
  p('movies', 'Deep Blue', 'The abyss looks back', ['#0EA5E9', '#0C4A6E', '#BAE6FD'], 'film', 2790, ['deep-sea', 'thriller']),
  p('movies', 'Paper Moon', 'A black-and-white kind of night', ['#6B7280', '#1F2937', '#F9FAFB'], 'film', 2590, ['classic', 'mono']),
  p('movies', 'Empire of Sand', 'The kingdom the desert swallowed', ['#D97706', '#92400E', '#FEF3C7'], 'shield', 2990, ['epic', 'desert']),

  // ---- SPORTS (15) ----
  p('sports', 'The Bicycle Kick', 'Defying gravity, defining the game', ['#F59E0B', '#7C2D12', '#0F172A'], 'chevron', 2690, ['football', 'iconic']),
  p('sports', 'Last Second Shot', 'The buzzer-beater that echoed', ['#DC2626', '#7F1D1D', '#FBBF24'], 'burst', 2790, ['basketball', 'clutch']),
  p('sports', 'The Cover Drive', 'Elegance in willow and leather', ['#0EA5E9', '#0C4A6E', '#FDE68A'], 'chevron', 2590, ['cricket', 'classic']),
  p('sports', 'Knockout Punch', 'The fist that changed history', ['#B91C1C', '#450A0A', '#FCD34D'], 'burst', 2890, ['boxing', 'power']),
  p('sports', 'The Long Drive', 'Fairway to glory', ['#10B981', '#064E3B', '#FEF3C7'], 'leaf', 2490, ['golf', 'green']),
  p('sports', 'Sprint Finish', 'The line that decided gold', ['#F59E0B', '#92400E', '#0F172A'], 'chevron', 2590, ['athletics', 'speed']),
  p('sports', 'The Slam Dunk', 'Above the rim, above the rest', ['#7C3AED', '#4C1D95', '#FDE047'], 'burst', 2790, ['basketball', 'power']),
  p('sports', 'Goalkeeper\'s Dive', 'The save that stopped time', ['#0EA5E9', '#0C4A6E', '#FBBF24'], 'shield', 2690, ['football', 'defense']),
  p('sports', 'The Serve', 'An ace under the sun', ['#F97316', '#7C2D12', '#FEF3C7'], 'burst', 2490, ['tennis', 'precision']),
  p('sports', 'Corner Flag', 'The celebration that shook the stadium', ['#16A34A', '#14532D', '#FBBF24'], 'chevron', 2590, ['football', 'joy']),
  p('sports', 'The Knockout Combo', 'Two hits, one ending', ['#DC2626', '#7F1D1D', '#0F172A'], 'burst', 2890, ['boxing', 'combo']),
  p('sports', 'Wicket Celebration', 'The roar after the wicket', ['#0D9488', '#134E4A', '#FDE68A'], 'chevron', 2590, ['cricket', 'fire']),
  p('sports', 'The Header', 'Airborne, unstoppable', ['#1D4ED8', '#1E3A8A', '#FDE047'], 'burst', 2690, ['football', 'air']),
  p('sports', 'Final Lap', 'The last curve before glory', ['#EA580C', '#7C2D12', '#0F172A'], 'chevron', 2590, ['racing', 'final']),
  p('sports', 'The Free Kick', 'Bending it beyond reach', ['#0EA5E9', '#0C4A6E', '#FDE68A'], 'burst', 2790, ['football', 'curve']),

  // ---- HOME DECOR (15) ----
  p('home-decor', 'Monstera Morning', 'Light through living leaves', ['#10B981', '#064E3B', '#FEF3C7'], 'leaf', 1990, ['botanical', 'green']),
  p('home-decor', 'Desert Lines', 'Minimalist dunes at dusk', ['#D97706', '#92400E', '#FEF3C7'], 'chevron', 2090, ['abstract', 'warm']),
  p('home-decor', 'Ocean Calm', 'A still sea, a still mind', ['#0EA5E9', '#0C4A6E', '#E0F2FE'], 'leaf', 2190, ['calm', 'blue']),
  p('home-decor', 'Terrazzo Dream', 'A modern speckled composition', ['#EC4899', '#831843', '#FDE68A'], 'burst', 2290, ['abstract', 'pink']),
  p('home-decor', 'Line Face', 'One-line portrait, endless feeling', ['#1E293B', '#0F172A', '#F8FAFC'], 'leaf', 1890, ['line-art', 'mono']),
  p('home-decor', 'Sunset Arch', 'Architecture in golden hour', ['#F59E0B', '#7C2D12', '#FEF3C7'], 'chevron', 2190, ['arch', 'warm']),
  p('home-decor', 'Bloom No. 7', 'A single flower, fully seen', ['#BE185D', '#831843', '#FCE7F3'], 'leaf', 1990, ['floral', 'pink']),
  p('home-decor', 'Mist over Pines', 'A forest waking up', ['#0D9488', '#134E4A', '#F0FDFA'], 'leaf', 2090, ['forest', 'teal']),
  p('home-decor', 'Brass Geometry', 'Warm metallic shapes on dark', ['#A07E2F', '#7A5E22', '#1E1B4B'], 'burst', 2390, ['geometric', 'brass']),
  p('home-decor', 'Wave Study', 'Hokusai-inspired modern swell', ['#0EA5E9', '#0C4A6E', '#FDE68A'], 'leaf', 2290, ['wave', 'blue']),
  p('home-decor', 'Coffee & Sun', 'A slow morning, framed', ['#92400E', '#451A03', '#FEF3C7'], 'leaf', 1990, ['cozy', 'brown']),
  p('home-decor', 'Marble Vein', 'Luxury in a single swirl', ['#94A3B8', '#475569', '#F8FAFC'], 'leaf', 2190, ['luxury', 'stone']),
  p('home-decor', 'Citrus Pop', 'A bright kitchen accent', ['#F97316', '#7C2D12', '#FEF3C7'], 'burst', 1990, ['kitchen', 'orange']),
  p('home-decor', 'Mountain Range', 'A minimalist horizon line', ['#475569', '#1E293B', '#FDE68A'], 'chevron', 2090, ['landscape', 'mono']),
  p('home-decor', 'Golden Hour', 'The last light, the best light', ['#F59E0B', '#B45309', '#FECDD3'], 'burst', 2290, ['sky', 'warm']),

  // ---- MARVEL / DC (15) ----
  p('marvel-dc', 'Web Slinger', 'The hero in the half-light', ['#DC2626', '#7F1D1D', '#1E3A8A'], 'burst', 2890, ['hero', 'red']),
  p('marvel-dc', 'Thunder God', 'A hammer raised to the storm', ['#3B82F6', '#1E3A8A', '#FDE68A'], 'burst', 2990, ['hero', 'thunder']),
  p('marvel-dc', 'Iron Resolve', 'A suit built for sacrifice', ['#EA580C', '#7C2D12', '#FCD34D'], 'shield', 3090, ['hero', 'gold']),
  p('marvel-dc', 'Night Knight', 'The dark defender rises', ['#1E293B', '#0F172A', '#FBBF24'], 'shield', 2990, ['hero', 'dark']),
  p('marvel-dc', 'Shield Throw', 'The spin that won the war', ['#1D4ED8', '#1E3A8A', '#DC2626'], 'shield', 2990, ['hero', 'shield']),
  p('marvel-dc', 'Green Rage', 'A smash heard round the world', ['#16A34A', '#14532D', '#FDE68A'], 'burst', 2890, ['hero', 'green']),
  p('marvel-dc', 'Speed Force', 'The lightning in his veins', ['#F59E0B', '#92400E', '#1E3A8A'], 'burst', 2990, ['hero', 'speed']),
  p('marvel-dc', 'Cape in Wind', 'The man who chose hope', ['#1D4ED8', '#1E3A8A', '#FDE68A'], 'burst', 3090, ['hero', 'hope']),
  p('marvel-dc', 'Lasso of Truth', 'The warrior princess', ['#A855F7', '#581C87', '#FBCFE8'], 'burst', 2990, ['hero', 'purple']),
  p('marvel-dc', 'Trident Rise', 'The king of the seas', ['#0EA5E9', '#0C4A6E', '#FDE68A'], 'shield', 2990, ['hero', 'sea']),
  p('marvel-dc', 'Claws Out', 'The mutant who walks alone', ['#FDE047', '#A16207', '#1E293B'], 'burst', 2890, ['hero', 'yellow']),
  p('marvel-dc', 'Cosmic Surf', 'Riding the edge of space', ['#6366F1', '#312E81', '#FDE68A'], 'burst', 3090, ['hero', 'cosmic']),
  p('marvel-dc', 'Bat Signal', 'A call answered in the dark', ['#1E1B4B', '#0F172A', '#FBBF24'], 'shield', 2990, ['hero', 'night']),
  p('marvel-dc', 'Thunder Strike', 'A storm named after a god', ['#3B82F6', '#1E3A8A', '#FCD34D'], 'burst', 2990, ['hero', 'storm']),
  p('marvel-dc', 'The Assemble', 'Six heroes, one frame', ['#DC2626', '#1D4ED8', '#FDE68A'], 'shield', 3190, ['team', 'epic']),

  // ---- CUSTOM PRINTS (15) ----
  p('custom-prints', 'Your Photo, Metal', 'Upload — we print on brushed aluminium', ['#475569', '#1E293B', '#E2E8F0'], 'spark', 2990, ['photo', 'metal']),
  p('custom-prints', 'Your Photo, Wood', 'Upload — we print on birch panel', ['#92400E', '#451A03', '#FEF3C7'], 'spark', 2790, ['photo', 'wood']),
  p('custom-prints', 'Your Photo, Canvas', 'Upload — we print on cotton canvas', ['#0D9488', '#134E4A', '#F0FDFA'], 'spark', 2490, ['photo', 'canvas']),
  p('custom-prints', 'Pet Portrait', 'Your companion, immortalised', ['#F472B6', '#831843', '#FEF3C7'], 'leaf', 3290, ['pet', 'portrait']),
  p('custom-prints', 'Family Frame', 'Generations on one wall', ['#F59E0B', '#7C2D12', '#FEF3C7'], 'leaf', 3290, ['family', 'portrait']),
  p('custom-prints', 'Wedding Vow', 'Your words, our typography', ['#BE123C', '#831843', '#FCE7F3'], 'leaf', 2990, ['wedding', 'text']),
  p('custom-prints', 'City Skyline', 'Your city, our line art', ['#1E293B', '#0F172A', '#FBBF24'], 'chevron', 2890, ['city', 'line']),
  p('custom-prints', 'Kids\' Doodle', 'Your child\'s art, gallery-grade', ['#EC4899', '#831843', '#FDE68A'], 'burst', 2690, ['kids', 'fun']),
  p('custom-prints', 'Quote Wall', 'A sentence that stays with you', ['#1E1B4B', '#0F172A', '#FDE68A'], 'spark', 2490, ['quote', 'text']),
  p('custom-prints', 'Map of Memory', 'A place that means everything', ['#0EA5E9', '#0C4A6E', '#FEF3C7'], 'leaf', 2890, ['map', 'place']),
  p('custom-prints', 'Logo Plate', 'Your brand, metal-grade', ['#A07E2F', '#7A5E22', '#1E1B4B'], 'shield', 3290, ['brand', 'logo']),
  p('custom-prints', 'Song Lyric', 'The line you can\'t stop singing', ['#7E22CE', '#3B0764', '#FBCFE8'], 'spark', 2490, ['music', 'text']),
  p('custom-prints', 'Anniversary Date', 'A number that changed everything', ['#DC2626', '#7F1D1D', '#FECDD3'], 'spark', 2690, ['date', 'love']),
  p('custom-prints', 'Recipe Plate', 'Grandma\'s recipe, preserved', ['#16A34A', '#14532D', '#FEF3C7'], 'leaf', 2790, ['food', 'text']),
  p('custom-prints', 'Constellation Map', 'The sky the night you were born', ['#1E1B4B', '#0F172A', '#FDE68A'], 'burst', 2990, ['stars', 'night']),
];

// Assign IDs and index per category
export const products: Product[] = rawProducts.map((rp, i) => ({
  ...rp,
  id: `p${String(i + 1).padStart(3, '0')}`,
}));

export function productsByCategory(slug: string): Product[] {
  return products.filter((pr) => pr.category === slug);
}

export function getProduct(id: string): Product | undefined {
  return products.find((pr) => pr.id === id);
}

// Index of a product within its category (for product code)
export function productIndex(product: Product): number {
  return productsByCategory(product.category).findIndex((pr) => pr.id === product.id) + 1;
}

export function formatPrice(n: number): string {
  return `${site.currency}${n.toLocaleString('en-PK')}`;
}
