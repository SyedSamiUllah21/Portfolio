'use client';

import { useEffect, useSyncExternalStore } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, CircleAlert, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'info' | 'error';

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
}

let toasts: ToastItem[] = [];
let nextId = 1;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export function showToast(message: string, type: ToastType = 'success') {
  toasts = [...toasts, { id: nextId++, message, type }];
  emit();
}

function dismiss(id: number) {
  toasts = toasts.filter((t) => t.id !== id);
  emit();
}

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
};
const EMPTY: ToastItem[] = [];

const STYLES: Record<ToastType, { icon: typeof Check; ring: string }> = {
  success: { icon: Check, ring: 'bg-emerald-500/15 text-emerald-400' },
  info: { icon: Info, ring: 'bg-[#7B5CFF]/15 text-[#B49CFF]' },
  error: { icon: CircleAlert, ring: 'bg-[#E3242B]/15 text-[#E3242B]' },
};

function ToastCard({ toast }: { toast: ToastItem }) {
  useEffect(() => {
    const t = window.setTimeout(() => dismiss(toast.id), 3500);
    return () => window.clearTimeout(t);
  }, [toast.id]);

  const { icon: TypeIcon, ring } = STYLES[toast.type];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 40, scale: 0.95 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      role="status"
      className="pointer-events-auto flex min-w-[16rem] max-w-[22rem] items-center gap-3 rounded-2xl border border-[#2A2A2A] bg-[#1F1F1F]/95 p-3 pr-2 shadow-[0_1.25rem_3rem_rgba(0,0,0,0.5)] backdrop-blur-md"
    >
      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${ring}`}>
        <TypeIcon size={16} />
      </span>
      <p className="flex-1 text-sm text-[#F5F5F5]">{toast.message}</p>
      <button
        type="button"
        onClick={() => dismiss(toast.id)}
        aria-label="Dismiss notification"
        className="flex h-7 w-7 items-center justify-center rounded-full text-[#9A9A9A] transition-colors hover:bg-white/5 hover:text-white"
      >
        <X size={14} />
      </button>
    </motion.div>
  );
}

export function ToastContainer() {
  const items = useSyncExternalStore(subscribe, () => toasts, () => EMPTY);
  return (
    <div aria-live="polite" className="pointer-events-none fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-2">
      <AnimatePresence initial={false}>
        {items.map((t) => (
          <ToastCard key={t.id} toast={t} />
        ))}
      </AnimatePresence>
    </div>
  );
}
