import pool from '../config/database.js';

export class OTP {
  static async create(email, otp, expiryMinutes = 10) {
    const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);
    const query = `
      INSERT INTO otp_verifications (email, otp_code, expires_at, created_at, verified)
      VALUES ($1, $2, $3, NOW(), false)
      ON CONFLICT (email) 
      DO UPDATE SET otp_code = $2, expires_at = $3, created_at = NOW(), verified = false
      RETURNING id, email, expires_at
    `;
    const result = await pool.query(query, [email, otp, expiresAt]);
    return result.rows[0];
  }

  static async verify(email, otp) {
    const query = `
      SELECT * FROM otp_verifications 
      WHERE email = $1 AND otp_code = $2 AND verified = false AND expires_at > NOW()
    `;
    const result = await pool.query(query, [email, otp]);
    
    if (result.rows.length === 0) {
      return { valid: false, message: 'Invalid or expired OTP' };
    }

    await pool.query(
      'UPDATE otp_verifications SET verified = true WHERE email = $1 AND otp_code = $2',
      [email, otp]
    );

    return { valid: true, message: 'OTP verified successfully' };
  }

  // ⭐ Helper added here
  static async getExisting(email, query) {
    const result = await pool.query(query, [email]);
    return result.rows.length > 0 ? result.rows[0] : null;
  }
}
