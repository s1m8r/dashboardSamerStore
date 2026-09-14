import OnlyStore from "@/pages/storePage/onlyStore";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(protected)/stores/store/$id")({
  component: OnlyStore,
});
