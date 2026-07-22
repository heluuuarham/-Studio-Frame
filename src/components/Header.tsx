import { Link, NavLink, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Menu, X, ShoppingBag, Search } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { site, categories } from '@/config';

export default function Header() {
  const { count } = useCart();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const loc = useLocation();

  useEffect(() => { setOpen(false); }, [loc.pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-40 transition-colors duration-300 ${scrolled ? 'bg-workshop-900/95 backdrop-blur-md border-b border-ink-100/10' : 'bg-transparent'}`}>
      <div className="shell flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 font-display text-xl tracking-tight text-ink-50">
          <span className="grid h-8 w-8 place-items-center rounded-sm bg-brass-500 text-workshop-900">SF</span>
          <span className="hidden sm:block">{site.name}</span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          <NavLink to="/" end className="font-mono text-xs uppercase tracking-widest text-ink-300 hover:text-brass-400 transition-colors">Home</NavLink>
          <NavLink to="/categories" className="font-mono text-xs uppercase tracking-widest text-ink-300 hover:text-brass-400 transition-colors">Shop</NavLink>
          {categories.slice(0, 4).map((c) => (
            <NavLink key={c.slug} to={`/category/${c.slug}`} className="font-mono text-xs uppercase tracking-widest text-ink-300 hover:text-brass-400 transition-colors">{c.name}</NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/cart" data-cart-target className="relative grid h-10 w-10 place-items-center rounded-sm border border-ink-100/15 text-ink-100 hover:border-brass-500 hover:text-brass-400 transition-colors">
            <ShoppingBag size={18} />
            {count > 0 && (
              <span className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-stamp-500 px-1 font-mono text-[10px] font-bold text-ink-50">{count}</span>
            )}
          </Link>
          <button onClick={() => setOpen((v) => !v)} className="grid h-10 w-10 place-items-center rounded-sm border border-ink-100/15 text-ink-100 lg:hidden">
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t border-ink-100/10 bg-workshop-800">
          <div className="shell py-4">
            <Link to="/" className="block py-2 font-mono text-sm uppercase tracking-widest text-ink-100">Home</Link>
            <Link to="/categories" className="block py-2 font-mono text-sm uppercase tracking-widest text-ink-100">All Categories</Link>
            <div className="my-2 h-px bg-ink-100/10" />
            {categories.map((c) => (
              <Link key={c.slug} to={`/category/${c.slug}`} className="block py-2 text-sm text-ink-300">{c.name}</Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
