# NEXUS CRM — Backend Integration Specification

This document provides the complete specification, API contracts, database schemas, authentication flow, and step-by-step code replacement guide to wire this frontend application into any production backend (Node.js/Express, Python/FastAPI, Go, NestJS, Ruby on Rails, Django, Supabase, Firebase, or GraphQL).

---

## 1. Architectural Overview & The Zero-Touch Seam

The frontend was engineered with a strict **data-access seam**. **Zero UI components touch mock data directly.**

```
┌────────────────────────────────────────────────────────┐
│ UI Components (Table, Kanban, Modal, Detail, Analytics)│
└──────────────────────────┬─────────────────────────────┘
                           │ Consumes hooks
┌──────────────────────────▼─────────────────────────────┐
│ Custom Hooks (useTickets, useTicket, useAddNote...)    │
└──────────────────────────┬─────────────────────────────┘
                           │ Consumes context
┌──────────────────────────▼─────────────────────────────┐
│ TicketContext & AuthContext                            │
│ ➔ [SWAPPABLE SEAM]: Currently in-memory reactive store │
│ ➔ Replace with API client (fetch, axios, TanStack Query│
└────────────────────────────────────────────────────────┘
```

### What You Will Edit
- `src/context/TicketContext.tsx` (or direct implementation in `src/hooks/useTickets.ts`)
- `src/context/AuthContext.tsx`
- `.env` (declare `VITE_API_BASE_URL`)

### What Remains 100% Untouched
- `src/components/tickets/TicketTable.tsx`
- `src/components/tickets/TicketKanban.tsx`
- `src/components/tickets/TicketDetailModal.tsx`
- `src/components/tickets/CreateTicketModal.tsx`
- `src/components/analytics/AnalyticsStrip.tsx`
- `src/components/hero/HeroSection.tsx`

---

## 2. Environment Variables

Create `.env.local` or declare in your deployment environment:

```env
# Backend API Base URL
VITE_API_BASE_URL=https://api.yourdomain.com/v1

# Optional WebSocket / SSE endpoint for live Kanban syncing
VITE_WS_BASE_URL=wss://api.yourdomain.com/ws
```

---

## 3. Data Models & TypeScript Interfaces

Ensure your backend matches these exact payload structures (defined in `src/types.ts`):

```typescript
export type TicketStatus = "Open" | "In Progress" | "Closed";

export interface Note {
  id: string;
  ticketId: string;
  noteText: string;
  createdAt: string; // ISO 8601 string (e.g. "2026-09-08T10:15:30Z")
  author?: {
    id: string;
    name: string;
    avatarText: string;
  };
}

export interface Ticket {
  id: string;              // UUID or CUID primary key
  ticketId: string;        // Human-friendly ticket number, e.g. "TKT-101"
  customerName: string;
  customerEmail: string;
  subject: string;
  description: string;
  status: TicketStatus;
  createdAt: string;       // ISO 8601
  updatedAt: string;       // ISO 8601
  notes: Note[];
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
  dailyTrend: Array<{
    date: string;          // e.g. "Sep 01"
    count: number;         // Tickets opened that day
    closed: number;        // Tickets closed that day
  }>;
}
```

---

## 4. REST API Endpoint Contracts

All requests should accept and return JSON (`Content-Type: application/json`).

### 4.1 Authentication & Profile
- **`POST /api/v1/auth/login`**
  - **Request Body**:
    ```json
    {
      "email": "elena.r@vectortech.io",
      "password": "user_password",
      "organizationDomain": "vectortech.io"
    }
    ```
  - **Response `200 OK`**:
    ```json
    {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": "usr_99182",
        "name": "Elena Rostova",
        "email": "elena.r@vectortech.io",
        "role": "Lead Incident Commander",
        "avatarText": "ER",
        "organization": {
          "id": "ORG-VECTOR-EU01",
          "name": "VectorTech Operations",
          "domain": "vectortech.io",
          "tier": "Enterprise Platinum",
          "region": "AWS Frankfurt (eu-central-1)"
        }
      }
    }
    ```

- **`GET /api/v1/auth/me`**
  - **Headers**: `Authorization: Bearer <token>`
  - **Response `200 OK`**: Returns user profile payload.

---

