import { CanAccess } from "@/components/functions/canAccess";
import EditStore from "@/pages/storePage/editStore";
import { usepermissions } from "@/stores/usePermissions";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/(protected)/stores/edit/$id")({
  beforeLoad: () => {
    if (!CanAccess(usepermissions.updateStores)) {
      throw redirect({
        to: "/401",
      });
    }
  },

  component: EditStore,
});
