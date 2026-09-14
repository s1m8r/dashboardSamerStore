import { CanAccess } from "@/components/functions/canAccess";
import EditProduct from "@/pages/product/editProduct";
import { usepermissions } from "@/stores/usePermissions";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/(protected)/products/edit/$id")({
  beforeLoad: () => {
    if (!CanAccess(usepermissions.updateProducts)) {
      throw redirect({
        to: "/401",
      });
    }
  },

  component: EditProduct,
});
