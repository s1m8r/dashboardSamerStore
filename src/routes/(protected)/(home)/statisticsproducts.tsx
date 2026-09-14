import StatisticsProduct from "@/pages/product/statistics";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(protected)/(home)/statisticsproducts")({
  component: StatisticsProduct,
});
