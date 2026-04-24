const db = require('../config/database');
const { successResponse, errorResponse } = require('../utils/response');

const sendSwapRequest = async (req, res) => {
  const { receiver_id, sender_skill_id, receiver_skill_id, message } = req.body;

  if (!receiver_id || !sender_skill_id || !receiver_skill_id) {
    return errorResponse(res, 400, 'Data permintaan tidak lengkap', 'BAD_REQUEST');
  }

  if (receiver_id === req.user.id) {
    return errorResponse(res, 400, 'Anda tidak bisa mengirim permintaan ke diri sendiri', 'BAD_REQUEST');
  }

  try {
    // Check if there's already an active or pending request between these users for these skills
    const existing = await db.query(
      'SELECT id FROM swap_requests WHERE sender_id = $1 AND receiver_id = $2 AND status = \'pending\'',
      [req.user.id, receiver_id]
    );

    if (existing.rows.length > 0) {
      return errorResponse(res, 400, 'Permintaan masih tertunda', 'REQUEST_EXISTS');
    }

    const result = await db.query(
      'INSERT INTO swap_requests (sender_id, receiver_id, sender_skill_id, receiver_skill_id, message) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [req.user.id, receiver_id, sender_skill_id, receiver_skill_id, message]
    );

    return successResponse(res, 201, 'Permintaan swap berhasil dikirim', result.rows[0]);
  } catch (error) {
    console.error('SendSwapRequest error:', error);
    return errorResponse(res, 500, 'Server error', 'SERVER_ERROR');
  }
};

const getIncomingRequests = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT sr.*, u.username as sender_name, u.profile_photo as sender_photo, 
              s1.name as offered_skill, s2.name as wanted_skill
       FROM swap_requests sr
       JOIN users u ON sr.sender_id = u.id
       JOIN skills s1 ON sr.sender_skill_id = s1.id
       JOIN skills s2 ON sr.receiver_skill_id = s2.id
       WHERE sr.receiver_id = $1 AND sr.status = 'pending'`,
      [req.user.id]
    );
    return successResponse(res, 200, 'Berhasil mengambil permintaan masuk', result.rows);
  } catch (error) {
    console.error('GetIncomingRequests error:', error);
    return errorResponse(res, 500, 'Server error', 'SERVER_ERROR');
  }
};

const acceptSwapRequest = async (req, res) => {
  const { id } = req.params;

  try {
    // 1. Get request details
    const srResult = await db.query('SELECT * FROM swap_requests WHERE id = $1', [id]);
    if (srResult.rows.length === 0) {
      return errorResponse(res, 404, 'Permintaan tidak ditemukan', 'NOT_FOUND');
    }

    const sr = srResult.rows[0];
    if (sr.receiver_id !== req.user.id) {
      return errorResponse(res, 403, 'Akses ditolak', 'FORBIDDEN');
    }

    if (sr.status !== 'pending') {
      return errorResponse(res, 400, 'Permintaan sudah diproses', 'ALREADY_PROCESSED');
    }

    // 2. Business Rule: Max 3 active partners
    const checkSlots = async (userId) => {
      const result = await db.query(
        'SELECT COUNT(*) FROM active_sessions WHERE (user1_id = $1 OR user2_id = $1) AND status = \'active\'',
        [userId]
      );
      return parseInt(result.rows[0].count);
    };

    const senderSlots = await checkSlots(sr.sender_id);
    const receiverSlots = await checkSlots(sr.receiver_id);

    if (senderSlots >= 3) {
       return errorResponse(res, 400, 'Sender sudah mencapai batas maksimal partner aktif', 'MAX_PARTNERS_REACHED');
    }
    if (receiverSlots >= 3) {
       return errorResponse(res, 400, 'Anda sudah mencapai batas maksimal partner aktif', 'MAX_PARTNERS_REACHED');
    }

    // 3. Perform Transaction
    await db.query('BEGIN');
    
    // Update request status
    await db.query('UPDATE swap_requests SET status = \'accepted\' WHERE id = $1', [id]);
    
    // Create session
    const sessionResult = await db.query(
      'INSERT INTO active_sessions (swap_request_id, user1_id, user2_id) VALUES ($1, $2, $3) RETURNING id',
      [id, sr.sender_id, sr.receiver_id]
    );

    await db.query('COMMIT');

    return successResponse(res, 200, 'Permintaan swap diterima', { session_id: sessionResult.rows[0].id });

  } catch (error) {
    await db.query('ROLLBACK');
    console.error('AcceptSwapRequest error:', error);
    return errorResponse(res, 500, 'Server error', 'SERVER_ERROR');
  }
};

const rejectSwapRequest = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      'UPDATE swap_requests SET status = \'rejected\' WHERE id = $1 AND receiver_id = $2 AND status = \'pending\' RETURNING id',
      [id, req.user.id]
    );
    if (result.rows.length === 0) {
      return errorResponse(res, 404, 'Permintaan tidak ditemukan atau tidak bisa diupdate', 'NOT_FOUND');
    }
    return successResponse(res, 200, 'Permintaan ditolak', null);
  } catch (error) {
    console.error('RejectSwapRequest error:', error);
    return errorResponse(res, 500, 'Server error', 'SERVER_ERROR');
  }
};

module.exports = {
  sendSwapRequest,
  getIncomingRequests,
  acceptSwapRequest,
  rejectSwapRequest
};
