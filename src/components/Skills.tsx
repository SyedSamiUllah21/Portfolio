'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import { sectionIndex, SKILL_CATEGORIES, SKILLS_PLAYGROUND_LIST, TOOLS_DATA, type PillVariant, type Tool } from '@/data/portfolio';
import { isFinePointer, prefersReducedMotion, REPLAY } from '@/lib/motion';
import { revealSectionHeader, spotlightMove } from '@/lib/reveal';
import SectionHeader from './SectionHeader';

gsap.registerPlugin(ScrollTrigger);

const PILL_STYLES: Record<PillVariant, string> = {
  violet: 'bg-[#7B5CFF] text-white border-[#7B5CFF] shadow-[0_0.5rem_1.5rem_-0.5rem_rgba(123,92,255,0.7)]',
  white: 'bg-[#F5F5F5] text-[#0E0E0E] border-[#F5F5F5]',
  outline: 'bg-[#0E0E0E]/60 text-[#F5F5F5] border-white/30 backdrop-blur-sm',
};

function ToolCard({ tool, index }: { tool: Tool; index: number }) {
  const tiltRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = tiltRef.current;
    if (!el || prefersReducedMotion() || !isFinePointer()) return;
    gsap.set(el, { transformPerspective: 1000 });
    const rx = gsap.quickTo(el, 'rotationX', { duration: 0.5, ease: 'power3.out' });
    const ry = gsap.quickTo(el, 'rotationY', { duration: 0.5, ease: 'power3.out' });

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      ry((px - 0.5) * 28);
      rx((0.5 - py) * 28);
      el.style.setProperty('--gx', `${px * 100}%`);
      el.style.setProperty('--gy', `${py * 100}%`);
    };
    const onLeave = () => {
      rx(0);
      ry(0);
    };
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <li className="tool-card">
      <div
        ref={tiltRef}
        className="group relative flex h-[14.375rem] flex-col justify-between overflow-hidden rounded-3xl border border-[#7B5CFF]/20 bg-gradient-to-br from-[#241C3D] via-[#1F1F1F] to-[#1A1A1A] p-6 transition-[border-color,box-shadow] duration-500 [transform-style:preserve-3d] hover:border-[#7B5CFF]/60 hover:shadow-[0_1.5rem_3.5rem_-1rem_rgba(123,92,255,0.5)]"
      >
        <span aria-hidden="true" className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-[#7B5CFF]/25 blur-[2.5rem]" />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{ background: 'radial-gradient(18rem circle at var(--gx, 50%) var(--gy, 50%), rgba(255,255,255,0.14), transparent 60%)' }}
        />

        <div className="relative flex items-start justify-between">
          <span
            className="tool-logo flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 font-display text-xl font-extrabold tracking-tight shadow-[0_0.75rem_1.5rem_rgba(0,0,0,0.4)]"
            style={{ background: tool.color, color: tool.textColor }}
            aria-hidden="true"
          >
            {tool.monogram}
          </span>
          <span className="font-mono text-xs text-[#7B5CFF]">({String(index + 1).padStart(2, '0')})</span>
        </div>

        <div className="relative">
          <h3 className="tool-text font-display text-xl font-extrabold uppercase tracking-tight">{tool.name}</h3>
          <p className="tool-text mt-1 text-sm text-[#9A9A9A]">{tool.role}</p>
        </div>

        <span aria-hidden="true" className="absolute bottom-0 left-0 h-1 w-10 bg-[#7B5CFF] transition-[width] duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:w-full" />
      </div>
    </li>
  );
}

