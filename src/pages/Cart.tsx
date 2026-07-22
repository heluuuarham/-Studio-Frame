import { Link } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { formatPrice, materials, sizes, site } from '@/config';
import Artwork from '@/components/Artwork';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, ChevronRight, Truck } from 'lucide-react';

export default function Cart() {
  const { items, remove, setQty, subtotal, shipping, total, remainingForFree } = useCart();

  if (items.length === 0) {
    return (
      <div className="shell py-20">
        <div className="mx-auto max-w-md text-center">
          <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full border border-ink-100/15">
            <ShoppingBag size={32} className="text-ink-400" />
          </div>
          <h1 className="font-display text-4xl text-ink-50">Your Cart is Empty</h1>
          <p className="mt-3 text-ink-400">Looks like you haven't added any prints yet.</p>
          <Link to="/categories" className="mt-6 inline-flex btn-brass">
            Browse Collections <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="shell py-10">
      <nav className="mb-6 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-ink-400">
        <Link to="/" className="hover:text-brass-400">Home</Link>
        <ChevronRight size={12} />
        <span className="text-ink-100">Cart</span>
      </nav>

      <h1 className="mb-8 font-display text-5xl text-ink-50 md:text-6xl">Your Cart</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Items */}
        <div className="lg:col-span-2">
          {/* Free shipping progress */}
          {remainingForFree > 0 ? (
            <div className="mb-4 flex items-center gap-3 rounded-sm border border-brass-500/30 bg-brass-500/5 p-3">
              <Truck size={16} className="shrink-0 text-brass-500" />
              <p className="text-sm text-ink-200">Add <span className="font-bold text-brass-400">{formatPrice(remainingForFree)}</span> more for free shipping</p>
            </div>
          ) : (
            <div className="mb-4 flex items-center gap-3 rounded-sm border border-teal-500/30 bg-teal-500/5 p-3">
              <Truck size={16} className="shrink-0 text-teal-500" />
              <p className="text-sm text-teal-500">You've unlocked free shipping!</p>
            </div>
          )}

          <div className="divide-y divide-ink-100/10 rounded-sm border border-ink-100/10">
            {items.map((item, i) => {
              const mat = materials[item.materialId];
              const sz = sizes.find((s) => s.id === item.sizeId);
              return (
                <div key={i} className="flex gap-4 p-4">
                  <Link to={`/product/${item.productId}`} className="shrink-0">
                    <div className="h-28 w-22 overflow-hidden rounded-sm border border-ink-100/10">
                      <Artwork
                        palette={(getProductPalette(item.productId))}
                        motif={(getProductMotif(item.productId))}
                        seed={item.productId}
                        className="h-full w-full"
                      />
                    </div>
                  </Link>
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between gap-2">
                      <div>
                        <Link to={`/product/${item.productId}`} className="font-display text-lg text-ink-50 hover:text-brass-400">{item.title}</Link>
                        <p className="mt-0.5 font-mono text-[11px] uppercase tracking-wider text-ink-400">{item.code}</p>
                        <p className="mt-1 text-xs text-ink-300">{mat.name} · {sz?.label}</p>
                      </div>
                      <button onClick={() => remove(i)} className="text-ink-400 hover:text-stamp-500 transition-colors"><Trash2 size={16} /></button>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <div className="flex items-center rounded-sm border border-ink-100/15">
                        <button onClick={() => setQty(i, item.qty - 1)} className="grid h-8 w-8 place-items-center text-ink-300 hover:text-brass-400"><Minus size={14} /></button>
                        <span className="w-8 text-center font-mono text-sm font-bold text-ink-50">{item.qty}</span>
                        <button onClick={() => setQty(i, item.qty + 1)} className="grid h-8 w-8 place-items-center text-ink-300 hover:text-brass-400"><Plus size={14} /></button>
                      </div>
                      <span className="font-mono text-sm font-bold text-brass-400">{formatPrice(item.unitPrice * item.qty)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-sm border border-ink-100/10 bg-workshop-800 p-6">
            <h2 className="font-display text-2xl text-ink-50">Order Summary</h2>
            <div className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between text-ink-300">
                <span>Subtotal</span>
                <span className="font-mono text-ink-100">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-ink-300">
                <span>Shipping</span>
                <span className="font-mono text-ink-100">{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
              </div>
              {remainingForFree > 0 && (
                <p className="text-[11px] text-ink-400">Add {formatPrice(remainingForFree)} for free shipping</p>
              )}
              <div className="border-t border-ink-100/10 pt-3">
                <div className="flex justify-between">
                  <span className="font-display text-xl text-ink-50">Total</span>
                  <span className="font-display text-xl text-brass-400">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
            <Link to="/checkout" className="mt-6 btn-primary w-full justify-center text-sm">
              Proceed to Checkout <ArrowRight size={16} />
            </Link>
            <Link to="/categories" className="mt-3 btn-ghost w-full justify-center">Continue Shopping</Link>
            <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-wider text-ink-400">WhatsApp order · {site.currency}{site.freeShippingThreshold}+ ships free</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// helpers to fetch palette/motif for cart artwork
import { getProduct } from '@/config';
function getProductPalette(id: string): [string, string, string] {
  return getProduct(id)?.palette ?? ['#475569', '#1E293B', '#E2E8F0'];
}
function getProductMotif(id: string): string {
  return getProduct(id)?.motif ?? 'burst';
}
