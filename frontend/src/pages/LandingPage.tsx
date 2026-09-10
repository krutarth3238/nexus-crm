import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ThemeToggle } from '../components/common/ThemeToggle';
import { NexusLogo } from '../components/common/NexusLogo';
import {
  Zap,
  ShieldCheck,
  Layers,
  ArrowRight,
  Clock,
  Database,
  CheckCircle2,
  Lock,
  ChevronRight,
  Flame,
  BarChart3,
  Server,
  Users
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

interface LandingPageProps {
  onNavigate: (page: 'landing' | 'login' | 'dashboard') => void;
  ticketCount: number;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, ticketCount }) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !heroRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from(headlineRef.current, {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
      });

      if (featuresRef.current) {
        gsap.from(featuresRef.current.children, {
          scrollTrigger: {
            trigger: featuresRef.current,
            start: 'top 85%',
          },
          y: 30,
          opacity: 0,
          duration: 0.7,
          stagger: 0.15,
          ease: 'power3.out',
        });
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#0D0F12] text-[#111827] dark:text-[#F9FAFB] transition-colors duration-150 flex flex-col font-sans">
      {/* Landing Navigation */}
      <header className="sticky top-0 z-40 w-full border-b border-[#E5E7EB] dark:border-[#262B35] bg-white/95 dark:bg-[#0D0F12]/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <NexusLogo variant="badge-solid" size={32} className="shrink-0" id="landing-header-logo" />
            <div>
              <span className="font-display font-extrabold text-base tracking-tight text-[#111827] dark:text-[#F9FAFB]">
                NEXUS<span className="text-[#FF4400]">.CRM</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-mono uppercase tracking-wider text-[#4B5563] dark:text-[#9CA3AF] border-l border-gray-300 dark:border-gray-700 pl-2">
                Enterprise Incident Platform
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />

            <button
              type="button"
              onClick={() => onNavigate('login')}
              className="px-3.5 py-1.5 rounded-md border border-[#D1D5DB] dark:border-[#374151] bg-white dark:bg-[#15181E] text-[#111827] dark:text-[#F9FAFB] hover:bg-[#F3F4F6] dark:hover:bg-[#1B2028] text-xs font-mono font-medium transition-colors"
            >
              ORGANIZATION SIGN IN
            </button>

            <button
              type="button"
              onClick={() => onNavigate('login')}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-md bg-[#FF4400] hover:bg-[#E63D00] text-white text-xs font-mono font-medium tracking-wide transition-colors shadow-sm"
            >
              <span>LAUNCH DASHBOARD</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-16 pb-20 border-b border-[#E5E7EB] dark:border-[#262B35] overflow-hidden">
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage: 'radial-gradient(#111827 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded border border-[#FF4400]/40 bg-[#FFF1EB] dark:bg-[#FF4400]/10 text-xs font-mono font-semibold text-[#FF4400] tracking-wider uppercase mb-6">
              <Flame className="w-3.5 h-3.5 fill-[#FF4400]" />
              <span>ENTERPRISE ORGANIZATION SUPPORT CORE</span>
            </div>

            <h1
              ref={headlineRef}
              className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.08] text-[#111827] dark:text-[#F9FAFB]"
            >
              ENGINEERING-GRADE INCIDENT TRIAGE. <br />
              <span className="text-[#FF4400]">ZERO BACKLOG DRAG.</span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-[#4B5563] dark:text-[#9CA3AF] leading-relaxed max-w-2xl font-normal">
              Built for high-velocity customer support and engineering triage. Featuring instantaneous search-as-you-type, a shared-layout Kanban pipeline, dense ticket tables, and real-time SLA velocity analytics.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onNavigate('login')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-md bg-[#FF4400] hover:bg-[#E63D00] text-white font-mono font-semibold text-xs tracking-wider uppercase transition-colors shadow-sm"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>OPEN LIVE CRM DASHBOARD</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('login')}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-md border border-[#D1D5DB] dark:border-[#374151] bg-white dark:bg-[#15181E] text-[#111827] dark:text-[#F9FAFB] hover:bg-[#F3F4F6] dark:hover:bg-[#1B2028] font-mono font-medium text-xs tracking-wider uppercase transition-colors"
              >
                <Users className="w-4 h-4 text-[#FF4400]" />
                <span>ORGANIZATION SSO PORTAL</span>
              </button>
            </div>

            {/* Micro-telemetry bar */}
            <div className="mt-10 flex flex-wrap items-center gap-6 pt-6 border-t border-[#E5E7EB] dark:border-[#262B35] text-xs font-mono text-[#4B5563] dark:text-[#9CA3AF]">
              <span className="flex items-center gap-1.5 text-[#111827] dark:text-[#F9FAFB] font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#16A34A]"></span>
                {ticketCount} TICKETS PRE-SEEDED
              </span>
              <span>•</span>
              <span>18.4h AVG RESOLUTION</span>
              <span>•</span>
              <span>99.8% SLA ADHERENCE</span>
              <span>•</span>
              <span className="text-[#FF4400] font-semibold">PERSISTENT CRM API</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Architecture Matrix */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <div className="text-xs font-mono uppercase tracking-wider text-[#FF4400] font-semibold">
            ARCHITECTURE & CAPABILITIES
          </div>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#111827] dark:text-[#F9FAFB] mt-1">
            Engineered as a pure client-side seam for instant backend integration.
          </h2>
        </div>

        <div ref={featuresRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-6 rounded-md border border-[#E5E7EB] dark:border-[#262B35] bg-white dark:bg-[#15181E]">
            <div className="w-10 h-10 rounded-md bg-[#FFF1EB] dark:bg-[#FF4400]/10 flex items-center justify-center text-[#FF4400] mb-4">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-lg text-[#111827] dark:text-[#F9FAFB] mb-2">
              Dense Productivity Table
            </h3>
            <p className="text-xs font-sans text-[#4B5563] dark:text-[#9CA3AF] leading-relaxed mb-4">
              Search-as-you-type across customer names, ticket IDs, and technical descriptions. Instant status filtering without layout shift or UI latency.
            </p>
            <div className="text-[11px] font-mono text-[#FF4400]">
              Instant Keyboard Triage →
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-md border border-[#E5E7EB] dark:border-[#262B35] bg-white dark:bg-[#15181E]">
            <div className="w-10 h-10 rounded-md bg-[#EFF6FF] dark:bg-[#2563EB]/10 flex items-center justify-center text-[#2563EB] mb-4">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-lg text-[#111827] dark:text-[#F9FAFB] mb-2">
              Shared-Layout Kanban
            </h3>
            <p className="text-xs font-sans text-[#4B5563] dark:text-[#9CA3AF] leading-relaxed mb-4">
              Powered by Motion layout IDs. Cards visibly glide across status columns rather than teleporting, providing tactile spatial confirmation for agents.
            </p>
            <div className="text-[11px] font-mono text-[#2563EB] dark:text-[#60A5FA]">
              Spring Physics Transitions →
            </div>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-md border border-[#E5E7EB] dark:border-[#262B35] bg-white dark:bg-[#15181E]">
            <div className="w-10 h-10 rounded-md bg-[#F0FDF4] dark:bg-[#16A34A]/10 flex items-center justify-center text-[#16A34A] mb-4">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="font-display font-bold text-lg text-[#111827] dark:text-[#F9FAFB] mb-2">
              Real-Time SLA Analytics
            </h3>
            <p className="text-xs font-sans text-[#4B5563] dark:text-[#9CA3AF] leading-relaxed mb-4">
              Flat, precision charts rendered with Recharts. Tracks created vs. closed volume over 14 days and calculates average resolution hours dynamically.
            </p>
            <div className="text-[11px] font-mono text-[#16A34A] dark:text-[#4ADE80]">
              Zero-Clutter Visualizer →
            </div>
          </div>
        </div>
      </section>



      {/* Footer */}
      <footer className="mt-auto border-t border-[#E5E7EB] dark:border-[#262B35] py-8 bg-[#F8F9FA] dark:bg-[#0D0F12]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#4B5563] dark:text-[#9CA3AF]">
          <div className="flex items-center gap-2">
            <NexusLogo variant="mark" size={16} id="landing-footer-logo" />
            <span className="font-bold text-[#111827] dark:text-[#F9FAFB]">NEXUS.CRM</span>
            <span>// ZERO-DRAG ENTERPRISE SUPPORT CORE</span>
          </div>
          <div className="flex items-center gap-1">
            <span>FOR ISSUES CONTACT</span>
            <a
              href="mailto:krutarth.a@somaiya.edu"
              className="text-[#FF4400] hover:underline transition-colors ml-1"
            >
              krutarth.a@somaiya.edu
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
