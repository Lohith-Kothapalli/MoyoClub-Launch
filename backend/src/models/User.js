import pool from '../config/database.js';
import bcrypt from 'bcryptjs';

export class User {
  static async create(userData) {
    const { name, email, phone, address, city, state, pincode } = userData;
    const query = `
      INSERT INTO users (name, email, phone, address, city, state, pincode, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      RETURNING id, name, email, phone, address, city, state, pincode, created_at
    `;
    const result = await pool.query(query, [name, email, phone, address, city, state, pincode]);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  static async findByPhone(phone) {
    if (!phone) return null;
    const query = 'SELECT * FROM users WHERE phone = $1';
    const result = await pool.query(query, [phone]);
    return result.rows[0];
  }

  static async findById(id) {
    const query = 'SELECT id, name, email, phone, address, city, state, pincode, created_at FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async update(id, userData) {
    const { name, address, city, state, pincode } = userData;
    const query = `
      UPDATE users 
      SET name = $1, address = $2, city = $3, state = $4, pincode = $5, updated_at = NOW()
      WHERE id = $6
      RETURNING id, name, email, phone, address, city, state, pincode, created_at
    `;
    const result = await pool.query(query, [name, address, city, state, pincode, id]);
    return result.rows[0];
  }
}

