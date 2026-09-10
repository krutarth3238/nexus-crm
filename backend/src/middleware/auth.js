const jwt = require('jsonwebtoken');

const config = require('../config/env');
const { AppError } = require('./errorHandler');

function authenticate(req, res, next) {
    const header = req.headers.authorization || '';

    const [scheme, token] = header.split(' ');

    if (scheme !== 'Bearer' || !token) {
        return next(
            new AppError(
                401,
                'UNAUTHORIZED',
                'Missing or invalid Authorization header'
            )
        );
    }

    try {
        const payload = jwt.verify(token, config.jwtSecret);

        const orgHeader = req.headers['x-organization-id'];

        if (orgHeader && orgHeader !== payload.organizationId) {
            return next(
                new AppError(
                    403,
                    'ORG_MISMATCH',
                    'Organization header does not match authenticated user'
                )
            );
        }

        req.user = payload;

        next();
    } catch {
        next(
            new AppError(
                401,
                'UNAUTHORIZED',
                'Invalid or expired token'
            )
        );
    }
}

module.exports = {
    authenticate,
};