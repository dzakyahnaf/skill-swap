const db = require('../config/database');
const { successResponse, errorResponse } = require('../utils/response');

const getSkills = async (req, res) => {
  const { user_id, type } = req.query;

  try {
    let query = 'SELECT id, name, category, description, skill_type, created_at FROM skills WHERE 1=1';
    const params = [];

    if (user_id) {
      params.push(user_id);
      query += ` AND user_id = $${params.length}`;
    }

    if (type) {
      params.push(type);
      query += ` AND skill_type = $${params.length}`;
    }

    const result = await db.query(query, params);
    return successResponse(res, 200, 'Berhasil mengambil daftar skill', result.rows);
  } catch (error) {
    console.error('GetSkills error:', error);
    return errorResponse(res, 500, 'Server error', 'SERVER_ERROR');
  }
};

const createSkill = async (req, res) => {
  const { name, category, description, skill_type } = req.body;

  if (!name || !skill_type) {
    return errorResponse(res, 400, 'Nama skill dan tipe wajib diisi', 'BAD_REQUEST');
  }

  try {
    // Business Rule: Max 10 skills per type
    const countResult = await db.query(
      'SELECT COUNT(*) FROM skills WHERE user_id = $1 AND skill_type = $2',
      [req.user.id, skill_type]
    );

    if (parseInt(countResult.rows[0].count) >= 10) {
      return errorResponse(res, 400, `Batas maksimal 10 skill ${skill_type} tercapai`, 'LIMIT_REACHED');
    }

    const result = await db.query(
      'INSERT INTO skills (user_id, name, category, description, skill_type) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [req.user.id, name, category, description, skill_type]
    );

    return successResponse(res, 201, 'Skill berhasil ditambahkan', result.rows[0]);
  } catch (error) {
    console.error('CreateSkill error:', error);
    return errorResponse(res, 500, 'Server error', 'SERVER_ERROR');
  }
};

const updateSkill = async (req, res) => {
  const { id } = req.params;
  const { name, category, description } = req.body;

  try {
    // Check ownership
    const skillCheck = await db.query('SELECT * FROM skills WHERE id = $1', [id]);
    if (skillCheck.rows.length === 0) {
      return errorResponse(res, 404, 'Skill tidak ditemukan', 'NOT_FOUND');
    }

    if (skillCheck.rows[0].user_id !== req.user.id) {
      return errorResponse(res, 403, 'Anda tidak memiliki akses untuk mengubah skill ini', 'FORBIDDEN');
    }

    const result = await db.query(
      'UPDATE skills SET name = $1, category = $2, description = $3 WHERE id = $4 RETURNING *',
      [name, category, description, id]
    );

    return successResponse(res, 200, 'Skill berhasil diperbarui', result.rows[0]);
  } catch (error) {
    console.error('UpdateSkill error:', error);
    return errorResponse(res, 500, 'Server error', 'SERVER_ERROR');
  }
};

const deleteSkill = async (req, res) => {
  const { id } = req.params;

  try {
    const skillCheck = await db.query('SELECT * FROM skills WHERE id = $1', [id]);
    if (skillCheck.rows.length === 0) {
      return errorResponse(res, 404, 'Skill tidak ditemukan', 'NOT_FOUND');
    }

    if (skillCheck.rows[0].user_id !== req.user.id) {
      return errorResponse(res, 403, 'Anda tidak memiliki akses untuk menghapus skill ini', 'FORBIDDEN');
    }

    // Business Rule: Cannot delete if attached to active swap requests/sessions? 
    // Usually enforced by DB constraints but good to check.
    
    await db.query('DELETE FROM skills WHERE id = $1', [id]);
    return successResponse(res, 200, 'Skill berhasil dihapus', null);
  } catch (error) {
    console.error('DeleteSkill error:', error);
    return errorResponse(res, 500, 'Server error', 'SERVER_ERROR');
  }
};

module.exports = {
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill
};
