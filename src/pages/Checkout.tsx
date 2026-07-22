import { useState, type FormEvent } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { formatPrice, site } from '@/config';
import { ChevronRight, Check, MessageCircle, AlertCircle } from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  terms: boolean;
}

interface Errors {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  terms?: string;
}

export default function Checkout() {
  const { items, subtotal, shipping, total, clear } = useCart();
  const [form, setForm] = useState<FormData>({ name: '', email: '', phone: '', address: '', city: '', terms: false });
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  if (items.length === 0 && !submitted) return <Navigate to="/cart" replace />;

  const validate = (): boolean => {
    const e: Errors = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.phone.trim()) e.phone = 'Phone is required';
    else if (!/^(\+?92|0)?3\d{9}$/.test(form.phone.replace(/[\s-]/g, ''))) e.phone = 'Enter a valid Pakistani mobile (e.g. 03XXXXXXXXX)';
    if (!form.address.trim()) e.address = 'Address is required';
    if (!form.city) e.city = 'Select your city';
    if (!form.terms) e.terms = 'You must accept the terms';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const buildWhatsAppMessage = (): string => {
    const lines: string[] = [];
    lines.push('*STUDIO FRAME — NEW ORDER*');
    lines.push('');
    lines.push(`*Name:* ${form.name}`);
    lines.push(`*Email:* ${form.email}`);
    lines.push(`*Phone:* ${form.phone}`);
    lines.push(`*Address:* ${form.address}`);
    lines.push(`*City:* ${form.city}`);
    lines.push('');
    lines.push('*ORDERED ITEMS:*');
    items.forEach((it, i) => {
      lines.push(`${i + 1}. ${it.title}`);
      lines.push(`   Code: ${it.code}`);
      lines.push(`   Qty: ${it.qty} × ${formatPrice(it.unitPrice)} = ${formatPrice(it.unitPrice * it.qty)}`);
    });
    lines.push('');
    lines.push(`*Subtotal:* ${formatPrice(subtotal)}`);
    lines.push(`*Shipping:* ${shipping === 0 ? 'FREE' : formatPrice(shipping)}`);
    lines.push(`*TOTAL:* ${formatPrice(total)}`);
    return lines.join('\n');
  };

  const handleSubmit = (ev: FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    const msg = encodeURIComponent(buildWhatsAppMessage());
    const url = `https://wa.me/${site.whatsapp}?text=${msg}`;
    window.open(url, '_blank');
    setSubmitted(true);
    clear();
  };

  if (submitted) {
    return (
      <div className="shell py-20">
        <div className="mx-auto max-w-md text-center">
          <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full bg-teal-500/15">
            <Check size={36} className="text-teal-500" />
          </div>
          <h1 className="font-display text-4xl text-ink-50">Order Sent!</h1>
          <p className="mt-3 text-ink-300">We've opened WhatsApp with your order details. Our team will confirm your order and payment shortly.</p>
          <Link to="/categories" className="mt-6 inline-flex btn-brass">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="shell py-10">
      <nav className="mb-6 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-ink-400">
        <Link to="/" className="hover:text-brass-400">Home</Link>
        <ChevronRight size={12} />
        <Link to="/cart" className="hover:text-brass-400">Cart</Link>
        <ChevronRight size={12} />
        <span className="text-ink-100">Checkout</span>
      </nav>

      <h1 className="mb-8 font-display text-5xl text-ink-50 md:text-6xl">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-3">
        {/* Form fields */}
        <div className="space-y-5 lg:col-span-2">
          <div className="rounded-sm border border-ink-100/10 bg-workshop-800 p-6">
            <h2 className="mb-5 font-display text-2xl text-ink-50">Delivery Details</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Full Name</label>
                <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" />
                {errors.name && <p className="mt-1 flex items-center gap-1 text-[11px] text-stamp-500"><AlertCircle size={11} /> {errors.name}</p>}
              </div>
              <div>
                <label className="label">Email</label>
                <input className="input" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
                {errors.email && <p className="mt-1 flex items-center gap-1 text-[11px] text-stamp-500"><AlertCircle size={11} /> {errors.email}</p>}
              </div>
              <div>
                <label className="label">Phone</label>
                <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="03XXXXXXXXX" />
                {errors.phone && <p className="mt-1 flex items-center gap-1 text-[11px] text-stamp-500"><AlertCircle size={11} /> {errors.phone}</p>}
              </div>
              <div>
                <label className="label">City</label>
                <select className="input" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}>
                  <option value="">Select city</option>
                  {site.cities.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.city && <p className="mt-1 flex items-center gap-1 text-[11px] text-stamp-500"><AlertCircle size={11} /> {errors.city}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className="label">Full Address</label>
                <textarea className="input min-h-[80px]" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="House #, street, area, landmark…" />
                {errors.address && <p className="mt-1 flex items-center gap-1 text-[11px] text-stamp-500"><AlertCircle size={11} /> {errors.address}</p>}
              </div>
            </div>
            <div className="mt-5">
              <label className="flex cursor-pointer items-start gap-3">
                <input type="checkbox" checked={form.terms} onChange={(e) => setForm({ ...form, terms: e.target.checked })} className="mt-0.5 h-4 w-4 accent-brass-500" />
                <span className="text-sm text-ink-300">I agree to the <span className="text-brass-400">Terms & Conditions</span> and confirm the order details are correct. I understand payment will be confirmed via WhatsApp.</span>
              </label>
              {errors.terms && <p className="mt-1 flex items-center gap-1 text-[11px] text-stamp-500"><AlertCircle size={11} /> {errors.terms}</p>}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div>
          <div className="sticky top-24 rounded-sm border border-ink-100/10 bg-workshop-800 p-6">
            <h2 className="font-display text-2xl text-ink-50">Your Order</h2>
            <div className="mt-4 max-h-64 space-y-3 overflow-y-auto">
              {items.map((it, i) => (
                <div key={i} className="flex justify-between gap-2 text-sm">
                  <div className="flex-1">
                    <p className="text-ink-100">{it.title}</p>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-ink-400">{it.code} · ×{it.qty}</p>
                  </div>
                  <span className="font-mono text-ink-100">{formatPrice(it.unitPrice * it.qty)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-2 border-t border-ink-100/10 pt-4 text-sm">
              <div className="flex justify-between text-ink-300"><span>Subtotal</span><span className="font-mono">{formatPrice(subtotal)}</span></div>
              <div className="flex justify-between text-ink-300"><span>Shipping</span><span className="font-mono">{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span></div>
              <div className="flex justify-between border-t border-ink-100/10 pt-2">
                <span className="font-display text-xl text-ink-50">Total</span>
                <span className="font-display text-xl text-brass-400">{formatPrice(total)}</span>
              </div>
            </div>
            <button type="submit" className="mt-5 w-full justify-center rounded-sm bg-[#25D366] px-6 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#1da851] active:scale-[0.98] flex items-center gap-2">
              <MessageCircle size={16} /> Place Order via WhatsApp
            </button>
            <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-wider text-ink-400">Opens WhatsApp with your order pre-filled</p>
          </div>
        </div>
      </form>
    </div>
  );
}
