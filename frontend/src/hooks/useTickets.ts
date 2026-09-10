import { useMemo, useState } from 'react';
import { useTicketContext } from '../context/TicketContext';
import { Ticket, TicketStatus, CreateTicketInput, TicketFilters, Note } from '../types';

export function useTickets(filters?: Partial<TicketFilters>) {
  const { tickets, stats } = useTicketContext();

  const filteredTickets = useMemo(() => {
    let result = [...tickets];

    if (filters?.status && filters.status !== 'All') {
      result = result.filter((t) => t.status === filters.status);
    }

    if (filters?.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(
        (t) =>
          t.ticketId.toLowerCase().includes(q) ||
          t.customerName.toLowerCase().includes(q) ||
          t.customerEmail.toLowerCase().includes(q) ||
          t.subject.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q)
      );
    }

    if (filters?.sortBy === 'oldest') {
      result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else if (filters?.sortBy === 'status') {
      const order: Record<TicketStatus, number> = { Open: 1, 'In Progress': 2, Closed: 3 };
      result.sort((a, b) => order[a.status] - order[b.status]);
    } else {
      // Default: newest first
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return result;
  }, [tickets, filters?.search, filters?.status, filters?.sortBy]);

  return {
    tickets: filteredTickets,
    rawTickets: tickets,
    stats,
    totalCount: filteredTickets.length,
    allCount: tickets.length,
  };
}

export function useTicket(id: string | null | undefined) {
  const { getTicketById } = useTicketContext();

  const ticket: Ticket | undefined = useMemo(() => {
    if (!id) return undefined;
    return getTicketById(id);
  }, [id, getTicketById]);

  return {
    ticket,
    isLoading: false,
    notFound: Boolean(id && !ticket),
  };
}

export function useCreateTicket() {
  const { createTicket } = useTicketContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = async (input: CreateTicketInput): Promise<Ticket> => {
    setIsSubmitting(true);
    setError(null);
    try {
      const newTicket = await createTicket(input);
      return newTicket;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to create ticket';
      setError(msg);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    createTicket: execute,
    isSubmitting,
    error,
  };
}

export function useUpdateTicketStatus() {
  const { updateTicketStatus } = useTicketContext();
  const [isUpdating, setIsUpdating] = useState(false);

  const execute = async (ticketId: string, newStatus: TicketStatus): Promise<void> => {
    setIsUpdating(true);
    try {
      await updateTicketStatus(ticketId, newStatus);
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    updateStatus: execute,
    isUpdating,
  };
}

export function useAddNote() {
  const { addNote } = useTicketContext();
  const [isAdding, setIsAdding] = useState(false);

  const execute = async (ticketId: string, noteText: string): Promise<Note> => {
    setIsAdding(true);
    try {
      return await addNote(ticketId, noteText);
    } finally {
      setIsAdding(false);
    }
  };

  return {
    addNote: execute,
    isAdding,
  };
}
