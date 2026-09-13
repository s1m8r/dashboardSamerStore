import ForgotPassword from "@/pages/login/forgotPassword";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(public)/forgot-password")({
  component: ForgotPassword,
});
