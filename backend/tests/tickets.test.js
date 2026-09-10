process.env.DB_PATH = './data/test.db';
process.env.JWT_SECRET = 'test-secret';
process.env.NODE_ENV = 'test';

const fs = require('fs');
const request = require('supertest');

let app;

beforeAll(() => {
  if (fs.existsSync(process.env.DB_PATH)) {
    fs.unlinkSync(process.env.DB_PATH);
  }

  require('../src/db/migrate');
  require('../src/db/seed');

  app = require('../src/app');
});

afterAll(() => {
  const db = require("../src/db/connection");
  if (db.open) {
    db.close();
  }

  const dbPath = process.env.DB_PATH;
  for (const suffix of ["", "-wal", "-shm"]) {
    const filePath = dbPath + suffix;
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
});

describe('Auth', () => {
  it('rejects invalid credentials', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'agent@datastraw.dev',
        password: 'wrong',
      });

    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe(
      'INVALID_CREDENTIALS'
    );
  });

  it('logs in with seeded demo user', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'agent@datastraw.dev',
        password: 'Support123!',
      });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe(
      'agent@datastraw.dev'
    );
  });
});

describe('Tickets', () => {
  let token;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'agent@datastraw.dev',
        password: 'Support123!',
      });

    token = res.body.token;
  });

  it('rejects requests without a token', async () => {
    const res = await request(app)
      .get('/api/v1/tickets');

    expect(res.status).toBe(401);
  });

  it('lists seeded tickets', async () => {
    const res = await request(app)
      .get('/api/v1/tickets')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('creates a ticket with a sequential ticketId', async () => {
    const res = await request(app)
      .post('/api/v1/tickets')
      .set('Authorization', `Bearer ${token}`)
      .send({
        customerName: 'Test User',
        customerEmail: 'test@example.com',
        subject: 'Cannot reset password',
        description:
          'The reset link expires immediately after being sent.',
      });

    expect(res.status).toBe(201);
    expect(res.body.ticketId).toMatch(/^TKT-\d{3}$/);
    expect(res.body.status).toBe('Open');
    expect(res.body.notes).toEqual([]);
  });

  it('rejects invalid ticket payloads', async () => {
    const res = await request(app)
      .post('/api/v1/tickets')
      .set('Authorization', `Bearer ${token}`)
      .send({
        customerName: 'A',
        customerEmail: 'not-an-email',
        subject: 'Hi',
        description: 'short',
      });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe(
      'VALIDATION_ERROR'
    );
  });

  it('updates ticket status', async () => {
    const create = await request(app)
      .post('/api/v1/tickets')
      .set('Authorization', `Bearer ${token}`)
      .send({
        customerName: 'Status Test',
        customerEmail: 's@example.com',
        subject: 'Testing status flow',
        description:
          'Verifying that PATCH updates status correctly.',
      });

    const res = await request(app)
      .patch(
        `/api/v1/tickets/${create.body.id}/status`
      )
      .set('Authorization', `Bearer ${token}`)
      .send({
        status: 'In Progress',
      });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('In Progress');
  });

  it('adds a note to a ticket', async () => {
    const create = await request(app)
      .post('/api/v1/tickets')
      .set('Authorization', `Bearer ${token}`)
      .send({
        customerName: 'Note Test',
        customerEmail: 'n@example.com',
        subject: 'Testing notes endpoint',
        description:
          'Verifying that notes are appended and returned.',
      });

    const res = await request(app)
      .post(
        `/api/v1/tickets/${create.body.id}/notes`
      )
      .set('Authorization', `Bearer ${token}`)
      .send({
        noteText: 'Investigating root cause.',
      });

    expect(res.status).toBe(201);

    const getRes = await request(app)
      .get(`/api/v1/tickets/${create.body.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(getRes.body.notes.length).toBe(1);
  });

  it('returns 404 for an unknown ticket', async () => {
    const res = await request(app)
      .get('/api/v1/tickets/TKT-999')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe(
      'TICKET_NOT_FOUND'
    );
  });

  it('searches and filters', async () => {
    const search = await request(app)
      .get('/api/v1/tickets?search=Astrid')
      .set('Authorization', `Bearer ${token}`);

    expect(
      search.body.data.some((t) =>
        t.customerName.includes('Astrid')
      )
    ).toBe(true);

    const filtered = await request(app)
      .get('/api/v1/tickets?status=Closed')
      .set('Authorization', `Bearer ${token}`);

    filtered.body.data.forEach((t) =>
      expect(t.status).toBe('Closed')
    );
  });
});

describe('Analytics', () => {
  it('returns TicketStats-shaped data', async () => {
    const login = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'agent@datastraw.dev',
        password: 'Support123!',
      });

    const res = await request(app)
      .get('/api/v1/analytics/stats')
      .set(
        'Authorization',
        `Bearer ${login.body.token}`
      );

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('total');
    expect(Array.isArray(res.body.dailyTrend)).toBe(
      true
    );
  });
});

