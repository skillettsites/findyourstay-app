"use client";

import { motion, useReducedMotion, useScroll, useTransform, type Variants } from "motion/react";
import { useRef, type ReactNode } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

/* Thin scroll-progress bar pinned to the top of the page. */
export function ScrollProgress({ className = "bg-ink" }: { className?: string }) {
  const { scrollYProgress } = useScroll();
  return <motion.div style={{ scaleX: scrollYProgress }} className={`fixed top-0 left-0 right-0 h-[3px] origin-left z-[60] ${className}`} />;
}

/* Scroll-triggered fade + rise. The default building block for sections. */
export function FadeUp({ children, delay = 0, y = 30, className = "" }: { children: ReactNode; delay?: number; y?: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.85, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/* Hero text that staggers in on mount, with a soft blur-in. */
const stage: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.14, delayChildren: 0.15 } } };
export function HeroStage({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div className={className} variants={stage} initial="hidden" animate="show">
      {children}
    </motion.div>
  );
}
const heroItem: Variants = {
  hidden: { opacity: 0, y: 26, filter: "blur(8px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 1, ease: EASE } },
};
export function HeroItem({ children, className = "" }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div className={className} variants={reduce ? undefined : heroItem}>
      {children}
    </motion.div>
  );
}

/* Full-bleed background image with gentle parallax + slow ken-burns zoom. */
export function ParallaxImage({ src, alt = "", priority = false }: { src: string; alt?: string; priority?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.08, 1.2]);
  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <motion.img
        src={src}
        alt={alt}
        fetchPriority={priority ? "high" : "auto"}
        style={reduce ? { scale: 1.05 } : { y, scale }}
        className="absolute inset-0 w-full h-full object-cover will-change-transform"
      />
    </div>
  );
}

/* Stagger container + item, for animating grids of cards/links. */
const container: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.04 } } };
const item: Variants = { hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } } };
export function Stagger({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div className={className} variants={container} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-60px" }}>
      {children}
    </motion.div>
  );
}
export function Item({ children, className = "" }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div className={className} variants={reduce ? undefined : item}>
      {children}
    </motion.div>
  );
}

/* Animated scroll cue for the bottom of a hero. */
export function ScrollCue({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={reduce ? { opacity: 0.7 } : { opacity: [0.2, 0.9, 0.2], y: [0, 7, 0] }}
      transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
      aria-hidden
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </motion.div>
  );
}
