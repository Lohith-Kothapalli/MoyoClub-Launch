import { useState } from "react";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { LogOut, Package, BarChart3, Truck } from "lucide-react";
import { WarehouseManager } from "./WarehouseAuth";
import { OrderManagement } from "./OrderManagement";
import { InventoryManagement } from "./InventoryManagement";
import { DeliveryAssignment } from "./DeliveryAssignment";
import { toast } from "sonner@2.0.3";
import logo from "figma:asset/ad4858b211b2d5b5338869cfb2610956523467f4.png";

interface WarehouseDashboardProps {
  manager: WarehouseManager;
  onLogout: () => void;
}

export function WarehouseDashboard({ manager, onLogout }: WarehouseDashboardProps) {
  const [activeTab, setActiveTab] = useState('delivery');

  const handleLogout = () => {
    localStorage.removeItem('moyoclub_current_warehouse_manager');
    onLogout();
    toast.success('Logged out successfully');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Moyo Club" className="h-12 w-12 object-contain" />
            <div className="flex flex-col">
              <span className="text-xl" style={{ color: '#A67C52' }}>moyoclub.one</span>
              <span className="text-xs" style={{ color: '#E87722' }}>Warehouse Manager</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <p className="text-sm">{manager.name}</p>
              <p className="text-xs text-gray-600">{manager.email}</p>
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
        <div className="mb-6">
          <h2 className="text-3xl text-gray-900 mb-2">Warehouse Dashboard</h2>
          <p className="text-gray-600">
            Manage inventory levels and process customer orders
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 max-w-2xl">
            <TabsTrigger value="delivery" className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Delivery Assignment
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="inventory" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Inventory
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="delivery" className="mt-0">
              <DeliveryAssignment />
            </TabsContent>

            <TabsContent value="orders" className="mt-0">
              <OrderManagement />
            </TabsContent>

            <TabsContent value="inventory" className="mt-0">
              <InventoryManagement />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
