"use client";

import {
    motion,
    useInView,
    useMotionValue,
    useReducedMotion,
    useScroll,
    useSpring,
    useTransform,
    MotionValue,
} from "framer-motion";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

// 3D "fly through" gallery: cards rush out of the depth of the screen toward
// the viewer while the page scrolls. The section is `length` screens tall and
// its stage stays pinned (sticky) meanwhile, so it runs on normal page scroll:
// wheel, trackpad, touch, keyboard and scrollbar all work and nothing is ever
// trapped. Visitors who ask for reduced motion get a flat, static layout.

interface TunnelLayout {
    angleCos: number;
    angleSin: number;
    radiusFactorX: number;
    radiusFactorY: number;
    rotationZ: number;
}

// Golden-angle spiral, so any number of cards spreads evenly around the centre.
function buildLayout(count: number): TunnelLayout[] {
    return Array.from({ length: count }, (_, i) => {
        const goldenAngle = i * 137.5 * (Math.PI / 180);
        return {
            angleCos: Math.cos(goldenAngle),
            angleSin: Math.sin(goldenAngle),
            radiusFactorX: 0.28 + (i % 3) * 0.08,
            radiusFactorY: 0.26 + (i % 2) * 0.09,
            rotationZ: (i % 2 === 0 ? 1 : -1) * (3 + (i % 5) * 2),
        };
    });
}

const SPRING_CONFIG = { stiffness: 60, damping: 25, mass: 0.5 };

interface StageDimensions {
    width: number;
    height: number;
    isMobile: boolean;
}

function useCameraParallax(enabled: boolean) {
    const rawX = useMotionValue(0);
    const rawY = useMotionValue(0);
    const x = useSpring(rawX, SPRING_CONFIG);
    const y = useSpring(rawY, SPRING_CONFIG);

    useEffect(() => {
        if (!enabled) return;
        const onMove = (e: PointerEvent) => {
            rawX.set((e.clientX / window.innerWidth - 0.5) * 2);
            rawY.set((e.clientY / window.innerHeight - 0.5) * 2);
        };
        window.addEventListener("pointermove", onMove, { passive: true });
        return () => window.removeEventListener("pointermove", onMove);
    }, [enabled, rawX, rawY]);

    return { x, y };
}

interface TunnelCardProps {
    layout: TunnelLayout;
    index: number;
    total: number;
    progress: MotionValue<number>;
    pointer: { x: MotionValue<number>; y: MotionValue<number> };
    stage: StageDimensions;
    children: ReactNode;
}

function TunnelCard({ layout, index, total, progress, pointer, stage, children }: TunnelCardProps) {
    const staggerSpan = 0.55;
    const start = (index / total) * (1 - staggerSpan);
    const end = start + staggerSpan;

    const localProgress = useTransform(progress, [start, end], [0, 1]);

    const farZ = stage.isMobile ? -1200 : -1700;
    const nearZ = stage.isMobile ? 350 : 500;
    const z = useTransform(localProgress, [0, 1], [farZ, nearZ]);

    const opacity = useTransform(localProgress, [0, 0.18, 0.82, 0.98], [0, 1, 1, 0]);
    // Fully faded cards are hidden, so they can't catch clicks or cost paint.
    const visibility = useTransform(opacity, (o) => (o < 0.01 ? "hidden" : "visible"));

    const cardWidth = stage.isMobile
        ? Math.max(130, Math.min(180, stage.width * 0.38))
        : Math.max(180, Math.min(270, stage.width * 0.18));

    const baseX = layout.angleCos * (stage.width * layout.radiusFactorX);
    const baseY = layout.angleSin * (stage.height * layout.radiusFactorY);
    const panStrength = stage.isMobile ? 20 : 45;

    const transform = useTransform(
        [z, pointer.x, pointer.y],
        ([currZ, px, py]: number[]) => {
            const offsetX = baseX - px * panStrength;
            const offsetY = baseY - py * panStrength;
            return `translate3d(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px), ${currZ}px) rotateZ(${layout.rotationZ}deg)`;
        }
    );

    return (
        <motion.div
            style={{
                width: cardWidth,
                transform,
                opacity,
                visibility,
                zIndex: index + 1,
            }}
            className="pointer-events-auto absolute left-1/2 top-1/2 aspect-[4/5] will-change-transform select-none"
        >
            {children}
        </motion.div>
    );
}

