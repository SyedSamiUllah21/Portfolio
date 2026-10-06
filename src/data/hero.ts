import type { StaticImageData } from 'next/image';

/**
 * Hero key art.
 *
 * No portrait yet → the hero renders the animated violet WebGL fallback with a
 * glowing CSS halo in the centre column.
 *
 * To switch to your portrait (dark background, glowing circle behind the face,
 * landscape ~16:9 such as 2752×1536):
 *   1. Save it as `src/assets/hero.jpg`.
 *   2. Replace the export below with:
 *        import heroImage from '@/assets/hero.jpg';
 *        export const HERO_IMAGE: StaticImageData | null = heroImage;
 *   3. Measure the halo in the image and update HALO.
 */
export const HERO_IMAGE: StaticImageData | null = null;

/** Halo centre (fractions of image width / height) and radius (fraction of image width). */
export const HALO = { cx: 0.5005, cy: 0.419, r: 0.1605 };

/** Matches the `object-[50%_30%]` position used on the hero image. */
export const HERO_OBJECT_POSITION = { x: 0.5, y: 0.3 };
