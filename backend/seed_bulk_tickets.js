const db = require('better-sqlite3')('./data/crm.db');
const { v4: uuidv4 } = require('uuid');

const orgId = 'ORG-DATASTRAW-01';

const subjects = [
  'Need help with API',
  'Bug in dashboard',
  'Billing question',
  'Feature request',
  'Cannot connect to database',
  'Unexpected downtime',
  'Account access issue',
  'Please upgrade my plan',
  'Integration failing',
  'Data export error'
];

const customers = [
  { name: 'Alice Smith', email: 'alice@example.com' },
  { name: 'Bob Johnson', email: 'bob@example.com' },
  { name: 'Charlie Davis', email: 'charlie@example.com' },
  { name: 'Dana Lee', email: 'dana@example.com' },
  { name: 'Evan Wright', email: 'evan@example.com' }
];

const descriptions = [
  'I am experiencing an issue when trying to perform this action. It used to work yesterday.',
  'Please look into this as soon as possible. Our team is blocked.',
  'I have attached the logs, but essentially the service returns a 500 error.',
  'Can we get a quick update on this? The client is asking.',
  'Just wondering how to properly configure this setting in the admin panel.'
];

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

function generateTickets(count, status) {
  const tickets = [];
  for (let i = 0; i < count; i++) {
    const c = getRandom(customers);
    tickets.push({
      customer_name: c.name,
      customer_email: c.email,
      subject: getRandom(subjects),
      description: getRandom(descriptions),
      status: status
    });
  }
  return tickets;
}

const allTickets = [
  ...generateTickets(10, 'Open'),
  ...generateTickets(15, 'In Progress'),
  ...generateTickets(11, 'Closed')
];

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

  const row = db.prepare('SELECT COUNT(*) as count FROM tickets WHERE organization_id = ?').get(orgId);
  let nextTicketNum = (row.count || 0) + 1;

  const now = new Date().toISOString();

  const formattedTickets = allTickets.map((t) => {
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
  console.log(`Successfully added ${formattedTickets.length} bulk demo tickets.`);
} catch (err) {
  console.error('Error inserting tickets:', err);
}
