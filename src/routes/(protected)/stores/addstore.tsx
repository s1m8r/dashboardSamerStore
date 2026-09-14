import { CanAccess } from "@/components/functions/canAccess";
import AddStore from "@/pages/storePage/addStore";
import { usepermissions } from "@/stores/usePermissions";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/(protected)/stores/addstore")({
  beforeLoad: () => {
    if (!CanAccess(usepermissions.createStores)) {
      throw redirect({
        to: "/401",
      });
    }
  },

  component: AddStore,
});
