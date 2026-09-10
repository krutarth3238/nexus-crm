import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Ticket, TicketStatus } from '../../types';
import { useTicket, useUpdateTicketStatus, useAddNote } from '../../hooks/useTickets';
import { X, Clock, User, Mail, Calendar, Send, MessageSquare, Check, ArrowLeft, ShieldCheck, Flame } from 'lucide-react';

interface TicketDetailModalProps {
  ticketId: string | null;
  onClose: () => void;
}

export const TicketDetailModal: React.FC<TicketDetailModalProps> = ({
  ticketId,
  onClose,
}) => {
  const { ticket, notFound } = useTicket(ticketId);
  const { updateStatus, isUpdating } = useUpdateTicketStatus();
  const { addNote, isAdding } = useAddNote();

  const [noteInput, setNoteInput] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const notesEndRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!ticketId) return null;

  const handleStatusChange = async (newStatus: TicketStatus) => {
    if (!ticket || ticket.status === newStatus) return;
    await updateStatus(ticket.id, newStatus);
    setStatusMessage(`Status updated to ${newStatus}`);
    setTimeout(() => setStatusMessage(null), 2500);
  };

  const handleAddNoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticket || !noteInput.trim() || isAdding) return;

    await addNote(ticket.id, noteInput);
    setNoteInput('');
    setTimeout(() => {
      notesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const formatFullDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-lg border border-[#E5E7EB] dark:border-[#262B35] bg-white dark:bg-[#15181E] shadow-2xl overflow-hidden z-10 my-auto"
        >
          {notFound || !ticket ? (
            <div className="p-12 text-center">
              <p className="font-mono text-sm text-[#FF4400]">Ticket record not found.</p>
              <button
                type="button"
                onClick={onClose}
                className="mt-4 px-4 py-2 bg-[#111827] text-white text-xs font-mono rounded"
              >
                Close Inspector
              </button>
            </div>
          ) : (
            <>
              {/* Header Bar */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB] dark:border-[#262B35] bg-[#F8F9FA] dark:bg-[#15181E]">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-[#111827] text-white dark:bg-[#F9FAFB] dark:text-[#111827]">
                    {ticket.ticketId}
                  </span>
                  <div className="h-4 w-[1px] bg-[#D1D5DB] dark:bg-[#374151]" />
                  <span className="font-mono text-xs text-[#4B5563] dark:text-[#9CA3AF]">
                    CREATED {formatFullDate(ticket.createdAt)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="p-1.5 rounded text-[#4B5563] dark:text-[#9CA3AF] hover:text-[#111827] dark:hover:text-[#F9FAFB] hover:bg-[#E5E7EB] dark:hover:bg-[#262B35] transition-colors"
                    aria-label="Close modal"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Status Update Strip */}
              <div className="px-6 py-3 border-b border-[#E5E7EB] dark:border-[#262B35] bg-white dark:bg-[#11141A] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-[#4B5563] dark:text-[#9CA3AF] font-semibold uppercase">
                    CURRENT STATUS:
                  </span>
                  {statusMessage && (
                    <span className="text-[#16A34A] dark:text-[#4ADE80] font-mono font-bold flex items-center gap-1 animate-pulse">
                      <Check className="w-3 h-3" />
                      {statusMessage}
                    </span>
                  )}
                </div>

                {/* Status selector buttons */}
                <div className="inline-flex rounded-md p-1 border border-[#E5E7EB] dark:border-[#262B35] bg-[#F8F9FA] dark:bg-[#15181E] gap-1">
                  {(['Open', 'In Progress', 'Closed'] as TicketStatus[]).map((statusVal) => {
                    const isActive = ticket.status === statusVal;
                    return (
                      <button
                        key={statusVal}
                        type="button"
                        id={`status-btn-${statusVal.toLowerCase().replace(' ', '-')}`}
                        onClick={() => handleStatusChange(statusVal)}
                        disabled={isUpdating}
                        className={`px-3 py-1 text-xs font-mono font-medium rounded transition-all ${
                          isActive
                            ? statusVal === 'Open'
                              ? 'bg-[#FF4400] text-white'
                              : statusVal === 'In Progress'
                              ? 'bg-[#2563EB] text-white'
                              : 'bg-[#16A34A] text-white'
                            : 'text-[#4B5563] dark:text-[#9CA3AF] hover:text-[#111827] dark:hover:text-[#F9FAFB]'
                        }`}
                      >
                        {statusVal}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Scrollable Content Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Subject & Description */}
                <div>
                  <h2 className="font-display font-bold text-xl sm:text-2xl text-[#111827] dark:text-[#F9FAFB] leading-snug">
                    {ticket.subject}
                  </h2>

                  <div className="mt-4 p-4 rounded-md border border-[#E5E7EB] dark:border-[#262B35] bg-[#F8F9FA] dark:bg-[#181C24]">
                    <div className="text-[11px] font-mono uppercase tracking-wider text-[#4B5563] dark:text-[#9CA3AF] mb-1.5">
                      INITIAL INQUIRY PAYLOAD
                    </div>
                    <p className="font-sans text-sm text-[#111827] dark:text-[#E5E7EB] leading-relaxed whitespace-pre-wrap">
                      {ticket.description}
                    </p>
                  </div>
                </div>

                {/* Customer Dossier Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-md border border-[#E5E7EB] dark:border-[#262B35] bg-white dark:bg-[#15181E] flex items-center gap-3">
                    <div className="w-9 h-9 rounded bg-[#FFF1EB] dark:bg-[#FF4400]/10 flex items-center justify-center text-[#FF4400]">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[10px] font-mono uppercase text-[#4B5563] dark:text-[#9CA3AF]">
                        CUSTOMER NAME
                      </div>
                      <div className="text-xs font-semibold text-[#111827] dark:text-[#F9FAFB]">
                        {ticket.customerName}
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-md border border-[#E5E7EB] dark:border-[#262B35] bg-white dark:bg-[#15181E] flex items-center gap-3">
                    <div className="w-9 h-9 rounded bg-[#EFF6FF] dark:bg-[#2563EB]/10 flex items-center justify-center text-[#2563EB]">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[10px] font-mono uppercase text-[#4B5563] dark:text-[#9CA3AF]">
                        AUTHENTICATED EMAIL
                      </div>
                      <div className="text-xs font-semibold font-mono text-[#111827] dark:text-[#F9FAFB] truncate">
                        {ticket.customerEmail}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes & Comments Thread */}
                <div className="pt-4 border-t border-[#E5E7EB] dark:border-[#262B35]">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-[#FF4400]" />
                      <h3 className="font-mono font-bold text-xs uppercase tracking-wider text-[#111827] dark:text-[#F9FAFB]">
                        ENGINEERING & SUPPORT NOTES THREAD ({ticket.notes.length})
                      </h3>
                    </div>
                    <span className="text-[11px] font-mono text-[#4B5563] dark:text-[#9CA3AF]">
                      AUDIT LOG
                    </span>
                  </div>

                  {/* Notes stream */}
                  <div className="space-y-3 mb-6">
                    {ticket.notes.length === 0 ? (
                      <div className="p-6 text-center rounded border border-dashed border-[#D1D5DB] dark:border-[#374151] text-xs font-mono text-[#9CA3AF]">
                        No internal notes recorded on this ticket yet. Add the first update below.
                      </div>
                    ) : (
                      ticket.notes.map((note, idx) => (
                        <div
                          key={note.id || idx}
                          className="p-3.5 rounded-md border border-[#E5E7EB] dark:border-[#262B35] bg-white dark:bg-[#181C24]"
                        >
                          <div className="flex items-center justify-between text-[11px] font-mono text-[#4B5563] dark:text-[#9CA3AF] mb-1.5 pb-1 border-b border-[#E5E7EB] dark:border-[#262B35]">
                            <span className="font-semibold text-[#111827] dark:text-[#F9FAFB]">
                              SUPPORT AGENT NOTE
                            </span>
                            <span>{formatFullDate(note.createdAt)}</span>
                          </div>
                          <p className="font-sans text-xs text-[#111827] dark:text-[#E5E7EB] leading-relaxed whitespace-pre-wrap">
                            {note.noteText}
                          </p>
                        </div>
                      ))
                    )}
                    <div ref={notesEndRef} />
                  </div>

                  {/* Add Note Form */}
                  <form onSubmit={handleAddNoteSubmit} className="space-y-2">
                    <label
                      htmlFor="new-note-text"
                      className="block text-xs font-mono uppercase text-[#4B5563] dark:text-[#9CA3AF]"
                    >
                      APPEND INTERNAL NOTE / WORKAROUND
                    </label>
                    <div className="relative">
                      <textarea
                        id="new-note-text"
                        rows={3}
                        value={noteInput}
                        onChange={(e) => setNoteInput(e.target.value)}
                        placeholder="Document investigation steps, reproduction details, or customer resolution..."
                        className="w-full p-3 text-xs font-sans rounded-md border border-[#E5E7EB] dark:border-[#262B35] bg-[#F8F9FA] dark:bg-[#181C24] text-[#111827] dark:text-[#F9FAFB] placeholder-[#9CA3AF] focus:outline-none focus:ring-1 focus:ring-[#FF4400] focus:border-[#FF4400] transition-colors"
                        onKeyDown={(e) => {
                          if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                            handleAddNoteSubmit(e);
                          }
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] font-mono text-[#9CA3AF]">
                        Press <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-[10px]">Ctrl</kbd> + <kbd className="px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-[10px]">Enter</kbd> to submit
                      </span>

                      <button
                        type="submit"
                        disabled={!noteInput.trim() || isAdding}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-md bg-[#111827] hover:bg-black dark:bg-[#F9FAFB] dark:hover:bg-white dark:text-[#111827] text-white font-mono font-medium text-xs transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{isAdding ? 'ADDING...' : 'APPEND NOTE'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
