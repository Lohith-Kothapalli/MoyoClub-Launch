import { useState, useEffect } from "react";
import { WarehouseAuth, WarehouseManager } from "./WarehouseAuth";
import { WarehouseDashboard } from "./WarehouseDashboard";
import { Toaster } from "./ui/sonner";
import { toast } from "sonner@2.0.3";

interface WarehouseProps {
  onBackToConsumer?: () => void;
}

export function Warehouse({ onBackToConsumer }: WarehouseProps) {
  const [warehouseManager, setWarehouseManager] =
    useState<WarehouseManager | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Check for logged in warehouse manager on mount
  useEffect(() => {
    const storedManager = localStorage.getItem(
      "moyoclub_current_warehouse_manager",
    );
    if (storedManager) {
      try {
        const managerData = JSON.parse(storedManager);
        setWarehouseManager(managerData);
      } catch (error) {
        console.error("Error parsing stored manager:", error);
        localStorage.removeItem(
          "moyoclub_current_warehouse_manager",
        );
        setIsAuthOpen(true);
      }
    } else {
      setIsAuthOpen(true);
    }
  }, []);

  const handleAuthSuccess = (manager: WarehouseManager) => {
    setWarehouseManager(manager);
    setIsAuthOpen(false);
  };

  const handleLogout = () => {
    setWarehouseManager(null);
    localStorage.removeItem("moyoclub_current_warehouse_manager");
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
  if (!warehouseManager || isAuthOpen) {
    return (
      <>
        <WarehouseAuth
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
      <WarehouseDashboard
        manager={warehouseManager}
        onLogout={handleLogout}
      />
      <Toaster />
    </div>
  );
}
