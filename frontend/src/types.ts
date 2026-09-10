export type TicketStatus = "Open" | "In Progress" | "Closed";

export interface Note {
  id: string;
  ticketId: string;
  noteText: string;
  createdAt: string;
}

export interface Ticket {
  id: string;
  ticketId: string;        // human-facing, e.g. "TKT-001"
  customerName: string;
  customerEmail: string;
  subject: string;
  description: string;
  status: TicketStatus;
  createdAt: string;       // ISO timestamp
  updatedAt: string;       // ISO timestamp
  notes: Note[];
}

export interface TicketFilters {
  search: string;
  status: TicketStatus | "All";
  sortBy: "newest" | "oldest" | "status";
}

export interface CreateTicketInput {
  customerName: string;
  customerEmail: string;
  subject: string;
  description: string;
}

export interface TicketStats {
  total: number;
  openCount: number;
  inProgressCount: number;
  closedCount: number;
  avgResolutionHours: number;
  dailyTrend: { date: string; count: number; closed: number }[];
}
