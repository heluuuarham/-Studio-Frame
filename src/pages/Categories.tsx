import { categories } from '@/config';
import CategoryCard from '@/components/CategoryCard';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function Categories() {
  return (
    <div className="shell py-12">
      <nav className="mb-6 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-ink-400">
        <Link to="/" className="hover:text-brass-400">Home</Link>
        <ChevronRight size={12} />
        <span className="text-ink-100">Categories</span>
      </nav>
      <div className="mb-10">
        <p className="eyebrow">All collections</p>
        <h1 className="mt-2 font-display text-5xl text-ink-50 md:text-6xl">Shop by Category</h1>
        <p className="mt-3 max-w-2xl text-ink-300">Six collections. 90+ designs. Each print available on metal, wood or canvas in six sizes.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => <CategoryCard key={c.slug} category={c} />)}
      </div>
    </div>
  );
}
