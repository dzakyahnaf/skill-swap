const db = require('../config/database');
const { successResponse, errorResponse } = require('../utils/response');

const submitReport = async (req, res) => {
  const { reported_id, reason, description } = req.body;

  if (!reported_id || !reason) {
    return errorResponse(res, 400, 'ID yang dilaporkan dan alasan wajib diisi', 'BAD_REQUEST');
  }

  if (reported_id === req.user.id) {
    return errorResponse(res, 400, 'Anda tidak bisa melaporkan diri sendiri', 'BAD_REQUEST');
  }

  try {
    const result = await db.query(
      'INSERT INTO reports (reporter_id, reported_id, reason, description) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.user.id, reported_id, reason, description]
    );

    return successResponse(res, 201, 'Laporan Anda telah berhasil dikirim dan akan segera diproses', result.rows[0]);
  } catch (error) {
    console.error('SubmitReport error:', error);
    return errorResponse(res, 500, 'Server error', 'SERVER_ERROR');
  }
};

const getMyReports = async (req, res) => {
  try {
    const result = await db.query(
      'SELECT r.*, u.username as reported_username FROM reports r JOIN users u ON r.reported_id = u.id WHERE r.reporter_id = $1',
      [req.user.id]
    );
    return successResponse(res, 200, 'Berhasil mengambil daftar laporan Anda', result.rows);
  } catch (error) {
    console.error('GetMyReports error:', error);
    return errorResponse(res, 500, 'Server error', 'SERVER_ERROR');
  }
};

module.exports = {
  submitReport,
  getMyReports
};
