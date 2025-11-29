import { useState, useEffect } from "react";
import { CorporateAuth, CorporateAccount } from "./CorporateAuth";
import { CorporateDashboard } from "./CorporateDashboard";
import { Toaster } from "./ui/sonner";
import { toast } from "sonner@2.0.3";

interface CorporateProps {
  onBackToConsumer?: () => void;
}

export function Corporate({ onBackToConsumer }: CorporateProps) {
  const [corporateAccount, setCorporateAccount] =
    useState<CorporateAccount | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Check for logged in corporate account on mount
  useEffect(() => {
    const storedCorporate = localStorage.getItem(
      "moyoclub_current_corporate",
    );
    if (storedCorporate) {
      try {
        const corporateData = JSON.parse(storedCorporate);
        setCorporateAccount(corporateData);
      } catch (error) {
        console.error("Error parsing stored corporate:", error);
        localStorage.removeItem("moyoclub_current_corporate");
        setIsAuthOpen(true);
      }
    } else {
      setIsAuthOpen(true);
    }
  }, []);

  const handleAuthSuccess = (account: CorporateAccount) => {
    setCorporateAccount(account);
    setIsAuthOpen(false);
  };

  const handleLogout = () => {
    setCorporateAccount(null);
    localStorage.removeItem("moyoclub_current_corporate");
    toast.success("Logged out successfully");
    // Go back to consumer view
    if (onBackToConsumer) {
      onBackToConsumer();
    }
  };

  const handleClose = () => {
    // If user closes without logging in, go back to consumer
    if (onBackToConsumer) {
      onBackToConsumer();
    }
  };

  // Show auth dialog if not logged in
  if (!corporateAccount || isAuthOpen) {
    return (
      <>
        <CorporateAuth
          isOpen={true}
          onClose={handleClose}
          onAuthSuccess={handleAuthSuccess}
        />
        <Toaster />
      </>
    );
  }

  return (
    <div className="min-h-screen">
      <CorporateDashboard
        account={corporateAccount}
        onLogout={handleLogout}
      />
      <Toaster />
    </div>
  );
}
