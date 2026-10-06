'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    const setScale = gsap.quickSetter(bar, 'scaleX') as (v: number) => void;
    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      refreshPriority: -1,
      onUpdate: (self) => setScale(self.progress),
      onRefresh: (self) => setScale(self.progress),
    });
    return () => st.kill();
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-[9995] h-[2.5px]">
      <div
        ref={barRef}
        className="h-full w-full origin-left bg-gradient-to-r from-[#5530A7] via-[#7B5CFF] to-[#C9BCFF] shadow-[0_0_12px_rgba(123,92,255,0.8)]"
        style={{ transform: 'scaleX(0)' }}
      />
    </div>
  );
}
