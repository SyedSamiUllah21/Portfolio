'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SERVICES_DATA, SERVICES_INTRO, sectionIndex } from '@/data/portfolio';
import { prefersReducedMotion, REPLAY } from '@/lib/motion';
import { revealSectionHeader } from '@/lib/reveal';
import SectionHeader from './SectionHeader';
import HeroShader from './HeroShader';
import { Icon } from './icons';

gsap.registerPlugin(ScrollTrigger);

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      revealSectionHeader(section);
      gsap.from('.services-intro', {
        y: 30,
        opacity: 0,
        duration: 0.9,
        ease: 'power4.out',
        scrollTrigger: { trigger: '.services-intro', start: 'top 85%', end: 'bottom 10%', toggleActions: REPLAY },
      });

      const wraps = gsap.utils.toArray<HTMLElement>('.service-sticky');
      const cards = wraps.map((w) => w.querySelector<HTMLElement>('.service-card')!);

      // Each card shrinks as the cards after it slide over (0.035 per level, max 3 levels).
      cards.forEach((card, i) => {
        for (let depth = 1; depth <= 3 && i + depth < wraps.length; depth++) {
          const next = wraps[i + depth];
          gsap.fromTo(
            card,
            { scale: 1 - 0.035 * (depth - 1) },
            {
              scale: 1 - 0.035 * depth,
              ease: 'none',
              immediateRender: depth === 1,
              scrollTrigger: {
                trigger: next,
                start: 'top bottom',
                end: () => `top ${parseFloat(getComputedStyle(next).top) || 0}px`,
                scrub: true,
                invalidateOnRefresh: true,
              },
            },
          );
        }
      });

      // Icon rotates as the card scrolls.
      wraps.forEach((w) => {
        const icon = w.querySelector('.service-icon');
        if (!icon) return;
        gsap.fromTo(
          icon,
          { rotate: -20 },
          { rotate: 20, ease: 'none', scrollTrigger: { trigger: w, start: 'top bottom', end: 'bottom top', scrub: true } },
        );
      });

      // Content rises in.
      wraps.forEach((w) => {
        gsap.from(w.querySelectorAll('.service-reveal'), {
          y: 40,
          opacity: 0,
          duration: 0.9,
          ease: 'power4.out',
          stagger: 0.08,
          scrollTrigger: { trigger: w, start: 'top 85%', end: 'bottom 10%', toggleActions: REPLAY },
        });
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="services"
      ref={sectionRef}
      aria-labelledby="services-title"
      className="relative border-t border-[#2A2A2A] bg-[#0E0E0E] px-6 py-28 md:px-12"
    >
      <div className="mx-auto max-w-[90rem]">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader id="services-title" index={sectionIndex('#services')} label="Services" lines={[{ text: 'What I' }, { text: 'build.', accent: true }]} />
          <p className="services-intro max-w-[24rem] text-base leading-relaxed text-[#9A9A9A] lg:text-right">{SERVICES_INTRO}</p>
        </div>

        <ol className="mt-20 flex flex-col gap-[30vh] lg:gap-[40vh]">
          {SERVICES_DATA.map((s, i) => (
            <li
              key={s.number}
              className="service-sticky sticky top-[calc(5.5rem+var(--i)*0.75rem)] lg:top-[calc(7rem+var(--i)*1.5rem)]"
              style={{ '--i': i } as React.CSSProperties}
            >
              <article className="service-card group relative min-h-[28rem] origin-top overflow-hidden rounded-3xl border-2 border-white/90 bg-[#0E0E0E] transition-[box-shadow,border-color] duration-500 hover:border-white hover:shadow-[0_0_4rem_rgba(123,92,255,0.55)] lg:min-h-[30rem]">
                <HeroShader timeOffset={i * 7.3} dprCap={0.75} intensity={0.95} interactive={false} />
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-br from-[#0E0E0E]/70 via-[#0E0E0E]/30 to-transparent" />

                <div className="relative z-10 grid h-full grid-cols-1 gap-8 p-7 sm:p-10 lg:grid-cols-12 lg:p-14">
                  <div className="flex items-start justify-between lg:col-span-5 lg:flex-col">
                    <span className="service-reveal font-display text-[5.5rem] font-black leading-[0.8] text-white text-stroke group-hover-fill sm:text-[8rem] lg:text-[11rem]">
                      {s.number}
                    </span>
                    <span className="service-reveal flex h-16 w-16 items-center justify-center rounded-2xl border border-white/25 bg-white/10 backdrop-blur-md lg:h-20 lg:w-20">
                      <span className="service-icon inline-flex text-white">
                        <Icon name={s.iconName} size={30} strokeWidth={1.75} />
                      </span>
                    </span>
                  </div>

                  <div className="flex flex-col justify-end lg:col-span-7">
                    <h3 className="service-reveal font-display text-3xl font-extrabold uppercase leading-[0.95] tracking-tight sm:text-5xl lg:text-6xl">
                      {s.title}
                    </h3>
                    <p className="service-reveal mt-5 max-w-[38rem] text-base leading-relaxed text-white/90 sm:text-lg">{s.description}</p>
                    <ul className="service-reveal mt-7 flex flex-wrap gap-2">
                      {s.tags.map((t) => (
                        <li
                          key={t}
                          className="rounded-full border border-white/25 bg-[#0E0E0E]/40 px-4 py-2 text-xs font-medium uppercase tracking-[0.15em] text-white backdrop-blur-md"
                        >
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
