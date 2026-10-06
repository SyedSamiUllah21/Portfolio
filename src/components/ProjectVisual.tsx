import Image from 'next/image';
import type { Project } from '@/data/portfolio';

/** Project image, or a designed gradient fallback when no screenshot exists yet. */
export default function ProjectVisual({ project, sizes, className = '', large = false }: { project: Project; sizes: string; className?: string; large?: boolean }) {
  return (
    <div className={`absolute inset-0 ${className}`} style={{ background: project.gradientFallback }}>
      {project.image ? (
        <Image src={project.image} alt={project.title} fill sizes={sizes} loading="eager" className="object-cover" />
      ) : (
        <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.18]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.35) 1px, transparent 1px)',
              backgroundSize: large ? '3rem 3rem' : '2.5rem 2.5rem',
              maskImage: 'radial-gradient(ellipse at 70% 30%, #000 10%, transparent 75%)',
              WebkitMaskImage: 'radial-gradient(ellipse at 70% 30%, #000 10%, transparent 75%)',
            }}
          />
          <div className="absolute -right-[10%] -top-[20%] aspect-square w-[60%] rounded-full bg-[#C9BCFF]/25 blur-[4rem]" />
          <span
            className={`absolute -right-[0.04em] top-[-0.12em] font-display font-black leading-none text-white/70 text-stroke-thin ${
              large ? 'text-[clamp(8rem,22vw,16rem)]' : 'text-[clamp(7rem,16vw,15rem)]'
            }`}
          >
            {project.number}
          </span>
          {large && (
          <div className="absolute left-[8%] top-[14%] flex flex-wrap gap-1.5 pr-[40%]">
            {project.tags.slice(0, 3).map((t) => (
              <span key={t} className="rounded-md border border-white/20 bg-black/20 px-2 py-1 font-mono text-[0.625rem] uppercase tracking-[0.1em] text-white/75 backdrop-blur-sm">
                {t}
              </span>
            ))}
          </div>
          )}
        </div>
      )}
    </div>
  );
}
