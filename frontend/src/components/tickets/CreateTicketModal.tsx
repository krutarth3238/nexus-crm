import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCreateTicket } from '../../hooks/useTickets';
import { Ticket } from '../../types';
import { X, Check, AlertCircle, ArrowRight, PlusCircle, Sparkles, Send } from 'lucide-react';

interface CreateTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTicketCreated?: (ticket: Ticket) => void;
}

interface FormState {
  customerName: string;
  customerEmail: string;
  subject: string;
  description: string;
}

interface FormErrors {
  customerName?: string;
  customerEmail?: string;
  subject?: string;
  description?: string;
}

export const CreateTicketModal: React.FC<CreateTicketModalProps> = ({
  isOpen,
  onClose,
  onTicketCreated,
}) => {
  const { createTicket, isSubmitting } = useCreateTicket();

  const [formData, setFormData] = useState<FormState>({
    customerName: '',
    customerEmail: '',
    subject: '',
    description: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [createdTicket, setCreatedTicket] = useState<Ticket | null>(null);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const errs: FormErrors = {};

    if (!formData.customerName.trim()) {
      errs.customerName = 'Customer name is required';
    } else if (formData.customerName.trim().length < 2) {
      errs.customerName = 'Must be at least 2 characters';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.customerEmail.trim()) {
      errs.customerEmail = 'Customer email is required';
    } else if (!emailRegex.test(formData.customerEmail.trim())) {
      errs.customerEmail = 'Please provide a valid email address';
    }

    if (!formData.subject.trim()) {
      errs.subject = 'Subject line is required';
    } else if (formData.subject.trim().length < 4) {
      errs.subject = 'Subject should be at least 4 characters';
    }

    if (!formData.description.trim()) {
      errs.description = 'Incident description is required';
    } else if (formData.description.trim().length < 10) {
      errs.description = 'Please detail the inquiry (at least 10 characters)';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || isSubmitting) return;

    try {
      const newTicket = await createTicket(formData);
      setCreatedTicket(newTicket);
    } catch (err) {
      console.error('Failed to create ticket:', err);
    }
  };

  const handleResetForAnother = () => {
    setFormData({
      customerName: '',
      customerEmail: '',
      subject: '',
      description: '',
    });
    setErrors({});
    setCreatedTicket(null);
  };

  const handleInspectCreated = () => {
    if (createdTicket && onTicketCreated) {
      onTicketCreated(createdTicket);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Modal Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-xl rounded-lg border border-[#E5E7EB] dark:border-[#262B35] bg-white dark:bg-[#15181E] shadow-2xl overflow-hidden z-10 my-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB] dark:border-[#262B35] bg-[#F8F9FA] dark:bg-[#181C24]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF4400]"></span>
            <h2 className="font-mono font-bold text-xs uppercase tracking-wider text-[#111827] dark:text-[#F9FAFB]">
              CREATE NEW SUPPORT TICKET
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded text-[#4B5563] dark:text-[#9CA3AF] hover:text-[#111827] dark:hover:text-[#F9FAFB] hover:bg-[#E5E7EB] dark:hover:bg-[#262B35] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {createdTicket ? (
              /* Satisfying Success State */
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.92, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                className="py-8 text-center"
              >
                <div className="w-16 h-16 mx-auto rounded-full bg-[#FFF1EB] dark:bg-[#FF4400]/15 border border-[#FF4400]/30 flex items-center justify-center text-[#FF4400] mb-4">
                  <motion.div
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.1, type: 'spring', stiffness: 400 }}
                  >
                    <Check className="w-8 h-8 stroke-[3]" />
                  </motion.div>
                </div>

                <div className="inline-block px-3 py-1 rounded bg-[#111827] dark:bg-[#F9FAFB] text-white dark:text-[#111827] font-mono font-bold text-sm mb-2">
                  {createdTicket.ticketId}
                </div>

                <h3 className="font-display font-bold text-xl text-[#111827] dark:text-[#F9FAFB]">
                  Ticket Dispatched Successfully
                </h3>

                <p className="mt-2 text-xs text-[#4B5563] dark:text-[#9CA3AF] max-w-md mx-auto leading-relaxed">
                  Ticket saved to the CRM database and available across the Table, Kanban pipeline, and analytics.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleInspectCreated}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-md bg-[#FF4400] hover:bg-[#E63D00] text-white font-mono font-medium text-xs tracking-wider uppercase transition-colors"
                  >
                    <span>INSPECT TICKET</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={handleResetForAnother}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-md border border-[#D1D5DB] dark:border-[#374151] bg-white dark:bg-[#181C24] text-[#111827] dark:text-[#F9FAFB] hover:bg-[#F3F4F6] dark:hover:bg-[#262B35] font-mono font-medium text-xs tracking-wider uppercase transition-colors"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>CREATE ANOTHER</span>
                  </button>
                </div>
              </motion.div>
            ) : (
              /* Input Form */
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Customer Name */}
                  <div>
                    <label
                      htmlFor="input-customer-name"
                      className="block text-xs font-mono uppercase text-[#4B5563] dark:text-[#9CA3AF] mb-1"
                    >
                      CUSTOMER NAME *
                    </label>
                    <input
                      type="text"
                      id="input-customer-name"
                      value={formData.customerName}
                      onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                      placeholder="e.g. Alex Morgan"
                      className={`w-full px-3 py-2 text-xs font-sans rounded-md border ${
                        errors.customerName
                          ? 'border-red-500 bg-red-50/20'
                          : 'border-[#E5E7EB] dark:border-[#262B35] bg-[#F8F9FA] dark:bg-[#181C24]'
                      } text-[#111827] dark:text-[#F9FAFB] focus:outline-none focus:ring-1 focus:ring-[#FF4400] transition-colors`}
                    />
                    {errors.customerName && (
                      <p className="mt-1 text-[11px] font-mono text-red-500">{errors.customerName}</p>
                    )}
                  </div>

                  {/* Customer Email */}
                  <div>
                    <label
                      htmlFor="input-customer-email"
                      className="block text-xs font-mono uppercase text-[#4B5563] dark:text-[#9CA3AF] mb-1"
                    >
                      CUSTOMER EMAIL *
                    </label>
                    <input
                      type="email"
                      id="input-customer-email"
                      value={formData.customerEmail}
                      onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                      placeholder="e.g. alex@enterprise.com"
                      className={`w-full px-3 py-2 text-xs font-sans rounded-md border ${
                        errors.customerEmail
                          ? 'border-red-500 bg-red-50/20'
                          : 'border-[#E5E7EB] dark:border-[#262B35] bg-[#F8F9FA] dark:bg-[#181C24]'
                      } text-[#111827] dark:text-[#F9FAFB] focus:outline-none focus:ring-1 focus:ring-[#FF4400] transition-colors`}
                    />
                    {errors.customerEmail && (
                      <p className="mt-1 text-[11px] font-mono text-red-500">{errors.customerEmail}</p>
                    )}
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label
                    htmlFor="input-subject"
                    className="block text-xs font-mono uppercase text-[#4B5563] dark:text-[#9CA3AF] mb-1"
                  >
                    SUBJECT / SUMMARY *
                  </label>
                  <input
                    type="text"
                    id="input-subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Concise overview of the inquiry or outage..."
                    className={`w-full px-3 py-2 text-xs font-sans rounded-md border ${
                      errors.subject
                        ? 'border-red-500 bg-red-50/20'
                        : 'border-[#E5E7EB] dark:border-[#262B35] bg-[#F8F9FA] dark:bg-[#181C24]'
                    } text-[#111827] dark:text-[#F9FAFB] focus:outline-none focus:ring-1 focus:ring-[#FF4400] transition-colors`}
                  />
                  {errors.subject && (
                    <p className="mt-1 text-[11px] font-mono text-red-500">{errors.subject}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label
                    htmlFor="input-description"
                    className="block text-xs font-mono uppercase text-[#4B5563] dark:text-[#9CA3AF] mb-1"
                  >
                    INCIDENT DESCRIPTION *
                  </label>
                  <textarea
                    id="input-description"
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Provide detailed logs, steps to reproduce, impact on customer operations..."
                    className={`w-full p-3 text-xs font-sans rounded-md border ${
                      errors.description
                        ? 'border-red-500 bg-red-50/20'
                        : 'border-[#E5E7EB] dark:border-[#262B35] bg-[#F8F9FA] dark:bg-[#181C24]'
                    } text-[#111827] dark:text-[#F9FAFB] focus:outline-none focus:ring-1 focus:ring-[#FF4400] transition-colors`}
                  />
                  {errors.description && (
                    <p className="mt-1 text-[11px] font-mono text-red-500">{errors.description}</p>
                  )}
                </div>

                {/* Submit button bar */}
                <div className="pt-3 border-t border-[#E5E7EB] dark:border-[#262B35] flex items-center justify-between">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-xs font-mono text-[#4B5563] dark:text-[#9CA3AF] hover:text-[#111827] dark:hover:text-[#F9FAFB] transition-colors"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    id="submit-create-ticket-btn"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-[#FF4400] hover:bg-[#E63D00] text-white font-mono font-medium text-xs tracking-wider uppercase transition-colors shadow-sm disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? 'DISPATCHING...' : 'DISPATCH TICKET'}</span>
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
