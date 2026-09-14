import StatisticsStores from "@/pages/storePage/statistics";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(protected)/(home)/statisticsStores")({
  component: StatisticsStores,
});
