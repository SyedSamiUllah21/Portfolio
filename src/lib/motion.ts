export const EASINGS = {
  expoOut: 'expo.out',
  power4Out: 'power4.out',
  power3Out: 'power3.out',
  elasticOut: 'elastic.out(1, 0.4)',
  backOut: 'back.out(1.7)',
  cssCurtain: 'cubic-bezier(0.76, 0, 0.24, 1)',
} as const;

export const DURATIONS = { fast: 0.4, base: 0.8, slow: 1.2, hero: 1.4 } as const;

export const STAGGERS = { chars: 0.02, words: 0.06, lines: 0.1, cards: 0.12 } as const;

/** framer-motion friendly version of the curtain ease. */
export const CURTAIN_BEZIER = [0.76, 0, 0.24, 1] as const;
export const MODAL_BEZIER = [0.16, 1, 0.3, 1] as const;

/** Scroll reveals replay in both directions. */
export const REPLAY = 'play reverse play reverse';

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function isFinePointer(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
}

/**
 * Splits text for per-word / per-character animation.
 * `words` → ['Hi,', "I'm", …]
 * `chars` → [['H','i',','], ['I',"'",'m'], …] (grouped by word so words never break mid-line)
 */
export function splitText(text: string, by: 'words'): string[];
export function splitText(text: string, by: 'chars'): string[][];
export function splitText(text: string, by: 'words' | 'chars'): string[] | string[][] {
  const words = text.split(/\s+/).filter(Boolean);
  if (by === 'words') return words;
  return words.map((w) => Array.from(w));
}
