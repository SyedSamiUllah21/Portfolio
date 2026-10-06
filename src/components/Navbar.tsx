'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnimatePresence, motion } from 'framer-motion';
import { NAV_LINKS, PERSON, PORTFOLIO_LINKS } from '@/data/portfolio';
import { CURTAIN_BEZIER, prefersReducedMotion } from '@/lib/motion';
import { useSmoothScroll } from './SmoothScroll';
import MagneticButton from './MagneticButton';
import ScrambleText from './ScrambleText';
import { GithubIcon, LinkedinIcon } from './icons';

gsap.registerPlugin(ScrollTrigger);

function useLocalTime(timeZone: string) {
  const [time, setTime] = useState('--:--');
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-GB', { timeZone, hour: '2-digit', minute: '2-digit', hour12: false });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    let interval = 0;
    // Align updates to the start of each minute.
    const timeout = window.setTimeout(() => {
      tick();
      interval = window.setInterval(tick, 60_000);
    }, 60_000 - (Date.now() % 60_000));
    return () => {
      window.clearTimeout(timeout);
      window.clearInterval(interval);
    };
  }, [timeZone]);
  return time;
}

function NavLinkItem({ label, href, active, onNavigate }: { label: string; href: string; active: boolean; onNavigate: (href: string) => void }) {
  const [hover, setHover] = useState(false);
  return (
    <li>
      <a
        href={href}
        onClick={(e) => {
          e.preventDefault();
          onNavigate(href);
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        aria-current={active ? 'true' : undefined}
        className={`relative flex flex-col items-center px-3 py-2 text-xs font-medium uppercase tracking-[0.15em] transition-colors duration-300 ${
          active ? 'text-[#F5F5F5]' : 'text-[#9A9A9A] hover:text-[#F5F5F5]'
        }`}
      >
        <ScrambleText text={label} active={hover} />
        <span
          aria-hidden="true"
          className={`absolute -bottom-0.5 h-1 w-1 rounded-full bg-[#7B5CFF] shadow-[0_0_8px_rgba(123,92,255,0.9)] transition-[opacity,scale] duration-300 ${
            active ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
          }`}
        />
      </a>
    </li>
  );
}

export default function Navbar({ isLoaded }: { isLoaded: boolean }) {
  const navRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState('');
  const { scrollTo, lockScroll, unlockScroll } = useSmoothScroll();
  const time = useLocalTime(PERSON.timezone);
  const introDone = useRef(false);
  const hidden = useRef(false);

  // Intro: slide down once the preloader is gone.
  useLayoutEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    if (!isLoaded) {
      gsap.set(nav, { yPercent: -100 });
      return;
    }
    gsap.to(nav, {
      yPercent: 0,
      duration: prefersReducedMotion() ? 0 : 0.8,
      ease: 'expo.out',
      onComplete: () => {
        introDone.current = true;
      },
    });
  }, [isLoaded]);

  // Background after 50px, hide on scroll down past 150px, show on scroll up.
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        const y = self.scroll();
        setScrolled(y > 50);
        if (!introDone.current) return;
        const shouldHide = self.direction === 1 && y > 150;
        if (shouldHide !== hidden.current) {
          hidden.current = shouldHide;
          gsap.to(nav, { yPercent: shouldHide ? -100 : 0, duration: 0.5, ease: 'power3.out', overwrite: true });
        }
      },
    });
    return () => st.kill();
  }, []);

  // Active-section dot.
  useEffect(() => {
    const triggers = NAV_LINKS.map(({ href }) => {
      const el = document.querySelector(href);
      if (!el) return null;
      return ScrollTrigger.create({
        trigger: el,
        start: 'top 40%',
        end: 'bottom 40%',
        refreshPriority: -1,
        onToggle: (self) => {
          if (self.isActive) setActive(href);
          else setActive((cur) => (cur === href ? '' : cur));
        },
      });
    });
    return () => triggers.forEach((t) => t?.kill());
  }, [isLoaded]);

  // Mobile menu: lock scroll + Escape.
  useEffect(() => {
    if (!menuOpen) return;
    lockScroll();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      unlockScroll();
    };
  }, [menuOpen, lockScroll, unlockScroll]);

  const navigate = (href: string) => {
    setMenuOpen(false);
    // Let the menu unlock scrolling before travelling.
    window.setTimeout(() => scrollTo(href, -80), menuOpen ? 50 : 0);
  };

  return (
    <>
      <header
        ref={navRef}
        className={`fixed inset-x-0 top-0 z-[9900] border-b transition-[background-color,border-color,backdrop-filter] duration-500 ${
          scrolled && !menuOpen ? 'border-[#2A2A2A] bg-[#0E0E0E]/80 backdrop-blur-md' : 'border-transparent bg-transparent'
        }`}
      >
        <nav aria-label="Primary" className="mx-auto flex h-[4.5rem] max-w-[90rem] items-center justify-between gap-4 px-6 md:px-12">
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              navigate('#top');
            }}
            aria-label={`${PERSON.fullName} — back to top`}
            className="group flex items-baseline font-display text-xl font-extrabold tracking-tight"
          >
            {PERSON.initials}
            <span className="ml-0.5 inline-block h-2 w-2 rounded-full bg-[#7B5CFF] transition-transform duration-500 group-hover:scale-[1.8]" />
          </a>

          <ul className="hidden items-center gap-1 lg:flex">
            {NAV_LINKS.map((l) => (
              <NavLinkItem key={l.href} label={l.label} href={l.href} active={active === l.href} onNavigate={navigate} />
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <div
              className="hidden items-center gap-2 rounded-full border border-[#2A2A2A] bg-[#161616]/70 px-3.5 py-2 font-mono text-[0.6875rem] tracking-[0.1em] text-[#9A9A9A] sm:flex"
              aria-label={`Local time in ${PERSON.city}`}
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              <span>
                {PERSON.cityCode} <span className="text-[#F5F5F5]" suppressHydrationWarning>{time}</span>
              </span>
            </div>

            <div className="hidden md:block">
              <MagneticButton
                href="#contact"
                variant="primary"
                className="!px-5 !py-2.5"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('#contact');
                }}
              >
                Let&apos;s Talk
              </MagneticButton>
            </div>

            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="relative flex h-11 w-11 items-center justify-center rounded-full border border-[#2A2A2A] bg-[#161616]/70 lg:hidden"
            >
              <span
                className={`absolute h-[1.5px] w-5 bg-[#F5F5F5] transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
                  menuOpen ? 'rotate-45' : '-translate-y-[0.25rem]'
                }`}
              />
              <span
                className={`absolute h-[1.5px] w-5 bg-[#F5F5F5] transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
                  menuOpen ? '-rotate-45' : 'translate-y-[0.25rem]'
                }`}
              />
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            initial={{ clipPath: 'circle(0% at calc(100% - 40px) 40px)' }}
            animate={{ clipPath: 'circle(150% at calc(100% - 40px) 40px)' }}
            exit={{ clipPath: 'circle(0% at calc(100% - 40px) 40px)' }}
            transition={{ duration: 0.6, ease: CURTAIN_BEZIER }}
            className="fixed inset-0 z-[9890] flex flex-col justify-between overflow-y-auto bg-[#0E0E0E] px-6 pb-8 pt-28 lg:hidden"
            data-lenis-prevent
          >
            <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-[24rem] w-[24rem] rounded-full bg-[#7B5CFF]/20 blur-[6rem]" />
            <ul className="relative flex flex-col gap-2.5">
              {NAV_LINKS.map((l, i) => (
                <li key={l.href} className="overflow-hidden">
                  <motion.a
                    href={l.href}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(l.href);
                    }}
                    initial={{ y: '110%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '110%', transition: { duration: 0.25 } }}
                    transition={{ duration: 0.7, delay: 0.2 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                    className={`flex items-baseline gap-3 py-1 font-display text-[min(6.2vw,3rem)] font-extrabold uppercase leading-none tracking-tight ${
                      active === l.href ? 'text-[#7B5CFF]' : 'text-[#F5F5F5]'
                    }`}
                  >
                    <span className="font-mono text-xs font-normal tracking-[0.1em] text-[#7B5CFF]">({l.index})</span>
                    {l.label}
                  </motion.a>
                </li>
              ))}
            </ul>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.75 }}
              className="relative mt-10 flex flex-col gap-5 border-t border-[#2A2A2A] pt-6"
            >
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#9A9A9A]">
                <span className="h-2 w-2 rounded-full bg-emerald-500 pulse-dot" />
                Available for work · {PERSON.cityCode} {time}
              </div>
              <div className="flex flex-wrap gap-3">
                <a href={PORTFOLIO_LINKS.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-full border border-[#2A2A2A] px-4 py-2.5 text-xs uppercase tracking-[0.15em] text-[#F5F5F5]">
                  <GithubIcon size={14} /> GitHub
                </a>
                <a href={PORTFOLIO_LINKS.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-full border border-[#2A2A2A] px-4 py-2.5 text-xs uppercase tracking-[0.15em] text-[#F5F5F5]">
                  <LinkedinIcon size={14} /> LinkedIn
                </a>
                <a href={PORTFOLIO_LINKS.email} className="flex items-center gap-2 rounded-full bg-[#7B5CFF] px-4 py-2.5 text-xs uppercase tracking-[0.15em] text-white">
                  Email me
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
