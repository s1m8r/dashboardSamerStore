import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, MailCheckIcon, MailIcon } from "lucide-react";

import InputForm from "@/components/forms/input";
import { Button } from "@/components/ui/button";
import AuthBrandPanel from "@/components/layout/authBrandPanel";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type forgotPasswordType = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword = () => {
  const [sentTo, setSentTo] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<forgotPasswordType>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = (data: forgotPasswordType) => {
    setSentTo(data.email);
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <AuthBrandPanel
        title="Forgot your password?"
        description="Enter the email address linked to your account and we'll send you a link to choose a new password."
      />

      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm animate-in fade-in-0 slide-in-from-bottom-3 duration-500 ease-out">
          <div className="mb-8 flex flex-col items-center gap-2 lg:hidden">
            <span className="flex size-10 items-center justify-center rounded-lg bg-white p-1.5 shadow-sm ring-1 ring-border">
              <img
                src="/logo.png"
                alt="logo"
                className="size-full object-contain"
              />
            </span>
          </div>

          {sentTo ? (
            <div className="flex flex-col items-center text-center">
              <span className="mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <MailCheckIcon className="size-6" />
              </span>
              <h1 className="font-heading text-2xl font-semibold text-foreground">
                Check your email
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                If an account exists for{" "}
                <span className="font-medium text-foreground">{sentTo}</span>,
                you'll receive a password reset link shortly.
              </p>
              <Button
                variant="outline"
                className="mt-6 w-full"
                onClick={() => setSentTo("")}
              >
                Use a different email
              </Button>
            </div>
          ) : (
            <>
              <h1 className="font-heading text-2xl font-semibold text-foreground">
                Reset your password
              </h1>
              <p className="mt-1 mb-8 text-sm text-muted-foreground">
                We'll email you a link to set a new one.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <InputForm
                  register={register}
                  icon={<MailIcon />}
                  name="email"
                  placeholder="Email"
                  label="Email"
                  errorMessage={errors.email?.message}
                />

                <Button variant="default" className="w-full" size="lg">
                  Send reset link
                </Button>
              </form>
            </>
          )}

          <Link
            to="/login"
            className="mt-6 flex items-center justify-center gap-1.5 text-sm text-muted-foreground underline-offset-4 transition hover:text-foreground hover:underline"
          >
            <ArrowLeft className="size-4" />
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
