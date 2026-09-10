import React from 'react';
import { Ticket, TicketStatus } from '../../types';
import { MessageSquare, ExternalLink, ChevronRight, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface TicketTableProps {
  tickets: Ticket[];
  onSelectTicket: (ticketId: string) => void;
  onUpdateStatus: (ticketId: string, status: TicketStatus) => void;
  onClearFilters?: () => void;
}

export const TicketTable: React.FC<TicketTableProps> = ({
  tickets,
  onSelectTicket,
  onUpdateStatus,
  onClearFilters,
}) => {
  const formatTime = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  const renderStatusBadge = (status: TicketStatus) => {
    switch (status) {
      case 'Open':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono font-semibold uppercase tracking-wider bg-[#FFF1EB] dark:bg-[#FF4400]/15 text-[#FF4400] border border-[#FF4400]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF4400]"></span>
            Open
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono font-semibold uppercase tracking-wider bg-[#EFF6FF] dark:bg-[#1E40AF]/20 text-[#2563EB] dark:text-[#60A5FA] border border-[#BFDBFE] dark:border-[#1E40AF]/40">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] dark:bg-[#60A5FA]"></span>
            In Progress
          </span>
        );
      case 'Closed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono font-semibold uppercase tracking-wider bg-[#F0FDF4] dark:bg-[#166534]/20 text-[#16A34A] dark:text-[#4ADE80] border border-[#BBF7D0] dark:border-[#166534]/40">
            <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] dark:bg-[#4ADE80]"></span>
            Closed
          </span>
        );
    }
  };

  if (tickets.length === 0) {
    return (
      <div className="w-full p-12 text-center rounded-md border border-[#E5E7EB] dark:border-[#262B35] bg-white dark:bg-[#15181E]">
        <div className="w-10 h-10 mx-auto rounded-full bg-[#F3F4F6] dark:bg-[#1B2028] flex items-center justify-center text-[#9CA3AF] mb-3">
          <AlertCircle className="w-5 h-5" />
        </div>
        <h3 className="font-mono font-bold text-sm text-[#111827] dark:text-[#F9FAFB] uppercase">
          NO MATCHING TICKETS LOCATED
        </h3>
        <p className="mt-1 text-xs text-[#4B5563] dark:text-[#9CA3AF] max-w-sm mx-auto">
          No records matched your search query or status criteria.
        </p>
        {onClearFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="mt-4 inline-flex items-center px-3 py-1.5 text-xs font-mono font-medium rounded border border-[#E5E7EB] dark:border-[#262B35] text-[#FF4400] hover:bg-[#FFF1EB] dark:hover:bg-[#FF4400]/10 transition-colors"
          >
            Reset Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="w-full rounded-md border border-[#E5E7EB] dark:border-[#262B35] bg-white dark:bg-[#15181E] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#E5E7EB] dark:border-[#262B35] bg-[#F8F9FA] dark:bg-[#1B2028]/60 text-[11px] font-mono uppercase tracking-wider text-[#4B5563] dark:text-[#9CA3AF]">
              <th className="py-2.5 px-4 font-semibold w-28">ID</th>
              <th className="py-2.5 px-4 font-semibold w-48">Customer</th>
              <th className="py-2.5 px-4 font-semibold">Subject & Preview</th>
              <th className="py-2.5 px-4 font-semibold w-36">Status</th>
              <th className="py-2.5 px-4 font-semibold w-36 text-right">Created</th>
              <th className="py-2.5 px-3 font-semibold w-12 text-center"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5E7EB] dark:divide-[#262B35] text-xs font-mono">
            {tickets.map((ticket) => (
              <tr
                key={ticket.id}
                id={`ticket-row-${ticket.id}`}
                onClick={() => onSelectTicket(ticket.id)}
                className="group hover:bg-[#F9FAFB] dark:hover:bg-[#1B2028] transition-colors duration-75 cursor-pointer"
              >
                {/* ID */}
                <td className="py-3 px-4 whitespace-nowrap">
                  <span className="font-bold text-[#111827] dark:text-[#F9FAFB] group-hover:text-[#FF4400] transition-colors">
                    {ticket.ticketId}
                  </span>
                </td>

                {/* Customer */}
                <td className="py-3 px-4">
                  <div className="font-sans font-semibold text-xs text-[#111827] dark:text-[#F9FAFB] truncate max-w-[180px]">
                    {ticket.customerName}
                  </div>
                  <div className="text-[11px] text-[#4B5563] dark:text-[#9CA3AF] truncate max-w-[180px]">
                    {ticket.customerEmail}
                  </div>
                </td>

                {/* Subject & snippet */}
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <span className="font-sans font-medium text-xs text-[#111827] dark:text-[#F9FAFB] group-hover:text-[#FF4400] transition-colors">
                      {ticket.subject}
                    </span>
                    {ticket.notes.length > 0 && (
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[10px] font-mono text-[#4B5563] dark:text-[#9CA3AF] bg-[#F3F4F6] dark:bg-[#262B35]" title={`${ticket.notes.length} internal notes`}>
                        <MessageSquare className="w-2.5 h-2.5" />
                        {ticket.notes.length}
                      </span>
                    )}
                  </div>
                  <p className="font-sans text-[11px] text-[#4B5563] dark:text-[#9CA3AF] line-clamp-1 mt-0.5">
                    {ticket.description}
                  </p>
                </td>

                {/* Status */}
                <td className="py-3 px-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-2">
                    {renderStatusBadge(ticket.status)}
                    <select
                      aria-label={`Change status for ${ticket.ticketId}`}
                      value={ticket.status}
                      onChange={(e) => onUpdateStatus(ticket.id, e.target.value as TicketStatus)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity bg-transparent text-[11px] text-[#4B5563] dark:text-[#9CA3AF] hover:text-[#111827] dark:hover:text-[#F9FAFB] cursor-pointer border border-[#E5E7EB] dark:border-[#374151] rounded px-1 py-0.5"
                    >
                      <option value="Open" className="dark:bg-[#15181E]">Set Open</option>
                      <option value="In Progress" className="dark:bg-[#15181E]">Set In Progress</option>
                      <option value="Closed" className="dark:bg-[#15181E]">Set Closed</option>
                    </select>
                  </div>
                </td>

                {/* Created Date */}
                <td className="py-3 px-4 whitespace-nowrap text-right text-[11px] text-[#4B5563] dark:text-[#9CA3AF]">
                  {formatTime(ticket.createdAt)}
                </td>

                {/* Arrow indicator */}
                <td className="py-3 px-3 text-center text-[#9CA3AF] group-hover:text-[#FF4400] transition-colors">
                  <ChevronRight className="w-4 h-4 inline-block" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer bar */}
      <div className="px-4 py-2.5 border-t border-[#E5E7EB] dark:border-[#262B35] bg-[#F8F9FA] dark:bg-[#1B2028]/60 flex items-center justify-between text-[11px] font-mono text-[#4B5563] dark:text-[#9CA3AF]">
        <span>DISPLAYING {tickets.length} ACTIVE INCIDENT RECORDS</span>
        <span className="hidden sm:inline">CLICK ANY ROW TO INSPECT DOSSIER</span>
      </div>
    </div>
  );
};
