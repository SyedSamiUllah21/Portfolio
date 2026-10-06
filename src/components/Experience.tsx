'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Briefcase, Calendar, MapPin } from 'lucide-react';
import { EXPERIENCE_DATA, sectionIndex } from '@/data/portfolio';
import { prefersReducedMotion, REPLAY } from '@/lib/motion';
import { revealSectionHeader } from '@/lib/reveal';
import SectionHeader from './SectionHeader';

gsap.registerPlugin(ScrollTrigger);

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const timeline = timelineRef.current;
    if (!section || !timeline || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      revealSectionHeader(section);

      // Track draws itself; the glowing dot rides its tip.
      const tl = gsap.timeline({
        scrollTrigger: { trigger: timeline, start: 'top 60%', end: 'bottom 80%', scrub: 0.6 },
      });
      tl.fromTo('.exp-bar', { scaleY: 0 }, { scaleY: 1, ease: 'none' }, 0).fromTo(
        '.exp-tip',
        { top: '0%' },
        { top: '100%', ease: 'none' },
        0,
      );

      gsap.utils.toArray<HTMLElement>('.exp-item').forEach((item) => {
        const t = gsap.timeline({
          scrollTrigger: { trigger: item, start: 'top 85%', end: 'bottom 10%', toggleActions: REPLAY },
        });
        t.from(item.querySelector('.exp-node'), { scale: 0, duration: 0.6, ease: 'back.out(2.5)' })
          .from(
            item.querySelector('.exp-card'),
            { x: -60, scale: 0.96, opacity: 0, filter: 'blur(12px)', duration: 0.9, ease: 'expo.out' },
            '<0.05',
          )
          .from(item.querySelectorAll('.exp-head'), { y: 24, opacity: 0, duration: 0.7, ease: 'power3.out', stagger: 0.06 }, '<0.2')
          .from(item.querySelectorAll('.exp-bullet'), { x: -20, opacity: 0, duration: 0.6, ease: 'power3.out', stagger: 0.07 }, '<0.15');
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="experience"
      ref={sectionRef}
      aria-labelledby="experience-title"
      className="relative overflow-x-clip border-t border-[#2A2A2A] bg-[#161616] px-6 py-28 md:px-12"
    >
      <div className="mx-auto max-w-[90rem]">
        <SectionHeader
          id="experience-title"
          index={sectionIndex('#experience')}
          label="Experience"
          lines={[{ text: "Where I've" }, { text: 'worked.', accent: true }]}
        />

        <div ref={timelineRef} className="relative mt-20 pl-[var(--pad)] [--line:0.6875rem] [--pad:2.5rem] sm:[--line:1.1875rem] sm:[--pad:4rem] lg:[--line:1.6875rem] lg:[--pad:6rem]">
          {/* Track */}
          <div aria-hidden="true" className="absolute bottom-0 left-[var(--line)] top-0 w-[2px] bg-[#2A2A2A]">
            <div className="exp-bar absolute inset-0 origin-top bg-gradient-to-b from-[#C9BCFF] via-[#7B5CFF] to-[#5530A7]" />
            <span className="exp-tip absolute left-1/2 top-full h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_0_4px_rgba(123,92,255,0.35),0_0_1.25rem_0.375rem_rgba(123,92,255,0.9)]" />
          </div>

          <ol className="flex flex-col gap-10 lg:gap-14">
            {EXPERIENCE_DATA.map((job) => (
              <li key={job.id} className="exp-item group relative">
                {/* Node centred on the track line */}
                <span
                  aria-hidden="true"
                  className="exp-node absolute top-10 flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#7B5CFF] bg-[#161616] transition-colors duration-500 group-hover:bg-[#7B5CFF] left-[calc(var(--line)+1px-0.75rem-var(--pad))] sm:top-12"
                >
                  <span className="h-2 w-2 rounded-full bg-white" />
                </span>

                <article className="exp-card relative overflow-hidden rounded-3xl border border-[#2A2A2A] bg-[#1F1F1F] p-8 transition-colors duration-500 group-hover:border-[#7B5CFF]/50 sm:p-10">
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-4 -top-10 select-none font-display text-[12rem] font-black leading-none text-white/[0.04] transition-colors duration-500 group-hover:text-[#7B5CFF]/15 sm:text-[16rem]"
                  >
                    {job.initial}
                  </span>

                  <div className="relative">
                    <div className="exp-head flex flex-wrap items-center gap-3">
                      <h3 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl">{job.company}</h3>
                      {job.isCurrent && (
                        <span className="flex items-center gap-2 rounded-full border border-[#E3242B]/40 bg-[#E3242B]/10 px-3 py-1 text-[0.625rem] font-bold uppercase tracking-[0.2em] text-[#FF5A60]">
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#E3242B] opacity-75" />
                            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#E3242B]" />
                          </span>
                          Current
                        </span>
                      )}
                    </div>

                    <div className="exp-head mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                      <span className="flex items-center gap-2 font-semibold text-[#B49CFF]">
                        <Briefcase size={15} className="text-[#7B5CFF]" aria-hidden="true" />
                        {job.role}
                      </span>
                      <span className="flex items-center gap-2 text-[#9A9A9A]">
                        <Calendar size={15} aria-hidden="true" />
                        {job.period}
                      </span>
                      {job.location && (
                        <span className="flex items-center gap-2 text-[#9A9A9A]">
                          <MapPin size={15} aria-hidden="true" />
                          {job.location}
                        </span>
                      )}
                    </div>

                    {job.summary && <p className="exp-head mt-5 max-w-[56rem] italic leading-relaxed text-[#9A9A9A]">{job.summary}</p>}

                    <ul className="mt-7 grid gap-3 border-t border-[#2A2A2A] pt-7">
                      {job.bullets.map((b) => (
                        <li key={b} className="exp-bullet flex gap-3 text-sm leading-relaxed text-[#D4D4D4] sm:text-base">
                          <span aria-hidden="true" className="mt-0.5 shrink-0 text-[#7B5CFF]">
                            ✦
                          </span>
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
