import { CanAccess } from "@/components/functions/canAccess";
import AddUser from "@/pages/user/addUser";
import { usepermissions } from "@/stores/usePermissions";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/(protected)/users/adduser")({
  beforeLoad: () => {
    if (!CanAccess(usepermissions.createUser)) {
      throw redirect({
        to: "/401",
      });
    }
  },

  component: AddUser,
});
