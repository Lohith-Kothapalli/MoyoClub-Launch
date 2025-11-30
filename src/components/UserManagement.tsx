import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Search, Plus, Edit2, Trash2, Lock, Unlock, UserPlus, Users, Building2, Warehouse, Shield, UserCog, History } from "lucide-react";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "./ui/alert-dialog";

// Audit log entry type
interface AuditLogEntry {
  id: string;
  timestamp: string;
  adminName: string;
  adminEmail: string;
  action: string;
  targetUserId: string;
  targetUserName: string;
  details: string;
}

// User types for different roles
interface ConsumerUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'consumer';
  status: 'active' | 'inactive';
  createdAt: string;
  lastLogin: string;
}

interface WarehouseUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  warehouseId: string;
  role: 'warehouse_manager';
  status: 'active' | 'inactive';
  createdAt: string;
  lastLogin: string;
}

interface SiteAdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'site-admin';
  status: 'active' | 'inactive';
  createdAt: string;
  lastLogin: string;
}

interface CorporateUser {
  id: string;
  companyName: string;
  companyEmail: string;
  contactPerson: string;
  phone: string;
  role: 'corporate';
  status: 'active' | 'inactive';
  createdAt: string;
  lastLogin: string;
}

type AllUsers = ConsumerUser | WarehouseUser | SiteAdminUser | CorporateUser;

