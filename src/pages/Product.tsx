import { useState, useRef, useMemo } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import {
  getProduct, getCategory, productsByCategory, productIndex, productCode,
  sizes, materials, priceFor, formatPrice, products, type MaterialId, type Product,
} from '@/config';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import Artwork from '@/components/Artwork';
import ProductCard from '@/components/ProductCard';
import { ChevronRight, Check, Minus, Plus, ShoppingBag, Truck, Shield, RotateCcw } from 'lucide-react';

// ---- AI-style related product recommendations ----
// Scores every other product by shared tags + same category + palette similarity.
function recommend(current: Product, all: Product[], limit = 4): Product[] {
  const scored = all
    .filter((p) => p.id !== current.id)
    .map((p) => {
      let score = 0;
      // shared tags
      const shared = p.tags.filter((t) => current.tags.includes(t)).length;
      score += shared * 3;
      // same category
      if (p.category === current.category) score += 2;
      // palette similarity (color distance)
      const dist = colorDist(p.palette, current.palette);
      score += Math.max(0, 3 - dist);
      // motif match
      if (p.motif === current.motif) score += 1;
      return { p, score };
    })
    .sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.p);
}

function colorDist(a: string[], b: string[]): number {
  const da = a.map(hexToRgb);
  const db = b.map(hexToRgb);
  let min = Infinity;
  for (const x of da) for (const y of db) {
    const d = Math.sqrt((x[0]-y[0])**2 + (x[1]-y[1])**2 + (x[2]-y[2])**2) / 441;
    if (d < min) min = d;
  }
  return min;
}
function hexToRgb(h: string): [number, number, number] {
  const v = h.replace('#', '');
  return [parseInt(v.slice(0,2),16), parseInt(v.slice(2,4),16), parseInt(v.slice(4,6),16)];
}

