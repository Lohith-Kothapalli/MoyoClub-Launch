import { useState } from "react";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { LogOut, Users, ShoppingCart, Lightbulb, BarChart3, Calendar } from "lucide-react";
import { CorporateAccount } from "./CorporateAuth";
import { EmployeeManagement } from "./EmployeeManagement";
import { ProductRequestForm } from "./ProductRequestForm";
import { Badge } from "./ui/badge";
import { toast } from "sonner@2.0.3";
import logo from "figma:asset/ad4858b211b2d5b5338869cfb2610956523467f4.png";

interface CorporateDashboardProps {
  account: CorporateAccount;
  onLogout: () => void;
}

export function CorporateDashboard({ account, onLogout }: CorporateDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = () => {
    localStorage.removeItem('moyoclub_current_corporate');
    onLogout();
    toast.success('Logged out successfully');
  };

  const subscriptionEndDate = new Date(account.subscriptionStartDate);
  subscriptionEndDate.setMonth(subscriptionEndDate.getMonth() + (account.subscriptionType === 'yearly' ? 12 : 1));
  
  const daysRemaining = Math.ceil((subscriptionEndDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Moyo Club" className="h-12 w-12 object-contain" />
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-xl" style={{ color: '#A67C52' }}>moyoclub.one</span>
                <span className="text-xs text-gray-500">•</span>
                <span className="text-sm text-gray-600">{account.companyName}</span>
              </div>
              <span className="text-xs" style={{ color: '#E87722' }}>Corporate Account</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <p className="text-sm">{account.contactPerson}</p>
              <p className="text-xs text-gray-600">{account.companyEmail}</p>
            </div>
            <Button
              variant="outline"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 max-w-3xl">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="employees" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Employees
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="requests" className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Product Requests
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            {/* Overview Tab */}
            <TabsContent value="overview" className="mt-0">
              <div className="space-y-6">
                {/* Subscription Status */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Subscription Status</CardTitle>
                        <CardDescription>Your current plan and usage</CardDescription>
                      </div>
                      <Badge
                        className="text-sm px-3 py-1"
                        style={{ backgroundColor: '#E87722', color: 'white' }}
                      >
                        {account.subscriptionType === 'yearly' ? 'Annual Plan' : 'Monthly Plan'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Subscription Started</p>
                        <p className="text-lg">{new Date(account.subscriptionStartDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Renewal Date</p>
                        <p className="text-lg">{subscriptionEndDate.toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Days Remaining</p>
                        <p className="text-lg">{daysRemaining} days</p>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t">
                      <h4 className="text-sm mb-4">Company Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Contact Person</p>
                          <p className="text-sm">{account.contactPerson}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Phone</p>
                          <p className="text-sm">{account.phone}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Email</p>
                          <p className="text-sm">{account.companyEmail}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Employee Count</p>
                          <p className="text-sm">{account.employeeCount}</p>
                        </div>
                        {account.gstNumber && (
                          <div>
                            <p className="text-sm text-gray-600">GST Number</p>
                            <p className="text-sm">{account.gstNumber}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-sm text-gray-600">Address</p>
                          <p className="text-sm">{account.address}, {account.city}, {account.state} - {account.pincode}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <Users className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-2xl mb-1">{account.employeeCount}</p>
                        <p className="text-sm text-gray-600">Total Employees</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <ShoppingCart className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-2xl mb-1">0</p>
                        <p className="text-sm text-gray-600">Orders This Month</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <Calendar className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-2xl mb-1">{daysRemaining}</p>
                        <p className="text-sm text-gray-600">Days Remaining</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <Lightbulb className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-2xl mb-1">0</p>
                        <p className="text-sm text-gray-600">Product Requests</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Getting Started */}
                <Card>
                  <CardHeader>
                    <CardTitle>Getting Started</CardTitle>
                    <CardDescription>Complete these steps to get your team set up</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#E87722', color: 'white' }}>
                          1
                        </div>
                        <div className="flex-1">
                          <h4 className="mb-1">Add Employees</h4>
                          <p className="text-sm text-gray-600">Go to the Employees tab to add your team members individually or via bulk upload</p>
                          <Button
                            size="sm"
                            className="mt-2"
                            style={{ backgroundColor: '#E87722' }}
                            onClick={() => setActiveTab('employees')}
                          >
                            Manage Employees
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#A67C52', color: 'white' }}>
                          2
                        </div>
                        <div className="flex-1">
                          <h4 className="mb-1">Request Custom Products</h4>
                          <p className="text-sm text-gray-600">Can't find what you need? Submit product requests and we'll source them for you</p>
                          <Button
                            size="sm"
                            className="mt-2"
                            variant="outline"
                            onClick={() => setActiveTab('requests')}
                          >
                            Submit Request
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-300 text-white">
                          3
                        </div>
                        <div className="flex-1">
                          <h4 className="mb-1">Track Orders & Analytics</h4>
                          <p className="text-sm text-gray-600">Monitor meal consumption, order history, and employee usage patterns</p>
                          <Button
                            size="sm"
                            className="mt-2"
                            variant="outline"
                            onClick={() => setActiveTab('orders')}
                          >
                            View Orders
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Employees Tab */}
            <TabsContent value="employees" className="mt-0">
              <EmployeeManagement corporateId={account.id} companyName={account.companyName} />
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Order History</CardTitle>
                  <CardDescription>View and manage corporate orders</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg mb-2">No orders yet</h3>
                    <p className="text-gray-600 mb-4">Your order history will appear here</p>
                    <p className="text-sm text-gray-500">Add employees to the program to start placing orders</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Product Requests Tab */}
            <TabsContent value="requests" className="mt-0">
              <ProductRequestForm corporateId={account.id} companyName={account.companyName} />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
