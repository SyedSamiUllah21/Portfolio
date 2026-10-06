'use client';

import { ArrowUp } from 'lucide-react';
import { NAV_LINKS, PERSON, PORTFOLIO_LINKS } from '@/data/portfolio';
import { useSmoothScroll } from './SmoothScroll';
import { GithubIcon, LinkedinIcon } from './icons';

export default function Footer() {
  const { scrollTo } = useSmoothScroll();
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-[#2A2A2A] bg-[#0E0E0E] px-6 pb-8 pt-20 md:px-12">
      <div className="mx-auto max-w-[90rem]">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="flex items-baseline font-display text-3xl font-extrabold tracking-tight">
              {PERSON.initials}
              <span className="ml-1 inline-block h-2.5 w-2.5 rounded-full bg-[#7B5CFF]" />
            </p>
            <p className="mt-4 max-w-[24rem] text-sm leading-relaxed text-[#9A9A9A]">
              {PERSON.role} · {PERSON.specialities.join(' · ')}. Based in {PERSON.city}, {PERSON.country}.
            </p>
          </div>

          <nav aria-label="Footer" className="lg:col-span-4">
            <p className="text-[0.625rem] font-medium uppercase tracking-[0.2em] text-[#5C5C5C]">Sitemap</p>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollTo(l.href, -80);
                    }}
                    className="group flex items-baseline gap-2 text-sm text-[#C8C8C8] transition-colors hover:text-white"
                  >
                    <span className="font-mono text-[0.625rem] text-[#5C5C5C] transition-colors group-hover:text-[#7B5CFF]">{l.index}</span>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col items-start gap-5 lg:col-span-3 lg:items-end">
            <p className="text-[0.625rem] font-medium uppercase tracking-[0.2em] text-[#5C5C5C]">Elsewhere</p>
            <div className="flex gap-3">
              <a
                href={PORTFOLIO_LINKS.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[#2A2A2A] text-[#C8C8C8] transition-colors hover:border-[#F5F5F5] hover:bg-[#F5F5F5] hover:text-[#181717]"
              >
                <GithubIcon size={18} />
              </a>
              <a
                href={PORTFOLIO_LINKS.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[#2A2A2A] text-[#C8C8C8] transition-colors hover:border-[#0A66C2] hover:bg-[#0A66C2] hover:text-white"
              >
                <LinkedinIcon size={18} />
              </a>
            </div>
            <button
              type="button"
              onClick={() => scrollTo(0)}
              className="group mt-2 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.2em] text-[#9A9A9A] transition-colors hover:text-white"
            >
              Back to top
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#7B5CFF] text-white transition-[translate] duration-500 group-hover:-translate-y-1">
                <ArrowUp size={16} />
              </span>
            </button>
          </div>
        </div>

        <p
          aria-hidden="true"
          className="mt-20 select-none whitespace-nowrap text-center font-display text-[8.4vw] font-black uppercase leading-[0.85] tracking-[-0.04em] text-white/90 text-stroke-thin"
        >
          {PERSON.firstName.split(' ')[1] ?? PERSON.firstName} {PERSON.lastName}
          <span className="text-[#7B5CFF] [-webkit-text-fill-color:currentColor]">.</span>
        </p>

        <div className="mt-10 flex flex-col gap-3 border-t border-[#2A2A2A] pt-6 text-xs text-[#5C5C5C] sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {PERSON.fullName}. All rights reserved.
          </p>
          <p className="uppercase tracking-[0.2em]">
            {PERSON.city}, {PERSON.countryCode} · {PERSON.utcLabel}
          </p>
        </div>
      </div>
    </footer>
  );
}
