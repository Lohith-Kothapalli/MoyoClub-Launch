import { Button } from "./ui/button";
import { LogOut, Layout } from "lucide-react";
import { SiteAdmin } from "./SiteAdminAuth";
import { ContentManagement } from "./ContentManagement";
import { toast } from "sonner@2.0.3";
import logo from "figma:asset/ad4858b211b2d5b5338869cfb2610956523467f4.png";

interface SiteAdminDashboardProps {
  admin: SiteAdmin;
  onLogout: () => void;
}

export function SiteAdminDashboard({ admin, onLogout }: SiteAdminDashboardProps) {
  const handleLogout = () => {
    localStorage.removeItem('moyoclub_current_site_admin');
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
              <span className="text-xs" style={{ color: '#E87722' }}>Site Admin</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <p className="text-sm">{admin.name}</p>
              <p className="text-xs text-gray-600">{admin.email}</p>
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
          <div className="flex items-center gap-3 mb-2">
            <Layout className="h-8 w-8" style={{ color: '#E87722' }} />
            <h2 className="text-3xl text-gray-900">Site Content Management</h2>
          </div>
          <p className="text-gray-600">
            Customize the content and images on the consumer-facing homepage
          </p>
        </div>

        {/* Content Management Component */}
        <ContentManagement />
      </div>
    </div>
  );
}
