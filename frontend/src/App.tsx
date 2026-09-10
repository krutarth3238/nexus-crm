import React, { useState, useEffect, useRef } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { TicketProvider } from './context/TicketContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useTickets, useUpdateTicketStatus } from './hooks/useTickets';
import { useSmoothScroll } from './hooks/useSmoothScroll';
import { Navbar } from './components/common/Navbar';
import { HeroSection } from './components/hero/HeroSection';
import { AnalyticsStrip } from './components/analytics/AnalyticsStrip';
import { TicketFiltersBar } from './components/tickets/TicketFiltersBar';
import { TicketTable } from './components/tickets/TicketTable';
import { TicketKanban } from './components/tickets/TicketKanban';
import { TicketDetailModal } from './components/tickets/TicketDetailModal';
import { CreateTicketModal } from './components/tickets/CreateTicketModal';
import { NexusLogo } from './components/common/NexusLogo';
import { LandingPage } from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import { TicketFilters, Ticket } from './types';


export type PageRoute = 'landing' | 'login' | 'dashboard';

function DashboardView({
  onNavigatePage,
}: {
  onNavigatePage: (page: PageRoute) => void;
}) {
  // Initialize Lenis + GSAP ScrollTrigger ticker sync for smooth scroll
  useSmoothScroll();

  const [filters, setFilters] = useState<TicketFilters>({
    search: '',
    status: 'All',
    sortBy: 'newest',
  });

  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const workspaceRef = useRef<HTMLDivElement>(null);

  const { tickets, rawTickets, stats } = useTickets(filters);
  const { updateStatus } = useUpdateTicketStatus();

  const counts = {
    all: rawTickets.length,
    open: stats.openCount,
    inProgress: stats.inProgressCount,
    closed: stats.closedCount,
  };

  const handleScrollToWorkspace = () => {
    workspaceRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSwitchToKanban = () => {
    setViewMode('kanban');
    workspaceRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleUpdateFilters = (newFilters: Partial<TicketFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#0D0F12] text-[#111827] dark:text-[#F9FAFB] transition-colors duration-150 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        onOpenCreate={() => setIsCreateModalOpen(true)}
        onNavigatePage={onNavigatePage}
        ticketCount={rawTickets.length}
      />

      {/* Kinetic Hero Section (GSAP + ScrollTrigger + Lenis) */}
      <HeroSection
        stats={stats}
        onOpenCreate={() => setIsCreateModalOpen(true)}
        onScrollToWorkspace={handleScrollToWorkspace}
        onSwitchToKanban={handleSwitchToKanban}
      />

      {/* Main Productivity Cockpit */}
      <main ref={workspaceRef} className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Slim Flat Analytics Strip */}
        <AnalyticsStrip stats={stats} />

        {/* Filters, Search & View Switcher Bar */}
        <div className="pt-2">
          <TicketFiltersBar
            filters={filters}
            onChangeFilters={handleUpdateFilters}
            viewMode={viewMode}
            onChangeViewMode={setViewMode}
            counts={counts}
          />

          {/* Productivity Workspace: Dense Table or Shared Layout Kanban */}
          {viewMode === 'list' ? (
            <TicketTable
              tickets={tickets}
              onSelectTicket={(id) => setSelectedTicketId(id)}
              onUpdateStatus={(id, status) => updateStatus(id, status)}
              onClearFilters={() => setFilters({ search: '', status: 'All', sortBy: 'newest' })}
            />
          ) : (
            <TicketKanban
              tickets={tickets}
              onSelectTicket={(id) => setSelectedTicketId(id)}
              onUpdateStatus={(id, status) => updateStatus(id, status)}
              onOpenCreate={() => setIsCreateModalOpen(true)}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-[#E5E7EB] dark:border-[#262B35] bg-white dark:bg-[#0D0F12] py-6 transition-colors duration-150 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#4B5563] dark:text-[#9CA3AF]">
          <div className="flex items-center gap-2">
            <NexusLogo variant="mark" size={16} id="dashboard-footer-logo" />
            <span className="font-bold text-[#111827] dark:text-[#F9FAFB]">NEXUS CRM</span>
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

      {/* Ticket Detail Inspector Drawer / Modal */}
      <TicketDetailModal
        ticketId={selectedTicketId}
        onClose={() => setSelectedTicketId(null)}
      />

      {/* Create Ticket Modal */}
      <CreateTicketModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onTicketCreated={(newTicket: Ticket) => {
          setSelectedTicketId(newTicket.id);
        }}
      />
    </div>
  );
}

function MainRouter() {
  const { tickets } = useTickets();
  const [currentPage, setCurrentPage] = useState<PageRoute>(() => {
    // Check URL hash first (e.g. #/login, #/landing, #/dashboard)
    const hash = window.location.hash.replace('#/', '').replace('#', '');
    if (hash === 'landing' || hash === 'login' || hash === 'dashboard') {
      return hash as PageRoute;
    }
    return 'landing'; // Default to landing page
  });

  // Sync hash with browser history
  useEffect(() => {
    window.location.hash = `#/${currentPage}`;
    window.scrollTo(0, 0);
  }, [currentPage]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '');
      if (hash === 'landing' || hash === 'login' || hash === 'dashboard') {
        setCurrentPage(hash as PageRoute);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <div className="relative min-h-screen">
      {/* Render Page */}
      {currentPage === 'landing' && (
        <LandingPage onNavigate={setCurrentPage} ticketCount={tickets.length} />
      )}
      {currentPage === 'login' && <LoginPage onNavigate={setCurrentPage} />}
      {currentPage === 'dashboard' && <DashboardView onNavigatePage={setCurrentPage} />}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <TicketProvider>
          <MainRouter />
        </TicketProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
