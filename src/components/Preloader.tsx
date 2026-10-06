'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PERSON } from '@/data/portfolio';
import { prefersReducedMotion } from '@/lib/motion';
import { useSmoothScroll } from './SmoothScroll';

gsap.registerPlugin(ScrollTrigger);

const SESSION_KEY = 'ssu-preloader-seen';

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);
  const { lockScroll, unlockScroll } = useSmoothScroll();
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    lockScroll();
    window.scrollTo(0, 0);

    let seen = false;
    try {
      seen = sessionStorage.getItem(SESSION_KEY) === '1';
    } catch {
      /* storage unavailable — play the full intro */
    }

    let finished = false;
    const finish = () => {
      finished = true;
      try {
        sessionStorage.setItem(SESSION_KEY, '1');
      } catch {
        /* ignore */
      }
      unlockScroll();
      setDone(true);
      ScrollTrigger.refresh();
      onCompleteRef.current();
    };
    const release = () => {
      if (!finished) unlockScroll();
    };

    if (seen || prefersReducedMotion()) {
      const tween = gsap.to(root, { opacity: 0, duration: 0.4, delay: 0.1, ease: 'power2.out', onComplete: finish });
      return () => {
        tween.kill();
        release();
      };
    }

    const ctx = gsap.context(() => {
      const counter = { v: 0 };
      const tl = gsap.timeline({ onComplete: finish });

      tl.to(counter, {
        v: 100,
        duration: 1.6,
        ease: 'power2.inOut',
        onUpdate: () => {
          if (counterRef.current) counterRef.current.textContent = String(Math.round(counter.v)).padStart(2, '0');
        },
      }, 0)
        .fromTo(lineRef.current, { scaleX: 0 }, { scaleX: 1, duration: 1.6, ease: 'power2.inOut' }, 0)
        .from('.pl-char', { y: 20, opacity: 0, duration: 0.6, ease: 'power3.out', stagger: 0.04 }, 0.2)
        .from('.pl-role', { y: 14, opacity: 0, duration: 0.6, ease: 'power3.out' }, 0.7)
        .from('.pl-meta', { opacity: 0, duration: 0.5 }, 0)
        .to({}, { duration: 0.2 })
        .to(panelRef.current, { yPercent: -100, duration: 0.8, ease: 'expo.out' })
        .to(curtainRef.current, { yPercent: -100, duration: 0.8, ease: 'expo.out' }, '<0.1');
    }, root);

    return () => {
      ctx.revert();
      release();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (done) return null;

  const year = new Date().getFullYear();
  const words = PERSON.fullName.toUpperCase().split(' ');

  return (
    <div ref={rootRef} className="fixed inset-0 z-[10000]" role="progressbar" aria-label="Loading portfolio">
      <div ref={curtainRef} className="absolute inset-0 bg-[#5530A7]" />
      <div
        ref={panelRef}
        className="absolute inset-0 flex flex-col justify-between bg-[#0E0E0E] px-6 py-6 md:px-12 md:py-10"
      >
        <div className="pl-meta flex items-center justify-between text-xs font-medium uppercase tracking-[0.2em]">
          <span className="text-[#9A9A9A]">Portfolio © {year}</span>
          <span className="text-[#7B5CFF]">
            {PERSON.city.toUpperCase()}, {PERSON.countryCode}
          </span>
        </div>

        <div className="flex flex-col items-center text-center">
          <p className="font-display text-[clamp(2.25rem,9vw,8rem)] font-black uppercase leading-[0.95] tracking-[-0.03em]">
            {words.map((w, wi) => (
              <span key={wi} className="inline-block whitespace-nowrap">
                {Array.from(w).map((c, ci) => (
                  <span key={ci} className="pl-char inline-block">
                    {c}
                  </span>
                ))}
                {wi < words.length - 1 && <span className="inline-block">&nbsp;</span>}
              </span>
            ))}
          </p>
          <p className="pl-role mt-5 text-xs font-medium uppercase tracking-[0.3em] text-[#7B5CFF] sm:text-sm">
            {PERSON.role}
          </p>
        </div>

        <div>
          <div className="flex items-end justify-between gap-4">
            <span className="pl-meta text-[0.625rem] font-medium uppercase tracking-[0.2em] text-[#9A9A9A] sm:text-xs">
              Initializing agent runtime
            </span>
            <span className="font-display font-tabular text-6xl font-black leading-none md:text-8xl">
              <span ref={counterRef}>00</span>
            </span>
          </div>
          <div className="mt-4 h-[2px] w-full bg-[#2A2A2A]">
            <div ref={lineRef} className="h-full w-full origin-left bg-[#7B5CFF]" style={{ transform: 'scaleX(0)' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
