import { LayoutDashboard, Users, UserPlus, Receipt, Settings, ChevronRight } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import paybazarLogo from "@/assets/paybazar-logo.png";

interface AppSidebarProps {
  role: "master" | "distributor";
}

export function AppSidebar({ role }: AppSidebarProps) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const masterItems = [
    { title: "Dashboard", url: "/master", icon: LayoutDashboard },
    { title: "All Distributors", url: "/master/distributors", icon: Users },
    { title: "Create Distributor", url: "/master/create", icon: UserPlus },
    { title: "Transactions", url: "/master/transactions", icon: Receipt },
    { title: "Settings", url: "/master/settings", icon: Settings },
  ];

  const distributorItems = [
    { title: "Dashboard", url: "/distributor", icon: LayoutDashboard },
    { title: "All Retailers", url: "/distributor/retailers", icon: Users },
    { title: "Create Retailer", url: "/distributor/create", icon: UserPlus },
    { title: "Transactions", url: "/distributor/transactions", icon: Receipt },
    { title: "Settings", url: "/distributor/settings", icon: Settings },
  ];

  const items = role === "master" ? masterItems : distributorItems;

  return (
    <Sidebar className={isCollapsed ? "w-16" : "w-64"} collapsible="icon">
      <SidebarContent className="bg-sidebar-background border-r border-sidebar-border">
        {/* Logo Section */}
        <div className={`p-4 border-b border-sidebar-border ${isCollapsed ? "px-2" : ""}`}>
          <div className="flex items-center gap-3">
            <img 
              src={paybazarLogo} 
              alt="PayBazaar" 
              className={isCollapsed ? "h-8" : "h-8"}
            />
            {!isCollapsed && (
              <span className="font-heading font-bold text-lg text-sidebar-foreground">
                PayBazaar
              </span>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className={isCollapsed ? "sr-only" : ""}>
            {role === "master" ? "Master Controls" : "Distributor Controls"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="hover:bg-sidebar-accent transition-colors">
                    <NavLink 
                      to={item.url} 
                      end={item.url === "/master" || item.url === "/distributor"}
                      className="flex items-center gap-3 py-3 px-3 rounded-lg text-sidebar-foreground"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-semibold border-l-4 border-sidebar-primary"
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {!isCollapsed && <span>{item.title}</span>}
                      {!isCollapsed && <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
