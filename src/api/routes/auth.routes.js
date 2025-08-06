const express = require('express');
const router = express.Router();
const controller = require('../controllers/auth.controller');
const passport = require('passport');
const jwt = require('jsonwebtoken');

// Rutas de autenticación local
router.post('/register', controller.register);
router.post('/login', controller.login);

// Rutas de autenticación con Google
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login-error' }),
  (req, res) => {
    const user = req.user;

    // Payload del token JWT
    const payload = {
      id: user._id,
      name: user.name,
      email: user.email,
      photo: user.photo || ''
    };

    // Crear token
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    // 🔁 Redirige al archivo frontend/authcallback.html con token como query param
    res.redirect(`/authcallback.html?token=${token}`);
  }
);

module.exports = router;
