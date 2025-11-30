import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Shield, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { ForgotPassword } from "./ForgotPassword";

export interface SiteAdmin {
  email: string;
  name: string;
  role: 'site-admin';
}

interface SiteAdminAuthProps {
  onLoginSuccess: (admin: SiteAdmin) => void;
  onBackToConsumer?: () => void;
}

// Demo credentials - replace with real authentication in production
const SITE_ADMIN_CREDENTIALS = {
  email: 'admin@moyoclub.one',
  password: 'admin123',
  name: 'Site Administrator'
};

export function SiteAdminAuth({ onLoginSuccess, onBackToConsumer }: SiteAdminAuthProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Validate credentials
    if (email === SITE_ADMIN_CREDENTIALS.email && password === SITE_ADMIN_CREDENTIALS.password) {
      const admin: SiteAdmin = {
        email: SITE_ADMIN_CREDENTIALS.email,
        name: SITE_ADMIN_CREDENTIALS.name,
        role: 'site-admin'
      };

      // Store in localStorage
      localStorage.setItem('moyoclub_current_site_admin', JSON.stringify(admin));

      toast.success('Site Admin login successful!');
      onLoginSuccess(admin);
    } else {
      setError('Invalid email or password');
      toast.error('Invalid credentials');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50 to-white p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: '#FEE8D6' }}>
              <Shield className="h-8 w-8" style={{ color: '#E87722' }} />
            </div>
          </div>
          <CardTitle className="text-2xl">Site Admin Login</CardTitle>
          <CardDescription>
            Access content management and site configuration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@moyoclub.one"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              style={{ backgroundColor: '#E87722' }}
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In as Site Admin'}
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

            {onBackToConsumer && (
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={onBackToConsumer}
                disabled={isLoading}
              >
                Back to Home
              </Button>
            )}

            {/* Demo credentials hint */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-600 mb-2">Demo Credentials:</p>
              <p className="text-xs text-gray-700">Email: admin@moyoclub.one</p>
              <p className="text-xs text-gray-700">Password: admin123</p>
            </div>

            <p className="text-xs text-center text-gray-500 mt-4">
              Site admin access is restricted to authorized personnel only
            </p>
          </form>
        </CardContent>
      </Card>
      
      <ForgotPassword 
        isOpen={showForgotPassword} 
        onClose={() => setShowForgotPassword(false)} 
      />
    </div>
  );
}

// Helper function to check if user is logged in
export function getSiteAdmin(): SiteAdmin | null {
  const stored = localStorage.getItem('moyoclub_current_site_admin');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }
  return null;
}