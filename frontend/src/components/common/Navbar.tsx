import React, { useState } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { NexusLogo } from './NexusLogo';
import { useAuth } from '../../context/AuthContext';
import { useTicketContext } from '../../context/TicketContext';
import { Plus, Building2, LogOut, Home, ChevronDown, Check, RefreshCw, Database } from 'lucide-react';

interface NavbarProps {
  onOpenCreate: () => void;
  onNavigatePage: (page: 'landing' | 'login' | 'dashboard') => void;
  ticketCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenCreate,
  onNavigatePage,
  ticketCount,
}) => {
  const { currentUser, logout, isBackendConnected } = useAuth();
  const { refreshTickets, isLoading: isSyncing } = useTicketContext();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#E5E7EB] dark:border-[#262B35] bg-white/95 dark:bg-[#0D0F12]/95 backdrop-blur-md transition-colors duration-150">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand logo & tagline */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigatePage('dashboard')}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <NexusLogo variant="badge-solid" size={32} className="shrink-0" id="navbar-logo" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-extrabold text-base tracking-tight text-[#111827] dark:text-[#F9FAFB]">
                  NEXUS<span className="text-[#FF4400]">.CRM</span>
                </span>
                <span className="hidden md:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold uppercase tracking-wider bg-[#FFF1EB] dark:bg-[#FF4400]/20 text-[#FF4400] border border-[#FF4400]/30">
                  {currentUser ? currentUser.organization.name : 'Core'}
                </span>
              </div>
              <p className="hidden sm:block text-[11px] font-mono text-[#4B5563] dark:text-[#9CA3AF] tracking-tight">
                High-throughput support triage
              </p>
            </div>
          </button>
        </div>

        {/* Center telemetry indicator */}
        <div className="hidden lg:flex items-center gap-2.5 px-3 py-1 rounded-md border border-[#E5E7EB] dark:border-[#262B35] bg-[#F8F9FA] dark:bg-[#15181E] text-xs font-mono text-[#4B5563] dark:text-[#9CA3AF]">
          <span className="relative flex h-2 w-2">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isBackendConnected ? 'bg-[#16A34A]' : 'bg-[#EAB308]'
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                isBackendConnected ? 'bg-[#16A34A]' : 'bg-[#EAB308]'
              }`}
            />
          </span>
          <span>{ticketCount} TICKETS</span>
          <span className="text-[#D1D5DB] dark:text-[#374151]">|</span>
          <span className="text-[#111827] dark:text-[#F9FAFB] font-semibold flex items-center gap-1.5">
            <Database className="w-3 h-3 text-[#FF4400]" />
            {isBackendConnected ? 'EXPRESS + SQLITE API SYNCED' : 'INTEGRATION SEAM READY'}
          </span>
          <button
            type="button"
            onClick={() => refreshTickets()}
            title="Refresh from backend API"
            className="ml-1 p-1 rounded hover:bg-[#E5E7EB] dark:hover:bg-[#262B35] text-[#6B7280] dark:text-[#9CA3AF] transition-colors"
          >
            <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin text-[#FF4400]' : ''}`} />
          </button>
        </div>

        {/* Right controls: Theme Toggle, Profile Menu & Create Ticket */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />

          {/* Organization Profile Indicator / Dropdown */}
          {currentUser && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-md border border-[#E5E7EB] dark:border-[#262B35] bg-white dark:bg-[#15181E] hover:bg-[#F3F4F6] dark:hover:bg-[#1B2028] text-xs font-mono transition-colors"
                aria-expanded={isProfileOpen}
              >
                <span className="w-5 h-5 rounded-full bg-[#FF4400] text-white flex items-center justify-center font-bold text-[10px]">
                  {currentUser.avatarText}
                </span>
                <span className="hidden sm:inline font-semibold text-[#111827] dark:text-[#F9FAFB] max-w-[110px] truncate">
                  {currentUser.name}
                </span>
                <ChevronDown className="w-3 h-3 text-[#9CA3AF]" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-md border border-[#E5E7EB] dark:border-[#262B35] bg-white dark:bg-[#15181E] shadow-xl p-3 z-50 text-xs font-mono">
                  <div className="pb-2 mb-2 border-b border-[#E5E7EB] dark:border-[#262B35]">
                    <div className="font-semibold text-sm text-[#111827] dark:text-[#F9FAFB] font-sans">
                      {currentUser.name}
                    </div>
                    <div className="text-[11px] text-[#4B5563] dark:text-[#9CA3AF]">
                      {currentUser.email}
                    </div>
                    <div className="mt-1 text-[10px] text-[#FF4400] font-bold uppercase">
                      {currentUser.role}
                    </div>
                  </div>

                  <div className="space-y-1 pb-2 mb-2 border-b border-[#E5E7EB] dark:border-[#262B35] text-[11px] text-[#4B5563] dark:text-[#9CA3AF]">
                    <div className="flex justify-between">
                      <span>Org:</span>
                      <span className="font-semibold text-[#111827] dark:text-[#F9FAFB]">{currentUser.organization.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tenant ID:</span>
                      <span className="text-[#111827] dark:text-[#F9FAFB]">{currentUser.organization.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tier:</span>
                      <span className="text-[#16A34A]">{currentUser.organization.tier}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileOpen(false);
                        onNavigatePage('landing');
                      }}
                      className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-[#F3F4F6] dark:hover:bg-[#1B2028] text-[#111827] dark:text-[#F9FAFB] text-left"
                    >
                      <Home className="w-3.5 h-3.5" />
                      <span>View Landing Page</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileOpen(false);
                        logout();
                        onNavigatePage('login');
                      }}
                      className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-[#FFF1EB] dark:hover:bg-[#FF4400]/10 text-[#FF4400] text-left"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Switch Organization / Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          <button
            type="button"
            id="new-ticket-btn"
            onClick={onOpenCreate}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-[#FF4400] hover:bg-[#E63D00] active:bg-[#CC3600] text-white font-mono font-medium text-xs tracking-wide transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FF4400] focus:ring-offset-2 dark:focus:ring-offset-[#0D0F12]"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>NEW TICKET</span>
          </button>
        </div>
      </div>
    </header>
  );
};
