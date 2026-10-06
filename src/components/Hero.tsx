'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDownRight, Download } from 'lucide-react';
import { HERO_DATA, PERSON, PORTFOLIO_LINKS } from '@/data/portfolio';
import { HALO, HERO_IMAGE, HERO_OBJECT_POSITION } from '@/data/hero';
import { prefersReducedMotion } from '@/lib/motion';
import { useSmoothScroll } from './SmoothScroll';
import MagneticButton from './MagneticButton';
import HeroShader from './HeroShader';

gsap.registerPlugin(ScrollTrigger);

const WAVES = 5;
const WAVE_DURATION = 11;

function HaloWaves({ className = '', style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute mix-blend-screen ${className}`} style={style}>
      <div className="halo-glow" />
      {Array.from({ length: WAVES }).map((_, i) => (
        <span key={i} className="halo-wave" style={{ animationDelay: `${(i * WAVE_DURATION) / WAVES}s` }} />
      ))}
    </div>
  );
}

/** Positions the halo waves over the glowing circle baked into the hero image. */
function ImageHalo({ imgW, imgH }: { imgW: number; imgH: number }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<{ left: number; top: number; size: number } | null>(null);

  useEffect(() => {
    const host = hostRef.current?.parentElement;
    if (!host) return;
    const measure = () => {
      const W = host.clientWidth;
      const H = host.clientHeight;
      // Replicates object-fit: cover + object-position.
      const scale = Math.max(W / imgW, H / imgH);
      const dispW = imgW * scale;
      const dispH = imgH * scale;
      const offX = (W - dispW) * HERO_OBJECT_POSITION.x;
      const offY = (H - dispH) * HERO_OBJECT_POSITION.y;
      const cx = offX + HALO.cx * dispW;
      const cy = offY + HALO.cy * dispH;
      const r = HALO.r * dispW;
      setBox({ left: cx - 4 * r, top: cy - 4 * r, size: 8 * r });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(host);
    return () => ro.disconnect();
  }, [imgW, imgH]);

  return (
    <div ref={hostRef} className="absolute inset-0">
      {box && (
        <HaloWaves
          className="halo-mask"
          style={{ left: box.left, top: box.top, width: box.size, height: box.size }}
        />
      )}
    </div>
  );
}

/** Fallback key art: CSS halo circle with the monogram, waves radiating from its edge. */
function FallbackOrb() {
  return (
    <div
      aria-hidden="true"
      className="absolute left-1/2 top-[7.5rem] aspect-square w-[15rem] -translate-x-1/2 sm:w-[17rem] lg:top-1/2 lg:w-[min(28vw,28rem,52vh)] lg:-translate-y-[54%]"
    >
      <HaloWaves
        className="left-1/2 top-1/2 h-[400%] w-[400%] -translate-x-1/2 -translate-y-1/2 [mask-image:radial-gradient(circle,#000_28%,transparent_62%)]"
      />
      <div className="absolute inset-0 rounded-full border-2 border-[#C9BCFF]/90 bg-[radial-gradient(circle_at_50%_32%,#2B1F55_0%,#160F30_42%,#0B0D12_78%)] shadow-[0_0_3.75rem_0.625rem_rgba(123,92,255,0.55),inset_0_0_3.125rem_0.5rem_rgba(123,92,255,0.45)]">
        <div className="absolute inset-[7%] rounded-full border border-dashed border-[#B49CFF]/25 [animation:spin-star_60s_linear_infinite]" />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="flex items-baseline font-display text-[clamp(3rem,7vw,6.5rem)] font-extrabold leading-none tracking-[-0.04em] text-[#F5F5F5]">
            {PERSON.initials}
            <span className="ml-1 inline-block h-[0.16em] w-[0.16em] rounded-full bg-[#7B5CFF] shadow-[0_0_1rem_rgba(123,92,255,0.9)]" />
          </span>
          <span className="mt-3 font-mono text-[0.625rem] uppercase tracking-[0.3em] text-[#B49CFF]/80">
            {PERSON.specialities[0]}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Hero({ isLoaded }: { isLoaded: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const artRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { scrollTo } = useSmoothScroll();
  const heroImage = HERO_IMAGE;
  const hasImage = heroImage !== null;

  // Intro — waits for the preloader. Hidden states are applied before paint.
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const hidden = () => {
        gsap.set(artRef.current, { scale: 1.15, opacity: 0 });
        gsap.set('.hero-char', { yPercent: 120, rotate: 8 });
        gsap.set('.hero-fade-up', { y: 40, opacity: 0 });
      };
      if (!isLoaded) {
        hidden();
        return;
      }
      const tl = gsap.timeline();
      tl.fromTo(artRef.current, { scale: 1.15, opacity: 0 }, { scale: 1, opacity: 1, duration: 2.2, ease: 'power3.out' }, 0)
        .fromTo(
          '.hero-char',
          { yPercent: 120, rotate: 8 },
          { yPercent: 0, rotate: 0, duration: 1.4, ease: 'expo.out', stagger: 0.025 },
          0.5,
        )
        .fromTo(
          '.hero-fade-up',
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'power4.out', stagger: 0.08 },
          0.8,
        );
    }, sectionRef);
    return () => ctx.revert();
  }, [isLoaded]);

  // Scroll parallax.
  useEffect(() => {
    if (!isLoaded || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.to('.hero-art-inner', {
        yPercent: 12,
        scale: 1.08,
        ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: 'bottom top', scrub: 0.6 },
      });
      gsap.to(contentRef.current, {
        y: -80,
        opacity: 0,
        ease: 'none',
        scrollTrigger: { trigger: sectionRef.current, start: 'top top', end: '70% top', scrub: 0.5 },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [isLoaded]);

  return (
    <section
      id="top"
      ref={sectionRef}
      aria-label="Introduction"
      className="relative min-h-[100svh] overflow-hidden bg-[#0B0D12] lg:h-[100svh] lg:min-h-[40rem]"
    >
      {/* Key art */}
      <div ref={artRef} className="absolute inset-0">
        <div className="hero-art-inner absolute inset-0 will-change-transform">
          {heroImage ? (
            <>
              <Image
                src={heroImage}
                alt={`${PERSON.fullName}, ${PERSON.role}`}
                fill
                priority
                placeholder="blur"
                sizes="100vw"
                quality={90}
                className="object-cover object-[50%_30%]"
              />
              <ImageHalo imgW={heroImage.width} imgH={heroImage.height} />
            </>
          ) : (
            <>
              <HeroShader intensity={0.8} dprCap={1} />
              <div className="absolute inset-0 bg-[#0B0D12]/45" />
              <FallbackOrb />
            </>
          )}
        </div>
      </div>

      {/* Scrims */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#0B0D12]/80 to-transparent" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-[#0E0E0E] via-[#0E0E0E]/70 to-transparent lg:h-[30%] lg:via-transparent" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden lg:block"
        style={{ background: 'linear-gradient(90deg, rgba(11,13,18,.75) 0%, transparent 32%, transparent 68%, rgba(11,13,18,.75) 100%)' }}
      />

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-10 mx-auto flex min-h-[100svh] max-w-[90rem] flex-col px-6 pb-8 pt-28 md:px-12 lg:h-full lg:min-h-0"
      >
        {!hasImage && <div aria-hidden="true" className="h-[17rem] shrink-0 sm:h-[19rem] lg:hidden" />}

        <div className={`grid flex-1 grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center lg:gap-6 ${hasImage ? 'content-end lg:content-center' : 'content-start lg:content-center'}`}>
          {/* Left */}
          <div className="@container lg:col-span-4">
            <p className="hero-fade-up mb-5 flex items-center gap-2 text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-[#F5F5F5]/80">
              <span className="h-1.5 w-1.5 rounded-full bg-[#7B5CFF] shadow-[0_0_8px_rgba(123,92,255,0.9)]" />
              {HERO_DATA.label}
            </p>
            <h1
              aria-label={HERO_DATA.headlineAria}
              data-cursor="headline"
              className="font-display text-[clamp(2.5rem,12.6cqw,4.5rem)] font-black uppercase leading-[0.92] tracking-[-0.03em] lg:text-[clamp(2.5rem,12.6cqw,7rem)]"
            >
              {HERO_DATA.headlineLines.map((line, li) => (
                <span key={li} aria-hidden="true" className="block overflow-hidden pb-[0.04em]">
                  <span
                    className={`block ${line.style === 'stroke' ? 'text-stroke' : ''} ${
                      line.style === 'accent' ? 'text-[#7B5CFF]' : ''
                    }`}
                  >
                    {Array.from(line.text).map((c, ci) => (
                      <span key={ci} className="hero-char inline-block will-change-transform">
                        {c}
                      </span>
                    ))}
                  </span>
                </span>
              ))}
            </h1>
            <div className="hero-fade-up mt-7 inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-[#0E0E0E]/50 px-4 py-2 text-xs text-[#F5F5F5]/90 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              {HERO_DATA.availability}
            </div>
          </div>

          {/* Right */}
          <div className="@container lg:col-span-3 lg:col-start-10 lg:-ml-12">
            <div className="flex flex-col gap-3 lg:gap-4">
              <p className="hero-fade-up flex items-center gap-3 font-mono text-[0.6875rem] tracking-[0.15em] text-[#B49CFF]">
                {HERO_DATA.helloLabel}
                <span className="h-px flex-1 bg-gradient-to-r from-[#7B5CFF]/60 to-transparent" />
              </p>
              <h2 className="hero-fade-up font-display text-[2.25rem] font-extrabold uppercase leading-[0.95] tracking-tight sm:text-5xl lg:text-[clamp(1.5rem,11cqw,3.25rem)]">
                <span className="block whitespace-nowrap">{PERSON.firstName}</span>
                <span className="block whitespace-nowrap text-[#7B5CFF]">{PERSON.lastName}</span>
              </h2>
              <p className="hero-fade-up text-base font-semibold leading-snug text-white">{HERO_DATA.tagline}</p>
              <p className="hero-fade-up text-sm leading-relaxed text-white/90">{HERO_DATA.intro}</p>

              <dl className="hero-fade-up mt-1 grid grid-cols-3 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10">
                {HERO_DATA.quickFacts.map((f) => (
                  <div key={f.label} className="flex flex-col gap-0.5 bg-[#0E0E0E]/75 px-3 py-2.5 backdrop-blur-md">
                    <dt className="order-2 text-[0.625rem] uppercase tracking-[0.15em] text-[#9A9A9A]">{f.label}</dt>
                    <dd className="order-1 font-display text-lg font-extrabold leading-none text-white">{f.value}</dd>
                  </div>
                ))}
              </dl>

              <div className="hero-fade-up mt-1 flex flex-wrap gap-2.5">
                <MagneticButton
                  href="#work"
                  variant="primary"
                  className="!px-5"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo('#work', 0);
                  }}
                >
                  View My Work <ArrowDownRight size={14} />
                </MagneticButton>
                <MagneticButton href={PORTFOLIO_LINKS.cv} download variant="outline" className="!px-5 bg-[#0E0E0E]/40 backdrop-blur-md">
                  Download CV <Download size={14} />
                </MagneticButton>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="hero-fade-up mt-10 flex items-center justify-between border-t border-white/10 pt-4 text-[0.625rem] font-medium uppercase tracking-[0.25em] text-[#F5F5F5]/70 lg:mt-6">
          <span className="flex items-center gap-3">
            Scroll
            <span aria-hidden="true" className="relative block h-px w-8 overflow-hidden bg-white/10">
              <span className="scroll-hint absolute inset-0 bg-[#7B5CFF]" />
            </span>
          </span>
          <span>{HERO_DATA.bottomRight}</span>
        </div>
      </div>
    </section>
  );
}
