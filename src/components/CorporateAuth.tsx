import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Building2, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { ForgotPassword } from "./ForgotPassword";

export interface CorporateAccount {
  id: string;
  companyName: string;
  companyEmail: string;
  contactPerson: string;
  phone: string;
  gstNumber?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  employeeCount: number;
  subscriptionType: 'monthly' | 'yearly';
  subscriptionStartDate: string;
  role: 'corporate';
}

interface CorporateAuthProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (account: CorporateAccount) => void;
}

// Demo corporate account
const DEMO_CORPORATE = {
  companyEmail: 'admin@techcorp.com',
  password: 'corporate123',
  companyName: 'TechCorp India',
  contactPerson: 'Rajesh Kumar',
  phone: '+91 98765 43210'
};

export function CorporateAuth({ isOpen, onClose, onAuthSuccess }: CorporateAuthProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  
  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Signup state
  const [companyName, setCompanyName] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [employeeCount, setEmployeeCount] = useState('');
  const [subscriptionType, setSubscriptionType] = useState<'monthly' | 'yearly'>('monthly');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 500));

    // Check demo credentials
    if (loginEmail === DEMO_CORPORATE.companyEmail && loginPassword === DEMO_CORPORATE.password) {
      const corporateAccount: CorporateAccount = {
        id: 'corp_demo_001',
        companyName: DEMO_CORPORATE.companyName,
        companyEmail: DEMO_CORPORATE.companyEmail,
        contactPerson: DEMO_CORPORATE.contactPerson,
        phone: DEMO_CORPORATE.phone,
        gstNumber: '27AABCU9603R1ZX',
        address: 'Tech Park, Whitefield',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560066',
        employeeCount: 150,
        subscriptionType: 'yearly',
        subscriptionStartDate: new Date().toISOString(),
        role: 'corporate'
      };

      localStorage.setItem('moyoclub_current_corporate', JSON.stringify(corporateAccount));
      toast.success(`Welcome back, ${corporateAccount.companyName}!`);
      onAuthSuccess(corporateAccount);
      onClose();
    } else {
      // Check if account exists in localStorage
      const accounts = JSON.parse(localStorage.getItem('moyoclub_corporate_accounts') || '[]');
      const account = accounts.find((acc: any) => 
        acc.companyEmail === loginEmail && acc.password === loginPassword
      );

      if (account) {
        const { password: _, ...accountWithoutPassword } = account;
        localStorage.setItem('moyoclub_current_corporate', JSON.stringify(accountWithoutPassword));
        toast.success(`Welcome back, ${account.companyName}!`);
        onAuthSuccess(accountWithoutPassword);
        onClose();
      } else {
        setError('Invalid email or password');
        toast.error('Invalid credentials');
      }
    }

    setIsLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (!employeeCount || parseInt(employeeCount) < 1) {
      setError('Please enter a valid employee count');
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const corporateId = `corp_${Date.now()}`;
    const corporateAccount: CorporateAccount = {
      id: corporateId,
      companyName,
      companyEmail,
      contactPerson,
      phone,
      gstNumber,
      address,
      city,
      state,
      pincode,
      employeeCount: parseInt(employeeCount),
      subscriptionType,
      subscriptionStartDate: new Date().toISOString(),
      role: 'corporate'
    };

    // Save account with password
    const accounts = JSON.parse(localStorage.getItem('moyoclub_corporate_accounts') || '[]');
    accounts.push({ ...corporateAccount, password });
    localStorage.setItem('moyoclub_corporate_accounts', JSON.stringify(accounts));

    // Save current session
    localStorage.setItem('moyoclub_current_corporate', JSON.stringify(corporateAccount));

    toast.success('Corporate account created successfully!', {
      description: 'Welcome to MoyoClub Corporate Program'
    });

    onAuthSuccess(corporateAccount);
    onClose();
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FEE8D6' }}>
                <Building2 className="h-6 w-6" style={{ color: '#E87722' }} />
              </div>
              <div>
                <CardTitle className="text-2xl">Corporate Account</CardTitle>
                <CardDescription>Bulk subscriptions for your team</CardDescription>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'login' | 'signup')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Create Account</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4 mt-4">
              {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Company Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="admin@yourcompany.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  style={{ backgroundColor: '#E87722' }}
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>

                <div className="text-center text-sm text-gray-600">
                  <button
                    type="button"
                    className="hover:underline"
                    style={{ color: '#E87722' }}
                    onClick={() => setShowForgotPassword(true)}
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* Demo credentials */}
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-xs text-gray-600 mb-2">Demo Corporate Account:</p>
                  <p className="text-xs text-gray-700">Email: admin@techcorp.com</p>
                  <p className="text-xs text-gray-700">Password: corporate123</p>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4 mt-4">
              {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <form onSubmit={handleSignup} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company-name">Company Name *</Label>
                    <Input
                      id="company-name"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company-email">Company Email *</Label>
                    <Input
                      id="company-email"
                      type="email"
                      value={companyEmail}
                      onChange={(e) => setCompanyEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact-person">Contact Person *</Label>
                    <Input
                      id="contact-person"
                      value={contactPerson}
                      onChange={(e) => setContactPerson(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gst">GST Number (Optional)</Label>
                    <Input
                      id="gst"
                      value={gstNumber}
                      onChange={(e) => setGstNumber(e.target.value)}
                      placeholder="27AABCU9603R1ZX"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="employee-count">Number of Employees *</Label>
                    <Input
                      id="employee-count"
                      type="number"
                      min="1"
                      value={employeeCount}
                      onChange={(e) => setEmployeeCount(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Office Address *</Label>
                  <Input
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pincode">Pincode *</Label>
                    <Input
                      id="pincode"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Subscription Type *</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      className={`p-4 border-2 rounded-lg text-left transition-all ${
                        subscriptionType === 'monthly'
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSubscriptionType('monthly')}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">Monthly</span>
                        {subscriptionType === 'monthly' && (
                          <CheckCircle2 className="h-5 w-5 text-orange-500" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600">Flexible 30-day plan</p>
                    </button>

                    <button
                      type="button"
                      className={`p-4 border-2 rounded-lg text-left transition-all ${
                        subscriptionType === 'yearly'
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSubscriptionType('yearly')}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">Yearly</span>
                        {subscriptionType === 'yearly' && (
                          <CheckCircle2 className="h-5 w-5 text-orange-500" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600">Save 20% annually</p>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password *</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  style={{ backgroundColor: '#E87722' }}
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating Account...' : 'Create Corporate Account'}
                </Button>

                <p className="text-xs text-center text-gray-500">
                  By signing up, you agree to our Terms of Service and Privacy Policy
                </p>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <ForgotPassword 
        isOpen={showForgotPassword} 
        onClose={() => setShowForgotPassword(false)} 
      />
    </div>
  );
}