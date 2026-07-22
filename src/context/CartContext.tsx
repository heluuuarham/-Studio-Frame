import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { getProduct, getCategory, getSize, getMaterial, priceFor, productCode, productIndex, type MaterialId } from '@/config';

export interface CartItem {
  productId: string;
  sizeId: string;
  materialId: MaterialId;
  qty: number;
  // cached for display even if product removed from config
  title: string;
  category: string;
  unitPrice: number;
  code: string;
}

interface CartContextValue {
  items: CartItem[];
  add: (productId: string, sizeId: string, materialId: MaterialId, qty: number) => void;
  remove: (index: number) => void;
  setQty: (index: number, qty: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
  shipping: number;
  total: number;
  freeShippingThreshold: number;
  remainingForFree: number;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = 'sf_cart_v1';

function load(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(load);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const add = useCallback((productId: string, sizeId: string, materialId: MaterialId, qty: number) => {
    const product = getProduct(productId);
    if (!product) return;
    const cat = product.category;
    const idx = productIndex(product);
    const code = productCode(
      getCategory(cat)?.code ?? 'GEN',
      idx,
      sizeId,
      materialId,
    );
    const unitPrice = priceFor(sizeId, materialId);

    setItems((prev) => {
      const existing = prev.findIndex(
        (i) => i.productId === productId && i.sizeId === sizeId && i.materialId === materialId,
      );
      if (existing >= 0) {
        const next = [...prev];
        next[existing] = { ...next[existing], qty: next[existing].qty + qty };
        return next;
      }
      return [...prev, { productId, sizeId, materialId, qty, title: product.title, category: cat, unitPrice, code }];
    });
  }, []);

  const remove = useCallback((index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const setQty = useCallback((index: number, qty: number) => {
    setItems((prev) => {
      if (qty <= 0) return prev.filter((_, i) => i !== index);
      const next = [...prev];
      next[index] = { ...next[index], qty };
      return next;
    });
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const { count, subtotal } = useMemo(() => {
    let c = 0, s = 0;
    for (const i of items) { c += i.qty; s += i.qty * i.unitPrice; }
    return { count: c, subtotal: s };
  }, [items]);

  const threshold = 5000;
  const shipping = subtotal === 0 || subtotal >= threshold ? 0 : 250;
  const total = subtotal + shipping;

  const value: CartContextValue = {
    items, add, remove, setQty, clear,
    count, subtotal, shipping, total,
    freeShippingThreshold: threshold,
    remainingForFree: Math.max(0, threshold - subtotal),
  };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}

// re-export for convenience
export { getSize, getMaterial };
