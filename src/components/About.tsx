'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';
import { ABOUT_DATA, sectionIndex } from '@/data/portfolio';
import { prefersReducedMotion, splitText } from '@/lib/motion';
import { revealSectionHeader, spotlightMove } from '@/lib/reveal';
import SectionHeader from './SectionHeader';
import { BrandLogo, Icon } from './icons';

gsap.registerPlugin(ScrollTrigger);

const ABOUT_REVEAL = 'play none none reverse';

/** Direction a card flies in from, based on its position in a desktop grid. */
function flyFrom(i: number, total: number, cols: number) {
  const rows = Math.ceil(total / cols);
  const col = i % cols;
  const row = Math.floor(i / cols);
  const mid = (cols - 1) / 2;
  const x = col < mid ? -130 : col > mid ? 130 : 0;
  const y = rows === 1 ? 90 : row < (rows - 1) / 2 ? -90 : 90;
  const r = x === 0 ? 0 : (x < 0 ? -6 : 6) * (y < 0 ? 1 : -1);
  return { 'data-fx': x, 'data-fy': y, 'data-fr': r };
}

function parseStat(value: string) {
  const m = value.match(/^(\d+)(.*)$/);
  return m ? { n: Number(m[1]), suffix: m[2] } : { n: 0, suffix: value };
}

