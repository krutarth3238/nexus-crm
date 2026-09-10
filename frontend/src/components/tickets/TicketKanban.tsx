import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Ticket, TicketStatus } from '../../types';
import { MessageSquare, ArrowRight, ArrowLeft, Check, Clock, AlertCircle } from 'lucide-react';

interface TicketKanbanProps {
  tickets: Ticket[];
  onSelectTicket: (ticketId: string) => void;
  onUpdateStatus: (ticketId: string, status: TicketStatus) => void;
  onOpenCreate: () => void;
}

const COLUMNS: Array<{ status: TicketStatus; label: string; color: string; bgBadge: string; textBadge: string; borderBadge: string }> = [
  {
    status: 'Open',
    label: 'OPEN QUEUE',
    color: '#FF4400',
    bgBadge: 'bg-[#FFF1EB] dark:bg-[#FF4400]/15',
    textBadge: 'text-[#FF4400]',
    borderBadge: 'border-[#FF4400]/30',
  },
  {
    status: 'In Progress',
    label: 'IN PROGRESS',
    color: '#2563EB',
    bgBadge: 'bg-[#EFF6FF] dark:bg-[#1E40AF]/20',
    textBadge: 'text-[#2563EB] dark:text-[#60A5FA]',
    borderBadge: 'border-[#BFDBFE] dark:border-[#1E40AF]/40',
  },
  {
    status: 'Closed',
    label: 'RESOLVED / CLOSED',
    color: '#16A34A',
    bgBadge: 'bg-[#F0FDF4] dark:bg-[#166534]/20',
    textBadge: 'text-[#16A34A] dark:text-[#4ADE80]',
    borderBadge: 'border-[#BBF7D0] dark:border-[#166534]/40',
  },
];

export const TicketKanban: React.FC<TicketKanbanProps> = ({
  tickets,
  onSelectTicket,
  onUpdateStatus,
  onOpenCreate,
}) => {
  const getTicketsForColumn = (status: TicketStatus) => {
    return tickets.filter((t) => t.status === status);
  };

  const formatRelativeTime = (isoString: string) => {
    try {
      const diffMs = Date.now() - new Date(isoString).getTime();
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      if (diffHours < 1) return 'Just now';
      if (diffHours < 24) return `${diffHours}h ago`;
      return `${diffDays}d ago`;
    } catch {
      return '';
    }
  };

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
        {COLUMNS.map((col) => {
          const colTickets = getTicketsForColumn(col.status);

          return (
            <div
              key={col.status}
              className="flex flex-col rounded-md border border-[#E5E7EB] dark:border-[#262B35] bg-[#F8F9FA] dark:bg-[#15181E] p-3 min-h-[500px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E5E7EB] dark:border-[#262B35]">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-sm"
                    style={{ backgroundColor: col.color }}
                  ></span>
                  <h3 className="font-mono font-bold text-xs uppercase tracking-wider text-[#111827] dark:text-[#F9FAFB]">
                    {col.label}
                  </h3>
                </div>

                <span
                  className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold border ${col.bgBadge} ${col.textBadge} ${col.borderBadge}`}
                >
                  {colTickets.length}
                </span>
              </div>

              {/* Cards Container with Motion shared layout animation */}
              <div className="space-y-3 flex-1">
                <AnimatePresence mode="popLayout" initial={false}>
                  {colTickets.map((ticket) => (
                    <motion.div
                      key={ticket.id}
                      layoutId={ticket.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 32,
                        mass: 0.8,
                      }}
                      id={`kanban-card-${ticket.id}`}
                      className="p-3.5 rounded-md border border-[#E5E7EB] dark:border-[#262B35] bg-white dark:bg-[#1B2028] hover:border-[#D1D5DB] dark:hover:border-[#374151] transition-colors cursor-pointer group"
                      onClick={() => onSelectTicket(ticket.id)}
                    >
                      {/* Top row: Ticket ID & Time */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="font-mono font-bold text-xs text-[#111827] dark:text-[#F9FAFB] group-hover:text-[#FF4400] transition-colors">
                          {ticket.ticketId}
                        </span>
                        <span className="font-mono text-[10px] text-[#4B5563] dark:text-[#9CA3AF]">
                          {formatRelativeTime(ticket.createdAt)}
                        </span>
                      </div>

                      {/* Subject */}
                      <h4 className="font-sans font-semibold text-xs text-[#111827] dark:text-[#F9FAFB] leading-snug line-clamp-2 mb-1.5">
                        {ticket.subject}
                      </h4>

                      {/* Customer info */}
                      <div className="text-[11px] font-sans text-[#4B5563] dark:text-[#9CA3AF] truncate mb-3">
                        {ticket.customerName}
                      </div>

                      {/* Footer info: notes count and fast column navigation */}
                      <div className="flex items-center justify-between pt-2 border-t border-[#E5E7EB] dark:border-[#262B35] text-[11px] font-mono">
                        <div className="flex items-center gap-1 text-[#4B5563] dark:text-[#9CA3AF]">
                          <MessageSquare className="w-3 h-3" />
                          <span>{ticket.notes.length}</span>
                        </div>

                        {/* Fast stage transitions to showcase shared layout gliding */}
                        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                          {ticket.status === 'Open' && (
                            <button
                              type="button"
                              onClick={() => onUpdateStatus(ticket.id, 'In Progress')}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium border border-[#BFDBFE] dark:border-[#1E40AF]/40 bg-[#EFF6FF] dark:bg-[#1E40AF]/20 text-[#2563EB] dark:text-[#60A5FA] hover:bg-[#DBEAFE] transition-colors"
                              title="Advance to In Progress"
                            >
                              <span>START</span>
                              <ArrowRight className="w-2.5 h-2.5" />
                            </button>
                          )}

                          {ticket.status === 'In Progress' && (
                            <>
                              <button
                                type="button"
                                onClick={() => onUpdateStatus(ticket.id, 'Open')}
                                className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono border border-[#E5E7EB] dark:border-[#374151] text-[#4B5563] dark:text-[#9CA3AF] hover:text-[#111827] transition-colors"
                                title="Return to Open"
                              >
                                <ArrowLeft className="w-2.5 h-2.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => onUpdateStatus(ticket.id, 'Closed')}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium border border-[#BBF7D0] dark:border-[#166534]/40 bg-[#F0FDF4] dark:bg-[#166534]/20 text-[#16A34A] dark:text-[#4ADE80] hover:bg-[#DCFCE7] transition-colors"
                                title="Resolve and close"
                              >
                                <span>RESOLVE</span>
                                <Check className="w-2.5 h-2.5 stroke-[3]" />
                              </button>
                            </>
                          )}

                          {ticket.status === 'Closed' && (
                            <button
                              type="button"
                              onClick={() => onUpdateStatus(ticket.id, 'In Progress')}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono border border-[#E5E7EB] dark:border-[#374151] text-[#4B5563] dark:text-[#9CA3AF] hover:text-[#FF4400] transition-colors"
                              title="Reopen ticket"
                            >
                              <ArrowLeft className="w-2.5 h-2.5" />
                              <span>REOPEN</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {colTickets.length === 0 && (
                  <div className="py-12 text-center rounded border border-dashed border-[#D1D5DB] dark:border-[#374151] p-4 text-xs font-mono text-[#9CA3AF]">
                    NO TICKETS IN THIS STAGE
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
