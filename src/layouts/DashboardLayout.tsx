
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Outlet, useLocation } from "react-router-dom";

export default function DashboardLayout() {
  const location = useLocation();

  const getPageTitle = (pathname: string) => {
    switch (pathname) {
      case "/dashboard":
        return "Dashboard";
      case "/menu-and-orders":
        return "Menu dan Pesanan";
      case "/cashier":
        return "Kasir";
      case "/history":
        return "Laporan";
      case "/account":
        return "Akun Saya";
      default:
        // Handle variations or subpages if needed
        if (pathname.startsWith("/menu-and-orders")) return "Menu dan Pesanan";
        return "Dashboard";
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="w-px h-4 bg-gray-200 mx-2" />
          <span className="font-semibold">{getPageTitle(location.pathname)}</span>
        </header>
        <main className="flex-1 overflow-y-auto p-6 @container/main">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
