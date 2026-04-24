const db = require('../config/database');
const { successResponse, errorResponse } = require('../utils/response');

const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await db.query('SELECT COUNT(*) FROM users');
    const activeSessions = await db.query('SELECT COUNT(*) FROM active_sessions WHERE status = \'active\'');
    const completedSessions = await db.query('SELECT COUNT(*) FROM active_sessions WHERE status = \'completed\'');
    const pendingReports = await db.query('SELECT COUNT(*) FROM reports WHERE status = \'pending\'');

    return successResponse(res, 200, 'Statistik dashboard berhasil diambil', {
      total_users: parseInt(totalUsers.rows[0].count),
      active_sessions: parseInt(activeSessions.rows[0].count),
      completed_sessions: parseInt(completedSessions.rows[0].count),
      pending_reports: parseInt(pendingReports.rows[0].count)
    });
  } catch (error) {
    console.error('GetDashboardStats error:', error);
    return errorResponse(res, 500, 'Server error', 'SERVER_ERROR');
  }
};

const banUser = async (req, res) => {
  const { id } = req.params;
  const { reason } = req.body;

  try {
    const result = await db.query(
      'UPDATE users SET is_banned = TRUE, ban_reason = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING id, username, is_banned',
      [reason || 'Pelanggaran ketentuan komunitas', id]
    );

    if (result.rows.length === 0) {
      return errorResponse(res, 404, 'User tidak ditemukan', 'NOT_FOUND');
    }

    return successResponse(res, 200, 'User berhasil di-banned', result.rows[0]);
  } catch (error) {
    console.error('BanUser error:', error);
    return errorResponse(res, 500, 'Server error', 'SERVER_ERROR');
  }
};

const unbanUser = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      'UPDATE users SET is_banned = FALSE, ban_reason = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING id, username, is_banned',
      [id]
    );

    if (result.rows.length === 0) {
      return errorResponse(res, 404, 'User tidak ditemukan', 'NOT_FOUND');
    }

    return successResponse(res, 200, 'User berhasil di-unban', result.rows[0]);
  } catch (error) {
    console.error('UnbanUser error:', error);
    return errorResponse(res, 500, 'Server error', 'SERVER_ERROR');
  }
};

const getAllUsers = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, username, email, full_name, is_banned, created_at FROM users ORDER BY created_at DESC'
    );
    return successResponse(res, 200, 'Daftar semua pengguna berhasil diambil', result.rows);
  } catch (error) {
    console.error('GetAllUsers error:', error);
    return errorResponse(res, 500, 'Server error', 'SERVER_ERROR');
  }
};

const getAllReports = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT r.*, u1.username as reporter_name, u2.username as reported_name
       FROM reports r
       JOIN users u1 ON r.reporter_id = u1.id
       JOIN users u2 ON r.reported_id = u2.id
       ORDER BY r.created_at DESC`
    );
    return successResponse(res, 200, 'Daftar semua laporan berhasil diambil', result.rows);
  } catch (error) {
    console.error('GetAllReports error:', error);
    return errorResponse(res, 500, 'Server error', 'SERVER_ERROR');
  }
};

const getAllSessions = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT s.*, u1.username as user1_name, u2.username as user2_name, sk1.name as skill1_name, sk2.name as skill2_name
       FROM active_sessions s
       JOIN users u1 ON s.user1_id = u1.id
       JOIN users u2 ON s.user2_id = u2.id
       JOIN skills sk1 ON s.user1_skill_id = sk1.id
       JOIN skills sk2 ON s.user2_skill_id = sk2.id
       ORDER BY s.created_at DESC`
    );
    return successResponse(res, 200, 'Daftar semua sesi aktif berhasil diambil', result.rows);
  } catch (error) {
    console.error('GetAllSessions error:', error);
    return errorResponse(res, 500, 'Server error', 'SERVER_ERROR');
  }
};

module.exports = {
  getDashboardStats,
  banUser,
  unbanUser,
  getAllReports,
  getAllUsers,
  getAllSessions
};
