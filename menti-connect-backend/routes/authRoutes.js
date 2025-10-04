// routes/authRoutes.js
const express = require('express');
const passport = require('passport');
const authController = require('../controllers/authController');
const router = express.Router();

// @desc    Auth with GitHub
// @route   GET /auth/github
router.get('/github', passport.authenticate('github', { scope: ['user:email', 'read:user', 'repo'] }));

// @desc    GitHub auth callback
// @route   GET /auth/github/callback
router.get(
    '/github/callback',
    passport.authenticate('github', { session: false, failureRedirect: '/' }),
    authController.githubCallback
);

module.exports = router;