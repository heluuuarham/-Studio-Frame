import { Link } from 'react-router-dom';
import { categories, products, site } from '@/config';
import CategoryCard from '@/components/CategoryCard';
import ProductCard from '@/components/ProductCard';
import Artwork from '@/components/Artwork';
import { ArrowRight, Truck, Shield, Palette, Sparkles } from 'lucide-react';

export default function Home() {
  const featured = products.slice(0, 8);
  const heroArt = products[0];

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Artwork palette={heroArt.palette} motif={heroArt.motif} seed="hero" className="h-full w-full" rounded={false} />
          <div className="absolute inset-0 bg-gradient-to-r from-workshop-900 via-workshop-900/80 to-workshop-900/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-workshop-900 via-transparent to-transparent" />
        </div>
        <div className="shell relative flex min-h-[88vh] flex-col justify-center py-20">
          <div className="max-w-2xl">
            <p className="eyebrow animate-fadeUp">Premium Wall Art Prints</p>
            <h1 className="mt-4 font-display text-6xl leading-[0.9] text-ink-50 sm:text-7xl md:text-8xl" style={{ animationDelay: '0.1s' }}>
              Wall Art<br />That Speaks.
            </h1>
            <p className="mt-6 max-w-md text-lg text-ink-200" style={{ animationDelay: '0.2s' }}>
              Anime, movies, sports, home decor, Marvel/DC and custom prints — on metal, wood and canvas. Built for your walls.
            </p>
            <div className="mt-8 flex flex-wrap gap-3" style={{ animationDelay: '0.3s' }}>
              <Link to="/categories" className="btn-brass">
                Shop All Collections <ArrowRight size={16} />
              </Link>
              <Link to="/category/custom-prints" className="btn-ghost">
                Create Custom Print
              </Link>
            </div>
          </div>
        </div>
        {/* Stats strip */}
        <div className="shell relative pb-10">
          <div className="grid grid-cols-2 gap-4 border-t border-ink-100/10 pt-6 md:grid-cols-4">
            {[
              { icon: Palette, label: '90+ Designs', sub: 'Across 6 collections' },
              { icon: Sparkles, label: '3 Materials', sub: 'Metal · Wood · Canvas' },
              { icon: Truck, label: 'Free Shipping', sub: `Over Rs.${site.freeShippingThreshold.toLocaleString()}` },
              { icon: Shield, label: 'Quality Guaranteed', sub: 'Museum-grade print' },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <s.icon size={20} className="text-brass-500" />
                <div>
                  <p className="font-mono text-xs font-bold uppercase tracking-wider text-ink-50">{s.label}</p>
                  <p className="text-[11px] text-ink-400">{s.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES — large visual cards */}
      <section className="shell py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="eyebrow">Browse by collection</p>
            <h2 className="mt-2 font-display text-4xl text-ink-50 md:text-5xl">Categories</h2>
          </div>
          <Link to="/categories" className="hidden font-mono text-xs uppercase tracking-widest text-brass-400 hover:text-brass-500 sm:block">View All →</Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {categories.slice(0, 4).map((c, i) => (
            <div key={c.slug} className={i === 0 ? 'md:col-span-2' : ''}>
              <CategoryCard category={c} large={i === 0} />
            </div>
          ))}
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {categories.slice(4).map((c) => (
            <CategoryCard key={c.slug} category={c} />
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="shell py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="eyebrow">Curated this week</p>
            <h2 className="mt-2 font-display text-4xl text-ink-50 md:text-5xl">Featured Prints</h2>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {featured.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>

      {/* MATERIALS STRIP */}
      <section className="shell py-16">
        <div className="rounded-sm border border-ink-100/10 bg-workshop-800 p-8 md:p-12">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div>
              <p className="eyebrow">Choose your surface</p>
              <h2 className="mt-2 font-display text-4xl text-ink-50 md:text-5xl">Metal. Wood. Canvas.</h2>
              <p className="mt-4 max-w-md text-ink-300">Every design is available on three premium surfaces. Brushed aluminium for a Displate-grade finish, birch wood for warmth, or cotton canvas for the classic gallery feel.</p>
              <Link to="/categories" className="mt-6 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-brass-400 hover:text-brass-500">
                Explore Materials <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { name: 'Metal', desc: 'Brushed aluminium', color: '#475569' },
                { name: 'Wood', desc: 'FSC birch panel', color: '#92400E' },
                { name: 'Canvas', desc: 'Cotton, gallery-wrapped', color: '#0D9488' },
              ].map((m) => (
                <div key={m.name} className="rounded-sm border border-ink-100/10 p-4 text-center">
                  <div className="mx-auto mb-3 h-16 w-16 rounded-full" style={{ background: m.color }} />
                  <p className="font-display text-lg text-ink-50">{m.name}</p>
                  <p className="mt-1 text-[11px] text-ink-400">{m.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="shell py-16">
        <div className="relative overflow-hidden rounded-sm border border-ink-100/10 p-10 text-center md:p-16" style={{ background: 'linear-gradient(135deg, #7B2FF7, #F107A3)' }}>
          <h2 className="font-display text-4xl text-white md:text-6xl">Your Wall, Your Story.</h2>
          <p className="mx-auto mt-4 max-w-md text-white/80">Upload your own photo or artwork and we'll print it on your chosen material and size.</p>
          <Link to="/category/custom-prints" className="mt-6 inline-flex items-center gap-2 rounded-sm bg-white px-6 py-3 font-mono text-xs font-bold uppercase tracking-wider text-workshop-900 hover:bg-ink-100 transition-colors">
            Start Custom Print <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
