'use client';

import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ArrowUpRight, X } from 'lucide-react';
import type { Project } from '@/data/portfolio';
import { MODAL_BEZIER } from '@/lib/motion';
import { useSmoothScroll } from './SmoothScroll';
import MagneticButton from './MagneticButton';
import ProjectVisual from './ProjectVisual';
import { GithubIcon } from './icons';

interface ProjectModalProps {
  projects: Project[];
  index: number | null;
  onClose: () => void;
  onChange: (index: number) => void;
}

export default function ProjectModal({ projects, index, onClose, onChange }: ProjectModalProps) {
  const open = index !== null && !!projects[index];
  const project = open ? projects[index] : null;
  const closeRef = useRef<HTMLButtonElement>(null);
  const { lockScroll, unlockScroll } = useSmoothScroll();
  const total = projects.length;

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    lockScroll();
    closeRef.current?.focus();
    return () => {
      unlockScroll();
      previouslyFocused?.focus?.();
    };
  }, [open, lockScroll, unlockScroll]);

  useEffect(() => {
    if (!open || index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onChange((index + 1) % total);
      if (e.key === 'ArrowLeft') onChange((index - 1 + total) % total);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, index, total, onClose, onChange]);

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <AnimatePresence>
      {project && index !== null && (
        <motion.div
          key="project-modal"
          className="fixed inset-0 z-[9950] flex items-end justify-center sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: MODAL_BEZIER }}
        >
          <button
            type="button"
            aria-label="Close project"
            tabIndex={-1}
            onClick={onClose}
            className="absolute inset-0 bg-[#0E0E0E]/70 backdrop-blur-xl"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
            initial={{ scale: 0.95, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 30, opacity: 0 }}
            transition={{ duration: 0.4, ease: MODAL_BEZIER }}
            className="relative flex max-h-[92svh] w-full max-w-[64rem] flex-col overflow-hidden rounded-t-3xl border border-[#2A2A2A] bg-[#161616] shadow-[0_2rem_6rem_rgba(0,0,0,0.6)] sm:rounded-3xl"
          >
            <div className="flex items-center justify-between gap-4 border-b border-[#2A2A2A] px-5 py-4 sm:px-7">
              <p className="truncate text-[0.6875rem] font-medium uppercase tracking-[0.2em] text-[#9A9A9A]">
                <span className="text-[#7B5CFF]">Project {pad(index + 1)}</span> / {pad(total)} · {project.category}
              </p>
              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() => onChange((index - 1 + total) % total)}
                  aria-label="Previous project"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#2A2A2A] text-[#F5F5F5] transition-colors hover:border-[#7B5CFF] hover:bg-[#7B5CFF]/10"
                >
                  <ArrowLeft size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => onChange((index + 1) % total)}
                  aria-label="Next project"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[#2A2A2A] text-[#F5F5F5] transition-colors hover:border-[#7B5CFF] hover:bg-[#7B5CFF]/10"
                >
                  <ArrowRight size={16} />
                </button>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={onClose}
                  aria-label="Close project"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F5F5F5] text-[#0E0E0E] transition-colors hover:bg-[#7B5CFF] hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="overflow-y-auto overscroll-contain" data-lenis-prevent>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.3, ease: MODAL_BEZIER }}
                >
                  <div className="relative aspect-[16/8] w-full overflow-hidden">
                    <ProjectVisual project={project} sizes="(min-width: 1024px) 64rem, 100vw" large />
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#161616] to-transparent" />
                    {project.liveUrl && (
                      <span className="absolute bottom-5 left-5 flex items-center gap-2 rounded-full border border-emerald-400/30 bg-[#0E0E0E]/70 px-3 py-1.5 text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-emerald-400 backdrop-blur-md sm:left-7">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        </span>
                        Live
                      </span>
                    )}
                  </div>

                  <div className="px-5 pb-8 pt-4 sm:px-7 sm:pb-10">
                    <h3
                      id="project-modal-title"
                      className="font-display text-3xl font-extrabold uppercase leading-[0.95] tracking-tight sm:text-5xl"
                    >
                      {project.title}
                    </h3>
                    {project.year && <p className="mt-2 font-mono text-xs text-[#9A9A9A]">{project.year}</p>}
                    <p className="mt-5 max-w-[46rem] text-base leading-relaxed text-[#C8C8C8] sm:text-lg">{project.description}</p>

                    <h4 className="mt-8 text-xs font-medium uppercase tracking-[0.2em] text-[#7B5CFF]">Highlights</h4>
                    <ul className="mt-4 grid gap-3">
                      {project.highlights.map((h) => (
                        <li key={h} className="flex gap-3 text-sm leading-relaxed text-[#E5E5E5] sm:text-base">
                          <span aria-hidden="true" className="mt-0.5 text-[#7B5CFF]">
                            ✦
                          </span>
                          {h}
                        </li>
                      ))}
                    </ul>

                    <ul className="mt-8 flex flex-wrap gap-2" aria-label="Tech stack">
                      {project.tags.map((t) => (
                        <li key={t} className="rounded-full border border-[#2A2A2A] bg-[#1F1F1F] px-3.5 py-1.5 text-xs font-medium text-[#F5F5F5]">
                          {t}
                        </li>
                      ))}
                    </ul>

                    {(project.liveUrl || project.repoUrl) && (
                      <div className="mt-9 flex flex-wrap gap-3">
                        {project.liveUrl && (
                          <MagneticButton href={project.liveUrl} target="_blank" variant="primary">
                            Live Demo <ArrowUpRight size={14} />
                          </MagneticButton>
                        )}
                        {project.repoUrl && (
                          <MagneticButton href={project.repoUrl} target="_blank" variant="outline">
                            <GithubIcon size={14} /> View on GitHub
                          </MagneticButton>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
