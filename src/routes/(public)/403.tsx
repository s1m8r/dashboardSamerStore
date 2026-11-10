import ErrordontHaveAccesse from "@/pages/pageError/403";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(public)/403")({
  component: ErrordontHaveAccesse,
});
