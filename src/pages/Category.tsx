import { useParams, Link, Navigate } from 'react-router-dom';
import { getCategory, productsByCategory } from '@/config';
import ProductCard from '@/components/ProductCard';
import { ChevronRight, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';

export default function Category() {
  const { slug } = useParams<{ slug: string }>();
  const category = slug ? getCategory(slug) : undefined;
  const [sort, setSort] = useState<'featured' | 'low' | 'high'>('featured');

  if (!category) return <Navigate to="/categories" replace />;

  let list = productsByCategory(category.slug);
  if (sort === 'low') list = [...list].sort((a, b) => a.price - b.price);
  if (sort === 'high') list = [...list].sort((a, b) => b.price - a.price);

  return (
    <div>
      {/* Category hero */}
      <div className="relative overflow-hidden border-b border-ink-100/10">
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${category.gradient[0]}, ${category.gradient[1]})` }} />
        <div className="absolute inset-0 bg-workshop-900/40" />
        <div className="shell relative py-16 md:py-20">
          <nav className="mb-6 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-ink-200/70">
            <Link to="/" className="hover:text-brass-400">Home</Link>
            <ChevronRight size={12} />
            <Link to="/categories" className="hover:text-brass-400">Categories</Link>
            <ChevronRight size={12} />
            <span className="text-ink-50">{category.name}</span>
          </nav>
          <p className="eyebrow text-ink-100/80">{category.tagline}</p>
          <h1 className="mt-2 font-display text-6xl text-ink-50 md:text-7xl">{category.name}</h1>
          <p className="mt-3 max-w-xl text-ink-200/80">{category.description}</p>
          <p className="mt-4 font-mono text-xs uppercase tracking-widest text-ink-200/60">{list.length} prints available</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="shell flex items-center justify-between py-6">
        <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-ink-400">
          <SlidersHorizontal size={14} />
          <span>Sort</span>
        </div>
        <div className="flex gap-1 rounded-sm border border-ink-100/10 p-0.5">
          {([['featured', 'Featured'], ['low', 'Price ↑'], ['high', 'Price ↓']] as const).map(([k, label]) => (
            <button
              key={k}
              onClick={() => setSort(k)}
              className={`rounded-sm px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors ${sort === k ? 'bg-brass-500 text-workshop-900' : 'text-ink-400 hover:text-ink-100'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="shell pb-16">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {list.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </div>
  );
}
