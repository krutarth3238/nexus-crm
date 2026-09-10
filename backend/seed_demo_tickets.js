const db = require('better-sqlite3')('./data/crm.db');
const { v4: uuidv4 } = require('uuid');

const tickets = [
  {
    customer_name: 'Tony Stark',
    customer_email: 'tony@starkindustries.com',
    subject: 'Server overheating',
    description: 'The Arc Reactor mainframe is showing thermal warnings. Need immediate assistance.',
    status: 'Open'
  },
  {
    customer_name: 'Bruce Wayne',
    customer_email: 'bruce@wayneenterprises.com',
    subject: 'Billing issue for Q3',
    description: 'I was charged twice for the Bat-server hosting. Please refund the duplicate amount.',
    status: 'In Progress'
  },
  {
    customer_name: 'Clark Kent',
    customer_email: 'clark@dailyplanet.com',
    subject: 'Cannot login to CRM',
    description: 'My password is not working. Might have typed it too fast. Can someone reset it?',
    status: 'Closed'
  },
  {
    customer_name: 'Diana Prince',
    customer_email: 'diana@themyscira.gov',
    subject: 'Request for API key limit increase',
    description: 'Our integration is hitting rate limits. We need the Enterprise API quota.',
    status: 'Open'
  },
  {
    customer_name: 'Barry Allen',
    customer_email: 'barry@starlabs.com',
    subject: 'Latency spikes in US-East',
    description: 'Seeing occasional 500ms latency spikes when accessing the database.',
    status: 'In Progress'
  }
];

const orgId = 'ORG-DATASTRAW-01';

try {
  const insert = db.prepare(`
    INSERT INTO tickets (id, organization_id, ticket_id, customer_name, customer_email, subject, description, status, created_at, updated_at)
    VALUES (@id, @organization_id, @ticket_id, @customer_name, @customer_email, @subject, @description, @status, @created_at, @updated_at)
  `);

  const insertMany = db.transaction((ticketsToInsert) => {
    for (const t of ticketsToInsert) {
      insert.run(t);
    }
  });

  // Calculate starting ticket number based on existing tickets for the org
  const row = db.prepare('SELECT COUNT(*) as count FROM tickets WHERE organization_id = ?').get(orgId);
  let nextTicketNum = (row.count || 0) + 1;

  const now = new Date().toISOString();

  const formattedTickets = tickets.map((t) => {
    const tNumStr = String(nextTicketNum++).padStart(4, '0');
    return {
      id: uuidv4(),
      organization_id: orgId,
      ticket_id: `TCK-${tNumStr}`,
      customer_name: t.customer_name,
      customer_email: t.customer_email,
      subject: t.subject,
      description: t.description,
      status: t.status,
      created_at: now,
      updated_at: now
    };
  });

  insertMany(formattedTickets);
  console.log(`Successfully added ${formattedTickets.length} demo tickets.`);
} catch (err) {
  console.error('Error inserting tickets:', err);
}
