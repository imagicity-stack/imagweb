import { twMerge } from "tailwind-merge";

export default function TextRing({ className }: { className?: string }) {
  return (
    <div className={twMerge("text-ring pointer-events-none", className)} aria-hidden>
      <span />
      <div className="absolute inset-0 flex items-center justify-center text-xs uppercase tracking-[0.5em] text-white/60">
        Strategy • Creativity • Premium • Motion •
      </div>
    </div>
  );
}
