'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '@/lib/motion';

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!<>-_\\/[]{}=+*^?#';

/**
 * Hover scramble: random glyphs resolve left → right every 30ms.
 * Pass `active` from the parent's hover state, or let it handle its own hover.
 */
export default function ScrambleText({ text, active, className = '' }: { text: string; active?: boolean; className?: string }) {
  const [display, setDisplay] = useState(text);
  const timer = useRef<number | null>(null);

  const run = useCallback(() => {
    if (prefersReducedMotion()) return;
    if (timer.current) window.clearInterval(timer.current);
    let frame = 0;
    timer.current = window.setInterval(() => {
      const resolved = Math.floor(frame / 2);
      setDisplay(
        Array.from(text)
          .map((c, i) => (c === ' ' ? ' ' : i < resolved ? c : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
          .join(''),
      );
      frame += 1;
      if (resolved >= text.length) {
        if (timer.current) window.clearInterval(timer.current);
        timer.current = null;
        setDisplay(text);
      }
    }, 30);
  }, [text]);

  useEffect(() => {
    if (active) run();
  }, [active, run]);

  useEffect(
    () => () => {
      if (timer.current) window.clearInterval(timer.current);
    },
    [],
  );

  return (
    <span className={`relative inline-block ${className}`} onMouseEnter={active === undefined ? run : undefined}>
      {/* Invisible copy reserves the width so scrambling never shifts the layout. */}
      <span className="invisible" aria-hidden="true">
        {text}
      </span>
      <span className="absolute inset-0" aria-hidden="true">
        {display}
      </span>
      <span className="sr-only">{text}</span>
    </span>
  );
}
