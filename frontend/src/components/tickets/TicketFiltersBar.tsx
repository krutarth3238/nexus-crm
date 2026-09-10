import React from 'react';
import { Search, X, Table, Kanban, ArrowUpDown, Filter } from 'lucide-react';
import { TicketStatus, TicketFilters } from '../../types';

interface TicketFiltersBarProps {
  filters: TicketFilters;
  onChangeFilters: (filters: Partial<TicketFilters>) => void;
  viewMode: 'list' | 'kanban';
  onChangeViewMode: (mode: 'list' | 'kanban') => void;
  counts: {
    all: number;
    open: number;
    inProgress: number;
    closed: number;
  };
}

export const TicketFiltersBar: React.FC<TicketFiltersBarProps> = ({
  filters,
  onChangeFilters,
  viewMode,
  onChangeViewMode,
  counts,
}) => {
  const statusOptions: Array<{ label: string; value: TicketStatus | 'All'; count: number }> = [
    { label: 'ALL TICKETS', value: 'All', count: counts.all },
    { label: 'OPEN', value: 'Open', count: counts.open },
    { label: 'IN PROGRESS', value: 'In Progress', count: counts.inProgress },
    { label: 'CLOSED', value: 'Closed', count: counts.closed },
  ];

  return (
    <div className="w-full space-y-3 mb-4">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search as you type */}
        <div className="relative flex-1 max-w-lg">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#9CA3AF]">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            id="ticket-search-input"
            value={filters.search}
            onChange={(e) => onChangeFilters({ search: e.target.value })}
            placeholder="Search by ID, customer name, email, or keywords..."
            className="w-full pl-9 pr-8 py-2 text-xs font-mono rounded-md border border-[#E5E7EB] dark:border-[#262B35] bg-white dark:bg-[#15181E] text-[#111827] dark:text-[#F9FAFB] placeholder-[#9CA3AF] focus:outline-none focus:ring-1 focus:ring-[#FF4400] focus:border-[#FF4400] transition-colors"
          />
          {filters.search && (
            <button
              type="button"
              onClick={() => onChangeFilters({ search: '' })}
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-[#9CA3AF] hover:text-[#111827] dark:hover:text-[#F9FAFB]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Right side: Sort and View Toggle */}
        <div className="flex items-center gap-2 justify-between md:justify-end">
          {/* Sort selector */}
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-[#E5E7EB] dark:border-[#262B35] bg-white dark:bg-[#15181E] text-xs font-mono text-[#4B5563] dark:text-[#9CA3AF]">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <select
              id="ticket-sort-select"
              value={filters.sortBy}
              onChange={(e) => onChangeFilters({ sortBy: e.target.value as TicketFilters['sortBy'] })}
              className="bg-transparent text-[#111827] dark:text-[#F9FAFB] focus:outline-none cursor-pointer font-mono text-xs"
            >
              <option value="newest" className="dark:bg-[#15181E]">Newest First</option>
              <option value="oldest" className="dark:bg-[#15181E]">Oldest First</option>
              <option value="status" className="dark:bg-[#15181E]">By Status</option>
            </select>
          </div>

          {/* View mode toggle: List vs Kanban */}
          <div className="inline-flex rounded-md p-0.5 border border-[#E5E7EB] dark:border-[#262B35] bg-white dark:bg-[#15181E]">
            <button
              type="button"
              id="view-mode-list-btn"
              onClick={() => onChangeViewMode('list')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium rounded transition-colors ${
                viewMode === 'list'
                  ? 'bg-[#111827] text-white dark:bg-[#F9FAFB] dark:text-[#111827]'
                  : 'text-[#4B5563] dark:text-[#9CA3AF] hover:text-[#111827] dark:hover:text-[#F9FAFB]'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>TABLE</span>
            </button>

            <button
              type="button"
              id="view-mode-kanban-btn"
              onClick={() => onChangeViewMode('kanban')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium rounded transition-colors ${
                viewMode === 'kanban'
                  ? 'bg-[#111827] text-white dark:bg-[#F9FAFB] dark:text-[#111827]'
                  : 'text-[#4B5563] dark:text-[#9CA3AF] hover:text-[#111827] dark:hover:text-[#F9FAFB]'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>KANBAN</span>
            </button>
          </div>
        </div>
      </div>

      {/* Status filter tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {statusOptions.map((opt) => {
          const isActive = filters.status === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              id={`filter-status-${opt.value.toLowerCase().replace(' ', '-')}`}
              onClick={() => onChangeFilters({ status: opt.value })}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-mono font-medium whitespace-nowrap transition-colors border ${
                isActive
                  ? 'border-[#FF4400] bg-[#FFF1EB] dark:bg-[#FF4400]/15 text-[#FF4400]'
                  : 'border-[#E5E7EB] dark:border-[#262B35] bg-white dark:bg-[#15181E] text-[#4B5563] dark:text-[#9CA3AF] hover:text-[#111827] dark:hover:text-[#F9FAFB]'
              }`}
            >
              <span>{opt.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                  isActive
                    ? 'bg-[#FF4400] text-white'
                    : 'bg-[#F3F4F6] dark:bg-[#262B35] text-[#6B7280] dark:text-[#9CA3AF]'
                }`}
              >
                {opt.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
