import express from 'express';
import { Order } from '../models/Order.js';
import { User } from '../models/User.js';
import { Product } from '../models/Product.js';
import { authenticateToken } from '../middleware/auth.js';
import { sendOrderConfirmation } from '../config/email.js';

const router = express.Router();

// Create new order
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { productId, quantity, totalAmount, transactionId, deliveryAddress } = req.body;
    const userId = req.user.userId;

    if (!productId || !quantity || !totalAmount || !transactionId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const order = await Order.create({
      userId,
      productId,
      quantity,
      totalAmount,
      transactionId,
      deliveryAddress
    });

    // Send confirmation email (don't block response if email fails)
    try {
      const user = await User.findById(userId);
      const product = await Product.findById(productId);
      
      if (user && user.email) {
        const emailResult = await sendOrderConfirmation(order, user, product);
        if (!emailResult.success) {
          console.warn('⚠️ Order created but confirmation email failed:', emailResult.error);
        }
      }
    } catch (emailError) {
      console.error('Error sending order confirmation email:', emailError);
      // Don't fail the order creation if email fails
    }

    res.status(201).json({ success: true, order });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user's orders
router.get('/my-orders', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const orders = await Order.findByUserId(userId);
    res.json({ success: true, orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get order by ID
router.get('/:orderId', authenticateToken, async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Verify order belongs to user
    if (order.user_id !== req.user.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    res.json({ success: true, order });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update order status (for admin use - can be protected with admin middleware later)
router.patch('/:orderId/status', authenticateToken, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required' });
    }

    // Valid statuses
    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status.toLowerCase())) {
      return res.status(400).json({ 
        error: 'Invalid status', 
        validStatuses 
      });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Verify order belongs to user (or add admin check here)
    if (order.user_id !== req.user.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const updatedOrder = await Order.updateStatus(orderId, status.toLowerCase());
    res.json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

