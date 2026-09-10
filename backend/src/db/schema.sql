CREATE TABLE IF NOT EXISTS organizations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  domain TEXT NOT NULL UNIQUE,
  tier TEXT NOT NULL DEFAULT 'Standard',
  region TEXT NOT NULL DEFAULT 'us-east-1',
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL REFERENCES organizations(id)
    ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'Support Agent',
  avatar_text TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  firebase_uid TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS ticket_counters (
  organization_id TEXT PRIMARY KEY REFERENCES organizations(id)
    ON DELETE CASCADE,
  next_number INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS tickets (
  id TEXT PRIMARY KEY,
  organization_id TEXT NOT NULL REFERENCES organizations(id)
    ON DELETE CASCADE,
  ticket_id TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Open'
    CHECK (status IN ('Open', 'In Progress', 'Closed')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE(organization_id, ticket_id)
);

CREATE TABLE IF NOT EXISTS ticket_notes (
  id TEXT PRIMARY KEY,
  ticket_id TEXT NOT NULL REFERENCES tickets(id)
    ON DELETE CASCADE,
  author_id TEXT REFERENCES users(id)
    ON DELETE SET NULL,
  note_text TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_tickets_org_status
  ON tickets(organization_id, status);

CREATE INDEX IF NOT EXISTS idx_tickets_created_at
  ON tickets(organization_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_ticket_notes_ticket
  ON ticket_notes(ticket_id, created_at ASC);

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_firebase_uid
  ON users(firebase_uid)
  WHERE firebase_uid IS NOT NULL;
