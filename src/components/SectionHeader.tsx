interface SectionHeaderProps {
  index: string;
  label: string;
  /** Each entry renders on its own line. Use `accent` for a violet line. */
  lines: { text: string; accent?: boolean; stroke?: boolean; sup?: string }[];
  className?: string;
  id?: string;
}

export default function SectionHeader({ index, label, lines, className = '', id }: SectionHeaderProps) {
  return (
    <div className={`section-header ${className}`}>
      <p className="sh-label flex items-center gap-3 text-xs font-medium uppercase tracking-[0.2em] text-[#7B5CFF]">
        <span>
          ({index}) — {label}
        </span>
        <span aria-hidden="true" className="sh-line block h-px w-12 origin-left bg-[#7B5CFF]/40" />
      </p>
      <h2
        id={id}
        className="mt-5 font-display text-4xl font-black uppercase leading-[0.95] tracking-[-0.03em] sm:text-6xl lg:text-7xl"
      >
        {lines.map((l, i) => (
          <span key={i} className="block overflow-hidden pb-[0.06em]">
            <span
              className={`sh-heading-line block ${l.accent ? 'text-[#7B5CFF]' : ''} ${l.stroke ? 'text-stroke' : ''}`}
            >
              {l.text}
              {l.sup && (
                <span className="ml-3 hidden pt-[0.4em] align-top font-mono text-[0.25em] font-normal leading-none tracking-normal text-[#9A9A9A] [-webkit-text-fill-color:currentColor] sm:inline-block">
                  {l.sup}
                </span>
              )}
            </span>
          </span>
        ))}
      </h2>
    </div>
  );
}
