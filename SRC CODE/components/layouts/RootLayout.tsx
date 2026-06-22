import { useEffect, useState } from "react";
import { Outlet, useNavigate, Link, useLocation } from "react-router";
import { authService } from "../../services/auth";
import { useOnlineStatus } from "../../hooks/useOnlineStatus";
import { Home, Ticket, History, User, Wallet, LogOut, Bell, Menu, Gift, Users, HelpCircle, Settings } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet";
import { toast } from "sonner";

const PRIMARY = "#1a56db";
const ORANGE  = "#ff5500";

// Full chrome hidden (booking flow pages provide their own header + no bottom nav)
const BOOKING_FLOW_PATHS = ["/app/search", "/app/bus/", "/app/booking-details", "/app/payment"];
const isBookingFlow = (path: string) =>
  BOOKING_FLOW_PATHS.some(p => path === p || path.startsWith(p));

// Header-only hidden (tab pages provide their own inline title, but keep bottom nav)
const NO_HEADER_PATHS = ["/app/tickets", "/app/history", "/app/wallet"];
const isNoHeader = (path: string) =>
  NO_HEADER_PATHS.some(p => path === p || path.startsWith(p));

export function RootLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [notificationCount] = useState(2);
  const hideChrome    = isBookingFlow(location.pathname);
  const hideHeaderOnly = !hideChrome && isNoHeader(location.pathname);
  useOnlineStatus();

  useEffect(() => {
    if (!authService.isAuthenticated()) navigate("/login");
  }, [navigate]);

  const handleLogout = () => {
    authService.logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const navItems = [
    { icon: Home,    label: "Home",    path: "/app" },
    { icon: Ticket,  label: "Tickets", path: "/app/tickets" },
    { icon: History, label: "History", path: "/app/history" },
    { icon: Wallet,  label: "Wallet",  path: "/app/wallet" },
    { icon: User,    label: "Profile", path: "/app/profile" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* ── White header — hidden on booking flow AND no-header tab pages ── */}
      {!hideChrome && !hideHeaderOnly && <header className="bg-white border-b border-[#dde5f4] shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Hamburger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-gray-600 hover:bg-blue-50">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
                <SheetDescription>Access features and settings</SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-1">
                {[
                  { icon: Users,      label: "Saved Passengers", path: "/app/passengers" },
                  { icon: Gift,       label: "Refer & Earn",     path: "/app/refer" },
                  { icon: HelpCircle, label: "Help & Support",   path: "/app/help" },
                  { icon: Settings,   label: "Settings",         path: "/app/settings" },
                ].map(item => (
                  <Button key={item.path} variant="ghost" className="w-full justify-start" onClick={() => navigate(item.path)}>
                    <item.icon className="w-4 h-4 mr-3" style={{ color: PRIMARY }} />{item.label}
                  </Button>
                ))}
                <div className="border-t pt-2 mt-2">
                  <Button variant="ghost" className="w-full justify-start text-red-600" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-3" />Logout
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo — matches image: bus icon + GoBus text in blue */}
          <button
            className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5"
            onClick={() => navigate("/app")}
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: PRIMARY }}>
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                <rect x="2" y="6" width="20" height="13" rx="3"/>
                <path d="M2 13h20" stroke="white" strokeWidth="1.2" fill="none"/>
                <rect x="4" y="8.5" width="4.5" height="3" rx="1" fill="#1a56db"/>
                <rect x="15.5" y="8.5" width="4.5" height="3" rx="1" fill="#1a56db"/>
                <circle cx="6" cy="21" r="2" fill="#1a56db"/>
                <circle cx="18" cy="21" r="2" fill="#1a56db"/>
              </svg>
            </div>
            <span className="font-black text-xl tracking-tight" style={{ color: PRIMARY }}>GoBus</span>
          </button>

          {/* Right — India badge + Bell */}
          <div className="flex items-center gap-1">
            <span className="text-xs font-semibold text-gray-500 border border-gray-200 rounded px-2 py-0.5 hidden sm:block">India ▾</span>
            <Button variant="ghost" size="icon" className="relative text-gray-600 hover:bg-blue-50" onClick={() => navigate("/app/notifications")}>
              <Bell className="w-5 h-5" />
              {notificationCount > 0 && (
                <Badge className="absolute -top-1 -right-1 w-4 h-4 p-0 flex items-center justify-center text-[10px] text-white" style={{ backgroundColor: ORANGE }}>
                  {notificationCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </header>}

      <main className={
        hideChrome
          ? "min-h-screen"
          : hideHeaderOnly
            ? "max-w-7xl mx-auto px-4 pt-4 pb-24"
            : "max-w-7xl mx-auto px-4 py-4 pb-24"
      }>
        <Outlet />
      </main>

      {/* ── Bottom nav — hidden on booking flow ── */}
      {!hideChrome && <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-[#dde5f4] dark:border-gray-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-2">
          <div className="flex justify-around">
            {navItems.map(({ icon: Icon, label, path }) => {
              const isActive = location.pathname === path;
              return (
                <Link key={path} to={path} className="flex flex-col items-center py-2.5 px-3 relative min-w-0 flex-1">
                  {isActive && (
                    <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full" style={{ backgroundColor: PRIMARY }} />
                  )}
                  <Icon className="w-5 h-5 mb-0.5" style={{ color: isActive ? PRIMARY : "#9CA3AF" }} />
                  <span className="text-[10px] leading-tight" style={{ color: isActive ? PRIMARY : "#9CA3AF", fontWeight: isActive ? 700 : 400 }}>
                    {label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>}
    </div>
  );
}
