import pool from '../config/database.js';

export class Order {
  static async create(orderData) {
    const { userId, productId, quantity, totalAmount, transactionId, deliveryAddress } = orderData;
    const orderId = `MOYO${Date.now()}`;
    
    // If transaction ID is provided, order is confirmed (payment received)
    // Otherwise, it's pending payment
    const status = transactionId ? 'confirmed' : 'pending';
    
    const query = `
      INSERT INTO orders (order_id, user_id, product_id, quantity, total_amount, transaction_id, delivery_address, status, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
      RETURNING *
    `;
    
    const result = await pool.query(query, [
      orderId,
      userId,
      productId,
      quantity,
      totalAmount,
      transactionId,
      JSON.stringify(deliveryAddress),
      status
    ]);
    
    return result.rows[0];
  }

  static async findByUserId(userId) {
    const query = `
      SELECT o.*, p.name as product_name, p.description as product_description
      FROM orders o
      LEFT JOIN products p ON o.product_id = p.id
      WHERE o.user_id = $1
      ORDER BY o.created_at DESC
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  static async findById(orderId) {
    const query = `
      SELECT o.*, p.name as product_name, p.description as product_description,
             u.name as user_name, u.email as user_email, u.phone as user_phone
      FROM orders o
      LEFT JOIN products p ON o.product_id = p.id
      LEFT JOIN users u ON o.user_id = u.id
      WHERE o.order_id = $1
    `;
    const result = await pool.query(query, [orderId]);
    return result.rows[0];
  }

  static async updateStatus(orderId, status) {
    const query = `
      UPDATE orders 
      SET status = $1, updated_at = NOW()
      WHERE order_id = $2
      RETURNING *
    `;
    const result = await pool.query(query, [status, orderId]);
    return result.rows[0];
  }
}

