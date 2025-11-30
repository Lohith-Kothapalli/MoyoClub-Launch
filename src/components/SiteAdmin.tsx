import { useState, useEffect } from "react";
import { SiteAdminAuth, SiteAdmin as SiteAdminType } from "./SiteAdminAuth";
import { SiteAdminDashboard } from "./SiteAdminDashboard";
import { Toaster } from "./ui/sonner";
import { toast } from "sonner";

interface SiteAdminProps {
  onBackToConsumer?: () => void;
}

export function SiteAdmin({ onBackToConsumer }: SiteAdminProps) {
  const [siteAdmin, setSiteAdmin] = useState<SiteAdminType | null>(
    null,
  );
  const [showAuth, setShowAuth] = useState(false);

  // Check for logged in site admin on mount
  useEffect(() => {
    const storedAdmin = localStorage.getItem(
      "moyoclub_current_site_admin",
    );
    if (storedAdmin) {
      try {
        const adminData = JSON.parse(storedAdmin);
        setSiteAdmin(adminData);
      } catch (error) {
        console.error("Error parsing stored admin:", error);
        localStorage.removeItem("moyoclub_current_site_admin");
        setShowAuth(true);
      }
    } else {
      setShowAuth(true);
    }
  }, []);

  const handleAuthSuccess = (admin: SiteAdminType) => {
    setSiteAdmin(admin);
    setShowAuth(false);
  };

  const handleLogout = () => {
    setSiteAdmin(null);
    localStorage.removeItem("moyoclub_current_site_admin");
    toast.success("Logged out successfully");
    // Go back to consumer view
    if (onBackToConsumer) {
      onBackToConsumer();
    }
  };

  // Show auth if not logged in
  if (!siteAdmin || showAuth) {
    return (
      <>
        <SiteAdminAuth
          onLoginSuccess={handleAuthSuccess}
          onBackToConsumer={onBackToConsumer}
        />
        <Toaster />
      </>
    );
  }

  return (
    <div className="min-h-screen">
      <SiteAdminDashboard
        admin={siteAdmin}
        onLogout={handleLogout}
      />
      <Toaster />
    </div>
  );
}
