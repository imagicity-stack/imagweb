import type { MouseEvent } from "react";
import { motion, useTransform, type MotionValue } from "framer-motion";
import PerspectiveTunnelHero from "@/components/ui/perspective-tunnel-hero";
import { Sparkle } from "@/components/Doodles";
import { photo } from "@/lib/media";
import { projects as allProjects } from "@/lib/work";
import { cn } from "@/lib/utils";

// "Fly through the work": the case studies from lib/work.js rushing past in
// 3D on a black band. Each card jumps to its full case study in the grid
// below, which also carries all of this content for keyboard and screen
// reader users (so the flying cards are hidden from them).

type Project = (typeof allProjects)[number];

const TONE_BORDER: Record<string, string> = {
    yellow: "border-ix-yellow",
    red: "border-ix-red",
    ink: "border-ix-paper",
};

interface WorkCardProps {
    project: Project;
    index: number;
    onSelect?: (slug: string, event: MouseEvent<HTMLAnchorElement>) => void;
}

function WorkCard({ project, index, onSelect }: WorkCardProps) {
    return (
        <a
            href={`#${project.slug}`}
            onClick={(event) => onSelect?.(project.slug, event)}
            tabIndex={-1}
            aria-hidden="true"
            data-no-wipe
            data-cursor="view"
            className={cn(
                "group @container relative block h-full w-full overflow-hidden rounded-[20px] border-[3px] bg-ix-ink-2 text-ix-paper shadow-[0_30px_60px_-20px_rgba(0,0,0,0.85)]",
                TONE_BORDER[project.tone] ?? TONE_BORDER.ink
            )}
        >
            <img
                src={photo(project.image, 560, 1.25)}
                alt=""
                loading="lazy"
                decoding="async"
                draggable={false}
                className="h-full w-full object-cover grayscale-[0.35] contrast-[1.05] transition duration-700 ease-out group-hover:scale-110 group-hover:grayscale-0"
            />
            <span className="absolute left-[6cqw] top-[6cqw] rounded-full bg-ix-paper px-[4.5cqw] py-[1.8cqw] font-ix-display text-[length:7cqw] leading-none text-ix-ink">
                {String(index + 1).padStart(2, "0")}
            </span>
            <span className="absolute right-[5cqw] top-[5cqw] flex max-w-[58%] -rotate-[4deg] flex-col rounded-[5cqw] border-2 border-ix-ink bg-ix-yellow px-[4.5cqw] py-[3cqw] text-[length:4.2cqw] font-extrabold uppercase leading-tight tracking-[0.06em] text-ix-ink transition-transform duration-500 group-hover:rotate-3 group-hover:scale-110">
                <strong className="font-ix-display text-[length:12cqw] font-normal leading-none tracking-normal">
                    {project.result}
                </strong>
                {project.metric}
            </span>
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/55 to-transparent px-[6cqw] pb-[6cqw] pt-[22cqw]">
                <span className="block text-[length:4.4cqw] font-bold uppercase tracking-[0.12em] text-ix-yellow">
                    {project.client}
                </span>
                <span className="mt-[1.5cqw] block font-ix-display text-[length:10cqw] uppercase leading-[0.95]">
                    {project.title}
                </span>
            </span>
        </a>
    );
}

interface TunnelCopyProps {
    progress: MotionValue<number>;
    animated: boolean;
    count: number;
}

function TunnelCopy({ progress, animated, count }: TunnelCopyProps) {
    const scale = useTransform(progress, [0, 0.5, 1], [0.86, 1, 1.18]);
    const opacity = useTransform(progress, [0, 0.82, 1], [1, 1, 0.3]);
    const startCue = useTransform(progress, [0.3, 0.42], [1, 0]);
    const endCue = useTransform(progress, [0.86, 0.97], [0, 1]);

    return (
        <>
            {/* Backdrop: dot grid, warm glow and depth rings */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(255,247,232,0.16)_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(closest-side,#000_77%,transparent_140%)]"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(250,232,12,0.12)_0%,transparent_65%)]"
            />
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <span className="absolute h-[48vmin] w-[48vmin] rounded-full border-2 border-ix-yellow/25" />
                <span className="absolute h-[76vmin] w-[76vmin] rounded-full border border-dashed border-ix-paper/20" />
                <span className="absolute h-[104vmin] w-[104vmin] rounded-full border border-dotted border-ix-red/30" />
            </div>

            <motion.div
                style={{ scale, opacity }}
                className="pointer-events-none relative z-0 flex max-w-2xl flex-col items-center px-6 text-center"
            >
                <span className="relative -rotate-3 font-ix-script text-[clamp(1.15rem,1.8vw,1.5rem)] text-ix-yellow">
                    Selected work, in 3D
                    <Sparkle className="absolute -right-9 -top-5" size={30} />
                </span>
                <h2 className="mt-3 font-ix-display text-[clamp(3rem,9vw,8rem)] uppercase leading-[0.9] text-ix-paper">
                    Fly through
                    <br />
                    <span className="text-ix-yellow">the work.</span>
                </h2>
                <p className="mt-5 max-w-[34ch] text-[clamp(0.95rem,1.3vw,1.1rem)] text-ix-paper/70">
                    {animated
                        ? `${count} launches and the numbers they moved. Keep scrolling to fly past them, then tap a card to read its story.`
                        : `${count} launches and the numbers they moved. Tap a card to read its story.`}
                </p>
            </motion.div>

            {animated ? (
                <>
                    <motion.div
                        style={{ opacity: startCue }}
                        aria-hidden="true"
                        className="pointer-events-none absolute bottom-8 z-20 flex flex-col items-center gap-2"
                    >
                        <span className="-rotate-2 font-ix-script text-lg text-ix-yellow">Keep scrolling</span>
                        <span className="h-8 w-[3px] rounded-full bg-gradient-to-b from-ix-yellow to-transparent" />
                    </motion.div>
                    <motion.div
                        style={{ opacity: endCue }}
                        aria-hidden="true"
                        className="pointer-events-none absolute bottom-8 z-20 flex flex-col items-center gap-2"
                    >
                        <span className="-rotate-2 font-ix-script text-lg text-ix-yellow">Now pick a story</span>
                        <span className="h-8 w-[3px] rounded-full bg-gradient-to-b from-ix-yellow to-transparent" />
                    </motion.div>
                </>
            ) : null}
        </>
    );
}

interface WorkTunnelProps {
    projects?: readonly Project[];
    onSelect?: (slug: string, event: MouseEvent<HTMLAnchorElement>) => void;
}

export default function WorkTunnel({ projects = allProjects, onSelect }: WorkTunnelProps) {
    return (
        <PerspectiveTunnelHero
            items={projects}
            getKey={(project) => project.slug}
            renderCard={(project, index) => (
                <WorkCard project={project} index={index} onSelect={onSelect} />
            )}
            length={3.2}
            className="bg-ix-ink text-ix-paper"
        >
            {(progress, { animated }) => (
                <TunnelCopy progress={progress} animated={animated} count={projects.length} />
            )}
        </PerspectiveTunnelHero>
    );
}
