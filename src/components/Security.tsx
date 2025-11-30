import { useState, useEffect } from "react";
import { SecurityAuth, SecurityAdmin as SecurityAdminType } from "./SecurityAuth";
import { SecurityDashboard } from "./SecurityDashboard";
import { Toaster } from "./ui/sonner";
import { toast } from "sonner";

interface SecurityProps {
  onBackToConsumer?: () => void;
}

export function Security({ onBackToConsumer }: SecurityProps) {
  const [securityAdmin, setSecurityAdmin] = useState<SecurityAdminType | null>(
    null,
  );
  const [showAuth, setShowAuth] = useState(false);

  // Check for logged in security admin on mount
  useEffect(() => {
    const storedAdmin = localStorage.getItem(
      "moyoclub_current_security_admin",
    );
    if (storedAdmin) {
      try {
        const adminData = JSON.parse(storedAdmin);
        setSecurityAdmin(adminData);
      } catch (error) {
        console.error("Error parsing stored admin:", error);
        localStorage.removeItem("moyoclub_current_security_admin");
        setShowAuth(true);
      }
    } else {
      setShowAuth(true);
    }
  }, []);

  const handleAuthSuccess = (admin: SecurityAdminType) => {
    setSecurityAdmin(admin);
    setShowAuth(false);
  };

  const handleLogout = () => {
    setSecurityAdmin(null);
    localStorage.removeItem("moyoclub_current_security_admin");
    toast.success("Logged out successfully");
    // Go back to consumer view
    if (onBackToConsumer) {
      onBackToConsumer();
    }
  };

  // Show auth if not logged in
  if (!securityAdmin || showAuth) {
    return (
      <>
        <SecurityAuth
          onLoginSuccess={handleAuthSuccess}
          onBackToConsumer={onBackToConsumer}
        />
        <Toaster />
      </>
    );
  }

  return (
    <div className="min-h-screen">
      <SecurityDashboard
        admin={securityAdmin}
        onLogout={handleLogout}
      />
      <Toaster />
    </div>
  );
}
