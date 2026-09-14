import { CanAccess } from "@/components/functions/canAccess";
import EditRole from "@/pages/role/editRole";
import { usepermissions } from "@/stores/usePermissions";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/(protected)/roles/edit/$id")({
  beforeLoad: () => {
    if (!CanAccess(usepermissions.updateRoles)) {
      throw redirect({
        to: "/401",
      });
    }
  },

  component: EditRole,
});
