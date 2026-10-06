'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MARQUEE_ROW_1, MARQUEE_ROW_2 } from '@/data/portfolio';
import { prefersReducedMotion } from '@/lib/motion';

gsap.registerPlugin(ScrollTrigger);

const BASE_SPEED = 1.2;
const MAX_BOOST = 9;
const MAX_SKEW = 10;

function Row({ words, variant, reverseStar }: { words: string[]; variant: 'solid' | 'outline'; reverseStar?: boolean }) {
  const items = [...words, ...words];
  return (
    <>
      {[0, 1].map((copy) => (
        <div key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1 ? true : undefined}>
          {items.map((w, i) => (
            <span key={`${copy}-${i}`} className="flex items-center">
              <span
                className={`px-6 font-display text-4xl font-extrabold uppercase leading-none tracking-tight sm:text-5xl lg:text-6xl ${
                  variant === 'solid' ? 'text-[#0E0E0E]' : 'text-stroke text-white'
                }`}
              >
                {w}
              </span>
              <span
                className={`${reverseStar ? 'spin-star-reverse' : 'spin-star'} text-2xl sm:text-3xl ${
                  variant === 'solid' ? 'text-[#0E0E0E]' : 'text-[#7B5CFF]'
                }`}
              >
                ✦
              </span>
            </span>
          ))}
        </div>
      ))}
    </>
  );
}

export default function VelocityMarquee() {
  const sectionRef = useRef<HTMLElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const r1 = row1Ref.current;
    const r2 = row2Ref.current;
    if (!r1 || !r2 || prefersReducedMotion()) return;

    let x1 = 0;
    let x2 = 0;
    let direction = 1;
    let boost = 1;
    let targetBoost = 1;
    let skew = 0;
    let targetSkew = 0;

    const setX1 = gsap.quickSetter(r1, 'x', 'px') as (v: number) => void;
    const setX2 = gsap.quickSetter(r2, 'x', 'px') as (v: number) => void;
    const setSkew1 = gsap.quickSetter(r1, 'skewX', 'deg') as (v: number) => void;
    const setSkew2 = gsap.quickSetter(r2, 'skewX', 'deg') as (v: number) => void;

    const observer = ScrollTrigger.observe({
      target: window,
      type: 'wheel,touch,scroll',
      onChangeY: (self) => {
        const v = self.velocityY;
        direction = v < 0 ? -1 : 1;
        targetBoost = Math.min(MAX_BOOST, 1 + Math.abs(v) / 400);
        targetSkew = gsap.utils.clamp(-MAX_SKEW, MAX_SKEW, v / 250);
      },
    });

    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    if (sectionRef.current) io.observe(sectionRef.current);

    const tick = (_t: number, dt: number) => {
      // Ease towards the target, then let the target relax back to rest.
      boost += (targetBoost - boost) * 0.1;
      skew += (targetSkew - skew) * 0.12;
      targetBoost += (1 - targetBoost) * 0.06;
      targetSkew += (0 - targetSkew) * 0.08;
      if (!visible) return;

      const frame = dt / 16.667;
      const speed = BASE_SPEED * boost * direction * frame;
      const w1 = r1.scrollWidth / 2;
      const w2 = r2.scrollWidth / 2;
      x1 -= speed;
      x2 += speed;
      if (w1 > 0) x1 = gsap.utils.wrap(-w1, 0, x1);
      if (w2 > 0) x2 = gsap.utils.wrap(-w2, 0, x2);
      setX1(x1);
      setX2(x2);
      setSkew1(skew);
      setSkew2(skew);
    };
    x2 = -r2.scrollWidth / 4;
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      observer.kill();
      io.disconnect();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="Focus areas"
      className="relative overflow-hidden border-t border-[#2A2A2A] bg-[#0E0E0E] py-28 sm:py-36"
    >
      <div aria-hidden="true" className="pointer-events-none absolute left-[10%] top-1/2 h-[20rem] w-[30rem] -translate-y-1/2 rounded-full bg-[#7B5CFF]/25 blur-[7rem]" />
      <div aria-hidden="true" className="pointer-events-none absolute right-[5%] top-1/3 h-[16rem] w-[26rem] rounded-full bg-[#5530A7]/30 blur-[6rem]" />

      <p className="sr-only">{[...MARQUEE_ROW_1, ...MARQUEE_ROW_2].join(', ')}</p>

      <div aria-hidden="true" className="relative grid place-items-center">
        <div className="col-start-1 row-start-1 w-[130vw] rotate-[5deg] overflow-hidden border-y-2 border-[#7B5CFF] bg-[#7B5CFF] py-4 shadow-[0_0_3rem_rgba(123,92,255,0.35)] sm:py-5">
          <div ref={row1Ref} className="flex w-max will-change-transform">
            <Row words={MARQUEE_ROW_1} variant="solid" />
          </div>
        </div>
        <div className="col-start-1 row-start-1 w-[130vw] -rotate-[5deg] overflow-hidden border-y-2 border-[#7B5CFF] bg-[#1A1A1A] py-4 sm:py-5">
          <div ref={row2Ref} className="flex w-max will-change-transform">
            <Row words={MARQUEE_ROW_2} variant="outline" reverseStar />
          </div>
        </div>
      </div>
    </section>
  );
}
