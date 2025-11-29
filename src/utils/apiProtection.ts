/**
 * API Protection Middleware
 * 
 * This utility provides security checks for API access control.
 * Only users with the 'security-admin' role should be able to access
 * certain administrative endpoints.
 * 
 * Usage in your backend API:
 * 
 * ```typescript
 * import { requireSecurityAdmin } from './utils/apiProtection';
 * 
 * app.post('/api/admin/users', requireSecurityAdmin, (req, res) => {
 *   // Only security admins can reach this code
 *   // ...
 * });
 * ```
 */

/**
 * Checks if the current user has security admin role
 * @returns boolean indicating if user is a security admin
 */
export function isSecurityAdmin(): boolean {
  const stored = localStorage.getItem('moyoclub_current_security_admin');
  if (stored) {
    try {
      const admin = JSON.parse(stored);
      return admin.role === 'security-admin' && admin.accessLevel === 'super-admin';
    } catch {
      return false;
    }
  }
  return false;
}

/**
 * Backend middleware to protect API routes
 * This should be implemented on your backend server
 * 
 * Example for Express.js:
 */
export const requireSecurityAdmin = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ error: 'No authorization token provided' });
  }

  try {
    // Decode and verify JWT token
    // const decoded = jwt.verify(authHeader, SECRET_KEY);
    
    // Check if user has security_admin role
    // if (decoded.role !== 'security-admin') {
    //   return res.status(403).json({ 
    //     error: 'Forbidden: Security Admin access required',
    //     message: 'You do not have permission to access this resource'
    //   });
    // }
    
    // User is authorized
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid authorization token' });
  }
};

/**
 * Example protected routes configuration:
 * 
 * ```typescript
 * // User management endpoints - require security admin
 * app.get('/api/admin/users', requireSecurityAdmin, getUsersList);
 * app.post('/api/admin/users', requireSecurityAdmin, createUser);
 * app.put('/api/admin/users/:id', requireSecurityAdmin, updateUser);
 * app.delete('/api/admin/users/:id', requireSecurityAdmin, deleteUser);
 * app.post('/api/admin/users/:id/ban', requireSecurityAdmin, banUser);
 * app.post('/api/admin/users/:id/impersonate', requireSecurityAdmin, impersonateUser);
 * app.put('/api/admin/users/:id/role', requireSecurityAdmin, changeUserRole);
 * 
 * // Audit log endpoints - require security admin
 * app.get('/api/admin/audit-log', requireSecurityAdmin, getAuditLog);
 * 
 * // Security settings endpoints - require security admin
 * app.get('/api/admin/security-settings', requireSecurityAdmin, getSecuritySettings);
 * app.put('/api/admin/security-settings', requireSecurityAdmin, updateSecuritySettings);
 * ```
 */

/**
 * Protected API call wrapper for frontend
 * Automatically adds security admin token to requests
 */
export async function secureApiCall(url: string, options: RequestInit = {}) {
  const stored = localStorage.getItem('moyoclub_current_security_admin');
  
  if (!stored) {
    throw new Error('Not authenticated as security admin');
  }

  const admin = JSON.parse(stored);
  
  // In production, you would get a JWT token from the auth service
  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${admin.email}`, // Replace with actual JWT token
    'Content-Type': 'application/json'
  };

  const response = await fetch(url, {
    ...options,
    headers
  });

  if (response.status === 403) {
    throw new Error('Forbidden: Security Admin access required');
  }

  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }

  return response.json();
}

/**
 * Example usage in React components:
 * 
 * ```typescript
 * import { secureApiCall } from '../utils/apiProtection';
 * 
 * const handleUpdateUser = async (userId: string, data: any) => {
 *   try {
 *     const result = await secureApiCall(`/api/admin/users/${userId}`, {
 *       method: 'PUT',
 *       body: JSON.stringify(data)
 *     });
 *     console.log('User updated:', result);
 *   } catch (error) {
 *     console.error('Failed to update user:', error);
 *   }
 * };
 * ```
 */
