import { Link } from 'react-router-dom';
import { type Product, formatPrice, getCategory } from '@/config';
import Artwork from './Artwork';

export default function ProductCard({ product }: { product: Product }) {
  const cat = getCategory(product.category);
  return (
    <Link to={`/product/${product.id}`} className="group block">
      <div className="relative overflow-hidden rounded-sm border border-ink-100/10 bg-workshop-800 transition-all duration-300 group-hover:border-brass-500/40">
        <div className="aspect-[4/5] overflow-hidden">
          <Artwork palette={product.palette} motif={product.motif} seed={product.id} className="h-full w-full transition-transform duration-500 group-hover:scale-105" />
        </div>
        <div className="absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-workshop-900 via-workshop-900/80 to-transparent p-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <span className="inline-flex items-center gap-1.5 rounded-sm bg-brass-500 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-workshop-900">View Print</span>
        </div>
        <div className="absolute right-2 top-2 rounded-sm bg-workshop-900/80 px-2 py-1 font-mono text-[9px] uppercase tracking-wider text-ink-300 backdrop-blur">
          {cat?.code}
        </div>
      </div>
      <div className="mt-3">
        <h3 className="font-display text-base leading-tight text-ink-50 transition-colors group-hover:text-brass-400">{product.title}</h3>
        <p className="mt-0.5 line-clamp-1 text-xs text-ink-400">{product.subtitle}</p>
        <p className="mt-1.5 font-mono text-xs text-ink-300">From <span className="font-bold text-ink-50">{formatPrice(product.price)}</span></p>
      </div>
    </Link>
  );
}
