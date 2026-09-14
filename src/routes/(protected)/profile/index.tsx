import Profile from "@/pages/profile/profile";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(protected)/profile/")({
  component: Profile,
});
