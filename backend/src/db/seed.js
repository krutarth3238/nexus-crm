const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const db = require('./connection');
const { nextTicketId } = require('../utils/ticketId');

const ORG_ID = 'ORG-DATASTRAW-01';
const DEMO_EMAIL = 'agent@datastraw.dev';
const DEMO_PASSWORD = 'Support123!';

function seed() {
  const existingOrg = db
    .prepare('SELECT id FROM organizations WHERE id = ?')
    .get(ORG_ID);

  if (existingOrg) {
    console.log('Seed skipped: organization already exists.');
    return;
  }

  const now = new Date().toISOString();

  db.prepare(
    `INSERT INTO organizations
    (id, name, domain, tier, region, created_at)
    VALUES (?, ?, ?, ?, ?, ?)`
  ).run(
    ORG_ID,
    'Datastraw Support',
    'datastraw.dev',
    'Standard',
    'us-east-1',
    now
  );

  const userId = uuidv4();
  const passwordHash = bcrypt.hashSync(DEMO_PASSWORD, 10);

  db.prepare(
    `INSERT INTO users
    (id, organization_id, name, email, role, avatar_text, password_hash, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    userId,
    ORG_ID,
    'Support Agent',
    DEMO_EMAIL,
    'Support Agent',
    'SA',
    passwordHash,
    now
  );

  const sampleTickets = [
    {
      customerName: 'Astrid Lindgren',
      customerEmail: 'a.lindgren@nordiccloud.se',
      subject: 'Login page returns 500 error',
      description:
        'Customer cannot log in since this morning; console shows a 500 from the login endpoint.',
      status: 'Open',
    },
    {
      customerName: 'Devon Carter',
      customerEmail: 'd.carter@vertex.co',
      subject: 'Webhook signature verification fails',
      description:
        'HMAC-SHA256 signature verification fails for events dispatched after 14:00 UTC yesterday.',
      status: 'In Progress',
    },
    {
      customerName: 'Mei Tanaka',
      customerEmail: 'mei.tanaka@shopline.jp',
      subject: 'Invoice PDF missing line items',
      description:
        'Generated invoices are missing the tax breakdown section since the last release.',
      status: 'Closed',
    },
  ];

  sampleTickets.forEach((ticket) => {
    const id = uuidv4();
    const ticketId = nextTicketId(ORG_ID);

    db.prepare(
      `INSERT INTO tickets
      (id, organization_id, ticket_id, customer_name, customer_email,
       subject, description, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      id,
      ORG_ID,
      ticketId,
      ticket.customerName,
      ticket.customerEmail,
      ticket.subject,
      ticket.description,
      ticket.status,
      now,
      now
    );
  });

  console.log(
    `Seed complete. Demo login: ${DEMO_EMAIL} / ${DEMO_PASSWORD}`
  );
}

seed();