import { Link } from 'react-router-dom';
import { type Category, productsByCategory } from '@/config';
import Artwork from './Artwork';
import { ArrowUpRight } from 'lucide-react';

export default function CategoryCard({ category, large = false }: { category: Category; large?: boolean }) {
  const sample = productsByCategory(category.slug).slice(0, 3);
  return (
    <Link
      to={`/category/${category.slug}`}
      className={`group relative block overflow-hidden rounded-sm border border-ink-100/10 bg-workshop-800 transition-all duration-300 hover:border-brass-500/40 ${large ? 'aspect-[16/10] md:aspect-[16/9]' : 'aspect-[4/5]'}`}
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0 opacity-90 transition-transform duration-500 group-hover:scale-105"
        style={{ backgroundImage: `linear-gradient(135deg, ${category.gradient[0]}, ${category.gradient[1]})` }}
      />
      {/* Sample art peeking */}
      <div className="absolute bottom-0 right-0 flex h-1/2 w-1/2 items-end justify-end gap-1 overflow-hidden p-3 opacity-40">
        {sample.map((p) => (
          <div key={p.id} className="h-full w-1/3 overflow-hidden rounded-sm">
            <Artwork palette={p.palette} motif={p.motif} seed={p.id} className="h-full w-full" />
          </div>
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-workshop-900 via-workshop-900/30 to-transparent" />

      {/* Content */}
      <div className="relative flex h-full flex-col justify-between p-6">
        <div className="flex items-start justify-between">
          <span className="rounded-sm bg-workshop-900/60 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-ink-100 backdrop-blur">
            {productsByCategory(category.slug).length} prints
          </span>
          <span className="grid h-9 w-9 place-items-center rounded-full bg-workshop-900/60 text-ink-100 backdrop-blur transition-all duration-300 group-hover:bg-brass-500 group-hover:text-workshop-900">
            <ArrowUpRight size={18} />
          </span>
        </div>
        <div>
          <p className="eyebrow mb-1">{category.tagline}</p>
          <h3 className={`font-display leading-[0.95] text-ink-50 ${large ? 'text-5xl md:text-7xl' : 'text-3xl'}`}>{category.name}</h3>
          {large && <p className="mt-3 max-w-md text-sm text-ink-200/80">{category.description}</p>}
        </div>
      </div>
    </Link>
  );
}
