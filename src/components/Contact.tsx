'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, Check, Copy, Mail } from 'lucide-react';
import { CONTACT_DATA, PERSON, PORTFOLIO_LINKS, sectionIndex } from '@/data/portfolio';
import { prefersReducedMotion, REPLAY } from '@/lib/motion';
import { spotlightMove } from '@/lib/reveal';
import type { ToastType } from './Toast';
import MagneticButton from './MagneticButton';
import { Icon } from './icons';

gsap.registerPlugin(ScrollTrigger);

// GitHub / LinkedIn tiles show the real logos in their brand colours.
const BRAND_TILES: Partial<Record<string, string>> = {
  Github: 'bg-[#F5F5F5] text-[#181717]',
  Linkedin: 'bg-[#F5F5F5] text-[#0A66C2]',
};

export default function Contact({ onShowToast }: { onShowToast: (message: string, type?: ToastType) => void }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);
  const [time, setTime] = useState('--:--');

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-GB', { timeZone: PERSON.timezone, hour: '2-digit', minute: '2-digit', hour12: false });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: '.contact-head', start: 'top 85%', end: 'bottom 10%', toggleActions: REPLAY },
      });
      tl.from('.contact-label', { x: -40, opacity: 0, duration: 0.8, ease: 'power4.out' })
        .from('.contact-line', { yPercent: 110, rotate: 3, duration: 1.2, ease: 'expo.out', stagger: 0.12 }, '<0.1')
        .fromTo(
          // Marker underline: revealed left → right like a pen stroke, once the words have landed.
          '.marker-svg',
          { clipPath: 'inset(-60% 100% -60% 0%)' },
          { clipPath: 'inset(-60% 0% -60% 0%)', duration: 1, ease: 'power2.inOut' },
          '-=0.7',
        );

      gsap.from('.contact-card', {
        y: 50,
        opacity: 0,
        duration: 0.9,
        ease: 'expo.out',
        stagger: 0.08,
        scrollTrigger: { trigger: '.contact-grid', start: 'top 88%', end: 'bottom 5%', toggleActions: REPLAY },
      });
    }, section);
    return () => ctx.revert();
  }, []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PORTFOLIO_LINKS.emailAddress);
      setCopied(true);
      onShowToast('Email copied to clipboard', 'success');
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      onShowToast(`Couldn't copy — email is ${PORTFOLIO_LINKS.emailAddress}`, 'error');
    }
  };

  const [line1, line2] = CONTACT_DATA.headline;
  const line2Words = line2.split(' ');
  const lastWord = line2Words.pop();

  return (
    <section
      id="contact"
      ref={sectionRef}
      aria-labelledby="contact-title"
      className="relative overflow-hidden border-t border-[#2A2A2A] bg-[#161616] px-6 py-28 md:px-12"
    >
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-0 h-[30rem] w-[60rem] max-w-full -translate-x-1/2 rounded-full bg-[#7B5CFF]/15 blur-[8rem]" />

      <div className="relative mx-auto max-w-[90rem]">
        <div className="contact-head">
          <p className="contact-label flex items-center gap-3 text-xs font-medium uppercase tracking-[0.2em] text-[#7B5CFF]">
            ({sectionIndex('#contact')}) — Contact
            <span aria-hidden="true" className="h-px w-12 bg-[#7B5CFF]/40" />
          </p>
          <h2
            id="contact-title"
            className="mt-6 font-display text-[calc(8.4vw-0.3rem)] font-black lg:text-[min(7.6vw,8.5rem)] uppercase leading-[0.92] tracking-[-0.03em]"
          >
            <span className="block overflow-hidden pb-[0.05em]">
              <span className="contact-line block">{line1}</span>
            </span>
            <span className="block overflow-hidden pb-[0.18em]">
              <span className="contact-line block text-[#7B5CFF]">
                {line2Words.join(' ')}{' '}
                <span className="relative inline-block whitespace-nowrap">
                  {lastWord}
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 300 24"
                    preserveAspectRatio="none"
                    className="marker-svg absolute -bottom-[0.12em] left-0 h-[0.18em] w-full overflow-visible"
                  >
                    <path
                      d="M4 16 C 60 6, 120 4, 180 10 S 270 18, 296 8"
                      fill="none"
                      stroke="#C9BCFF"
                      strokeWidth="7"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </span>
            </span>
          </h2>
        </div>

        <div className="contact-grid mt-16 grid grid-cols-1 gap-5 lg:grid-cols-12">
          {/* Primary inbox */}
          <div className="contact-card lg:col-span-7">
            <div className="animated-border @container relative flex h-full flex-col justify-between overflow-hidden rounded-3xl p-7 sm:p-10">
              <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#7B5CFF]/25 blur-[4rem]" />
              <div className="relative">
                <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-[#9A9A9A]">
                  <Mail size={14} className="text-[#7B5CFF]" aria-hidden="true" />
                  {CONTACT_DATA.inboxLabel}
                </p>
                <a
                  href={PORTFOLIO_LINKS.email}
                  className="mt-5 block break-all font-display text-[clamp(1.15rem,4.1cqw,2.75rem)] font-extrabold leading-tight tracking-tight text-[#F5F5F5] transition-colors hover:text-[#B49CFF] @lg:break-normal"
                >
                  {PORTFOLIO_LINKS.emailAddress}
                </a>
              </div>
              <div className="relative mt-10 flex flex-wrap gap-3">
                <MagneticButton href={PORTFOLIO_LINKS.email} variant="primary">
                  Send an email <ArrowUpRight size={14} />
                </MagneticButton>
                <MagneticButton onClick={copyEmail} variant="outline" aria-label="Copy email address">
                  {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied' : 'Copy email'}
                </MagneticButton>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="contact-card lg:col-span-5">
            <div className="flex h-full flex-col justify-between gap-8 rounded-3xl border border-[#2A2A2A] bg-[#1F1F1F] p-7 sm:p-10">
              <div className="flex items-center gap-3">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                </span>
                <span className="text-xs font-medium uppercase tracking-[0.2em] text-emerald-400">Available for work</span>
              </div>
              <div>
                <p className="font-display text-6xl font-black leading-none tracking-tight sm:text-7xl">
                  <span suppressHydrationWarning>{time}</span>
                </p>
                <p className="mt-3 text-xs font-medium uppercase tracking-[0.2em] text-[#9A9A9A]">{CONTACT_DATA.locationLine}</p>
              </div>
              <p className="border-t border-[#2A2A2A] pt-6 text-base leading-relaxed text-[#C8C8C8]">{CONTACT_DATA.reachLine}</p>
            </div>
          </div>

          {/* Channels */}
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:col-span-12 lg:grid-cols-3">
            {CONTACT_DATA.channels.map((c) => {
              const external = c.href.startsWith('http');
              return (
                <li key={c.label} className="contact-card">
                  <a
                    href={c.href}
                    target={external ? '_blank' : undefined}
                    rel={external ? 'noopener noreferrer' : undefined}
                    download={c.download ? '' : undefined}
                    onMouseMove={spotlightMove}
                    className="spotlight group flex h-full items-center gap-4 rounded-3xl border border-[#2A2A2A] bg-[#1F1F1F] p-5 transition-[border-color,box-shadow] duration-500 hover:border-[#7B5CFF]/60 hover:shadow-[0_1rem_3rem_-1rem_rgba(123,92,255,0.5)] sm:p-6"
                  >
                    <span
                      className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-colors duration-500 ${
                        BRAND_TILES[c.icon] ?? 'bg-[#7B5CFF]/10 text-[#B49CFF] group-hover:bg-[#7B5CFF] group-hover:text-white'
                      }`}
                    >
                      <Icon
                        name={c.icon}
                        size={BRAND_TILES[c.icon] ? 24 : 20}
                        className="transition-[scale] duration-500 group-hover:scale-110"
                      />
                    </span>
                    <span className="relative z-10 min-w-0 flex-1">
                      <span className="block text-[0.625rem] font-medium uppercase tracking-[0.2em] text-[#5C5C5C]">{c.label}</span>
                      <span className="mt-1 block truncate text-sm font-medium text-[#F5F5F5] sm:text-base">{c.value}</span>
                    </span>
                    <ArrowUpRight
                      size={18}
                      aria-hidden="true"
                      className="relative z-10 shrink-0 text-[#5C5C5C] transition-[color,rotate] duration-500 group-hover:rotate-45 group-hover:text-[#7B5CFF]"
                    />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
