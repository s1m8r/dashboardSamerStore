import { CanAccess } from "@/components/functions/canAccess";
import EditUser from "@/pages/user/editUser";
import { usepermissions } from "@/stores/usePermissions";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/(protected)/users/edit/$id")({
  beforeLoad: () => {
    if (!CanAccess(usepermissions.updateUser)) {
      throw redirect({
        to: "/401",
      });
    }
  },
  component: EditUser,
});
