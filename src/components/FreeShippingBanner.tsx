import { useCart } from '@/context/CartContext';
import { site } from '@/config';
import { Truck } from 'lucide-react';

export default function FreeShippingBanner() {
  const { subtotal, remainingForFree } = useCart();
  const pct = Math.min(100, (subtotal / site.freeShippingThreshold) * 100);

  return (
    <div className="border-b border-ink-100/10 bg-workshop-800">
      <div className="shell flex items-center gap-3 py-2.5">
        <Truck size={14} className="shrink-0 text-brass-500" />
        <p className="font-mono text-[11px] tracking-wide text-ink-300">
          {remainingForFree > 0 ? (
            <>Add <span className="font-bold text-brass-400">Rs.{remainingForFree.toLocaleString()}</span> for FREE shipping</>
          ) : (
            <span className="font-bold text-teal-500">You've unlocked FREE shipping</span>
          )}
        </p>
        <div className="ml-auto hidden h-1 w-32 overflow-hidden rounded-full bg-workshop-600 sm:block">
          <div className="h-full bg-brass-500 transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  );
}
