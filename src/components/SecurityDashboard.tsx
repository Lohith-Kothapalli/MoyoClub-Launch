import { useState } from "react";
import { SecurityAdmin } from "./SecurityAuth";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { UserManagement } from "./UserManagement";
import { ShieldCheck, LogOut, Users, Activity, AlertTriangle, Settings } from "lucide-react";
import { BRAND_COLORS } from "../constants";

interface SecurityDashboardProps {
  admin: SecurityAdmin;
  onLogout: () => void;
}

export function SecurityDashboard({ admin, onLogout }: SecurityDashboardProps) {
  const [activeTab, setActiveTab] = useState<'users' | 'activity' | 'security' | 'settings'>('users');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-red-100">
                <ShieldCheck className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h1 className="text-xl">Security Administration</h1>
                <p className="text-sm text-gray-500">{admin.name} • {admin.email}</p>
              </div>
            </div>
            <Button variant="outline" onClick={onLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-6">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="space-y-6">
          <TabsList>
            <TabsTrigger value="users">
              <Users className="h-4 w-4 mr-2" />
              User Management
            </TabsTrigger>
            <TabsTrigger value="activity">
              <Activity className="h-4 w-4 mr-2" />
              Activity Logs
            </TabsTrigger>
            <TabsTrigger value="security">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Security Alerts
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <UserManagement />
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <ActivityItem
                    user="Priya Sharma"
                    action="Logged in"
                    time="2 minutes ago"
                    type="login"
                  />
                  <ActivityItem
                    user="Rahul Verma"
                    action="Placed order #ORD-12345"
                    time="15 minutes ago"
                    type="order"
                  />
                  <ActivityItem
                    user="Admin (Site)"
                    action="Updated product inventory"
                    time="1 hour ago"
                    type="admin"
                  />
                  <ActivityItem
                    user="Warehouse Manager"
                    action="Updated delivery status"
                    time="2 hours ago"
                    type="warehouse"
                  />
                  <ActivityItem
                    user="TechCorp India"
                    action="Added 5 new employees"
                    time="3 hours ago"
                    type="corporate"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Failed Login Attempts</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl">3</p>
                  <p className="text-xs text-gray-500">Last 24 hours</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Suspicious Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl">0</p>
                  <p className="text-xs text-gray-500">Last 7 days</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Password Resets</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl">12</p>
                  <p className="text-xs text-gray-500">Last 30 days</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Security Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <SecurityAlert
                    title="Multiple failed login attempts"
                    description="IP: 192.168.1.100 attempted to login 3 times"
                    severity="medium"
                    time="10 minutes ago"
                  />
                  <SecurityAlert
                    title="New device login"
                    description="User 'priya@example.com' logged in from new device"
                    severity="low"
                    time="2 hours ago"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-sm">Password Policy</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm">Minimum Length: 8 characters</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm">Password Expiry: 90 days</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm">Failed Attempts Limit: 5</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <p className="text-sm">Session Timeout: 30 minutes</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm">Two-Factor Authentication</h3>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-gray-600">
                      2FA is currently disabled for all users. Enable to add an extra layer of security.
                    </p>
                    <Button className="mt-4" variant="outline">
                      Enable 2FA
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm">API Access</h3>
                  <div className="p-4 border rounded-lg">
                    <p className="text-sm text-gray-600">
                      Manage API keys and access tokens for system integrations.
                    </p>
                    <Button className="mt-4" variant="outline">
                      Manage API Keys
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

interface ActivityItemProps {
  user: string;
  action: string;
  time: string;
  type: 'login' | 'order' | 'admin' | 'warehouse' | 'corporate';
}

function ActivityItem({ user, action, time, type }: ActivityItemProps) {
  const colors = {
    login: 'bg-green-100 text-green-600',
    order: 'bg-blue-100 text-blue-600',
    admin: 'bg-orange-100 text-orange-600',
    warehouse: 'bg-purple-100 text-purple-600',
    corporate: 'bg-indigo-100 text-indigo-600'
  };

  return (
    <div className="flex items-center gap-4 p-3 border rounded-lg">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${colors[type]}`}>
        {type === 'login' && <Users className="h-5 w-5" />}
        {type === 'order' && <Activity className="h-5 w-5" />}
        {type === 'admin' && <ShieldCheck className="h-5 w-5" />}
        {type === 'warehouse' && <Activity className="h-5 w-5" />}
        {type === 'corporate' && <Users className="h-5 w-5" />}
      </div>
      <div className="flex-1">
        <p className="text-sm"><span className="font-medium">{user}</span> {action}</p>
        <p className="text-xs text-gray-500">{time}</p>
      </div>
    </div>
  );
}

interface SecurityAlertProps {
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  time: string;
}

function SecurityAlert({ title, description, severity, time }: SecurityAlertProps) {
  const colors = {
    low: 'bg-yellow-50 border-yellow-200',
    medium: 'bg-orange-50 border-orange-200',
    high: 'bg-red-50 border-red-200'
  };

  const badgeColors = {
    low: 'bg-yellow-100 text-yellow-800',
    medium: 'bg-orange-100 text-orange-800',
    high: 'bg-red-100 text-red-800'
  };

  return (
    <div className={`p-4 border rounded-lg ${colors[severity]}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="h-4 w-4" />
            <h4 className="text-sm">{title}</h4>
            <span className={`text-xs px-2 py-0.5 rounded ${badgeColors[severity]}`}>
              {severity.toUpperCase()}
            </span>
          </div>
          <p className="text-sm text-gray-600">{description}</p>
          <p className="text-xs text-gray-500 mt-1">{time}</p>
        </div>
        <Button size="sm" variant="outline">
          Review
        </Button>
      </div>
    </div>
  );
}