### 4.2 Tickets List & Search
- **`GET /api/v1/tickets`**
  - **Query Parameters**:
    - `status` (optional): `"Open"` | `"In Progress"` | `"Closed"` | `"All"`
    - `search` (optional): string (searches `ticketId`, `customerName`, `customerEmail`, `subject`, `description`)
    - `sortBy` (optional): `"newest"` | `"oldest"` | `"status"`
    - `page` (optional): number (default `1`)
    - `limit` (optional): number (default `50`)
  - **Headers**:
    - `Authorization: Bearer <token>`
    - `X-Organization-ID: <org_id>`
  - **Response `200 OK`**:
    ```json
    {
      "data": [
        {
          "id": "c7a8b9e0-1234-5678-90ab-cdef12345678",
          "ticketId": "TKT-101",
          "customerName": "Astrid Lindgren",
          "customerEmail": "a.lindgren@nordiccloud.se",
          "subject": "Deadlock during partition rebalance on Cluster 4",
          "description": "During standard node maintenance, partition migration halted at 42%...",
          "status": "In Progress",
          "createdAt": "2026-09-07T14:32:00.000Z",
          "updatedAt": "2026-09-08T09:12:00.000Z",
          "notes": [
            {
              "id": "note-01",
              "ticketId": "c7a8b9e0-1234-5678-90ab-cdef12345678",
              "noteText": "Hotfix applied on broker 03. Monitoring partition offset.",
              "createdAt": "2026-09-08T09:12:00.000Z"
            }
          ]
        }
      ],
      "meta": {
        "total": 35,
        "page": 1,
        "limit": 50,
        "hasMore": false
      }
    }
    ```

---

### 4.3 Get Single Ticket
- **`GET /api/v1/tickets/:id`**
  - Supports lookup either by internal UUID (`id`) or human identifier (`TKT-101`).
  - **Response `200 OK`**: Single `Ticket` object.
  - **Response `404 Not Found`**:
    ```json
    { "error": { "code": "TICKET_NOT_FOUND", "message": "Ticket TKT-999 not found" } }
    ```

---

### 4.4 Create Ticket
- **`POST /api/v1/tickets`**
  - **Request Body**:
    ```json
    {
      "customerName": "Devon Carter",
      "customerEmail": "d.carter@vertex.co",
      "subject": "Webhook failure on payload verification",
      "description": "HMAC-SHA256 signature verification fails for events dispatched after 14:00 UTC."
    }
    ```
  - **Server Processing Requirements**:
    1. Validate fields (`customerName` >= 2 chars, valid email format, `subject` >= 4 chars, `description` >= 10 chars).
    2. Atomically sequence the human-facing `ticketId` (e.g. increment counter for organization: `TKT-136`).
    3. Initialize status as `"Open"`.
    4. Set `createdAt` and `updatedAt` to server current timestamp.
  - **Response `201 Created`**: Returns the newly created `Ticket` object with empty `notes: []`.

---

### 4.5 Update Ticket Status (Kanban & Table actions)
- **`PATCH /api/v1/tickets/:id/status`**
  - **Request Body**:
    ```json
    {
      "status": "In Progress"
    }
    ```
  - **Response `200 OK`**:
    ```json
    {
      "id": "c7a8b9e0-1234-5678-90ab-cdef12345678",
      "status": "In Progress",
      "updatedAt": "2026-09-08T10:20:00.000Z"
    }
    ```

---

### 4.6 Append Internal Note / Audit Entry
- **`POST /api/v1/tickets/:id/notes`**
  - **Request Body**:
    ```json
    {
      "noteText": "Customer verified resolution in staging environment."
    }
    ```
  - **Response `201 Created`**:
    ```json
    {
      "id": "note-9982",
      "ticketId": "c7a8b9e0-1234-5678-90ab-cdef12345678",
      "noteText": "Customer verified resolution in staging environment.",
      "createdAt": "2026-09-08T10:22:15.000Z"
    }
    ```

---

### 4.7 Aggregate Metrics & Analytics
- **`GET /api/v1/analytics/stats`**
  - **Query Parameters**: `days` (optional, default `14`)
  - **Response `200 OK`**:
    ```json
    {
      "total": 35,
      "openCount": 14,
      "inProgressCount": 11,
      "closedCount": 10,
      "avgResolutionHours": 18.4,
      "dailyTrend": [
        { "date": "Aug 26", "count": 3, "closed": 1 },
        { "date": "Aug 27", "count": 2, "closed": 2 },
        { "date": "Sep 08", "count": 4, "closed": 3 }
      ]
    }
    ```

