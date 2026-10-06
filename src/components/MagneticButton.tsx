'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { isFinePointer, prefersReducedMotion } from '@/lib/motion';

type Variant = 'primary' | 'secondary' | 'outline' | 'pill' | 'ghost';

interface BaseProps {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
  /** Classes for the inner label wrapper. */
  labelClassName?: string;
  'aria-label'?: string;
}

type AnchorProps = BaseProps & {
  href: string;
  download?: boolean | string;
  target?: string;
  rel?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
};

type ButtonProps = BaseProps & {
  href?: undefined;
  type?: 'button' | 'submit';
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
};

export type MagneticButtonProps = AnchorProps | ButtonProps;

const VARIANTS: Record<Variant, { base: string; fill: string }> = {
  primary: {
    base: 'bg-[#7B5CFF] text-white border border-[#7B5CFF] shadow-[0_0.5rem_2rem_rgba(123,92,255,0.35)] hover:shadow-[0_0.75rem_2.5rem_rgba(123,92,255,0.55)]',
    fill: 'bg-[#5530A7]',
  },
  secondary: {
    base: 'bg-[#F5F5F5] text-[#0E0E0E] border border-[#F5F5F5] hover:text-white',
    fill: 'bg-[#5530A7]',
  },
  outline: {
    base: 'bg-transparent text-[#F5F5F5] border border-white/30 hover:border-[#7B5CFF]',
    fill: 'bg-[#5530A7]',
  },
  pill: {
    base: 'bg-[#161616] text-[#F5F5F5] border border-[#2A2A2A] hover:border-[#7B5CFF]',
    fill: 'bg-[#5530A7]',
  },
  ghost: {
    base: 'bg-transparent text-[#F5F5F5] border border-transparent',
    fill: 'bg-white/5',
  },
};

export default function MagneticButton(props: MagneticButtonProps) {
  const { children, variant = 'primary', className = '', labelClassName = '' } = props;
  const rootRef = useRef<HTMLElement | null>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = rootRef.current;
    const label = labelRef.current;
    if (!el || !label || prefersReducedMotion() || !isFinePointer()) return;

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      gsap.to(el, { x: x * 0.35, y: y * 0.35, duration: 0.3, ease: 'power2.out' });
      gsap.to(label, { x: x * 0.47 - x * 0.35, y: y * 0.47 - y * 0.35, duration: 0.3, ease: 'power2.out' });
    };
    const onLeave = () => {
      gsap.to([el, label], { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.4)' });
    };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
      gsap.killTweensOf([el, label]);
    };
  }, []);

  const v = VARIANTS[variant];
  const classes = `group/mag relative inline-flex items-center justify-center overflow-hidden rounded-full px-7 py-3.5 text-xs font-semibold uppercase tracking-[0.15em] transition-[color,border-color,box-shadow,background-color] duration-500 ${v.base} ${className}`;

  const inner = (
    <>
      <span
        aria-hidden="true"
        className={`absolute inset-0 translate-y-[101%] rounded-[inherit] transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover/mag:translate-y-0 ${v.fill}`}
      />
      <span ref={labelRef} className={`relative z-10 inline-flex items-center gap-2 ${labelClassName}`}>
        {children}
      </span>
    </>
  );

  if (props.href !== undefined) {
    const { href, download, target, rel, onClick } = props as AnchorProps;
    return (
      <a
        ref={(n) => {
          rootRef.current = n;
        }}
        href={href}
        download={download}
        target={target}
        rel={rel ?? (target === '_blank' ? 'noopener noreferrer' : undefined)}
        onClick={onClick}
        aria-label={props['aria-label']}
        className={classes}
      >
        {inner}
      </a>
    );
  }

  const { type = 'button', onClick, disabled } = props as ButtonProps;
  return (
    <button
      ref={(n) => {
        rootRef.current = n;
      }}
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={props['aria-label']}
      className={classes}
    >
      {inner}
    </button>
  );
}
