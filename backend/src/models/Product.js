import pool from '../config/database.js';

export class Product {
  static async findAll() {
    const query = 'SELECT * FROM products WHERE active = true ORDER BY created_at DESC';
    const result = await pool.query(query);
    return result.rows;
  }

  static async findById(id) {
    const query = 'SELECT * FROM products WHERE id = $1 AND active = true';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async create(productData) {
    const { name, description, price, image_url } = productData;
    const query = `
      INSERT INTO products (name, description, price, image_url, active, created_at)
      VALUES ($1, $2, $3, $4, true, NOW())
      RETURNING *
    `;
    const result = await pool.query(query, [name, description, price, image_url]);
    return result.rows[0];
  }
}

