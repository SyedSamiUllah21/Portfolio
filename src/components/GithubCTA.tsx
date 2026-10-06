'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight } from 'lucide-react';
import { PORTFOLIO_LINKS, PROJECTS_DATA } from '@/data/portfolio';
import { prefersReducedMotion, REPLAY } from '@/lib/motion';
import ProjectVisual from './ProjectVisual';
import { GithubIcon } from './icons';

gsap.registerPlugin(ScrollTrigger);

const MARQUEE_TEXT = Array.from({ length: 6 }, () => 'SEE MORE ON GITHUB ✦').join(' ');

// Resting and hover positions for the fanned thumbnails.
const FAN = [
  { rest: '-rotate-[8deg] -translate-x-[18%]', hover: 'group-hover:-rotate-[14deg] group-hover:-translate-x-[46%] group-hover:-translate-y-[4%]' },
  { rest: 'rotate-0 -translate-y-[6%]', hover: 'group-hover:-translate-y-[14%]' },
  { rest: 'rotate-[8deg] translate-x-[18%]', hover: 'group-hover:rotate-[14deg] group-hover:translate-x-[46%] group-hover:-translate-y-[4%]' },
];

export default function GithubCTA() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: 'top 85%',
          end: 'bottom 10%',
          toggleActions: REPLAY,
          // Created before the pinned Work section has measured, so refresh after it.
          refreshPriority: -1,
        },
      });
      tl.from('.gh-card', { y: 80, scale: 0.94, opacity: 0, duration: 1.1, ease: 'expo.out' })
        .from('.gh-text', { y: 30, opacity: 0, duration: 0.8, ease: 'power4.out', stagger: 0.08 }, '<0.25')
        .from(
          '.gh-thumb-wrap',
          {
            y: 160,
            rotate: (i: number) => [-25, 0, 25][i] ?? 0,
            opacity: 0,
            duration: 1,
            ease: 'back.out(1.4)',
            stagger: 0.1,
          },
          '<0.1',
        );
    }, root);
    return () => ctx.revert();
  }, []);

  const thumbs = PROJECTS_DATA.slice(0, 3);

  return (
    <div ref={rootRef} className="relative border-t border-[#2A2A2A] bg-[#0E0E0E] px-6 py-24 md:px-12">
      <div className="mx-auto max-w-[90rem]">
        <a
          href={PORTFOLIO_LINKS.github}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`See more work on GitHub (${PORTFOLIO_LINKS.githubHandle})`}
          className="gh-card github-card group relative block overflow-hidden rounded-[2rem] transition-[box-shadow] duration-500 hover:shadow-[0_2rem_6rem_-1rem_rgba(123,92,255,0.55)]"
        >
          {/* Marquee rows */}
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex flex-col justify-center gap-4 opacity-[0.07] transition-opacity duration-500 group-hover:opacity-[0.14]">
            <div className="marquee-left flex w-max whitespace-nowrap font-display text-[6rem] font-black leading-none text-white text-stroke-thin">
              <span className="pr-8">{MARQUEE_TEXT}</span>
              <span className="pr-8">{MARQUEE_TEXT}</span>
            </div>
            <div className="marquee-right flex w-max whitespace-nowrap font-display text-[6rem] font-black leading-none text-white text-stroke-thin">
              <span className="pr-8">{MARQUEE_TEXT}</span>
              <span className="pr-8">{MARQUEE_TEXT}</span>
            </div>
          </div>
          <div aria-hidden="true" className="pointer-events-none absolute -right-20 top-1/2 h-[28rem] w-[28rem] -translate-y-1/2 rounded-full bg-[#7B5CFF]/35 blur-[6rem]" />

          <div className="relative grid grid-cols-1 items-center gap-12 p-8 sm:p-12 lg:grid-cols-12 lg:p-16">
            <div className="lg:col-span-7">
              <p className="gh-text flex items-center gap-3 text-xs font-medium uppercase tracking-[0.2em] text-[#C9BCFF]">
                <GithubIcon size={16} /> More work · GitHub
              </p>
              <h3 className="gh-text mt-6 font-display text-5xl font-black uppercase leading-[0.92] tracking-[-0.03em] sm:text-6xl lg:text-7xl">
                Want to see the{' '}
                <span className="bg-gradient-to-r from-[#B49CFF] via-[#7B5CFF] to-[#C9BCFF] bg-clip-text text-transparent">code?</span>
              </h3>
              <p className="gh-text mt-5 max-w-[30rem] text-base leading-relaxed text-white/80 sm:text-lg">
                Repos, agents and experiments — all on GitHub.
              </p>
              <div className="gh-text mt-9 flex items-center gap-3">
                <span className="sheen relative inline-flex items-center overflow-hidden rounded-full bg-[#F5F5F5] px-7 py-4 text-xs font-bold uppercase tracking-[0.2em] text-[#0E0E0E]">
                  Open GitHub
                </span>
                <span className="flex h-[3.25rem] w-[3.25rem] items-center justify-center rounded-full bg-[#7B5CFF] text-white shadow-[0_0_2rem_rgba(123,92,255,0.6)] transition-[rotate] duration-500 group-hover:rotate-45">
                  <ArrowUpRight size={20} />
                </span>
              </div>
            </div>

            <div aria-hidden="true" className="relative mx-auto h-[15rem] w-full max-w-[26rem] sm:h-[18rem] lg:col-span-5">
              {thumbs.map((p, i) => (
                <div key={p.id} className="gh-thumb-wrap absolute inset-x-[18%] bottom-0 top-[10%]" style={{ zIndex: i === 1 ? 3 : 2 - i }}>
                  <div
                    className={`relative h-full w-full overflow-hidden rounded-2xl border border-white/20 shadow-[0_1.5rem_3rem_rgba(0,0,0,0.5)] transition-[translate,rotate] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${FAN[i].rest} ${FAN[i].hover}`}
                  >
                    <ProjectVisual project={p} sizes="16rem" />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 pt-10">
                      <p className="line-clamp-2 font-display text-xs font-extrabold uppercase leading-tight text-white">{p.title}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </a>
      </div>
    </div>
  );
}
