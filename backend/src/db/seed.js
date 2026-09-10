const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const db = require('./connection');
const { nextTicketId } = require('../utils/ticketId');

const ORG_ID = 'ORG-DATASTRAW-01';
const DEMO_EMAIL = 'agent@datastraw.dev';
const DEMO_PASSWORD = 'Support123!';

const DEMO_TICKETS = [
  {
    customer_name: 'Tony Stark',
    customer_email: 'tony@starkindustries.com',
    subject: 'Server overheating',
    description: 'The Arc Reactor mainframe is showing thermal warnings. Need immediate assistance.',
    status: 'Open',
  },
  {
    customer_name: 'Bruce Wayne',
    customer_email: 'bruce@wayneenterprises.com',
    subject: 'Billing issue for Q3',
    description: 'I was charged twice for the Bat-server hosting. Please refund the duplicate amount.',
    status: 'In Progress',
  },
  {
    customer_name: 'Clark Kent',
    customer_email: 'clark@dailyplanet.com',
    subject: 'Cannot login to CRM',
    description: 'My password is not working. Might have typed it too fast. Can someone reset it?',
    status: 'Closed',
  },
  {
    customer_name: 'Diana Prince',
    customer_email: 'diana@themyscira.gov',
    subject: 'Request for API key limit increase',
    description: 'Our integration is hitting rate limits. We need the Enterprise API quota.',
    status: 'Open',
  },
  {
    customer_name: 'Barry Allen',
    customer_email: 'barry@starlabs.com',
    subject: 'Latency spikes in US-East',
    description: 'Seeing occasional 500ms latency spikes when accessing the database.',
    status: 'In Progress',
  },
];

function seed() {
  const existingOrg = db
    .prepare('SELECT id FROM organizations WHERE id = ?')
    .get(ORG_ID);

  if (existingOrg) {
    console.log('Seed skipped: organization already exists.');
  } else {
    const now = new Date().toISOString();

    db.prepare(
      `INSERT INTO organizations
      (id, name, domain, tier, region, created_at)
      VALUES (?, ?, ?, ?, ?, ?)`
    ).run(ORG_ID, 'Datastraw Support', 'datastraw.dev', 'Standard', 'us-east-1', now);

    const userId = uuidv4();
    const passwordHash = bcrypt.hashSync(DEMO_PASSWORD, 10);

    db.prepare(
      `INSERT INTO users
      (id, organization_id, name, email, role, avatar_text, password_hash, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(userId, ORG_ID, 'Support Agent', DEMO_EMAIL, 'Support Agent', 'SA', passwordHash, now);

    console.log(`Seed complete. Demo login: ${DEMO_EMAIL} / ${DEMO_PASSWORD}`);
  }

  // Seed demo tickets only if none exist yet for this org
  const ticketCount = db
    .prepare('SELECT COUNT(*) as count FROM tickets WHERE organization_id = ?')
    .get(ORG_ID);

  if (ticketCount.count === 0) {
    const now = new Date().toISOString();
    const insert = db.prepare(
      `INSERT INTO tickets
      (id, organization_id, ticket_id, customer_name, customer_email, subject, description, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    );

    const insertMany = db.transaction((tickets) => {
      for (const t of tickets) {
        insert.run(
          uuidv4(), ORG_ID, nextTicketId(ORG_ID),
          t.customer_name, t.customer_email,
          t.subject, t.description, t.status,
          now, now
        );
      }
    });

    insertMany(DEMO_TICKETS);
    console.log(`Seed complete: ${DEMO_TICKETS.length} demo tickets added.`);
  } else {
    console.log(`Seed skipped: ${ticketCount.count} tickets already exist.`);
  }
}

seed();