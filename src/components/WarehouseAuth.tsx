import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Mail, Lock, Loader2, Warehouse } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { ForgotPassword } from "./ForgotPassword";

export interface WarehouseManager {
  id: string;
  name: string;
  email: string;
  role: 'warehouse_manager';
  warehouseId: string;
  createdAt: string;
}

interface WarehouseAuthProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (manager: WarehouseManager) => void;
}

export function WarehouseAuth({ isOpen, onClose, onAuthSuccess }: WarehouseAuthProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (field: string, value: string) => {
    setLoginData(prev => ({ ...prev, [field]: value }));
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleLogin = async () => {
    const { email, password } = loginData;

    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Check warehouse managers in localStorage
      const storedManagers = JSON.parse(localStorage.getItem('moyoclub_warehouse_managers') || '{}');
      const manager = storedManagers[email];

      if (manager && manager.password === password) {
        const { password: _, ...managerData } = manager;
        localStorage.setItem('moyoclub_current_warehouse_manager', JSON.stringify(managerData));
        
        toast.success('Warehouse Login Successful!', {
          description: `Welcome, ${managerData.name}`,
          duration: 3000,
        });
        
        onAuthSuccess(managerData);
        onClose();
        setLoginData({ email: '', password: '' });
      } else {
        toast.error('Invalid credentials');
      }
      
      setIsLoading(false);
    }, 1000);
  };

  // Initialize demo warehouse manager
  const initializeDemoManager = () => {
    const demoManager = {
      id: 'wm_demo_001',
      name: 'Demo Manager',
      email: 'warehouse@moyoclub.one',
      password: 'warehouse123',
      role: 'warehouse_manager',
      warehouseId: 'wh_mumbai_001',
      createdAt: new Date().toISOString()
    };

    const storedManagers = JSON.parse(localStorage.getItem('moyoclub_warehouse_managers') || '{}');
    if (!storedManagers['warehouse@moyoclub.one']) {
      storedManagers['warehouse@moyoclub.one'] = demoManager;
      localStorage.setItem('moyoclub_warehouse_managers', JSON.stringify(storedManagers));
    }

    setLoginData({
      email: 'warehouse@moyoclub.one',
      password: 'warehouse123'
    });

    toast.success('Demo credentials loaded', {
      description: 'Click Login to continue',
      duration: 2000,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Warehouse className="h-6 w-6" style={{ color: '#E87722' }} />
            <DialogTitle className="text-2xl">Warehouse Manager Login</DialogTitle>
          </div>
          <DialogDescription>
            Access the warehouse management system to manage inventory and orders
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div>
            <Label htmlFor="warehouse-email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="warehouse-email"
                type="email"
                placeholder="warehouse@moyoclub.one"
                className="pl-10"
                value={loginData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="warehouse-password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="warehouse-password"
                type="password"
                placeholder="••••••••"
                className="pl-10"
                value={loginData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
          </div>

          <Button
            className="w-full"
            size="lg"
            style={{ backgroundColor: '#E87722' }}
            onClick={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              'Login to Warehouse System'
            )}
          </Button>

          <div className="text-center text-sm text-gray-600">
            <button
              className="hover:underline"
              style={{ color: '#E87722' }}
              onClick={() => setShowForgotPassword(true)}
            >
              Forgot Password?
            </button>
          </div>

          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-800 mb-2">
              <strong>Demo Credentials:</strong>
            </p>
            <p className="text-xs text-blue-700 mb-1">Email: warehouse@moyoclub.one</p>
            <p className="text-xs text-blue-700 mb-2">Password: warehouse123</p>
            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs"
              onClick={initializeDemoManager}
            >
              Load Demo Credentials
            </Button>
          </div>
        </div>
      </DialogContent>

      <ForgotPassword 
        isOpen={showForgotPassword} 
        onClose={() => setShowForgotPassword(false)} 
      />
    </Dialog>
  );
}