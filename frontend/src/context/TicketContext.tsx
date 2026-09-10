import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  Ticket,
  TicketStatus,
  CreateTicketInput,
  Note,
  TicketStats,
} from '../types';

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api/v1';

const TOKEN_KEY = 'crm-auth-token';

interface TicketContextType {
  tickets: Ticket[];
  stats: TicketStats;
  isLoading: boolean;
  error: string | null;
  createTicket: (input: CreateTicketInput) => Promise<Ticket>;
  updateTicketStatus: (id: string, newStatus: TicketStatus) => Promise<void>;
  addNote: (ticketId: string, noteText: string) => Promise<Note>;
  getTicketById: (id: string) => Ticket | undefined;
  refreshTickets: () => Promise<void>;
}

const TicketContext = createContext<TicketContextType | undefined>(undefined);

async function parseResponse(response: Response) {
  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      body?.error?.message ||
        body?.message ||
        'Ticket request failed.'
    );
  }

  return body;
}

export function TicketProvider({ children }: { children: React.ReactNode }) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [backendStats, setBackendStats] = useState<TicketStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getAuthHeaders = useCallback((): HeadersInit => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      return {
        'Content-Type': 'application/json',
      };
    }

    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
  }, []);

  const refreshTickets = useCallback(async () => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      setTickets([]);
      setBackendStats(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const [ticketsResponse, statsResponse] = await Promise.all([
        fetch(`${API_BASE}/tickets?limit=200&sortBy=newest`, {
          headers: getAuthHeaders(),
        }),
        fetch(`${API_BASE}/analytics/stats?days=14`, {
          headers: getAuthHeaders(),
        }),
      ]);

      const ticketsBody = await parseResponse(ticketsResponse);
      const statsBody = await parseResponse(statsResponse);

      const ticketData = Array.isArray(ticketsBody.data)
        ? ticketsBody.data
        : Array.isArray(ticketsBody)
          ? ticketsBody
          : [];

      setTickets(ticketData);
      setBackendStats(statsBody);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Unable to load CRM data from the backend.';

      setError(message);
      setTickets([]);
      setBackendStats(null);
    } finally {
      setIsLoading(false);
    }
  }, [getAuthHeaders]);

  useEffect(() => {
    refreshTickets();

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === TOKEN_KEY) {
        refreshTickets();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [refreshTickets]);

  const createTicket = useCallback(
    async (input: CreateTicketInput): Promise<Ticket> => {
      const token = localStorage.getItem(TOKEN_KEY);

      if (!token) {
        throw new Error('You must be signed in to create a ticket.');
      }

      const response = await fetch(`${API_BASE}/tickets`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          customerName: input.customerName.trim(),
          customerEmail: input.customerEmail.trim(),
          subject: input.subject.trim(),
          description: input.description.trim(),
        }),
      });

      const body = await parseResponse(response);

      const created: Ticket = body.data ?? body.ticket ?? body;

      setTickets((previous) => [
        created,
        ...previous.filter((ticket) => ticket.id !== created.id),
      ]);

      await refreshTickets();

      return created;
    },
    [getAuthHeaders, refreshTickets]
  );

  const updateTicketStatus = useCallback(
    async (id: string, newStatus: TicketStatus): Promise<void> => {
      const target = tickets.find(
        (ticket) => ticket.id === id || ticket.ticketId === id
      );

      const targetId = target?.id ?? id;

      if (!localStorage.getItem(TOKEN_KEY)) {
        throw new Error('You must be signed in to update a ticket.');
      }

      const response = await fetch(
        `${API_BASE}/tickets/${targetId}/status`,
        {
          method: 'PATCH',
          headers: getAuthHeaders(),
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      await parseResponse(response);

      await refreshTickets();
    },
    [tickets, getAuthHeaders, refreshTickets]
  );

  const addNote = useCallback(
    async (ticketId: string, noteText: string): Promise<Note> => {
      const target = tickets.find(
        (ticket) =>
          ticket.id === ticketId || ticket.ticketId === ticketId
      );

      const targetId = target?.id ?? ticketId;

      if (!localStorage.getItem(TOKEN_KEY)) {
        throw new Error('You must be signed in to add a note.');
      }

      if (!noteText.trim()) {
        throw new Error('Note text is required.');
      }

      const response = await fetch(
        `${API_BASE}/tickets/${targetId}/notes`,
        {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({
            noteText: noteText.trim(),
          }),
        }
      );

      const body = await parseResponse(response);

      const createdNote: Note = body.data ?? body.note ?? body;

      await refreshTickets();

      return createdNote;
    },
    [tickets, getAuthHeaders, refreshTickets]
  );

  const getTicketById = useCallback(
    (id: string): Ticket | undefined => {
      return tickets.find(
        (ticket) => ticket.id === id || ticket.ticketId === id
      );
    },
    [tickets]
  );

  const computedStats = useMemo<TicketStats>(() => {
    if (backendStats) {
      return backendStats;
    }

    return {
      total: tickets.length,
      openCount: tickets.filter((ticket) => ticket.status === 'Open').length,
      inProgressCount: tickets.filter(
        (ticket) => ticket.status === 'In Progress'
      ).length,
      closedCount: tickets.filter(
        (ticket) => ticket.status === 'Closed'
      ).length,
      avgResolutionHours: 0,
      dailyTrend: [],
    };
  }, [tickets, backendStats]);

  return (
    <TicketContext.Provider
      value={{
        tickets,
        stats: computedStats,
        isLoading,
        error,
        createTicket,
        updateTicketStatus,
        addNote,
        getTicketById,
        refreshTickets,
      }}
    >
      {children}
    </TicketContext.Provider>
  );
}

export function useTicketContext(): TicketContextType {
  const context = useContext(TicketContext);

  if (!context) {
    throw new Error(
      'useTicketContext must be used within a TicketProvider'
    );
  }

  return context;
}
