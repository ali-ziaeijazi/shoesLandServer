const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { readDb, writeDb } = require('../utils/jsonDb');
const { sendResetEmail } = require('../utils/email');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your_refresh_jwt_secret_key';

// Register
router.post(
  '/register',
  [
    body('username')
      .isLength({ min: 5 })
      .matches(/^[a-zA-Z][a-zA-Z0-9]*$/)
      .withMessage('Username must start with a letter and contain no spaces.'),
    body('email').isEmail().withMessage('Invalid email address.'),
    body('password')
      .isLength({ min: 8, max: 16 })
      .matches(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$])/)
      .withMessage('Password must be 8-16 characters long with letters, numbers, and special characters.'),
    body('firstName').notEmpty().withMessage('First name is required.'),
    body('lastName').notEmpty().withMessage('Last name is required.'),
    body('phone').matches(/^\d{11}$/).withMessage('Phone number must be 11 digits.'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { username, email, password, firstName, lastName, phone } = req.body;

    const db = readDb();
    if (db.users.some((user) => user.email === email || user.username === username)) {
      return res.status(400).json({ error: 'Email or username already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { id: Date.now(), username, email, password: hashedPassword, firstName, lastName, phone };

    db.users.push(newUser);
    writeDb(db);

    console.log("user created: ", newUser.username, newUser.email)
    res.status(201).json({ message: 'User registered successfully' });
  }
);


router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const db = readDb();
  const user = db.users.find((user) => user.username === username);
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid username or password.' });
  }

  // Access Token
  const accessToken = jwt.sign(
    { id: user.id, username: user.username },
    JWT_SECRET,
    { expiresIn: '5m' }
  );

  // Refresh Token
  const refreshToken = jwt.sign(
    { id: user.id, username: user.username },
    JWT_REFRESH_SECRET,
    { expiresIn: '30m' }
  );

  // Example of securely storing the refresh token (store it in your database)
  // db.refreshTokens.push({ token: refreshToken, userId: user.id });

  // Set the refresh token in an HTTP-only cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true, // Use secure in production only
    sameSite: 'Strict', // Prevent CSRF
    maxAge: 30 * 60* 1000, // 30min
  });

  console.log('User logged in:', user.username);
  res.json({
    message: 'Login successful',
    accessToken,
    username:user.username
  });
});

router.post('/refresh', (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    return res.status(403).json({ error: 'Refresh token missing.' });
  }

  try {
    const payload = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    const accessToken = jwt.sign({ id: payload.id, username: payload.username }, JWT_SECRET, { expiresIn: '5m' });
    res.json({ accessToken,username:payload.username});
  } catch (err) {
    console.error('Error verifying token:', err); // لاگ خطا
    return res.status(403).json({ error: 'Invalid refresh token.' });
  }
});



// Endpoint to get user information based on the Access Token
router.get('/whoami', function (req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token is missing.' });
  }

  try {
    // Verify the token and extract the payload
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // Attach user info to the request object
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired access token.' });
  }
}, (req, res) => {
  const { id, username } = req.user;
  res.json({ id, username });
});

// Forgot Password
router.post(
  '/forgot-password',
  [
    body('email').isEmail().withMessage('Invalid email address'), // اعتبارسنجی ایمیل
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); // اگر ایمیل معتبر نیست
    }

    const { email } = req.body;

    const db = readDb();
    const user = db.users.find((user) => user.email === email);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' }); // اگر کاربر وجود نداشته باشد
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '15m' });

    try {
      await sendResetEmail(email, token); // ارسال ایمیل ریست پسورد
      res.json({ message: 'Reset email sent' });
    } catch (error) {
      console.error('Error during sending reset email:', error);  // چاپ خطا
      res.status(500).json({ error: 'Failed to send reset email.' });
    }
  }
);

// Reset Password
router.post(
  '/reset-password',
  [
    body('newPassword')
      .isLength({ min: 8, max: 16 })
      .matches(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$])/)
      .withMessage('Password must be 8-16 characters long with letters, numbers, and special characters.')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { token, newPassword } = req.body;

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const db = readDb();

      const user = db.users.find((user) => user.id === decoded.id);
      if (!user) return res.status(404).json({ error: 'User not found.' });

      user.password = await bcrypt.hash(newPassword, 10);
      writeDb(db);

      res.json({ message: 'Password reset successfully' });
    } catch (err) {
      res.status(400).json({ error: 'Invalid or expired token.' });
    }
  }
);

module.exports = router;
