const db = require('../config/database');
const { successResponse, errorResponse } = require('../utils/response');

const getActiveSessions = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT asess.*, 
              u.id as partner_id, u.username as partner_name, u.profile_photo as partner_photo,
              s1.name as offered_skill, s2.name as wanted_skill
       FROM active_sessions asess
       JOIN swap_requests sr ON asess.swap_request_id = sr.id
       JOIN users u ON (asess.user1_id = u.id OR asess.user2_id = u.id) AND u.id != $1
       JOIN skills s1 ON sr.sender_skill_id = s1.id
       JOIN skills s2 ON sr.receiver_skill_id = s2.id
       WHERE (asess.user1_id = $1 OR asess.user2_id = $1) AND asess.status = 'active'`,
      [req.user.id]
    );
    return successResponse(res, 200, 'Berhasil mengambil sesi aktif', result.rows);
  } catch (error) {
    console.error('GetActiveSessions error:', error);
    return errorResponse(res, 500, 'Server error', 'SERVER_ERROR');
  }
};

const confirmCompletion = async (req, res) => {
  const { id } = req.params;

  try {
    const sessionResult = await db.query('SELECT * FROM active_sessions WHERE id = $1', [id]);
    if (sessionResult.rows.length === 0) {
      return errorResponse(res, 404, 'Sesi tidak ditemukan', 'NOT_FOUND');
    }

    const session = sessionResult.rows[0];
    let updateQuery = '';
    
    if (session.user1_id === req.user.id) {
      updateQuery = 'UPDATE active_sessions SET user1_confirmed = TRUE WHERE id = $1 RETURNING *';
    } else if (session.user2_id === req.user.id) {
      updateQuery = 'UPDATE active_sessions SET user2_confirmed = TRUE WHERE id = $1 RETURNING *';
    } else {
      return errorResponse(res, 403, 'Anda bukan bagian dari sesi ini', 'FORBIDDEN');
    }

    const updateResult = await db.query(updateQuery, [id]);
    const updatedSession = updateResult.rows[0];

    // Check if both confirmed
    if (updatedSession.user1_confirmed && updatedSession.user2_confirmed) {
      const completionResult = await db.query(
        'UPDATE active_sessions SET status = \'completed\', completed_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *',
        [id]
      );
      return successResponse(res, 200, 'Sesi telah diselesaikan oleh kedua pihak', completionResult.rows[0]);
    }

    return successResponse(res, 200, 'Konfirmasi berhasil, menunggu partner mengkonfirmasi', updatedSession);

  } catch (error) {
    console.error('ConfirmCompletion error:', error);
    return errorResponse(res, 500, 'Server error', 'SERVER_ERROR');
  }
};

module.exports = {
  getActiveSessions,
  confirmCompletion
};
