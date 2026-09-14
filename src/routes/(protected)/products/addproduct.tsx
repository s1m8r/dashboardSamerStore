import { CanAccess } from "@/components/functions/canAccess";
import AddProduct from "@/pages/product/addProduct";
import { usepermissions } from "@/stores/usePermissions";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/(protected)/products/addproduct")({
  beforeLoad: () => {
    if (!CanAccess(usepermissions.createProducts)) {
      throw redirect({
        to: "/401",
      });
    }
  },

  component: AddProduct,
});
