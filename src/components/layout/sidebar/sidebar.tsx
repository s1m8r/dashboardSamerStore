import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Home,
  ShoppingCart,
  Store,
  Users,
  Settings,
  LogOut,
  UserCog2Icon,
  User2Icon,
} from "lucide-react";
import ItemHeader from "./itemHeader";
import { Link, useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "@/stores/userStore";
import { usepermissions } from "@/stores/usePermissions";
const permissions = usepermissions;
const SideBar = () => {
  const logout = useAuthStore((state) => state.logout);
  const Navigate = useNavigate();
  const handleLogout = () => {
    logout();
    setTimeout(() => {
      Navigate({ to: "/login" });
    }, 200);
  };
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-3 pt-4 pb-2">
        <Link
          to={"/"}
          className="flex items-center gap-2.5 px-1 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white p-1 shadow-sm">
            <img src="/logo.png" alt="logo" className="size-full object-contain" />
          </span>
          <span className="font-heading text-sm font-semibold tracking-tight text-sidebar-foreground group-data-[collapsible=icon]:hidden">
            Dashboard Samer Store
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="px-1 py-2">
        <ItemHeader
          path="/"
          icon={<Home />}
          children="Home"
          permission={"any"}
          activePaths={[
            "/statisticsusers",
            "/statisticsStores",
            "/statisticsproducts",
          ]}
        />
        <ItemHeader
          path="/users"
          icon={<Users />}
          children="User"
          pathAdd="/users/adduser"
          textAdd="Add User"
          permissionAdd={permissions.createUser}
          permission={[
            permissions.createUser,
            permissions.readUser,
            permissions.deleteUser,
            permissions.updateUser,
          ]}
        />
        <ItemHeader
          path="/stores"
          icon={<Store />}
          children="Stores"
          pathAdd="/stores/addstore"
          textAdd="Add Store"
          permissionAdd={permissions.createStores}
          permission={[
            permissions.createStores,
            permissions.readStores,
            permissions.deleteStores,
            permissions.updateStores,
          ]}
        />
        <ItemHeader
          path="/products"
          icon={<ShoppingCart />}
          children="Products"
          pathAdd="/products/addproduct"
          textAdd="Add Product"
          permissionAdd={permissions.createProducts}
          permission={[
            permissions.createProducts,
            permissions.readProducts,
            permissions.deleteProducts,
            permissions.updateProducts,
          ]}
        />

        <ItemHeader
          path="/roles"
          icon={<UserCog2Icon />}
          children="Roles"
          pathAdd="/roles/addrole"
          textAdd="Add Role"
          permissionAdd={permissions.createRoles}
          permission={[
            permissions.createRoles,
            permissions.readRoles,
            permissions.deleteRoles,
            permissions.updateRoles,
          ]}
        />
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border px-1 pt-2 pb-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Settings">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <span className="flex w-full items-center gap-2 group-data-[collapsible=icon]:justify-center">
                    <Settings />
                    <span className="group-data-[collapsible=icon]:hidden">
                      Settings
                    </span>
                  </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link to={"/profile"}>
                      <User2Icon />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={handleLogout}
                    className="cursor-pointer"
                  >
                    <LogOut />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default SideBar;