export interface PerspectiveTunnelHeroProps<T> {
    items: readonly T[];
    renderCard: (item: T, index: number) => ReactNode;
    getKey: (item: T, index: number) => string;
    /**
     * Backdrop and centre content, drawn behind the cards. Gets the smoothed
     * 0..1 scroll progress, and whether the tunnel is animated at all.
     */
    children?: (progress: MotionValue<number>, state: { animated: boolean }) => ReactNode;
    /** Scroll distance of the section, in screen heights. */
    length?: number;
    className?: string;
}

export default function PerspectiveTunnelHero<T>({
    items,
    renderCard,
    getKey,
    children,
    length = 3,
    className,
}: PerspectiveTunnelHeroProps<T>) {
    const trackRef = useRef<HTMLElement>(null);
    const stageRef = useRef<HTMLDivElement>(null);
    const reduce = useReducedMotion();
    const inView = useInView(trackRef);
    const layout = useMemo(() => buildLayout(items.length), [items.length]);

    // The server always renders the animated version; reduced-motion visitors
    // switch to the static one after mount, which keeps hydration consistent.
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    const animated = !(mounted && reduce);

    const [stage, setStage] = useState<StageDimensions>({
        width: 1440,
        height: 900,
        isMobile: false,
    });

    // Sized from the stage itself rather than the window, so it also fits a
    // narrower column instead of overflowing it.
    useEffect(() => {
        const el = stageRef.current;
        if (!el) return;

        const observer = new ResizeObserver(([entry]) => {
            const { width, height } = entry.contentRect;
            setStage({ width, height, isMobile: width < 768 });
        });
        observer.observe(el);
        return () => observer.disconnect();
    }, [animated]);

    // 0 when the section's top enters the bottom of the screen, 1 when its end
    // scrolls past: the tunnel is already moving as it arrives, then pins.
    const { scrollYProgress } = useScroll({
        target: trackRef,
        offset: ["start end", "end end"],
    });
    const progress = useSpring(scrollYProgress, {
        stiffness: 80,
        damping: 30,
        restDelta: 0.0001,
    });
    const still = useMotionValue(0.5);

    const pointer = useCameraParallax(animated && inView);

    return (
        <section
            ref={trackRef}
            className={cn("relative", className)}
            style={animated ? { height: `${length * 100}svh` } : undefined}
        >
            {animated ? (
                <div
                    ref={stageRef}
                    className="sticky top-0 flex h-svh w-full items-center justify-center overflow-hidden"
                    style={{
                        perspective: stage.isMobile ? "900px" : "1200px",
                        transformStyle: "preserve-3d",
                    }}
                >
                    {children?.(progress, { animated })}

                    {/* 3D Z-Space Plane */}
                    <div
                        className="pointer-events-none absolute inset-0"
                        style={{ transformStyle: "preserve-3d" }}
                    >
                        {items.map((item, i) => (
                            <TunnelCard
                                key={getKey(item, i)}
                                layout={layout[i]}
                                index={i}
                                total={items.length}
                                progress={progress}
                                pointer={pointer}
                                stage={stage}
                            >
                                {renderCard(item, i)}
                            </TunnelCard>
                        ))}
                    </div>
                </div>
            ) : (
                <div
                    ref={stageRef}
                    className="relative flex flex-col items-center gap-12 overflow-hidden px-4 py-24 sm:py-32"
                >
                    {children?.(still, { animated })}
                    <div className="relative z-10 flex max-w-5xl flex-wrap justify-center gap-6">
                        {items.map((item, i) => (
                            <div
                                key={getKey(item, i)}
                                className="aspect-[4/5] w-[min(42vw,220px)]"
                                style={{ rotate: `${layout[i].rotationZ / 2}deg` }}
                            >
                                {renderCard(item, i)}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}
