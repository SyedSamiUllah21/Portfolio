'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { isFinePointer, prefersReducedMotion } from '@/lib/motion';

export type CursorState = 'default' | 'pointer' | 'project' | 'headline' | 'input';

interface CursorApi {
  /** Force a cursor state (e.g. while dragging); pass null to go back to automatic detection. */
  setCursorOverride: (state: CursorState | null) => void;
}

const CursorContext = createContext<CursorApi>({ setCursorOverride: () => {} });

export const useCursor = () => useContext(CursorContext);

export function CursorProvider({ children }: { children: React.ReactNode }) {
  const overrideRef = useRef<CursorState | null>(null);
  const [, force] = useState(0);
  const setCursorOverride = useCallback((s: CursorState | null) => {
    overrideRef.current = s;
    force((n) => n + 1);
  }, []);
  const api = useMemo(() => ({ setCursorOverride }), [setCursorOverride]);

  return (
    <CursorContext.Provider value={api}>
      {children}
      <CustomCursor overrideRef={overrideRef} />
    </CursorContext.Provider>
  );
}

const POINTER_SELECTOR = 'a, button, [role="button"], label, select, summary, [data-cursor="pointer"]';
const INPUT_SELECTOR = 'input:not([type="checkbox"]):not([type="radio"]):not([type="range"]), textarea, [contenteditable="true"]';

function resolveState(target: EventTarget | null): CursorState {
  if (!(target instanceof Element)) return 'default';
  const explicit = target.closest<HTMLElement>('[data-cursor]');
  const value = explicit?.dataset.cursor as CursorState | undefined;
  if (value === 'project' || value === 'headline' || value === 'input') return value;
  if (target.closest(INPUT_SELECTOR)) return 'input';
  if (value === 'pointer' || target.closest(POINTER_SELECTOR)) return 'pointer';
  return 'default';
}

function CustomCursor({ overrideRef }: { overrideRef: React.RefObject<CursorState | null> }) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [state, setState] = useState<CursorState>('default');
  const [visible, setVisible] = useState(false);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  // Effect 1: only decide whether the cursor should exist.
  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    const update = () => setIsEnabled(isFinePointer() && !prefersReducedMotion());
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // Effect 2: refs exist now that the enabled render has committed.
  useEffect(() => {
    if (!isEnabled) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    document.body.classList.add('custom-cursor-active');
    gsap.set([dot, ring], { xPercent: -50, yPercent: -50 });

    const dotX = gsap.quickTo(dot, 'x', { duration: 0.05 });
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.05 });
    const ringX = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power2.out' });
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power2.out' });

    let first = true;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType && e.pointerType !== 'mouse') return;
      if (first) {
        gsap.set([dot, ring], { x: e.clientX, y: e.clientY });
        first = false;
      }
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
      setVisible(true);
    };
    const onOver = (e: Event) => setState(overrideRef.current ?? resolveState(e.target));
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerover', onOver, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);
    document.documentElement.addEventListener('mouseenter', onEnter);

    return () => {
      document.body.classList.remove('custom-cursor-active');
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerover', onOver);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      document.documentElement.removeEventListener('mouseenter', onEnter);
    };
  }, [isEnabled, overrideRef]);

  if (!isEnabled) return null;

  const current = overrideRef.current ?? state;

  const ringStyles: Record<CursorState, string> = {
    default:
      'h-10 w-10 border-[1.5px] border-white/90 bg-transparent shadow-[0_0_14px_rgba(255,255,255,0.35),inset_0_0_10px_rgba(255,255,255,0.25)]',
    pointer:
      'h-14 w-14 border-2 border-white bg-white/10 shadow-[0_0_18px_rgba(255,255,255,0.45),inset_0_0_12px_rgba(255,255,255,0.3)]',
    project:
      'h-[5.625rem] w-[5.625rem] border-0 bg-[#7B5CFF] shadow-[0_0_40px_rgba(123,92,255,0.65)]',
    headline:
      'h-[7.5rem] w-[7.5rem] border border-white/50 bg-white/15 backdrop-blur-[3px] shadow-[0_0_30px_rgba(255,255,255,0.2)]',
    input: 'h-10 w-10 border-0 bg-transparent opacity-0',
  };

  const dotStyles: Record<CursorState, string> = {
    default: 'h-3 w-3 rounded-full',
    pointer: 'h-2 w-2 rounded-full',
    project: 'h-0 w-0 rounded-full opacity-0',
    headline: 'h-2 w-2 rounded-full',
    input: 'h-5 w-[2px] rounded-sm',
  };

  return (
    <div aria-hidden="true" className={`transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      <div
        ref={ringRef}
        className={`pointer-events-none fixed left-0 top-0 z-[99999] flex items-center justify-center rounded-full transition-[width,height,background-color,border-color,border-width,box-shadow,opacity] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${ringStyles[current]}`}
      >
        <span
          className={`whitespace-nowrap text-[0.6875rem] font-bold tracking-[0.15em] text-white transition-opacity duration-200 ${
            current === 'project' ? 'opacity-100' : 'opacity-0'
          }`}
        >
          VIEW ↗
        </span>
      </div>
      <div
        ref={dotRef}
        className={`pointer-events-none fixed left-0 top-0 z-[99999] bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.4),0_0_12px_4px_rgba(255,255,255,0.75)] transition-[width,height,border-radius,opacity] duration-200 ${dotStyles[current]}`}
      />
    </div>
  );
}