export function UserManagement() {
  const [activeView, setActiveView] = useState<'users' | 'audit-log'>('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showImpersonateDialog, setShowImpersonateDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AllUsers | null>(null);
  const [userToImpersonate, setUserToImpersonate] = useState<AllUsers | null>(null);
  
  // Audit log state
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([]);

  // Helper function to add audit log entry
  const addAuditLog = (action: string, targetUserId: string, targetUserName: string, details: string) => {
    const currentAdmin = JSON.parse(localStorage.getItem('moyoclub_current_security_admin') || '{}');
    const entry: AuditLogEntry = {
      id: `AUDIT-${Date.now()}`,
      timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
      adminName: currentAdmin.name || 'Security Admin',
      adminEmail: currentAdmin.email || 'security@moyoclub.one',
      action,
      targetUserId,
      targetUserName,
      details
    };
    setAuditLog(prev => [entry, ...prev]);
    
    // Store in localStorage for persistence
    const existingLogs = JSON.parse(localStorage.getItem('moyoclub_audit_log') || '[]');
    localStorage.setItem('moyoclub_audit_log', JSON.stringify([entry, ...existingLogs]));
  };

  // Load audit log on mount
  useEffect(() => {
    const storedLogs = localStorage.getItem('moyoclub_audit_log');
    if (storedLogs) {
      setAuditLog(JSON.parse(storedLogs));
    }
  }, []);
  
  // Mock data - replace with actual API calls
  const [consumers, setConsumers] = useState<ConsumerUser[]>([
    {
      id: 'USR-001',
      name: 'Priya Sharma',
      email: 'priya@example.com',
      phone: '+91 98765 43210',
      role: 'consumer',
      status: 'active',
      createdAt: '2024-01-15 10:30:00',
      lastLogin: '2024-11-17 14:23:00'
    },
    {
      id: 'USR-002',
      name: 'Rahul Verma',
      email: 'rahul@example.com',
      phone: '+91 98765 43211',
      role: 'consumer',
      status: 'active',
      createdAt: '2024-02-20 09:15:00',
      lastLogin: '2024-11-16 18:45:00'
    }
  ]);

  const [warehouseManagers, setWarehouseManagers] = useState<WarehouseUser[]>([
    {
      id: 'WM-001',
      name: 'Amit Patel',
      email: 'warehouse@moyoclub.one',
      phone: '+91 98765 43212',
      warehouseId: 'WH-001',
      role: 'warehouse_manager',
      status: 'active',
      createdAt: '2024-01-10 08:00:00',
      lastLogin: '2024-11-18 09:15:00'
    }
  ]);

  const [siteAdmins, setSiteAdmins] = useState<SiteAdminUser[]>([
    {
      id: 'SA-001',
      name: 'Site Administrator',
      email: 'admin@moyoclub.one',
      phone: '+91 98765 43213',
      role: 'site-admin',
      status: 'active',
      createdAt: '2024-01-01 12:00:00',
      lastLogin: '2024-11-18 10:30:00'
    }
  ]);

  const [corporateAccounts, setCorporateAccounts] = useState<CorporateUser[]>([
    {
      id: 'CORP-001',
      companyName: 'TechCorp India',
      companyEmail: 'admin@techcorp.com',
      contactPerson: 'Rajesh Kumar',
      phone: '+91 98765 43210',
      role: 'corporate',
      status: 'active',
      createdAt: '2024-01-05 11:45:00',
      lastLogin: '2024-11-17 16:20:00'
    }
  ]);

  // Add user form state
  const [newUserForm, setNewUserForm] = useState({
    role: 'consumer' as 'consumer' | 'warehouse_manager' | 'site-admin' | 'corporate',
    name: '',
    email: '',
    phone: '',
    password: '',
    warehouseId: '',
    companyName: '',
    contactPerson: ''
  });

  const [editUserForm, setEditUserForm] = useState({
    id: '',
    role: 'consumer' as 'consumer' | 'warehouse_manager' | 'site-admin' | 'corporate',
    name: '',
    email: '',
    phone: '',
    warehouseId: '',
    companyName: '',
    contactPerson: ''
  });

  const handleAddUser = () => {
    // Validate form
    if (!newUserForm.email || !newUserForm.password) {
      toast.error('Email and password are required');
      return;
    }

    if (!newUserForm.phone) {
      toast.error('Phone number is required');
      return;
    }

    const now = new Date();
    const createdAt = now.toISOString().slice(0, 19).replace('T', ' ');
    const lastLogin = 'Never';

    switch (newUserForm.role) {
      case 'consumer':
        if (!newUserForm.name) {
          toast.error('Name is required for consumers');
          return;
        }
        const newConsumerId = `USR-${String(consumers.length + 1).padStart(3, '0')}`;
        setConsumers([...consumers, {
          id: newConsumerId,
          name: newUserForm.name,
          email: newUserForm.email,
          phone: newUserForm.phone,
          role: 'consumer',
          status: 'active',
          createdAt,
          lastLogin
        }]);
        addAuditLog('Add User', newConsumerId, newUserForm.name, `Added consumer user ${newUserForm.name}`);
        break;
      
      case 'warehouse_manager':
        if (!newUserForm.name || !newUserForm.warehouseId) {
          toast.error('Name and warehouse ID are required');
          return;
        }
        const newWarehouseId = `WM-${String(warehouseManagers.length + 1).padStart(3, '0')}`;
        setWarehouseManagers([...warehouseManagers, {
          id: newWarehouseId,
          name: newUserForm.name,
          email: newUserForm.email,
          phone: newUserForm.phone,
          warehouseId: newUserForm.warehouseId,
          role: 'warehouse_manager',
          status: 'active',
          createdAt,
          lastLogin
        }]);
        addAuditLog('Add User', newWarehouseId, newUserForm.name, `Added warehouse manager ${newUserForm.name}`);
        break;
      
      case 'site-admin':
        if (!newUserForm.name) {
          toast.error('Name is required');
          return;
        }
        const newAdminId = `SA-${String(siteAdmins.length + 1).padStart(3, '0')}`;
        setSiteAdmins([...siteAdmins, {
          id: newAdminId,
          name: newUserForm.name,
          email: newUserForm.email,
          phone: newUserForm.phone,
          role: 'site-admin',
          status: 'active',
          createdAt,
          lastLogin
        }]);
        addAuditLog('Add User', newAdminId, newUserForm.name, `Added site admin ${newUserForm.name}`);
        break;
      
      case 'corporate':
        if (!newUserForm.companyName || !newUserForm.contactPerson) {
          toast.error('Company name and contact person are required');
          return;
        }
        const newCorpId = `CORP-${String(corporateAccounts.length + 1).padStart(3, '0')}`;
        setCorporateAccounts([...corporateAccounts, {
          id: newCorpId,
          companyName: newUserForm.companyName,
          companyEmail: newUserForm.email,
          contactPerson: newUserForm.contactPerson,
          phone: newUserForm.phone,
          role: 'corporate',
          status: 'active',
          createdAt,
          lastLogin
        }]);
        addAuditLog('Add User', newCorpId, newUserForm.contactPerson, `Added corporate account ${newUserForm.companyName}`);
        break;
    }

    toast.success('User added successfully');
    setShowAddDialog(false);
    setNewUserForm({
      role: 'consumer',
      name: '',
      email: '',
      phone: '',
      password: '',
      warehouseId: '',
      companyName: '',
      contactPerson: ''
    });
  };

  const handleEditUser = () => {
    if (!editUserForm.email || !editUserForm.phone) {
      toast.error('Email and phone are required');
      return;
    }

    // Track role changes for audit log
    const originalUser = [...consumers, ...warehouseManagers, ...siteAdmins, ...corporateAccounts].find(u => u.id === editUserForm.id);
    const originalRole = originalUser?.role || '';
    const roleChanged = originalRole !== editUserForm.role;

    switch (editUserForm.role) {
      case 'consumer':
        if (!editUserForm.name) {
          toast.error('Name is required');
          return;
        }
        setConsumers(consumers.map(u => u.id === editUserForm.id ? {
          ...u,
          name: editUserForm.name,
          email: editUserForm.email,
          phone: editUserForm.phone
        } : u));
        if (roleChanged) {
          addAuditLog('Change Role', editUserForm.id, editUserForm.name, `Changed role from ${getRoleName(originalRole)} to ${getRoleName(editUserForm.role)}`);
        } else {
          addAuditLog('Edit User', editUserForm.id, editUserForm.name, `Updated consumer user ${editUserForm.name}`);
        }
        break;
      
      case 'warehouse_manager':
        if (!editUserForm.name || !editUserForm.warehouseId) {
          toast.error('Name and warehouse ID are required');
          return;
        }
        setWarehouseManagers(warehouseManagers.map(u => u.id === editUserForm.id ? {
          ...u,
          name: editUserForm.name,
          email: editUserForm.email,
          phone: editUserForm.phone,
          warehouseId: editUserForm.warehouseId
        } : u));
        if (roleChanged) {
          addAuditLog('Change Role', editUserForm.id, editUserForm.name, `Changed role from ${getRoleName(originalRole)} to ${getRoleName(editUserForm.role)}`);
        } else {
          addAuditLog('Edit User', editUserForm.id, editUserForm.name, `Updated warehouse manager ${editUserForm.name}`);
        }
        break;
      
      case 'site-admin':
        if (!editUserForm.name) {
          toast.error('Name is required');
          return;
        }
        setSiteAdmins(siteAdmins.map(u => u.id === editUserForm.id ? {
          ...u,
          name: editUserForm.name,
          email: editUserForm.email,
          phone: editUserForm.phone
        } : u));
        if (roleChanged) {
          addAuditLog('Change Role', editUserForm.id, editUserForm.name, `Changed role from ${getRoleName(originalRole)} to ${getRoleName(editUserForm.role)}`);
        } else {
          addAuditLog('Edit User', editUserForm.id, editUserForm.name, `Updated site admin ${editUserForm.name}`);
        }
        break;
      
      case 'corporate':
        if (!editUserForm.companyName || !editUserForm.contactPerson) {
          toast.error('Company name and contact person are required');
          return;
        }
        setCorporateAccounts(corporateAccounts.map(u => u.id === editUserForm.id ? {
          ...u,
          companyName: editUserForm.companyName,
          companyEmail: editUserForm.email,
          contactPerson: editUserForm.contactPerson,
          phone: editUserForm.phone
        } : u));
        if (roleChanged) {
          addAuditLog('Change Role', editUserForm.id, editUserForm.contactPerson, `Changed role from ${getRoleName(originalRole)} to ${getRoleName(editUserForm.role)}`);
        } else {
          addAuditLog('Edit User', editUserForm.id, editUserForm.contactPerson, `Updated corporate account ${editUserForm.companyName}`);
        }
        break;
    }

    toast.success(roleChanged ? 'User role updated successfully' : 'User updated successfully');
    setShowEditDialog(false);
    setEditUserForm({
      id: '',
      role: 'consumer',
      name: '',
      email: '',
      phone: '',
      warehouseId: '',
      companyName: '',
      contactPerson: ''
    });
  };

  const handleOpenEditDialog = (user: AllUsers) => {
    if ('name' in user) {
      setEditUserForm({
        id: user.id,
        role: user.role,
        name: user.name,
        email: user.email,
        phone: user.phone,
        warehouseId: 'warehouseId' in user ? user.warehouseId : '',
        companyName: '',
        contactPerson: ''
      });
    } else if ('companyName' in user) {
      setEditUserForm({
        id: user.id,
        role: user.role,
        name: '',
        email: user.companyEmail,
        phone: user.phone,
        warehouseId: '',
        companyName: user.companyName,
        contactPerson: user.contactPerson
      });
    }
    setShowEditDialog(true);
  };

  const handleToggleStatus = (userId: string, currentStatus: 'active' | 'inactive') => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    
    switch (activeView) {
      case 'users':
        setConsumers(consumers.map(u => u.id === userId ? { ...u, status: newStatus } : u));
        addAuditLog('Toggle Status', userId, getUserDisplayName(consumers.find(u => u.id === userId) || { name: '' }), `Toggled status to ${newStatus}`);
        break;
      case 'warehouse':
        setWarehouseManagers(warehouseManagers.map(u => u.id === userId ? { ...u, status: newStatus } : u));
        addAuditLog('Toggle Status', userId, getUserDisplayName(warehouseManagers.find(u => u.id === userId) || { name: '' }), `Toggled status to ${newStatus}`);
        break;
      case 'site-admin':
        setSiteAdmins(siteAdmins.map(u => u.id === userId ? { ...u, status: newStatus } : u));
        addAuditLog('Toggle Status', userId, getUserDisplayName(siteAdmins.find(u => u.id === userId) || { name: '' }), `Toggled status to ${newStatus}`);
        break;
      case 'corporate':
        setCorporateAccounts(corporateAccounts.map(u => u.id === userId ? { ...u, status: newStatus } : u));
        addAuditLog('Toggle Status', userId, getUserDisplayName(corporateAccounts.find(u => u.id === userId) || { name: '' }), `Toggled status to ${newStatus}`);
        break;
    }
    
    toast.success(`User ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`);
  };

  const handleDeleteUser = (user: AllUsers) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    const userId = user.id;
    const userName = getUserDisplayName(user);
    
    switch (user.role) {
      case 'consumer':
        setConsumers(consumers.filter(u => u.id !== userId));
        break;
      case 'warehouse_manager':
        setWarehouseManagers(warehouseManagers.filter(u => u.id !== userId));
        break;
      case 'site-admin':
        setSiteAdmins(siteAdmins.filter(u => u.id !== userId));
        break;
      case 'corporate':
        setCorporateAccounts(corporateAccounts.filter(u => u.id !== userId));
        break;
    }
    
    addAuditLog('Delete User', userId, userName, `Deleted ${getRoleName(user.role)} user`);
    toast.success('User deleted successfully');
  };

  const handleResetPassword = (userId: string) => {
    if (!confirm('Are you sure you want to reset this user\'s password?')) return;
    toast.success('Password reset email sent to user');
    addAuditLog('Reset Password', userId, getUserDisplayName(consumers.find(u => u.id === userId) || { name: '' }), `Reset password for user`);
  };

  const handleImpersonateUser = (user: AllUsers) => {
    setUserToImpersonate(user);
    setShowImpersonateDialog(true);
  };

  // Get all users combined
  const getAllUsers = (): AllUsers[] => {
    return [...consumers, ...warehouseManagers, ...siteAdmins, ...corporateAccounts];
  };

  // Apply filters
  const getFilteredUsers = (): AllUsers[] => {
    let allUsers = getAllUsers();
    
    // Filter by search term
    if (searchTerm) {
      allUsers = allUsers.filter(user => {
        const searchLower = searchTerm.toLowerCase();
        // Search by phone number as well
        if (user.phone.toLowerCase().includes(searchLower)) {
          return true;
        }
        if ('name' in user) {
          return user.name.toLowerCase().includes(searchLower) || 
                 user.email.toLowerCase().includes(searchLower);
        }
        if ('companyName' in user) {
          return user.companyName.toLowerCase().includes(searchLower) || 
                 user.companyEmail.toLowerCase().includes(searchLower) ||
                 user.contactPerson.toLowerCase().includes(searchLower);
        }
        return false;
      });
    }
    
    // Filter by role
    if (roleFilter !== 'all') {
      allUsers = allUsers.filter(user => user.role === roleFilter);
    }
    
    // Filter by status
    if (statusFilter !== 'all') {
      allUsers = allUsers.filter(user => user.status === statusFilter);
    }
    
    return allUsers;
  };

  const getRoleName = (role: string): string => {
    switch (role) {
      case 'consumer': return 'Consumer';
      case 'warehouse_manager': return 'Warehouse Manager';
      case 'site-admin': return 'Site Admin';
      case 'corporate': return 'Corporate Admin';
      default: return role;
    }
  };

  const getUserDisplayName = (user: AllUsers): string => {
    if ('companyName' in user) {
      return user.contactPerson;
    }
    return 'name' in user ? user.name : '';
  };

  const getUserEmail = (user: AllUsers): string => {
    if ('companyEmail' in user) {
      return user.companyEmail;
    }
    return user.email;
  };

  const renderUserTable = (users: AllUsers[], type: string) => {
    const filteredUsers = getFilteredUsers();
    
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Full Name</TableHead>
              <TableHead>User ID</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead>Created Date & Time</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-gray-500">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{getUserDisplayName(user)}</TableCell>
                  <TableCell>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">{user.id}</code>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{getRoleName(user.role)}</Badge>
                  </TableCell>
                  <TableCell>{getUserEmail(user)}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell className="text-sm text-gray-600">{user.createdAt}</TableCell>
                  <TableCell className="text-sm text-gray-600">{user.lastLogin}</TableCell>
                  <TableCell>
                    <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOpenEditDialog(user)}
                        title="Edit User"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteUser(user)}
                        title="Delete User"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleResetPassword(user.id)}
                        title="Reset Password"
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Lock className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleImpersonateUser(user)}
                        title="Impersonate User"
                        className="text-green-600 hover:text-green-700"
                      >
                        <UserCog className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    );
  };

  const renderAuditLogTable = () => {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>Admin Name</TableHead>
              <TableHead>Admin Email</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Target User ID</TableHead>
              <TableHead>Target User Name</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {auditLog.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-gray-500">
                  No audit log entries found
                </TableCell>
              </TableRow>
            ) : (
              auditLog.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="text-sm text-gray-600">{entry.timestamp}</TableCell>
                  <TableCell>{entry.adminName}</TableCell>
                  <TableCell>{entry.adminEmail}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{entry.action}</Badge>
                  </TableCell>
                  <TableCell>
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">{entry.targetUserId}</code>
                  </TableCell>
                  <TableCell>{entry.targetUserName}</TableCell>
                  <TableCell>{entry.details}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl">User Management</h2>
          <p className="text-gray-500">Manage users across all roles</p>
        </div>
        <Button onClick={() => setShowAddDialog(true)} style={{ backgroundColor: '#E87722' }}>
          <UserPlus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Consumers</CardTitle>
              <Users className="h-4 w-4 text-gray-500" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl">{consumers.length}</p>
            <p className="text-xs text-gray-500">
              {consumers.filter(u => u.status === 'active').length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Warehouse Managers</CardTitle>
              <Warehouse className="h-4 w-4 text-gray-500" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl">{warehouseManagers.length}</p>
            <p className="text-xs text-gray-500">
              {warehouseManagers.filter(u => u.status === 'active').length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Site Admins</CardTitle>
              <Shield className="h-4 w-4 text-gray-500" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl">{siteAdmins.length}</p>
            <p className="text-xs text-gray-500">
              {siteAdmins.filter(u => u.status === 'active').length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Corporate Accounts</CardTitle>
              <Building2 className="h-4 w-4 text-gray-500" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl">{corporateAccounts.length}</p>
            <p className="text-xs text-gray-500">
              {corporateAccounts.filter(u => u.status === 'active').length} active
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative md:col-span-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search users by name, email, or phone number..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="consumer">Consumer</SelectItem>
              <SelectItem value="warehouse_manager">Warehouse Manager</SelectItem>
              <SelectItem value="site-admin">Site Admin</SelectItem>
              <SelectItem value="corporate">Corporate Admin</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* View Toggle: Users vs Audit Log */}
      <Tabs value={activeView} onValueChange={(v) => setActiveView(v as any)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="users">
            <Users className="h-4 w-4 mr-2" />
            All Users
          </TabsTrigger>
          <TabsTrigger value="audit-log">
            <History className="h-4 w-4 mr-2" />
            Audit Log
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          {renderUserTable(getAllUsers(), 'all')}
        </TabsContent>

        <TabsContent value="audit-log" className="space-y-4">
          {renderAuditLogTable()}
        </TabsContent>
      </Tabs>

      {/* Add User Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Role</Label>
              <Select 
                value={newUserForm.role} 
                onValueChange={(value: any) => setNewUserForm({ ...newUserForm, role: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="consumer">Consumer</SelectItem>
                  <SelectItem value="warehouse_manager">Warehouse Manager</SelectItem>
                  <SelectItem value="site-admin">Site Admin</SelectItem>
                  <SelectItem value="corporate">Corporate Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {newUserForm.role === 'corporate' ? (
              <>
                <div className="space-y-2">
                  <Label>Company Name</Label>
                  <Input
                    value={newUserForm.companyName}
                    onChange={(e) => setNewUserForm({ ...newUserForm, companyName: e.target.value })}
                    placeholder="Enter company name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Company Email</Label>
                  <Input
                    type="email"
                    value={newUserForm.email}
                    onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                    placeholder="company@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Contact Person</Label>
                  <Input
                    value={newUserForm.contactPerson}
                    onChange={(e) => setNewUserForm({ ...newUserForm, contactPerson: e.target.value })}
                    placeholder="Enter contact person name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    value={newUserForm.phone}
                    onChange={(e) => setNewUserForm({ ...newUserForm, phone: e.target.value })}
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    value={newUserForm.name}
                    onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                    placeholder="Enter full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={newUserForm.email}
                    onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                    placeholder="user@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    value={newUserForm.phone}
                    onChange={(e) => setNewUserForm({ ...newUserForm, phone: e.target.value })}
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
                {newUserForm.role === 'warehouse_manager' && (
                  <div className="space-y-2">
                    <Label>Warehouse ID</Label>
                    <Input
                      value={newUserForm.warehouseId}
                      onChange={(e) => setNewUserForm({ ...newUserForm, warehouseId: e.target.value })}
                      placeholder="WH-001"
                    />
                  </div>
                )}
              </>
            )}
            
            <div className="space-y-2">
              <Label>Initial Password</Label>
              <Input
                type="password"
                value={newUserForm.password}
                onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                placeholder="Enter initial password"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddUser} style={{ backgroundColor: '#E87722' }}>
              Add User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user account information
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Role</Label>
              <Select 
                value={editUserForm.role} 
                onValueChange={(value: any) => setEditUserForm({ ...editUserForm, role: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="consumer">Consumer</SelectItem>
                  <SelectItem value="warehouse_manager">Warehouse Manager</SelectItem>
                  <SelectItem value="site-admin">Site Admin</SelectItem>
                  <SelectItem value="corporate">Corporate Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {editUserForm.role === 'corporate' ? (
              <>
                <div className="space-y-2">
                  <Label>Company Name</Label>
                  <Input
                    value={editUserForm.companyName}
                    onChange={(e) => setEditUserForm({ ...editUserForm, companyName: e.target.value })}
                    placeholder="Enter company name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Company Email</Label>
                  <Input
                    type="email"
                    value={editUserForm.email}
                    onChange={(e) => setEditUserForm({ ...editUserForm, email: e.target.value })}
                    placeholder="company@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Contact Person</Label>
                  <Input
                    value={editUserForm.contactPerson}
                    onChange={(e) => setEditUserForm({ ...editUserForm, contactPerson: e.target.value })}
                    placeholder="Enter contact person name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    value={editUserForm.phone}
                    onChange={(e) => setEditUserForm({ ...editUserForm, phone: e.target.value })}
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    value={editUserForm.name}
                    onChange={(e) => setEditUserForm({ ...editUserForm, name: e.target.value })}
                    placeholder="Enter full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={editUserForm.email}
                    onChange={(e) => setEditUserForm({ ...editUserForm, email: e.target.value })}
                    placeholder="user@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input
                    value={editUserForm.phone}
                    onChange={(e) => setEditUserForm({ ...editUserForm, phone: e.target.value })}
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
                {editUserForm.role === 'warehouse_manager' && (
                  <div className="space-y-2">
                    <Label>Warehouse ID</Label>
                    <Input
                      value={editUserForm.warehouseId}
                      onChange={(e) => setEditUserForm({ ...editUserForm, warehouseId: e.target.value })}
                      placeholder="WH-001"
                    />
                  </div>
                )}
              </>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditUser} style={{ backgroundColor: '#E87722' }}>
              Update User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Impersonate User Dialog */}
      <Dialog open={showImpersonateDialog} onOpenChange={setShowImpersonateDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Impersonate User</DialogTitle>
            <DialogDescription>
              Login as this user to debug their issues. All actions will be logged.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="p-4 border border-orange-200 bg-orange-50 rounded-lg">
              <p className="text-sm text-orange-800">
                ⚠️ Warning: Impersonation is for debugging purposes only. All actions performed while impersonating will be tracked in the audit log.
              </p>
            </div>
            <div className="space-y-2">
              <Label>User Name</Label>
              <Input
                value={userToImpersonate ? getUserDisplayName(userToImpersonate) : ''}
                readOnly
                placeholder="User Name"
              />
            </div>
            <div className="space-y-2">
              <Label>User Email</Label>
              <Input
                value={userToImpersonate ? getUserEmail(userToImpersonate) : ''}
                readOnly
                placeholder="User Email"
              />
            </div>
            <div className="space-y-2">
              <Label>User Role</Label>
              <Input
                value={userToImpersonate ? getRoleName(userToImpersonate.role) : ''}
                readOnly
                placeholder="User Role"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowImpersonateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              if (userToImpersonate) {
                const userName = getUserDisplayName(userToImpersonate);
                const userEmail = getUserEmail(userToImpersonate);
                addAuditLog('Impersonate User', userToImpersonate.id, userName, `Started impersonating user ${userName} (${userEmail})`);
                toast.success(`Now impersonating ${userName}`);
                // In production, implement actual impersonation logic here
                // Store original admin session, switch to user session, add banner indicating impersonation mode
              }
              setShowImpersonateDialog(false);
              setUserToImpersonate(null);
            }} style={{ backgroundColor: '#E87722' }}>
              Start Impersonation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}