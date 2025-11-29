import { useState, useEffect } from "react";
import { Auth, UserData } from "./Auth";
import { SingleProductPurchase } from "./SingleProductPurchase";
import { Toaster } from "./ui/sonner";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { LogOut, User } from "lucide-react";
import { removeAuthToken, apiRequest, API_ENDPOINTS, getAuthToken } from "../config/api";
import { analytics, trackPageView } from "../utils/analytics";

export function Consumer() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authDefaultTab, setAuthDefaultTab] = useState<"login" | "signup">("signup");
  const [user, setUser] = useState<UserData | null>(null);

  // Check for logged in user on mount and validate token
  useEffect(() => {
    const validateAndRestoreSession = async () => {
      const storedUser = localStorage.getItem("moyoclub_current_user");
      const token = getAuthToken();
      
      if (storedUser && token) {
        try {
          // Validate token with backend
          const response = await apiRequest(API_ENDPOINTS.AUTH.ME, {
            method: 'GET',
          });

          if (response.success && response.user) {
            // Token is valid, restore user session
            setUser(response.user);
            localStorage.setItem("moyoclub_current_user", JSON.stringify(response.user));

            // Welcome back message
            setTimeout(() => {
              toast.success(`Welcome back, ${response.user.name.split(" ")[0]}!`, {
                description: "Ready to order your premium nutrition box?",
                duration: 3000,
              });
            }, 500);
            return;
          }
        } catch (error: any) {
          // Token is invalid or expired
          console.log("Token validation failed:", error.message);
          localStorage.removeItem("moyoclub_current_user");
          removeAuthToken();
        }
      }

      // No valid session found, show signup prompt
      setTimeout(() => {
        setIsAuthOpen(true);
        toast("Welcome to MoyoClub! 🌱", {
          description: "Sign up to place your first order",
          duration: 5000,
        });
      }, 1000);
    };

    validateAndRestoreSession();
  }, []);

  const handleAuthSuccess = (userData: UserData, token: string) => {
    setUser(userData);
    setIsAuthOpen(false);
    localStorage.setItem("moyoclub_current_user", JSON.stringify(userData));

    toast.success(`Welcome, ${userData.name.split(" ")[0]}!`, {
      description: "You can now place your order",
      duration: 3000,
    });
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("moyoclub_current_user");
    removeAuthToken();
    analytics.logout();
    toast.success("Logged out successfully", {
      description: "Come back soon!",
      duration: 3000,
    });
  };

  // Track page view on mount
  useEffect(() => {
    trackPageView(window.location.pathname);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster />

      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/images/logo.png"
              alt="MoyoClub Logo"
              className="h-12 w-12 object-contain"
            />
            <div>
              <h1 className="text-2xl" style={{ color: "#E87722" }}>
                MoyoClub
              </h1>
              <p className="text-xs text-gray-600">Farm-Fresh Premium Nutrition</p>
            </div>
          </div>

          {user ? (
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm">{user.name}</p>
                <p className="text-xs text-gray-600">{user.email}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                style={{ borderColor: "#E87722", color: "#E87722" }}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => setIsAuthOpen(true)}
              style={{ backgroundColor: "#E87722" }}
            >
              <User className="h-4 w-4 mr-2" />
              Sign Up / Login
            </Button>
          )}
        </div>
      </header>

      {/* Main Content */}
      {user ? (
        <SingleProductPurchase user={user} />
      ) : (
        <div className="container max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="bg-white rounded-lg p-12 shadow-sm">
            <div className="flex justify-center mb-6">
              <img
                src="/images/logo.png"
                alt="MoyoClub Logo"
                className="h-24 w-24 object-contain"
              />
            </div>
            <h2 className="text-3xl mb-4" style={{ color: "#E87722" }}>
              Welcome to MoyoClub
            </h2>
            <p className="text-gray-600 mb-8">
              Please sign up or login to start your order
            </p>
            <Button
              onClick={() => setIsAuthOpen(true)}
              size="lg"
              style={{ backgroundColor: "#E87722" }}
            >
              <User className="h-5 w-5 mr-2" />
              Get Started
            </Button>
          </div>
        </div>
      )}

      {/* Auth Dialog */}
      <Auth
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={handleAuthSuccess}
        defaultTab={authDefaultTab}
      />
    </div>
  );
}