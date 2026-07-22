import { Link } from 'react-router-dom';
import { Instagram, Facebook, Mail, Phone } from 'lucide-react';
import { site, categories } from '@/config';

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-ink-100/10 bg-workshop-800">
      <div className="shell py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 font-display text-2xl text-ink-50">
              <span className="grid h-9 w-9 place-items-center rounded-sm bg-brass-500 text-workshop-900">SF</span>
              {site.name}
            </div>
            <p className="mt-4 max-w-sm text-sm text-ink-400">{site.tagline} Premium wall art prints on metal, wood and canvas. Made for your walls, shipped across Pakistan.</p>
            <div className="mt-5 flex gap-3">
              <a href="#" className="grid h-9 w-9 place-items-center rounded-sm border border-ink-100/15 text-ink-300 hover:border-brass-500 hover:text-brass-400 transition-colors"><Instagram size={16} /></a>
              <a href="#" className="grid h-9 w-9 place-items-center rounded-sm border border-ink-100/15 text-ink-300 hover:border-brass-500 hover:text-brass-400 transition-colors"><Facebook size={16} /></a>
              <a href={`mailto:${site.email}`} className="grid h-9 w-9 place-items-center rounded-sm border border-ink-100/15 text-ink-300 hover:border-brass-500 hover:text-brass-400 transition-colors"><Mail size={16} /></a>
              <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noreferrer" className="grid h-9 w-9 place-items-center rounded-sm border border-ink-100/15 text-ink-300 hover:border-brass-500 hover:text-brass-400 transition-colors"><Phone size={16} /></a>
            </div>
          </div>

          <div>
            <h4 className="font-mono text-[10px] uppercase tracking-widest text-brass-500">Shop</h4>
            <ul className="mt-4 space-y-2">
              {categories.map((c) => (
                <li key={c.slug}><Link to={`/category/${c.slug}`} className="text-sm text-ink-300 hover:text-ink-50 transition-colors">{c.name}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-[10px] uppercase tracking-widest text-brass-500">Help</h4>
            <ul className="mt-4 space-y-2">
              <li><Link to="/cart" className="text-sm text-ink-300 hover:text-ink-50 transition-colors">Cart</Link></li>
              <li><Link to="/checkout" className="text-sm text-ink-300 hover:text-ink-50 transition-colors">Checkout</Link></li>
              <li><a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noreferrer" className="text-sm text-ink-300 hover:text-ink-50 transition-colors">WhatsApp Us</a></li>
              <li><span className="text-sm text-ink-300">Free shipping over {site.currency}{site.freeShippingThreshold.toLocaleString()}</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-ink-100/10 pt-6 sm:flex-row">
          <p className="font-mono text-[11px] text-ink-400">© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
          <p className="font-mono text-[11px] text-ink-400">Printed in Pakistan · Shipped nationwide</p>
        </div>
      </div>
    </footer>
  );
}
