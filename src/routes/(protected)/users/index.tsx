import { CanAccess } from "@/components/functions/canAccess";
import ShowUser from "@/pages/user/showUsers";
import { usepermissions } from "@/stores/usePermissions";
import { createFileRoute, redirect } from "@tanstack/react-router";
export const Route = createFileRoute("/(protected)/users/")({
  beforeLoad: () => {
    if (!CanAccess(usepermissions.readUser)) {
      throw redirect({
        to: "/401",
      });
    }
  },

  component: ShowUser,
});
