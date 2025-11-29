import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { ShieldCheck, AlertCircle } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { ForgotPassword } from "./ForgotPassword";

export interface SecurityAdmin {
  email: string;
  name: string;
  role: 'security-admin';
  accessLevel: 'super-admin';
}

interface SecurityAuthProps {
  onLoginSuccess: (admin: SecurityAdmin) => void;
  onBackToConsumer?: () => void;
}

// Demo credentials - replace with real authentication in production
const SECURITY_ADMIN_CREDENTIALS = {
  email: 'security@moyoclub.one',
  password: 'security123',
  name: 'Security Administrator'
};

export function SecurityAuth({ onLoginSuccess, onBackToConsumer }: SecurityAuthProps) {
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
    if (email === SECURITY_ADMIN_CREDENTIALS.email && password === SECURITY_ADMIN_CREDENTIALS.password) {
      const admin: SecurityAdmin = {
        email: SECURITY_ADMIN_CREDENTIALS.email,
        name: SECURITY_ADMIN_CREDENTIALS.name,
        role: 'security-admin',
        accessLevel: 'super-admin'
      };

      // Store in localStorage
      localStorage.setItem('moyoclub_current_security_admin', JSON.stringify(admin));

      toast.success('Security Admin login successful!');
      onLoginSuccess(admin);
    } else {
      setError('Invalid email or password');
      toast.error('Invalid credentials');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-red-50 to-white p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center bg-red-100">
              <ShieldCheck className="h-8 w-8 text-red-600" />
            </div>
          </div>
          <CardTitle className="text-2xl">Security Admin Login</CardTitle>
          <CardDescription>
            Access user management and security administration
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
                placeholder="security@moyoclub.one"
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
              className="w-full bg-red-600 hover:bg-red-700"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In as Security Admin'}
            </Button>

            <div className="text-center text-sm text-gray-600">
              <button
                type="button"
                className="hover:underline text-red-600"
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
              <p className="text-xs text-gray-700">Email: security@moyoclub.one</p>
              <p className="text-xs text-gray-700">Password: security123</p>
            </div>

            <p className="text-xs text-center text-gray-500 mt-4">
              Security admin access is restricted to authorized personnel only
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper function to check if user is logged in
export function getSecurityAdmin(): SecurityAdmin | null {
  const stored = localStorage.getItem('moyoclub_current_security_admin');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }
  return null;
}