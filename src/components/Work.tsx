'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { PROJECTS_DATA, sectionIndex, WORK_CATEGORIES, type Project } from '@/data/portfolio';
import { prefersReducedMotion, REPLAY } from '@/lib/motion';
import { revealSectionHeader } from '@/lib/reveal';
import SectionHeader from './SectionHeader';
import ProjectModal from './ProjectModal';
import ProjectVisual from './ProjectVisual';

gsap.registerPlugin(ScrollTrigger);

const pad = (n: number) => String(n).padStart(2, '0');

function ProjectCard({ project, index, onOpen }: { project: Project; index: number; onOpen: () => void }) {
  const wide = index % 2 === 0;
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className={`work-card w-full shrink-0 lg:self-center ${
        wide ? 'lg:w-[min(42vw,calc((100svh-15rem)*4/3))]' : 'lg:w-[min(38vw,calc((100svh-17rem)*16/10))]'
      }`}
    >
      <button
        type="button"
        onClick={onOpen}
        data-cursor="project"
        aria-label={`Open project: ${project.title}`}
        className={`group relative block w-full overflow-hidden rounded-3xl border border-[#2A2A2A] bg-[#1F1F1F] text-left transition-[border-color,box-shadow] duration-500 hover:border-[#7B5CFF]/70 hover:shadow-[0_1.5rem_4rem_-1rem_rgba(123,92,255,0.5)] ${
          wide ? 'aspect-[4/3]' : 'aspect-[4/3] lg:aspect-[16/10]'
        }`}
      >
        <div className="absolute inset-0 transition-[scale] duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]">
          <ProjectVisual project={project} sizes="(min-width: 1024px) 42vw, 100vw" />
        </div>
        <div aria-hidden="true" className="absolute inset-0 bg-[#7B5CFF]/25 opacity-0 mix-blend-screen transition-opacity duration-500 group-hover:opacity-100" />

        <div className="absolute left-4 top-4 flex flex-wrap items-center gap-2 sm:left-5 sm:top-5">
          <span className="rounded-full border border-white/20 bg-[#0E0E0E]/60 px-3 py-1.5 font-mono text-[0.6875rem] text-white backdrop-blur-md">
            {project.number}
          </span>
          {project.year && (
            <span className="rounded-full border border-white/20 bg-[#0E0E0E]/60 px-3 py-1.5 font-mono text-[0.6875rem] text-white backdrop-blur-md">
              {project.year}
            </span>
          )}
          {project.liveUrl && (
            <span className="flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-[#0E0E0E]/60 px-3 py-1.5 text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-emerald-400 backdrop-blur-md">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              Live
            </span>
          )}
        </div>

        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0E0E0E] via-[#0E0E0E]/80 to-transparent p-5 pt-20 sm:p-7 sm:pt-24">
          <p className="text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-[#B49CFF]">{project.category}</p>
          <div className="mt-2 flex items-end justify-between gap-4">
            <h3 className="font-display text-2xl font-extrabold uppercase leading-[0.95] tracking-tight sm:text-3xl xl:text-4xl">
              {project.title}
            </h3>
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/25 text-white transition-[background-color,border-color,rotate] duration-500 group-hover:rotate-45 group-hover:border-[#7B5CFF] group-hover:bg-[#7B5CFF]">
              <ArrowUpRight size={18} />
            </span>
          </div>
        </div>
      </button>
    </motion.div>
  );
}