---

## 5. Recommended Database Schemas

### 5.1 PostgreSQL (Relational DDL)

```sql
-- Organizations (Tenants)
CREATE TABLE organizations (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255) NOT NULL UNIQUE,
    tier VARCHAR(64) NOT NULL DEFAULT 'Standard',
    region VARCHAR(64) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Users / Support Agents
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id VARCHAR(64) REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(128) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ticket Status Enum
CREATE TYPE ticket_status_enum AS ENUM ('Open', 'In Progress', 'Closed');

-- Tickets Table
CREATE TABLE tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id VARCHAR(64) REFERENCES organizations(id) ON DELETE CASCADE,
    ticket_id VARCHAR(32) NOT NULL, -- e.g. TKT-101
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    subject VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    status ticket_status_enum NOT NULL DEFAULT 'Open',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    resolved_at TIMESTAMPTZ,
    CONSTRAINT uq_org_ticket_id UNIQUE(organization_id, ticket_id)
);

-- Ticket Internal Notes
CREATE TABLE ticket_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID REFERENCES tickets(id) ON DELETE CASCADE,
    author_id UUID REFERENCES users(id) ON DELETE SET NULL,
    note_text TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Performance Indexes
CREATE INDEX idx_tickets_org_status ON tickets(organization_id, status);
CREATE INDEX idx_tickets_created_at ON tickets(organization_id, created_at DESC);
CREATE INDEX idx_tickets_search ON tickets USING gin(to_tsvector('english', subject || ' ' || customer_name || ' ' || description));
CREATE INDEX idx_ticket_notes_ticket ON ticket_notes(ticket_id, created_at ASC);
```

---

### 5.2 MongoDB / Document NoSQL Structure

```javascript
// Collection: tickets
{
  "_id": ObjectId("64f8a1..."),
  "organizationId": "ORG-VECTOR-EU01",
  "ticketId": "TKT-101",
  "customerName": "Astrid Lindgren",
  "customerEmail": "a.lindgren@nordiccloud.se",
  "subject": "Deadlock during partition rebalance on Cluster 4",
  "description": "During standard node maintenance...",
  "status": "In Progress", // "Open" | "In Progress" | "Closed"
  "createdAt": ISODate("2026-09-07T14:32:00.000Z"),
  "updatedAt": ISODate("2026-09-08T09:12:00.000Z"),
  "notes": [
    {
      "id": "note-01",
      "authorId": "usr_99182",
      "authorName": "Elena Rostova",
      "noteText": "Hotfix applied on broker 03.",
      "createdAt": ISODate("2026-09-08T09:12:00.000Z")
    }
  ]
}
```

---

## 6. Step-by-Step Code Replacement in React

Below is the drop-in replacement implementation for `src/context/TicketContext.tsx` using native `fetch` with token-based authentication.

### Drop-in Replacement: `src/context/TicketContext.tsx`

