const { Router } = require('express');
const authHandlers = require('../handlers/auth');
const passport = require('passport');

const authRoutes = Router();

authRoutes.get('/google', passport.authenticate(
  'google',
  {
    scope:
      [
        'https://mail.google.com/',
        'profile', 'email', 'openid',
      ],
  },
));

authRoutes.get(
  '/google/callback',
  passport.authenticate('google', {
    successRedirect: 'http://localhost:8080',
    failureRedirect: '/auth/google',
  }),
);

authRoutes.get('/logout', authHandlers.logout);

module.exports = authRoutes;
