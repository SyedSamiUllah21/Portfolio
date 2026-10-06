'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, MapPin } from 'lucide-react';
import { EDUCATION_DATA, EDUCATION_QUOTE, sectionIndex } from '@/data/portfolio';
import { prefersReducedMotion, REPLAY, splitText } from '@/lib/motion';
import { revealSectionHeader, spotlightMove } from '@/lib/reveal';
import SectionHeader from './SectionHeader';
import { Icon } from './icons';

gsap.registerPlugin(ScrollTrigger);

export default function Education() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      revealSectionHeader(section);
      gsap.from('.edu-card', {
        y: 60,
        scale: 0.95,
        opacity: 0,
        filter: 'blur(10px)',
        duration: 1,
        ease: 'expo.out',
        stagger: 0.12,
        scrollTrigger: { trigger: '.edu-grid', start: 'top 85%', end: 'bottom 10%', toggleActions: REPLAY },
      });
      gsap.from('.edu-quote-word', {
        yPercent: 110,
        opacity: 0,
        duration: 0.8,
        ease: 'power4.out',
        stagger: 0.04,
        scrollTrigger: { trigger: '.edu-quote', start: 'top 85%', end: 'bottom 10%', toggleActions: REPLAY },
      });
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="education"
      ref={sectionRef}
      aria-labelledby="education-title"
      className="relative overflow-x-clip border-t border-[#2A2A2A] bg-[#161616] px-6 py-28 md:px-12"
    >
      <div className="mx-auto max-w-[90rem]">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end">
          <SectionHeader
            id="education-title"
            index={sectionIndex('#education')}
            label="Education"
            className="lg:col-span-6"
            lines={[{ text: 'Always' }, { text: 'learning.', accent: true }]}
          />
          <blockquote className="edu-quote font-display text-2xl font-bold leading-[1.15] tracking-tight text-[#F5F5F5] sm:text-3xl lg:col-span-6 lg:text-right">
            <span aria-hidden="true" className="mr-2 text-[#7B5CFF]">
              ✦
            </span>
            {splitText(EDUCATION_QUOTE, 'words').map((w, i) => (
              <span key={i} className="inline-block overflow-hidden align-bottom">
                <span className="edu-quote-word inline-block">{w}&nbsp;</span>
              </span>
            ))}
          </blockquote>
        </div>

        <ul className="edu-grid mt-16 grid grid-cols-1 gap-5 md:grid-cols-2 lg:gap-6">
          {EDUCATION_DATA.map((e, i) => {
            const meta = [e.duration, e.period].filter(Boolean).join(' · ');
            const cardClass =
              'spotlight group relative flex h-full flex-col overflow-hidden rounded-3xl border border-[#2A2A2A] bg-[#1F1F1F] p-8 transition-[border-color,box-shadow] duration-500 hover:border-[#7B5CFF]/60 hover:shadow-[0_1.5rem_4rem_-1rem_rgba(123,92,255,0.45)] sm:p-10';
            const body = (
              <>
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -bottom-8 -right-2 font-display text-[10rem] font-black leading-none text-white/[0.03] transition-colors duration-500 group-hover:text-[#7B5CFF]/10"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  <div className="relative z-10 flex items-start justify-between gap-4">
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#7B5CFF]/10 text-[#B49CFF] transition-colors duration-500 group-hover:bg-[#7B5CFF] group-hover:text-white">
                      <Icon name={e.icon} size={26} />
                    </span>
                    {e.credentialUrl ? (
                      <span className="flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3.5 py-1.5 text-[0.625rem] font-bold uppercase tracking-[0.2em] text-emerald-400 transition-colors duration-500 group-hover:bg-emerald-400/20">
                        {e.badge}
                        <ArrowUpRight size={12} className="transition-[rotate] duration-500 group-hover:rotate-45" />
                      </span>
                    ) : (
                      <span className="rounded-full border border-[#7B5CFF]/40 bg-[#7B5CFF]/10 px-3.5 py-1.5 text-[0.625rem] font-bold uppercase tracking-[0.2em] text-[#B49CFF]">
                        {e.badge}
                      </span>
                    )}
                  </div>

                  <p className="relative z-10 mt-10 text-xs font-medium uppercase tracking-[0.2em] text-[#7B5CFF]">{e.institution}</p>
                  <h3 className="relative z-10 mt-3 font-display text-2xl font-extrabold uppercase leading-[1.02] tracking-tight sm:text-3xl">
                    {e.program}
                  </h3>
                  <div className="relative z-10 mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 pt-8 text-sm text-[#9A9A9A]">
                    {e.location && (
                      <span className="flex items-center gap-2">
                        <MapPin size={15} aria-hidden="true" /> {e.location}
                      </span>
                    )}
                    {meta && <span className="font-mono text-xs">{meta}</span>}
                  </div>
              </>
            );
            return (
              <li key={e.program} className="edu-card">
                {e.credentialUrl ? (
                  <a
                    href={e.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${e.program}, ${e.institution} — view verified credential`}
                    onMouseMove={spotlightMove}
                    className={cardClass}
                  >
                    {body}
                  </a>
                ) : (
                  <article onMouseMove={spotlightMove} className={cardClass}>
                    {body}
                  </article>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
