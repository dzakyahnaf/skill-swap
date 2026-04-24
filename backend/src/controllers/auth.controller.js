const bcrypt = require('bcryptjs');
const db = require('../config/database');
const { generateToken } = require('../utils/jwt');
const { successResponse, errorResponse } = require('../utils/response');

const register = async (req, res) => {
  const { username, email, password, full_name } = req.body;

  if (!username || !email || !password) {
    return errorResponse(res, 400, 'Username, email dan password wajib diisi', 'BAD_REQUEST');
  }

  try {
    // Check if user exists
    const userExists = await db.query('SELECT * FROM users WHERE email = $1 OR username = $2', [email, username]);
    if (userExists.rows.length > 0) {
      if (userExists.rows[0].email === email) {
        return errorResponse(res, 409, 'Email sudah terdaftar', 'EMAIL_TAKEN');
      }
      return errorResponse(res, 409, 'Username sudah terdaftar', 'USERNAME_TAKEN');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Insert user
    const newUser = await db.query(
      'INSERT INTO users (username, email, password_hash, full_name) VALUES ($1, $2, $3, $4) RETURNING id, username, email, full_name, is_active, created_at',
      [username, email, passwordHash, full_name]
    );

    const user = newUser.rows[0];

    // Generate token
    const token = generateToken({ id: user.id, username: user.username, role: 'user' });

    return successResponse(res, 201, 'Registrasi berhasil', {
      user,
      token
    });

  } catch (error) {
    console.error('Register error:', error);
    return errorResponse(res, 500, 'Terjadi kesalahan pada server', 'SERVER_ERROR');
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return errorResponse(res, 400, 'Email dan password wajib diisi', 'BAD_REQUEST');
  }

  try {
    // Check user
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return errorResponse(res, 401, 'Email atau password salah', 'UNAUTHORIZED');
    }

    const user = result.rows[0];

    // Check if banned
    if (user.is_banned) {
      return errorResponse(res, 403, `Akun Anda telah di-banned. Alasan: ${user.ban_reason}`, 'USER_BANNED');
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return errorResponse(res, 401, 'Email atau password salah', 'UNAUTHORIZED');
    }

    // Generate token
    const token = generateToken({ id: user.id, username: user.username, role: 'user' });

    return successResponse(res, 200, 'Login berhasil', {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        profile_photo: user.profile_photo
      },
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    return errorResponse(res, 500, 'Terjadi kesalahan pada server', 'SERVER_ERROR');
  }
};

const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return errorResponse(res, 400, 'Email dan password wajib diisi', 'BAD_REQUEST');
  }

  try {
    const result = await db.query('SELECT * FROM admins WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return errorResponse(res, 401, 'Kredensial admin tidak valid', 'UNAUTHORIZED');
    }

    const admin = result.rows[0];

    const isMatch = await bcrypt.compare(password, admin.password_hash);
    if (!isMatch) {
      return errorResponse(res, 401, 'Kredensial admin tidak valid', 'UNAUTHORIZED');
    }

    const token = generateToken({ id: admin.id, username: admin.username, role: 'admin' });

    return successResponse(res, 200, 'Admin login berhasil', {
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email
      },
      token
    });

  } catch (error) {
    console.error('Admin Login error:', error);
    return errorResponse(res, 500, 'Terjadi kesalahan pada server', 'SERVER_ERROR');
  }
};

module.exports = {
  register,
  login,
  adminLogin
};
