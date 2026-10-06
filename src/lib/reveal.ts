import gsap from 'gsap';
import { REPLAY } from './motion';

/** Animates a <SectionHeader> found inside `scope`. Call inside a gsap.context. */
export function revealSectionHeader(scope: Element, pinnedContainer?: Element, toggleActions: string = REPLAY) {
  const header = scope.querySelector('.section-header');
  if (!header) return;
  const tl = gsap.timeline({
    scrollTrigger: { trigger: header, start: 'top 85%', end: 'bottom 10%', toggleActions, pinnedContainer },
  });
  tl.from(header.querySelector('.sh-label'), { x: -40, opacity: 0, duration: 0.8, ease: 'power4.out' })
    .from(header.querySelector('.sh-line'), { scaleX: 0, duration: 0.8, ease: 'power3.out' }, '<0.2')
    .from(
      header.querySelectorAll('.sh-heading-line'),
      { yPercent: 110, rotate: 3, duration: 1.1, ease: 'expo.out', stagger: 0.1 },
      '<-0.4',
    );
}

/** Mouse move handler that drives the `.spotlight` radial highlight. */
export function spotlightMove(e: React.MouseEvent<HTMLElement>) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty('--mx', `${e.clientX - r.left}px`);
  el.style.setProperty('--my', `${e.clientY - r.top}px`);
}
