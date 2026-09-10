const rateLimit = require('express-rate-limit');

const rateLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,

    message: {
        error: {
            code: 'RATE_LIMITED',
            message: 'Too many requests. Please slow down.',
        },
    },
});

module.exports = {
    rateLimiter,
};