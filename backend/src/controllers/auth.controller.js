const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const db = require('../db/connection');
const config = require('../config/env');
const { AppError } = require('../middleware/errorHandler');
const { getFirebaseApp, getAuth } = require('../config/firebase');

function toUserResponse(userRow, orgRow) {
  return {
    id: userRow.id,
    name: userRow.name,
    email: userRow.email,
    role: userRow.role,
    avatarText: userRow.avatar_text,
    organization: {
      id: orgRow.id,
      name: orgRow.name,
      domain: orgRow.domain,
      tier: orgRow.tier,
      region: orgRow.region,
    },
  };
}

function issueToken(user) {
  return jwt.sign(
    {
      userId: user.id,
      organizationId: user.organization_id,
    },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn }
  );
}

function initials(nameOrEmail) {
  return nameOrEmail
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('');
}

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError(
      400,
      'VALIDATION_ERROR',
      'Email and password are required'
    );
  }

  const user = db
    .prepare('SELECT * FROM users WHERE email = ?')
    .get(String(email).toLowerCase());

  if (!user) {
    throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
  }

  const valid = await bcrypt.compare(password, user.password_hash);

  if (!valid) {
    throw new AppError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
  }

  const org = db
    .prepare('SELECT * FROM organizations WHERE id = ?')
    .get(user.organization_id);

  res.status(200).json({
    token: issueToken(user),
    user: toUserResponse(user, org),
  });
}

async function firebaseLogin(req, res) {
  const { idToken } = req.body;

  if (!idToken) {
    throw new AppError(400, 'VALIDATION_ERROR', 'idToken is required');
  }

  const app = getFirebaseApp();

  if (!app) {
    throw new AppError(
      501,
      'FIREBASE_NOT_CONFIGURED',
      'Firebase login is not configured on this server'
    );
  }

  let decoded;

  try {
    decoded = await getAuth().verifyIdToken(idToken);
  } catch (err) {
    throw new AppError(
      401,
      'INVALID_FIREBASE_TOKEN',
      'Firebase token is invalid or expired'
    );
  }

  const { uid, email, name } = decoded;

  if (!email) {
    throw new AppError(
      400,
      'VALIDATION_ERROR',
      'Firebase account has no email address'
    );
  }

  let user = db
    .prepare('SELECT * FROM users WHERE firebase_uid = ?')
    .get(uid);

  if (!user) {
    user = db
      .prepare('SELECT * FROM users WHERE email = ?')
      .get(email.toLowerCase());

    if (user) {
      db.prepare('UPDATE users SET firebase_uid = ? WHERE id = ?')
        .run(uid, user.id);

      user = db
        .prepare('SELECT * FROM users WHERE id = ?')
        .get(user.id);
    }
  }

  if (!user) {
    const org = db
      .prepare('SELECT * FROM organizations LIMIT 1')
      .get();

    if (!org) {
      throw new AppError(
        500,
        'ORG_NOT_FOUND',
        'No organization exists � run the seed script first'
      );
    }

    const userId = uuidv4();
    const placeholderHash = bcrypt.hashSync(uuidv4(), 10);
    const now = new Date().toISOString();

    db.prepare(
      `INSERT INTO users
      (id, organization_id, name, email, role, avatar_text, password_hash, firebase_uid, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(
      userId,
      org.id,
      name || email,
      email.toLowerCase(),
      'Support Agent',
      initials(name || email),
      placeholderHash,
      uid,
      now
    );

    user = db
      .prepare('SELECT * FROM users WHERE id = ?')
      .get(userId);
  }

  const org = db
    .prepare('SELECT * FROM organizations WHERE id = ?')
    .get(user.organization_id);

  res.status(200).json({
    token: issueToken(user),
    user: toUserResponse(user, org),
  });
}

async function me(req, res) {
  const user = db
    .prepare('SELECT * FROM users WHERE id = ?')
    .get(req.user.userId);

  if (!user) {
    throw new AppError(404, 'USER_NOT_FOUND', 'User not found');
  }

  const org = db
    .prepare('SELECT * FROM organizations WHERE id = ?')
    .get(user.organization_id);

  res.status(200).json(toUserResponse(user, org));
}

module.exports = { login, me, firebaseLogin };