export default function Product() {
  const { id } = useParams<{ id: string }>();
  const product = id ? getProduct(id) : undefined;
  const { add } = useCart();
  const { push } = useToast();
  const flyRef = useRef<HTMLDivElement>(null);

  const [sizeId, setSizeId] = useState('a4');
  const [materialId, setMaterialId] = useState<MaterialId>('canvas');
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [adding, setAdding] = useState(false);

  const related = useMemo(() => {
    if (!product) return [];
    return recommend(product, products);
  }, [product]);

  if (!product) return <Navigate to="/categories" replace />;

  const category = getCategory(product.category)!;
  const idx = productIndex(product);
  const code = productCode(category.code, idx, sizeId, materialId);
  const unitPrice = priceFor(sizeId, materialId);
  const total = unitPrice * qty;

  // Generate 4 "angles" of the artwork using different seeds
  const images = [0, 1, 2, 3].map((n) => `${product.id}-${n}`);

  const handleAdd = () => {
    setAdding(true);
    // fly-to-cart animation
    if (flyRef.current) {
      const fly = flyRef.current;
      const cart = document.querySelector('[data-cart-target]') as HTMLElement | null;
      if (cart) {
        const fr = fly.getBoundingClientRect();
        const cr = cart.getBoundingClientRect();
        fly.style.setProperty('--fly-x', `${cr.left - fr.left}px`);
        fly.style.setProperty('--fly-y', `${cr.top - fr.top}px`);
        fly.classList.add('animate-flyToCart');
      }
    }
    setTimeout(() => {
      add(product.id, sizeId, materialId, qty);
      push(product.title, `${code} · ${qty} × ${formatPrice(unitPrice)}`);
      setAdding(false);
      setQty(1);
      if (flyRef.current) flyRef.current.classList.remove('animate-flyToCart');
    }, 700);
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div className="shell pt-6">
        <nav className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-ink-400">
          <Link to="/" className="hover:text-brass-400">Home</Link>
          <ChevronRight size={12} />
          <Link to={`/category/${category.slug}`} className="hover:text-brass-400">{category.name}</Link>
          <ChevronRight size={12} />
          <span className="text-ink-100">{product.title}</span>
        </nav>
      </div>

      {/* Main */}
      <div className="shell grid gap-10 py-8 lg:grid-cols-2 lg:gap-16">
        {/* Gallery */}
        <div>
          <div className="relative overflow-hidden rounded-sm border border-ink-100/10 bg-workshop-800">
            <div className="aspect-[4/5]">
              <Artwork palette={product.palette} motif={product.motif} seed={images[activeImg]} className="h-full w-full" />
            </div>
            <div className="absolute left-3 top-3 rounded-sm bg-workshop-900/80 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-brass-400 backdrop-blur">
              Studio Frame
            </div>
            <div className="absolute right-3 top-3 rounded-sm bg-workshop-900/80 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-ink-300 backdrop-blur">
              {activeImg + 1} / 4
            </div>
          </div>
          <div className="mt-3 grid grid-cols-4 gap-3">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`overflow-hidden rounded-sm border-2 transition-colors ${activeImg === i ? 'border-brass-500' : 'border-ink-100/10 hover:border-ink-100/30'}`}
              >
                <div className="aspect-[4/5]">
                  <Artwork palette={product.palette} motif={product.motif} seed={img} className="h-full w-full" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <p className="eyebrow">{category.name}</p>
          <h1 className="mt-2 font-display text-5xl leading-[0.95] text-ink-50 md:text-6xl">{product.title}</h1>
          <p className="mt-3 text-lg text-ink-300">{product.subtitle}</p>

          {/* Price */}
          <div className="mt-6 flex items-baseline gap-3">
            <span className="font-display text-4xl text-brass-400">{formatPrice(unitPrice)}</span>
            <span className="font-mono text-xs uppercase tracking-wider text-ink-400">per print</span>
          </div>

          {/* Product code */}
          <div className="mt-4 inline-flex items-center gap-2 rounded-sm border border-ink-100/15 bg-workshop-800 px-3 py-1.5">
            <span className="font-mono text-[10px] uppercase tracking-widest text-ink-400">Product Code</span>
            <span className="font-mono text-xs font-bold text-brass-400">{code}</span>
          </div>

          {/* Material selector */}
          <div className="mt-8">
            <p className="label">Material</p>
            <div className="grid grid-cols-3 gap-2">
              {(Object.values(materials) as typeof materials[MaterialId][]).map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMaterialId(m.id)}
                  className={`rounded-sm border p-3 text-left transition-all ${materialId === m.id ? 'border-brass-500 bg-brass-500/10' : 'border-ink-100/15 hover:border-ink-100/30'}`}
                >
                  <span className={`block font-display text-lg ${materialId === m.id ? 'text-brass-400' : 'text-ink-50'}`}>{m.name}</span>
                  <span className="mt-0.5 block text-[11px] leading-tight text-ink-400">{m.blurb}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Size selector */}
          <div className="mt-6">
            <p className="label">Size</p>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
              {sizes.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSizeId(s.id)}
                  className={`rounded-sm border py-2.5 text-center transition-all ${sizeId === s.id ? 'border-brass-500 bg-brass-500/10' : 'border-ink-100/15 hover:border-ink-100/30'}`}
                >
                  <span className={`block font-mono text-xs font-bold ${sizeId === s.id ? 'text-brass-400' : 'text-ink-100'}`}>{s.code}</span>
                  <span className="mt-0.5 block text-[9px] text-ink-400">{s.label.split('·')[1]?.trim() ?? s.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Qty + Add */}
          <div className="mt-8 flex items-center gap-3">
            <div className="flex items-center rounded-sm border border-ink-100/15">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-12 w-12 place-items-center text-ink-300 hover:text-brass-400"><Minus size={16} /></button>
              <span className="w-10 text-center font-mono text-lg font-bold text-ink-50">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="grid h-12 w-12 place-items-center text-ink-300 hover:text-brass-400"><Plus size={16} /></button>
            </div>
            <button
              onClick={handleAdd}
              disabled={adding}
              className="relative flex-1"
            >
              <span className="btn-primary w-full justify-center text-sm">
                {adding ? 'Adding…' : `Add to Cart · ${formatPrice(total)}`}
              </span>
              {/* flying clone */}
              <div ref={flyRef} className="pointer-events-none absolute left-0 top-0 h-16 w-16 opacity-0">
                <Artwork palette={product.palette} motif={product.motif} seed={product.id} className="h-full w-full rounded-sm" />
              </div>
            </button>
          </div>

          {/* Trust badges */}
          <div className="mt-8 grid grid-cols-3 gap-3 border-t border-ink-100/10 pt-6">
            {[
              { icon: Truck, label: 'Free over Rs.5000' },
              { icon: Shield, label: 'Quality guaranteed' },
              { icon: RotateCcw, label: '7-day returns' },
            ].map((b, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5 text-center">
                <b.icon size={18} className="text-brass-500" />
                <span className="font-mono text-[10px] uppercase tracking-wider text-ink-400">{b.label}</span>
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="mt-8 rounded-sm border border-ink-100/10 bg-workshop-800 p-5">
            <p className="text-sm leading-relaxed text-ink-300">
              {product.subtitle}. Part of the {category.name} collection — printed on premium {materials[materialId].name.toLowerCase()} in your chosen size. Each print is made to order and shipped flat in protective packaging.
            </p>
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <section className="shell py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="eyebrow flex items-center gap-2"><Check size={12} /> AI-curated for you</p>
            <h2 className="mt-2 font-display text-3xl text-ink-50 md:text-4xl">You May Also Like</h2>
            <p className="mt-1 text-sm text-ink-400">Recommended based on style, palette and theme similarity.</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {related.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>
    </div>
  );
}
