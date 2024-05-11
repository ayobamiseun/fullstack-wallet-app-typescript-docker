import rateLimit from 'express-rate-limit';

const FIFTEEN_MIN = 15 * 60 * 1000;
const ONE_HOUR = 60 * 60 * 1000;

// Brute-force protection on credentials. 5 attempts / 15 min / IP.
export const loginLimiter = rateLimit({
  windowMs: FIFTEEN_MIN,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts. Try again later.' },
});

// Account-creation abuse. 5 / hour / IP.
export const registerLimiter = rateLimit({
  windowMs: ONE_HOUR,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many registrations. Try again later.' },
});

// Reset-token issuance / consumption. 5 / hour / IP.
export const passwordResetLimiter = rateLimit({
  windowMs: ONE_HOUR,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many password reset attempts. Try again later.' },
});