```typescript
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Ticket, TicketStatus, CreateTicketInput, Note, TicketStats } from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api/v1';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('crm-auth-token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

interface TicketContextType {
  tickets: Ticket[];
  stats: TicketStats;
  isLoading: boolean;
  error: string | null;
  refreshTickets: () => Promise<void>;
  createTicket: (input: CreateTicketInput) => Promise<Ticket>;
  updateTicketStatus: (id: string, newStatus: TicketStatus) => Promise<void>;
  addNote: (ticketId: string, noteText: string) => Promise<Note>;
  getTicketById: (id: string) => Ticket | undefined;
}

const TicketContext = createContext<TicketContextType | undefined>(undefined);

export function TicketProvider({ children }: { children: React.ReactNode }) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [stats, setStats] = useState<TicketStats>({
    total: 0,
    openCount: 0,
    inProgressCount: 0,
    closedCount: 0,
    avgResolutionHours: 0,
    dailyTrend: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 1. Fetch tickets and stats from backend
  const refreshTickets = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [ticketsRes, statsRes] = await Promise.all([
        fetch(`${API_BASE}/tickets?limit=100`, { headers: getAuthHeaders() }),
        fetch(`${API_BASE}/analytics/stats`, { headers: getAuthHeaders() }),
      ]);

      if (!ticketsRes.ok) throw new Error(`Tickets error: ${ticketsRes.statusText}`);
      if (!statsRes.ok) throw new Error(`Stats error: ${statsRes.statusText}`);

      const ticketsData = await ticketsRes.json();
      const statsData = await statsRes.json();

      setTickets(ticketsData.data || ticketsData);
      setStats(statsData);
    } catch (err: any) {
      setError(err.message || 'Failed to load tickets');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshTickets();
  }, [refreshTickets]);

  // 2. Create ticket via POST /tickets
  const createTicket = useCallback(async (input: CreateTicketInput): Promise<Ticket> => {
    const res = await fetch(`${API_BASE}/tickets`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(input),
    });

    if (!res.ok) throw new Error('Failed to create ticket on server');
    const created: Ticket = await res.json();

    // Optimistically prepend to state
    setTickets((prev) => [created, ...prev]);
    return created;
  }, []);

  // 3. Update status via PATCH /tickets/:id/status (with optimistic update)
  const updateTicketStatus = useCallback(async (id: string, newStatus: TicketStatus): Promise<void> => {
    // Optimistic UI update for instantaneous Kanban glider
    setTickets((prev) =>
      prev.map((t) => (t.id === id || t.ticketId === id ? { ...t, status: newStatus } : t))
    );

    const res = await fetch(`${API_BASE}/tickets/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status: newStatus }),
    });

    if (!res.ok) {
      // Rollback on failure
      refreshTickets();
      throw new Error('Status update rejected by server');
    }
  }, [refreshTickets]);

  // 4. Add internal note via POST /tickets/:id/notes
  const addNote = useCallback(async (ticketId: string, noteText: string): Promise<Note> => {
    const res = await fetch(`${API_BASE}/tickets/${ticketId}/notes`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ noteText }),
    });

    if (!res.ok) throw new Error('Failed to append note');
    const newNote: Note = await res.json();

    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId || t.ticketId === ticketId
          ? { ...t, notes: [...t.notes, newNote] }
          : t
      )
    );

    return newNote;
  }, []);

  const getTicketById = useCallback(
    (id: string): Ticket | undefined => {
      return tickets.find((t) => t.id === id || t.ticketId === id);
    },
    [tickets]
  );

  return (
    <TicketContext.Provider
      value={{
        tickets,
        stats,
        isLoading,
        error,
        refreshTickets,
        createTicket,
        updateTicketStatus,
        addNote,
        getTicketById,
      }}
    >
      {children}
    </TicketContext.Provider>
  );
}

export function useTicketContext() {
  const ctx = useContext(TicketContext);
  if (!ctx) throw new Error('useTicketContext must be within TicketProvider');
  return ctx;
}
```

---

## 7. Real-Time Collaboration (Optional WebSocket / SSE)

For multi-agent environments where tickets move on the Kanban board in real time across screens:

### Recommended WebSocket Event Protocol
- Server sends:
  - `ticket:created` → `{ payload: Ticket }`
  - `ticket:status_changed` → `{ payload: { ticketId: string, status: TicketStatus, updatedAt: string } }`
  - `ticket:note_added` → `{ payload: { ticketId: string, note: Note } }`

```typescript
// Add inside useEffect of TicketProvider
const ws = new WebSocket(`${import.meta.env.VITE_WS_BASE_URL}?token=${token}`);
ws.onmessage = (event) => {
  const { type, payload } = JSON.parse(event.data);
  if (type === 'ticket:status_changed') {
    setTickets((prev) =>
      prev.map((t) => (t.id === payload.ticketId ? { ...t, status: payload.status } : t))
    );
  }
};
```

---

## 8. Summary Checklist Before Launching Backend

- [ ] Configure **CORS** on your backend server to allow the frontend URL (allow methods `GET, POST, PATCH, OPTIONS` and headers `Content-Type, Authorization, X-Organization-ID`).
- [ ] Implement rate limiting (e.g. 100 req/min per user).
- [ ] Enforce ticket ID sequence uniqueness per organization (e.g. `TKT-101`, `TKT-102`).
- [ ] Sanitize input strings to prevent XSS in customer description and note bodies.
- [ ] Set up database indexes on `organization_id`, `status`, and full-text search columns.
