/**
 * Utility functions for calculations
 * Handles pricing, fees, and order totals
 */

import { CartItem } from "../components/Cart";

/**
 * Calculate subtotal from cart items
 */
export const calculateSubtotal = (items: CartItem[]): number => {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

/**
 * Calculate delivery fee based on subtotal
 * Free delivery over ₹500
 */
export const calculateDeliveryFee = (subtotal: number): number => {
  return subtotal > 500 ? 0 : 50;
};

/**
 * Calculate order total (subtotal + delivery fee)
 */
export const calculateOrderTotal = (items: CartItem[]): number => {
  const subtotal = calculateSubtotal(items);
  const deliveryFee = calculateDeliveryFee(subtotal);
  return subtotal + deliveryFee;
};

/**
 * Format price in Indian Rupees
 */
export const formatPrice = (amount: number): string => {
  return `₹${amount.toFixed(2)}`;
};
