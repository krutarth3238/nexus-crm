const { v4: uuidv4 } = require('uuid');

const db = require('../db/connection');
const { AppError } = require('../middleware/errorHandler');
const { nextTicketId } = require('../utils/ticketId');

const nowIso = () => new Date().toISOString();

function mapNote(row) {
  return {
    id: row.id,
    ticketId: row.ticket_id,
    noteText: row.note_text,
    createdAt: row.created_at,
  };
}

function mapTicket(row, notes) {
  return {
    id: row.id,
    ticketId: row.ticket_id,
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    subject: row.subject,
    description: row.description,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    notes: notes.map(mapNote),
  };
}

function getNotesForTicket(ticketDbId) {
  return db
    .prepare(
      'SELECT * FROM ticket_notes WHERE ticket_id = ? ORDER BY created_at ASC'
    )
    .all(ticketDbId);
}

function findTicketRow(orgId, idOrTicketId) {
  return db
    .prepare(
      'SELECT * FROM tickets WHERE organization_id = ? AND (id = ? OR ticket_id = ?)'
    )
    .get(orgId, idOrTicketId, idOrTicketId);
}

async function list(req, res) {
  const orgId = req.user.organizationId;

  const {
    status,
    search,
    sortBy = 'newest',
    page = 1,
    limit = 50,
  } = req.query;

  const clauses = ['organization_id = ?'];
  const params = [orgId];

  if (status && status !== 'All') {
    clauses.push('status = ?');
    params.push(status);
  }

  if (search) {
    clauses.push(
      '(ticket_id LIKE ? OR customer_name LIKE ? OR customer_email LIKE ? OR subject LIKE ? OR description LIKE ?)'
    );

    const term = `%${search}%`;

    params.push(term, term, term, term, term);
  }

  const orderBy =
    sortBy === 'oldest'
      ? 'created_at ASC'
      : sortBy === 'status'
        ? 'status ASC'
        : 'created_at DESC';

  const pageNum = Math.max(1, parseInt(page, 10) || 1);

  const limitNum = Math.min(
    200,
    Math.max(1, parseInt(limit, 10) || 50)
  );

  const offset = (pageNum - 1) * limitNum;

  const whereSql = clauses.join(' AND ');

  const totalRow = db
    .prepare(`SELECT COUNT(*) as count FROM tickets WHERE ${whereSql}`)
    .get(...params);

  const rows = db
    .prepare(
      `SELECT * FROM tickets
       WHERE ${whereSql}
       ORDER BY ${orderBy}
       LIMIT ? OFFSET ?`
    )
    .all(...params, limitNum, offset);

  const data = rows.map((row) =>
    mapTicket(row, getNotesForTicket(row.id))
  );

  res.status(200).json({
    data,
    meta: {
      total: totalRow.count,
      page: pageNum,
      limit: limitNum,
      hasMore: offset + rows.length < totalRow.count,
    },
  });
}

async function getOne(req, res) {
  const row = findTicketRow(
    req.user.organizationId,
    req.params.id
  );

  if (!row) {
    throw new AppError(
      404,
      'TICKET_NOT_FOUND',
      `Ticket ${req.params.id} not found`
    );
  }

  res
    .status(200)
    .json(mapTicket(row, getNotesForTicket(row.id)));
}

async function create(req, res) {
  const orgId = req.user.organizationId;

  const {
    customerName,
    customerEmail,
    subject,
    description,
  } = req.body;

  const errors = [];

  if (!customerName || customerName.trim().length < 2) {
    errors.push('customerName must be at least 2 characters');
  }

  if (
    !customerEmail ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)
  ) {
    errors.push('customerEmail must be a valid email');
  }

  if (!subject || subject.trim().length < 4) {
    errors.push('subject must be at least 4 characters');
  }

  if (!description || description.trim().length < 10) {
    errors.push('description must be at least 10 characters');
  }

  if (errors.length) {
    throw new AppError(
      400,
      'VALIDATION_ERROR',
      errors.join('; ')
    );
  }

  const id = uuidv4();
  const ticketId = nextTicketId(orgId);
  const timestamp = nowIso();

  db.prepare(
    `INSERT INTO tickets
    (id, organization_id, ticket_id, customer_name,
     customer_email, subject, description, status,
     created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'Open', ?, ?)`
  ).run(
    id,
    orgId,
    ticketId,
    customerName.trim(),
    customerEmail.trim(),
    subject.trim(),
    description.trim(),
    timestamp,
    timestamp
  );

  const row = findTicketRow(orgId, id);

  res
    .status(201)
    .json(mapTicket(row, []));
}

async function updateStatus(req, res) {
  const orgId = req.user.organizationId;
  const { status } = req.body;

  const validStatuses = [
    'Open',
    'In Progress',
    'Closed',
  ];

  if (!validStatuses.includes(status)) {
    throw new AppError(
      400,
      'VALIDATION_ERROR',
      `status must be one of ${validStatuses.join(', ')}`
    );
  }

  const row = findTicketRow(orgId, req.params.id);

  if (!row) {
    throw new AppError(
      404,
      'TICKET_NOT_FOUND',
      `Ticket ${req.params.id} not found`
    );
  }

  const updatedAt = nowIso();

  db.prepare(
    'UPDATE tickets SET status = ?, updated_at = ? WHERE id = ?'
  ).run(status, updatedAt, row.id);

  res.status(200).json({
    id: row.id,
    status,
    updatedAt,
  });
}

async function addNote(req, res) {
  const orgId = req.user.organizationId;
  const { noteText } = req.body;

  if (!noteText || !noteText.trim()) {
    throw new AppError(
      400,
      'VALIDATION_ERROR',
      'noteText is required'
    );
  }

  const row = findTicketRow(orgId, req.params.id);

  if (!row) {
    throw new AppError(
      404,
      'TICKET_NOT_FOUND',
      `Ticket ${req.params.id} not found`
    );
  }

  const noteId = uuidv4();
  const createdAt = nowIso();

  db.prepare(
    `INSERT INTO ticket_notes
    (id, ticket_id, author_id, note_text, created_at)
    VALUES (?, ?, ?, ?, ?)`
  ).run(
    noteId,
    row.id,
    req.user.userId,
    noteText.trim(),
    createdAt
  );

  db.prepare(
    'UPDATE tickets SET updated_at = ? WHERE id = ?'
  ).run(createdAt, row.id);

  res.status(201).json({
    id: noteId,
    ticketId: row.id,
    noteText: noteText.trim(),
    createdAt,
  });
}

module.exports = {
  list,
  getOne,
  create,
  updateStatus,
  addNote,
};