export default function Work() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const [category, setCategory] = useState('All');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const projects = useMemo(
    () => (category === 'All' ? PROJECTS_DATA : PROJECTS_DATA.filter((p) => p.category === category)),
    [category],
  );
  const countRef = useRef(projects.length);
  countRef.current = projects.length;

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;
    const reduced = prefersReducedMotion();

    const ctx = gsap.context(() => {
      // Pin first so triggers inside the pinned section can account for it.
      const mm = gsap.matchMedia();
      mm.add('(min-width: 1024px)', () => {
        const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
        gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${Math.max(window.innerWidth * 1.8, track.scrollWidth - window.innerWidth + 200)}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (!counterRef.current) return;
              const n = countRef.current;
              counterRef.current.textContent = pad(Math.min(n, Math.round(self.progress * (n - 1)) + 1));
            },
          },
        });
      });

      const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
      const pinnedContainer = isDesktop ? section : undefined;
      if (!reduced) {
        // Inside the pin the header never scrolls away, so only reverse when scrolling back above it.
        const toggle = isDesktop ? 'play none none reverse' : REPLAY;
        revealSectionHeader(section, pinnedContainer, toggle);
        gsap.from('.work-filters > *', {
          y: 20,
          opacity: 0,
          duration: 0.6,
          ease: 'power3.out',
          stagger: 0.05,
          scrollTrigger: { trigger: '.work-filters', start: 'top 90%', end: 'bottom 10%', toggleActions: toggle, pinnedContainer },
        });
        gsap.to('.work-bg-word', {
          x: -300,
          ease: 'none',
          scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: true },
        });
      }
    }, section);

    // The track's width changes with the filter (and once fonts load) → re-measure the pin.
    let lastWidth = track.scrollWidth;
    let timer = 0;
    const ro = new ResizeObserver(() => {
      if (track.scrollWidth === lastWidth) return;
      lastWidth = track.scrollWidth;
      window.clearTimeout(timer);
      timer = window.setTimeout(() => ScrollTrigger.refresh(), 200);
    });
    ro.observe(track);

    return () => {
      ro.disconnect();
      window.clearTimeout(timer);
      ctx.revert();
    };
  }, []);

  useEffect(() => {
    if (counterRef.current) counterRef.current.textContent = '01';
  }, [category]);

  const close = useCallback(() => setOpenIndex(null), []);

  return (
    <>
    <section
      id="work"
      ref={sectionRef}
      aria-labelledby="work-title"
      className="relative overflow-hidden border-t border-[#2A2A2A] bg-[#0E0E0E] py-28 lg:flex lg:h-[100svh] lg:flex-col lg:justify-center lg:py-0 lg:pt-20"
    >
      <div
        aria-hidden="true"
        className="work-bg-word pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 whitespace-nowrap font-display text-[22vw] font-black uppercase leading-none text-white opacity-15 text-stroke-thin"
      >
        Selected work ✦ Agentic AI ✦
      </div>

      <div className="relative mx-auto w-full max-w-[90rem] px-6 md:px-12">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader
            id="work-title"
            index={sectionIndex('#work')}
            label="Projects"
            lines={[{ text: 'Featured' }, { text: 'Projects', accent: true, sup: `(${pad(PROJECTS_DATA.length)})` }]}
          />
          <div className="flex flex-col gap-5 lg:max-w-[36rem] lg:shrink-0 lg:items-end">
            <p className="hidden items-baseline gap-2 font-mono text-sm text-[#9A9A9A] lg:flex" aria-hidden="true">
              <span ref={counterRef} className="font-display text-4xl font-black text-[#F5F5F5]">
                01
              </span>
              / {pad(projects.length)}
            </p>
            <div className="work-filters flex flex-wrap gap-2 lg:justify-end" role="group" aria-label="Filter projects by category">
              {WORK_CATEGORIES.map((c) => {
                const active = c === category;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCategory(c)}
                    aria-pressed={active}
                    className={`rounded-full border px-4 py-2 text-xs font-medium uppercase tracking-[0.15em] transition-[background-color,border-color,color,box-shadow] duration-300 ${
                      active
                        ? 'border-[#7B5CFF] bg-[#7B5CFF] text-white shadow-[0_0_1.5rem_rgba(123,92,255,0.55)]'
                        : 'border-[#2A2A2A] bg-[#0E0E0E]/60 text-[#9A9A9A] hover:border-[#7B5CFF]/60 hover:text-[#F5F5F5]'
                    }`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="relative mt-12 lg:mt-10">
        <div
          ref={trackRef}
          className="flex flex-col gap-6 px-6 md:px-12 lg:w-max lg:flex-row lg:items-center lg:gap-8 lg:pl-[max(3rem,calc((100vw-90rem)/2+3rem))] lg:pr-[12vw]"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {projects.map((p, i) => (
              <ProjectCard key={p.id} project={p} index={i} onOpen={() => setOpenIndex(i)} />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
    <ProjectModal projects={projects} index={openIndex} onClose={close} onChange={setOpenIndex} />
    </>
  );
}
