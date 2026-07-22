import { useToast } from '@/context/ToastContext';
import { CheckCircle2, X } from 'lucide-react';

export default function ToastStack() {
  const { toasts, dismiss } = useToast();
  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-50 flex flex-col gap-2.5">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto w-[300px] animate-toastIn rounded-sm border border-brass-500/30 bg-workshop-700 p-4 shadow-2xl"
        >
          <div className="flex items-start gap-3">
            <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-teal-500" />
            <div className="flex-1">
              <p className="font-mono text-[10px] uppercase tracking-widest text-teal-500">Added to cart</p>
              <p className="mt-1 text-sm font-semibold text-ink-50">{t.title}</p>
              <p className="mt-0.5 text-xs text-ink-400">{t.body}</p>
            </div>
            <button onClick={() => dismiss(t.id)} className="text-ink-400 hover:text-ink-100"><X size={16} /></button>
          </div>
        </div>
      ))}
    </div>
  );
}
