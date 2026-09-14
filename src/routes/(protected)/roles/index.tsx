import { CanAccess } from "@/components/functions/canAccess";
import ShowRole from "@/pages/role/showRole";
import { usepermissions } from "@/stores/usePermissions";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/(protected)/roles/")({
  beforeLoad: () => {
    if (!CanAccess(usepermissions.readRoles)) {
      throw redirect({
        to: "/401",
      });
    }
  },

  component: ShowRole,
});
