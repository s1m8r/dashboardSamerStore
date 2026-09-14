import { CanAccess } from "@/components/functions/canAccess";
import ShowStore from "@/pages/storePage/showStore";
import { usepermissions } from "@/stores/usePermissions";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/(protected)/stores/")({
  beforeLoad: () => {
    if (!CanAccess(usepermissions.readStores)) {
      throw redirect({
        to: "/401",
      });
    }
  },

  component: ShowStore,
});
