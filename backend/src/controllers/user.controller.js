const db = require('../config/database');
const { successResponse, errorResponse } = require('../utils/response');

const getMe = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, username, email, full_name, bio, profile_photo, is_active, created_at FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return errorResponse(res, 404, 'User tidak ditemukan', 'NOT_FOUND');
    }

    return successResponse(res, 200, 'Data profil berhasil diambil', result.rows[0]);
  } catch (error) {
    console.error('GetMe error:', error);
    return errorResponse(res, 500, 'Server error', 'SERVER_ERROR');
  }
};

const updateProfile = async (req, res) => {
  const { full_name, bio } = req.body;

  try {
    const result = await db.query(
      'UPDATE users SET full_name = $1, bio = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING id, username, full_name, bio',
      [full_name, bio, req.user.id]
    );

    return successResponse(res, 200, 'Profil berhasil diperbarui', result.rows[0]);
  } catch (error) {
    console.error('UpdateProfile error:', error);
    return errorResponse(res, 500, 'Server error', 'SERVER_ERROR');
  }
};

const getUserProfile = async (req, res) => {
  const { id } = req.params;

  try {
    const userResult = await db.query(
      'SELECT id, username, full_name, bio, profile_photo, created_at FROM users WHERE id = $1',
      [id]
    );

    if (userResult.rows.length === 0) {
      return errorResponse(res, 404, 'User tidak ditemukan', 'NOT_FOUND');
    }

    // Get user skills
    const skillsResult = await db.query(
      'SELECT id, name, category, description, skill_type FROM skills WHERE user_id = $1',
      [id]
    );

    return successResponse(res, 200, 'Profil user berhasil diambil', {
      ...userResult.rows[0],
      skills: skillsResult.rows
    });
  } catch (error) {
    console.error('GetUserProfile error:', error);
    return errorResponse(res, 500, 'Server error', 'SERVER_ERROR');
  }
};

const searchUsers = async (req, res) => {
  const { skill, category } = req.query;

  try {
    let query = `
      SELECT DISTINCT u.id, u.username, u.full_name, u.profile_photo, s.name as matched_skill
      FROM users u
      JOIN skills s ON u.id = s.user_id
      WHERE u.id != $1 AND u.is_banned = FALSE AND s.skill_type = 'offered'
    `;
    const params = [req.user.id];

    if (skill) {
      params.push(`%${skill}%`);
      query += ` AND s.name ILIKE $${params.length}`;
    }

    if (category) {
      params.push(category);
      query += ` AND s.category = $${params.length}`;
    }

    const result = await db.query(query, params);

    return successResponse(res, 200, 'Pencarian berhasil', result.rows);
  } catch (error) {
    console.error('SearchUsers error:', error);
    return errorResponse(res, 500, 'Server error', 'SERVER_ERROR');
  }
};

module.exports = {
  getMe,
  updateProfile,
  getUserProfile,
  searchUsers
};
