import { ShoppingCart, User, Menu, LogIn, Shield, Building2 } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";
import logo from "figma:asset/ad4858b211b2d5b5338869cfb2610956523467f4.png";
import { UserData } from "./Auth";

type UserRole = 'consumer' | 'warehouse' | 'site-admin' | 'corporate';

interface HeaderProps {
  onNavigate: (page: string) => void;
  cartItems: number;
  onOpenCart: () => void;
  user: UserData | null;
  onOpenAuth: (tab?: 'login' | 'signup') => void;
  onOpenProfile: () => void;
  onOpenSiteAdmin?: () => void;
  onOpenCorporate?: () => void;
  currentRole?: UserRole;
}

export function Header({ onNavigate, cartItems, onOpenCart, user, onOpenAuth, onOpenProfile, onOpenSiteAdmin, onOpenCorporate, currentRole = 'consumer' }: HeaderProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleDisplay = (role: UserRole) => {
    switch (role) {
      case 'warehouse':
        return 'Warehouse Manager';
      case 'site-admin':
        return 'Site Admin';
      case 'corporate':
        return 'Corporate Account';
      default:
        return null;
    }
  };

  const roleDisplay = getRoleDisplay(currentRole);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/80 shadow-sm">
      <div className="container mx-auto flex h-16 md:h-20 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => onNavigate('home')}>
          <img src={logo} alt="Moyo Club" className="h-12 w-12 md:h-14 md:w-14 object-contain" />
          <div className="flex flex-col">
            <span className="text-xl md:text-2xl font-semibold" style={{ color: '#A67C52' }}>moyoclub.one</span>
            {roleDisplay && (
              <span className="text-xs font-medium" style={{ color: '#E87722' }}>{roleDisplay}</span>
            )}
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <button 
            onClick={() => onNavigate('home')} 
            className="text-gray-700 hover:text-orange-600 transition-colors font-medium relative group"
          >
            Meals
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-600 group-hover:w-full transition-all duration-300" />
          </button>
          <button 
            onClick={() => {
              const productsSection = document.getElementById('products');
              productsSection?.scrollIntoView({ behavior: 'smooth' });
              // Small delay to allow scroll to complete before clicking tab
              setTimeout(() => {
                const beveragesTab = document.querySelector('[value="Beverages"]') as HTMLElement;
                beveragesTab?.click();
              }, 500);
            }}
            className="text-gray-700 hover:text-orange-600 transition-colors font-medium relative group"
          >
            Beverages
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-600 group-hover:w-full transition-all duration-300" />
          </button>
          <button 
            onClick={() => onNavigate('tracker')} 
            className="text-gray-700 hover:text-orange-600 transition-colors font-medium relative group"
          >
            Track Order
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-600 group-hover:w-full transition-all duration-300" />
          </button>
          <button 
            onClick={() => onNavigate('farmers')}
            className="text-gray-700 hover:text-orange-600 transition-colors font-medium relative group"
          >
            Our Farmers
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-600 group-hover:w-full transition-all duration-300" />
          </button>
          {/* Only show admin links when logged into those specific roles */}
          {currentRole === 'corporate' && onOpenCorporate && (
            <>
              <div className="h-4 w-px bg-gray-300" />
              <button 
                onClick={onOpenCorporate}
                className="text-gray-700 transition-colors flex items-center gap-1"
                onMouseEnter={(e) => e.currentTarget.style.color = '#E87722'}
                onMouseLeave={(e) => e.currentTarget.style.color = ''}
              >
                <Building2 className="h-4 w-4" />
                Corporate Portal
              </button>
            </>
          )}
          {currentRole === 'site-admin' && onOpenSiteAdmin && (
            <>
              <div className="h-4 w-px bg-gray-300" />
              <button 
                onClick={onOpenSiteAdmin}
                className="text-gray-700 transition-colors flex items-center gap-1"
                onMouseEnter={(e) => e.currentTarget.style.color = '#E87722'}
                onMouseLeave={(e) => e.currentTarget.style.color = ''}
              >
                <Shield className="h-4 w-4" />
                Admin Portal
              </button>
            </>
          )}
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative hover:bg-orange-50 transition-colors" onClick={onOpenCart}>
            <ShoppingCart className="h-5 w-5 md:h-6 md:w-6" style={{ color: '#A67C52' }} />
            {cartItems > 0 && (
              <Badge className="absolute -right-1 -top-1 h-5 w-5 md:h-6 md:w-6 rounded-full p-0 flex items-center justify-center text-white font-semibold shadow-md animate-pulse" style={{ backgroundColor: '#E87722' }}>
                {cartItems}
              </Badge>
            )}
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback style={{ backgroundColor: '#FEE8D6', color: '#A67C52' }}>
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onOpenProfile}>
                  <User className="mr-2 h-4 w-4" />
                  <span>My Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onNavigate('tracker')}>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  <span>My Orders</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onOpenAuth('login')}
                className="hidden md:flex"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </Button>
              <Button 
                size="sm"
                style={{ backgroundColor: '#E87722' }}
                className="hover:opacity-90 hidden md:flex"
                onClick={() => onOpenAuth('signup')}
              >
                Sign Up
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => onOpenAuth('login')}
                className="md:hidden"
              >
                <User className="h-5 w-5" />
              </Button>
            </>
          )}

          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}