function CoreSkills() {
  return (
    <div className="mt-16">
      <div className="mb-6 flex items-center gap-4">
        <p className="sk-heading text-xs font-medium uppercase tracking-[0.2em] text-[#7B5CFF]">Core skills</p>
        <span aria-hidden="true" className="sk-heading-line h-px flex-1 origin-left bg-gradient-to-r from-[#7B5CFF]/50 via-[#2A2A2A] to-transparent" />
      </div>

      {/* Same structure as the CV: "Category: item, item, item" */}
      <dl className="skill-rows relative">
        {/* Progress line that draws down the list while scrolling */}
        <span aria-hidden="true" className="pointer-events-none absolute bottom-0 left-0 top-0 w-px bg-[#2A2A2A]">
          <span
            className="sk-progress absolute inset-0 origin-top shadow-[0_0_0.75rem_rgba(123,92,255,0.7)]"
            style={{ background: `linear-gradient(to bottom, ${SKILL_CATEGORIES.map((c) => c.color).join(', ')})` }}
          />
        </span>
        <span aria-hidden="true" className="sk-line-top pointer-events-none absolute left-0 right-0 top-0 h-px origin-left bg-[#2A2A2A]" />

        {SKILL_CATEGORIES.map((c) => (
          <div
            key={c.title}
            onMouseMove={spotlightMove}
            style={{ '--c': c.color } as React.CSSProperties}
            className="skill-row spotlight group relative flex flex-col gap-2 py-5 pl-5 sm:flex-row sm:items-baseline sm:gap-6 sm:pl-6 lg:py-6"
          >
            {/* hover tint + left accent bar */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 origin-left scale-x-0 bg-[linear-gradient(90deg,color-mix(in_srgb,var(--c)_16%,transparent),color-mix(in_srgb,var(--c)_5%,transparent)_45%,transparent)] transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:scale-x-100"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute bottom-0 left-0 top-0 w-[3px] origin-bottom scale-y-0 bg-[var(--c)] shadow-[0_0_1rem_var(--c)] transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:scale-y-100"
            />

            <dt className="relative z-10 shrink-0 whitespace-nowrap font-display text-lg font-extrabold uppercase tracking-tight sm:w-[17rem] lg:w-[19.5rem] lg:text-xl">
              <span className="inline-flex items-baseline transition-[translate,color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2 group-hover:text-[var(--c)]">
                <span
                  aria-hidden="true"
                  className="sk-dot mr-3 inline-block h-2.5 w-2.5 shrink-0 self-center rounded-full bg-[var(--c)] shadow-[0_0_0.75rem_var(--c)]"
                />
                <span className="sr-only">{c.title}</span>
                <span aria-hidden="true" className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                  {Array.from(c.title).map((ch, i) => (
                    <span key={i} className="sk-char inline-block whitespace-pre">
                      {ch}
                    </span>
                  ))}
                </span>
                <span aria-hidden="true" className="sk-colon inline-block text-[var(--c)]">:</span>
              </span>
            </dt>

            <dd className="relative z-10 flex-1 text-base leading-relaxed text-[#C8C8C8] sm:text-lg">
              {c.items.map((item, i) => (
                <span key={item}>
                  <span
                    className="sk-item inline-block transition-colors duration-300 group-hover:text-[#F5F5F5]"
                    style={{ transitionDelay: `${i * 35}ms` }}
                  >
                    <span className="bg-[linear-gradient(90deg,var(--c),var(--c))] bg-[length:0%_1px] bg-[position:0_100%] bg-no-repeat pb-0.5 transition-[background-size,color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-[length:100%_1px] hover:text-white">
                      {item}
                    </span>
                    {i < c.items.length - 1 && <span className="text-[var(--c)] opacity-70">,</span>}
                  </span>{' '}
                </span>
              ))}
            </dd>

            <span
              aria-hidden="true"
              className="sk-count relative z-10 hidden shrink-0 font-mono text-xs text-[var(--c)] md:block"
            >
              <span className="opacity-60 transition-opacity duration-500 group-hover:opacity-100">
                ({String(c.items.length).padStart(2, '0')})
              </span>
            </span>

            {/* bottom divider that draws in, with a glowing comet travelling along it */}
            <span aria-hidden="true" className="sk-line pointer-events-none absolute bottom-0 left-0 right-0 h-px origin-left bg-[#2A2A2A]" />
            <span aria-hidden="true" className="pointer-events-none absolute bottom-0 left-0 right-0 h-px overflow-visible">
              <span className="sk-comet absolute -top-px left-0 h-[3px] w-24 rounded-full bg-[linear-gradient(90deg,transparent,var(--c),transparent)] opacity-0 shadow-[0_0_0.75rem_var(--c)]" />
            </span>
          </div>
        ))}
      </dl>
    </div>
  );
}

function Playground() {
  const boxRef = useRef<HTMLDivElement>(null);
  const [round, setRound] = useState(0);

  return (
    <div className="mt-20">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <p className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.2em] text-[#7B5CFF]">
          Skills playground <span className="text-[#5C5C5C]">(drag me)</span>
        </p>
        <button
          type="button"
          onClick={() => setRound((r) => r + 1)}
          className="flex items-center gap-2 rounded-full border border-[#2A2A2A] px-4 py-2 text-[0.6875rem] font-medium uppercase tracking-[0.15em] text-[#9A9A9A] transition-colors hover:border-[#7B5CFF] hover:text-[#F5F5F5]"
        >
          <RotateCcw size={13} /> Reset
        </button>
      </div>

      <div
        ref={boxRef}
        className="relative min-h-[28rem] overflow-hidden rounded-3xl border border-[#2A2A2A] bg-[#161616] p-5 sm:p-8 lg:min-h-[24rem]"
      >
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex select-none items-center justify-center font-display text-[16vw] font-black uppercase leading-none text-white/[0.06] text-stroke-thin lg:text-[12rem]"
        >
          Interactive
        </span>
        <ul key={round} className="relative flex flex-wrap content-start gap-2.5 sm:gap-3" aria-label="Skills">
          {SKILLS_PLAYGROUND_LIST.map((s, i) => (
            <motion.li
              key={s.name}
              drag
              dragConstraints={boxRef}
              dragElastic={0.2}
              dragMomentum
              whileDrag={{ scale: 1.12, zIndex: 20 }}
              whileHover={{ scale: 1.05 }}
              initial={{ y: -60, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20, delay: i * 0.03 }}
              data-cursor="pointer"
              className={`relative cursor-grab touch-none select-none rounded-full border px-4 py-2 text-sm font-medium active:cursor-grabbing sm:px-5 sm:py-2.5 ${PILL_STYLES[s.variant]}`}
            >
              {s.name}
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      revealSectionHeader(section);
      const tl = gsap.timeline({
        scrollTrigger: { trigger: '.tools-grid', start: 'top 85%', end: 'bottom 10%', toggleActions: REPLAY },
      });
      tl.from('.tool-card', { y: 60, scale: 0.94, opacity: 0, filter: 'blur(12px)', duration: 1, ease: 'expo.out', stagger: 0.1 })
        .from('.tool-logo', { scale: 0.4, rotate: -12, duration: 0.8, ease: 'back.out(2)', stagger: 0.1 }, '<0.2')
        .from('.tool-text', { y: 20, opacity: 0, duration: 0.6, ease: 'power3.out', stagger: 0.05 }, '<0.1');

      // Core skills: heading, scroll-drawn progress line, then each row in sequence.
      gsap
        .timeline({ scrollTrigger: { trigger: '.skill-rows', start: 'top 88%', end: 'bottom 5%', toggleActions: REPLAY } })
        .from('.sk-heading', { x: -30, opacity: 0, duration: 0.7, ease: 'power4.out' })
        .from('.sk-heading-line', { scaleX: 0, duration: 1, ease: 'power3.out' }, '<0.1')
        .from('.sk-line-top', { scaleX: 0, duration: 1.1, ease: 'expo.out' }, '<');
      gsap.fromTo(
        '.sk-progress',
        { scaleY: 0 },
        { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.skill-rows', start: 'top 75%', end: 'bottom 55%', scrub: 0.6 } },
      );

      gsap.utils.toArray<HTMLElement>('.skill-row').forEach((row) => {
        gsap
          .timeline({ scrollTrigger: { trigger: row, start: 'top 90%', end: 'bottom 5%', toggleActions: REPLAY } })
          .from(row.querySelector('.sk-dot'), { scale: 0, duration: 0.5, ease: 'back.out(3)' })
          .from(row.querySelectorAll('.sk-char'), { yPercent: 115, rotate: 6, duration: 0.8, ease: 'expo.out', stagger: 0.025 }, '<0.05')
          .from(row.querySelector('.sk-colon'), { scale: 0, opacity: 0, duration: 0.5, ease: 'back.out(3)' }, '<0.25')
          .from(
            row.querySelectorAll('.sk-item'),
            { y: 18, opacity: 0, filter: 'blur(6px)', duration: 0.6, ease: 'power3.out', stagger: 0.05 },
            '<0.05',
          )
          .from(row.querySelector('.sk-count'), { opacity: 0, x: 12, duration: 0.5, ease: 'power3.out' }, '<0.2')
          .from(row.querySelector('.sk-line'), { scaleX: 0, duration: 1.1, ease: 'expo.out' }, 0.1)
          .fromTo(
            row.querySelector('.sk-comet'),
            { left: '0%', opacity: 0 },
            { keyframes: [{ opacity: 1, duration: 0.15 }, { left: '92%', duration: 0.9, ease: 'power2.inOut' }, { opacity: 0, duration: 0.2 }] },
            0.1,
          );
      });
    }, section);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="skills"
      ref={sectionRef}
      aria-labelledby="skills-title"
      className="relative overflow-x-clip border-t border-[#2A2A2A] bg-[#0E0E0E] px-6 py-28 md:px-12"
    >
      <div className="mx-auto max-w-[90rem]">
        <SectionHeader
          id="skills-title"
          index={sectionIndex('#skills')}
          label="Toolkit"
          lines={[{ text: 'Core tools' }, { text: '& skills.', accent: true }]}
        />

        <CoreSkills />

        <ul className="tools-grid mt-20 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 lg:gap-5">
          {TOOLS_DATA.map((t, i) => (
            <ToolCard key={t.name} tool={t} index={i} />
          ))}
        </ul>

        <Playground />
      </div>
    </section>
  );
}
