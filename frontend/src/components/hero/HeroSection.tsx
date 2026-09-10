import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown, Flame, Zap, Activity, Clock, Layers } from 'lucide-react';
import { TicketStats } from '../../types';

gsap.registerPlugin(ScrollTrigger);

interface HeroSectionProps {
  stats: TicketStats;
  onOpenCreate: () => void;
  onScrollToWorkspace: () => void;
  onSwitchToKanban: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  stats,
  onOpenCreate,
  onScrollToWorkspace,
  onSwitchToKanban,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineLine1Ref = useRef<HTMLDivElement>(null);
  const headlineLine2Ref = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const telemetryBarRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !containerRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Kinetic Typography assembly on load
      tl.fromTo(
        [headlineLine1Ref.current, headlineLine2Ref.current],
        { y: '110%', opacity: 0, rotateX: 25 },
        {
          y: '0%',
          opacity: 1,
          rotateX: 0,
          duration: 0.85,
          stagger: 0.12,
          ease: 'power3.out',
        }
      )
      .fromTo(
        subtitleRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.6 },
        '-=0.4'
      )
      .fromTo(
        telemetryBarRef.current,
        { opacity: 0, scale: 0.98 },
        { opacity: 1, scale: 1, duration: 0.5 },
        '-=0.3'
      )
      .fromTo(
        cardsRef.current ? cardsRef.current.children : [],
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 },
        '-=0.3'
      );

      // ScrollTrigger reaction on scrolling down
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.5,
        animation: gsap.to(containerRef.current, {
          opacity: 0.92,
          y: -20,
          ease: 'none',
        }),
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full border-b border-[#E5E7EB] dark:border-[#262B35] bg-white dark:bg-[#0D0F12] pt-10 pb-12 overflow-hidden transition-colors duration-150"
    >
      {/* Precision architectural background grid */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: 'radial-gradient(#111827 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Sub-header telemetry badge */}
        <div 
          ref={telemetryBarRef}
          className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-[#E5E7EB] dark:border-[#262B35]"
        >
          <div className="inline-flex items-center gap-2.5 px-2.5 py-1 rounded border border-[#FF4400]/40 bg-[#FFF1EB] dark:bg-[#FF4400]/10 text-xs font-mono font-semibold text-[#FF4400] tracking-wider uppercase">
            <Flame className="w-3.5 h-3.5 fill-[#FF4400]" />
            <span>OPERATIONAL TELEMETRY // CRM-V3</span>
          </div>

          <div className="flex items-center gap-6 text-xs font-mono text-[#4B5563] dark:text-[#9CA3AF]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#16A34A]"></span>
              LATENCY 12ms
            </span>
            <span className="hidden sm:flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-[#FF4400]" />
              ZERO DRAG MODE
            </span>
            <span className="hidden md:flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#2563EB]" />
              AVG RESOLUTION: {stats.avgResolutionHours}h
            </span>
          </div>
        </div>

        {/* Main kinetic typography headline */}
        <div className="max-w-4xl">
          <div className="overflow-hidden">
            <h1
              ref={headlineLine1Ref}
              className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-[#111827] dark:text-[#F9FAFB] tracking-tight leading-[1.05]"
            >
              RADICAL INCIDENT VELOCITY.
            </h1>
          </div>
          <div className="overflow-hidden mt-1 sm:mt-2">
            <h1
              ref={headlineLine2Ref}
              className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.05] text-[#FF4400]"
            >
              ZERO BACKLOG FRICTION.
            </h1>
          </div>

          <p
            ref={subtitleRef}
            className="mt-5 text-base sm:text-lg text-[#4B5563] dark:text-[#9CA3AF] max-w-2xl leading-relaxed font-normal"
          >
            A high-cadence support cockpit built for engineering-led teams. Instant search-as-you-type, shared-layout Kanban pipeline, and sub-millisecond status triage across all active customer inquiries.
          </p>

          {/* Quick CTA actions */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onOpenCreate}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-[#FF4400] hover:bg-[#E63D00] active:bg-[#CC3600] text-white font-mono font-medium text-xs tracking-wider uppercase transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FF4400] focus:ring-offset-2 dark:focus:ring-offset-[#0D0F12]"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>LOG NEW INCIDENT</span>
            </button>

            <button
              type="button"
              onClick={onSwitchToKanban}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-[#D1D5DB] dark:border-[#374151] bg-white dark:bg-[#15181E] text-[#111827] dark:text-[#F9FAFB] hover:bg-[#F3F4F6] dark:hover:bg-[#1B2028] font-mono font-medium text-xs tracking-wider uppercase transition-colors"
            >
              <Layers className="w-4 h-4 text-[#FF4400]" />
              <span>EXPLORE KANBAN PIPELINE</span>
            </button>

            <button
              type="button"
              onClick={onScrollToWorkspace}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-md text-[#4B5563] dark:text-[#9CA3AF] hover:text-[#111827] dark:hover:text-[#F9FAFB] font-mono text-xs font-medium tracking-wide transition-colors"
            >
              <span>JUMP TO TRIAGE</span>
              <ArrowDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Live operational KPI metrics strip */}
        <div
          ref={cardsRef}
          className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-[#E5E7EB] dark:border-[#262B35]"
        >
          <div className="p-3.5 rounded-md border border-[#E5E7EB] dark:border-[#262B35] bg-[#F8F9FA] dark:bg-[#15181E]/60">
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#4B5563] dark:text-[#9CA3AF]">
              TOTAL PIPELINE
            </div>
            <div className="mt-1 font-mono font-bold text-2xl text-[#111827] dark:text-[#F9FAFB]">
              {stats.total}
            </div>
            <div className="mt-1 text-[11px] font-mono text-[#4B5563] dark:text-[#9CA3AF]">
              Active customer threads
            </div>
          </div>

          <div className="p-3.5 rounded-md border border-[#FF4400]/40 bg-[#FFF1EB] dark:bg-[#FF4400]/10">
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#FF4400] font-semibold">
              UNRESOLVED OPEN
            </div>
            <div className="mt-1 font-mono font-bold text-2xl text-[#FF4400]">
              {stats.openCount}
            </div>
            <div className="mt-1 text-[11px] font-mono text-[#FF4400]/80">
              Needs triage / owner
            </div>
          </div>

          <div className="p-3.5 rounded-md border border-[#E5E7EB] dark:border-[#262B35] bg-[#F8F9FA] dark:bg-[#15181E]/60">
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#4B5563] dark:text-[#9CA3AF]">
              IN PROGRESS
            </div>
            <div className="mt-1 font-mono font-bold text-2xl text-[#2563EB] dark:text-[#60A5FA]">
              {stats.inProgressCount}
            </div>
            <div className="mt-1 text-[11px] font-mono text-[#4B5563] dark:text-[#9CA3AF]">
              Active investigation
            </div>
          </div>

          <div className="p-3.5 rounded-md border border-[#E5E7EB] dark:border-[#262B35] bg-[#F8F9FA] dark:bg-[#15181E]/60">
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#4B5563] dark:text-[#9CA3AF]">
              CLOSED / RESOLVED
            </div>
            <div className="mt-1 font-mono font-bold text-2xl text-[#16A34A] dark:text-[#4ADE80]">
              {stats.closedCount}
            </div>
            <div className="mt-1 text-[11px] font-mono text-[#4B5563] dark:text-[#9CA3AF]">
              Confirmed solutions
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
