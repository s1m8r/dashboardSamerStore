import { CanAccess } from "@/components/functions/canAccess";
import AddRole from "@/pages/role/addRole";
import { usepermissions } from "@/stores/usePermissions";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/(protected)/roles/addrole")({
  beforeLoad: () => {
    if (!CanAccess(usepermissions.createRoles)) {
      throw redirect({
        to: "/401",
      });
    }
  },

  component: AddRole,
});
