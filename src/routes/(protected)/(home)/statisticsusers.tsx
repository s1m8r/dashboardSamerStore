import StatisticsUser from "@/pages/user/statistics";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(protected)/(home)/statisticsusers")({
  component: StatisticsUser,
});
