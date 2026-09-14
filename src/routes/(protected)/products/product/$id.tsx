import OnlyProduct from "@/pages/product/onlyProduct";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(protected)/products/product/$id")({
  component: OnlyProduct,
});