function BlockHeader({ letter, label }: { letter: string; label: string }) {
  return (
    <div className="block-header mb-8 flex items-center gap-4">
      <span className="font-mono text-xs text-[#5C5C5C]">{letter}</span>
      <span className="bh-label text-xs font-medium uppercase tracking-[0.2em] text-[#7B5CFF]">{label}</span>
      <span aria-hidden="true" className="bh-line h-px flex-1 origin-left bg-gradient-to-r from-[#7B5CFF]/60 via-[#2A2A2A] to-transparent" />
    </div>
  );
}

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      revealSectionHeader(section);

      // Statement: word-by-word scrub.
      gsap.fromTo(
        '.about-word',
        { opacity: 0.15, color: '#5C5C5C' },
        {
          opacity: 1,
          color: '#F5F5F5',
          ease: 'none',
          stagger: 0.1,
          scrollTrigger: { trigger: '.about-statement', start: 'top 80%', end: 'bottom 50%', scrub: 0.5 },
        },
      );

      // Block headers.
      gsap.utils.toArray<HTMLElement>('.block-header').forEach((bh) => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: bh, start: 'top 85%', toggleActions: ABOUT_REVEAL } });
        tl.from(bh.querySelector('.bh-label'), { x: -40, opacity: 0, duration: 0.8, ease: 'power4.out' }).from(
          bh.querySelector('.bh-line'),
          { scaleX: 0, duration: 1, ease: 'power3.out' },
          '<0.1',
        );
      });

      // Cards fly in from their own direction.
      gsap.utils.toArray<HTMLElement>('.fly-group').forEach((group) => {
        const cards = group.querySelectorAll<HTMLElement>('.fly-card');
        gsap.from(cards, {
          x: (_i: number, el: HTMLElement) => Number(el.dataset.fx ?? 0),
          y: (_i: number, el: HTMLElement) => Number(el.dataset.fy ?? 90),
          rotate: (_i: number, el: HTMLElement) => Number(el.dataset.fr ?? 0),
          scale: 0.85,
          opacity: 0,
          filter: 'blur(8px)',
          duration: 1.1,
          ease: 'expo.out',
          stagger: 0.12,
          scrollTrigger: { trigger: group, start: 'top 85%', toggleActions: ABOUT_REVEAL },
        });
      });

      // Stat counters: count up on enter, reset once fully out of view.
      gsap.utils.toArray<HTMLElement>('.stat-number').forEach((el) => {
        const target = Number(el.dataset.count ?? 0);
        const counter = { v: 0 };
        const render = () => (el.textContent = String(Math.round(counter.v)));
        const count = (duration: number) => {
          gsap.killTweensOf(counter);
          counter.v = 0;
          render();
          gsap.to(counter, { v: target, duration, ease: 'power3.out', onUpdate: render });
        };
        ScrollTrigger.create({
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          onEnter: () => count(1.6),
          onEnterBack: () => count(1.6),
          onLeave: () => {
            gsap.killTweensOf(counter);
            counter.v = 0;
            render();
          },
          onLeaveBack: () => {
            gsap.killTweensOf(counter);
            counter.v = 0;
            render();
          },
        });
        el.closest('.stat-card')?.addEventListener('mouseenter', () => count(0.9));
      });

      // Governance oversight bars.
      gsap.utils.toArray<HTMLElement>('.oversight-fill').forEach((bar) => {
        gsap.fromTo(
          bar,
          { scaleX: 0 },
          {
            scaleX: Number(bar.dataset.value ?? 0) / 100,
            duration: 1.4,
            ease: 'power3.out',
            scrollTrigger: { trigger: bar, start: 'top 90%', toggleActions: ABOUT_REVEAL },
          },
        );
      });

      // Quote words.
      gsap.from('.quote-word', {
        y: 24,
        opacity: 0,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.06,
        scrollTrigger: { trigger: '.quote-card', start: 'top 80%', toggleActions: ABOUT_REVEAL },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  const words = splitText(ABOUT_DATA.statement, 'words');

  return (
    <section
      id="about"
      ref={sectionRef}
      aria-labelledby="about-title"
      className="relative overflow-x-clip border-t border-[#2A2A2A] bg-[#161616] px-6 py-28 md:px-12"
    >
      <div className="mx-auto max-w-[90rem]">
        <SectionHeader
          id="about-title"
          index={sectionIndex('#about')}
          label="About me"
          lines={[{ text: 'The engineer' }, { text: 'behind the agents.', accent: true }]}
        />

        {/* Statement */}
        <p className="about-statement mt-16 max-w-[80rem] font-display text-2xl font-bold leading-[1.15] tracking-tight sm:text-4xl lg:text-6xl">
          {words.map((w, i) => (
            <span key={i} className="about-word inline-block">
              {w}
              {i < words.length - 1 && ' '}
            </span>
          ))}
        </p>

        {/* Stats */}
        <div className="fly-group mt-16 grid grid-cols-1 gap-4 sm:grid-cols-3 lg:gap-6">
          {ABOUT_DATA.stats.map((s, i) => {
            const { n, suffix } = parseStat(s.value);
            return (
              <div key={s.label} className="fly-card" {...flyFrom(i, ABOUT_DATA.stats.length, 3)}>
                <div
                  onMouseMove={spotlightMove}
                  className="stat-card spotlight group h-full rounded-3xl border border-[#2A2A2A] bg-[#1F1F1F] p-8 transition-[translate,border-color,box-shadow] duration-500 hover:-translate-y-2 hover:border-[#7B5CFF]/50 hover:shadow-[0_1.5rem_4rem_-1rem_rgba(123,92,255,0.45)]"
                >
                  <p className="relative z-10 font-display text-6xl font-black leading-none tracking-tight transition-[color,scale] duration-500 group-hover:scale-105 group-hover:text-[#B49CFF] sm:text-7xl lg:text-8xl origin-left">
                    <span className="stat-number font-tabular" data-count={n}>
                      {n}
                    </span>
                    <span className="text-[#7B5CFF]">{suffix}</span>
                  </p>
                  <p className="relative z-10 mt-4 text-xs font-medium uppercase tracking-[0.2em] text-[#9A9A9A]">{s.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* A — Industries + quote */}
        <div className="mt-24 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <BlockHeader letter="A" label="Industries served" />
            <div className="fly-group grid grid-cols-1 gap-4 sm:grid-cols-2">
              {ABOUT_DATA.industries.map((ind, i) => (
                <div key={ind.title} className="fly-card" {...flyFrom(i, ABOUT_DATA.industries.length, 2)}>
                  <div
                    onMouseMove={spotlightMove}
                    className="spotlight group relative h-full overflow-hidden rounded-3xl border border-[#2A2A2A] bg-[#1F1F1F] p-7 transition-[border-color,box-shadow] duration-500 hover:border-[#7B5CFF]/60 hover:shadow-[0_1.25rem_3rem_-1rem_rgba(123,92,255,0.5)]"
                  >
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 translate-y-full bg-gradient-to-t from-[#5530A7] to-[#7B5CFF]/80 transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:translate-y-0"
                    />
                    <div className="relative z-10 flex items-start justify-between">
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#2A2A2A] bg-[#161616] text-[#7B5CFF] transition-colors duration-500 group-hover:border-white/30 group-hover:bg-white/10 group-hover:text-white">
                        <Icon name={ind.icon} size={22} />
                      </span>
                      <span className="font-mono text-xs text-[#5C5C5C] transition-colors duration-500 group-hover:text-white/70">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <h3 className="relative z-10 mt-8 font-display text-xl font-extrabold uppercase tracking-tight">{ind.title}</h3>
                    <p className="relative z-10 mt-2 text-sm leading-relaxed text-[#9A9A9A] transition-colors duration-500 group-hover:text-white/90">
                      {ind.blurb}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="fly-group flex lg:col-span-5 lg:pt-[3.25rem]">
            <div className="fly-card flex w-full" data-fx={130} data-fy={0} data-fr={6}>
              <figure className="quote-card animated-border relative flex w-full flex-col justify-between overflow-hidden rounded-3xl p-8 sm:p-10">
                <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#7B5CFF]/25 blur-[4rem]" />
                <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-[#5530A7]/30 blur-[4rem]" />
                <span aria-hidden="true" className="float-y relative block font-display text-[8rem] font-black leading-[0.7] text-[#7B5CFF]">
                  &ldquo;
                </span>
                <blockquote className="relative mt-6 font-display text-3xl font-extrabold uppercase leading-[1.05] tracking-tight sm:text-4xl">
                  {splitText(ABOUT_DATA.quote.text, 'words').map((w, i) => (
                    <span key={i} className="quote-word inline-block">
                      {w}&nbsp;
                    </span>
                  ))}
                </blockquote>
                <figcaption className="relative mt-8 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-[#9A9A9A]">
                  <span className="h-px w-8 bg-[#7B5CFF]" />
                  {ABOUT_DATA.quote.author}
                </figcaption>
              </figure>
            </div>
          </div>
        </div>

        {/* B — Governance */}
        <div className="mt-24">
          <BlockHeader letter="B" label="AI governance model" />
          <div className="fly-group grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {ABOUT_DATA.governance.map((tier, i) => (
              <div key={tier.code} className="fly-card relative" {...flyFrom(i, ABOUT_DATA.governance.length, 4)}>
                <div
                  onMouseMove={spotlightMove}
                  className="spotlight group flex h-full flex-col rounded-3xl border border-[#2A2A2A] bg-[#1F1F1F] p-7 transition-[border-color,box-shadow] duration-500 hover:border-[#7B5CFF]/60 hover:shadow-[0_1.25rem_3rem_-1rem_rgba(123,92,255,0.45)]"
                >
                  <span className="relative z-10 font-display text-7xl font-black leading-none text-[#7B5CFF] text-stroke group-hover-fill">
                    {tier.code}
                  </span>
                  <h3 className="relative z-10 mt-6 font-display text-lg font-extrabold uppercase tracking-tight">{tier.name}</h3>
                  <p className="relative z-10 mt-2 flex-1 text-sm leading-relaxed text-[#9A9A9A]">{tier.description}</p>
                  <div className="relative z-10 mt-6">
                    <div className="mb-2 flex items-center justify-between text-[0.625rem] uppercase tracking-[0.2em] text-[#5C5C5C]">
                      <span>Human oversight</span>
                      <span className="font-mono text-[#B49CFF]">{tier.oversight}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-[#2A2A2A]">
                      <div
                        className="oversight-fill h-full w-full origin-left rounded-full bg-gradient-to-r from-[#5530A7] to-[#B49CFF]"
                        data-value={tier.oversight}
                        style={{ transform: `scaleX(${tier.oversight / 100})` }}
                      />
                    </div>
                  </div>
                </div>
                {i < ABOUT_DATA.governance.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="absolute -right-[1.15rem] top-1/2 z-20 hidden h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-[#2A2A2A] bg-[#161616] text-[#7B5CFF] lg:flex"
                  >
                    <ArrowRight size={14} />
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* C — Daily drivers */}
        <div className="mt-24">
          <BlockHeader letter="C" label="Daily drivers" />
          <div className="fly-group grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
            {ABOUT_DATA.dailyDrivers.map((d, i) => (
              <div key={d.title} className="fly-card" {...flyFrom(i, ABOUT_DATA.dailyDrivers.length, 4)}>
                <div
                  onMouseMove={spotlightMove}
                  style={{ '--c': d.glow } as React.CSSProperties}
                  className="spotlight group flex h-full flex-col items-start gap-3 rounded-3xl border border-[#2A2A2A] bg-[#1F1F1F] p-5 transition-[border-color,box-shadow] duration-500 hover:border-[color-mix(in_srgb,var(--c)_60%,transparent)] sm:flex-row sm:items-center sm:gap-4 hover:shadow-[0_1rem_2.5rem_-1rem_var(--c)] sm:p-6"
                >
                  <span
                    className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/10 shadow-[0_0.5rem_1.25rem_rgba(0,0,0,0.45)] transition-shadow duration-500 group-hover:shadow-[0_0_1.5rem_color-mix(in_srgb,var(--c)_55%,transparent)]"
                    style={{ background: d.color, color: d.fg }}
                  >
                    <span className="wiggle-on-hover inline-flex">
                      <BrandLogo name={d.brand} size={24} />
                    </span>
                  </span>
                  <div className="relative z-10 min-w-0">
                    <p className="font-mono text-[0.625rem] text-[#5C5C5C]">({String(i + 1).padStart(2, '0')})</p>
                    <h3 className="font-display text-sm font-extrabold uppercase leading-tight tracking-tight sm:text-lg">{d.title}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
