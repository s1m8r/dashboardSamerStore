import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLogin } from "@/API/user";
import { userScema } from "@/schemas/user";
import ErrorMessage from "@/components/forms/errors";
import { Link } from "@tanstack/react-router";
import { KeySquareIcon, MailIcon } from "lucide-react";
import InputForm from "@/components/forms/input";
import { Button } from "@/components/ui/button";
import AuthBrandPanel from "@/components/layout/authBrandPanel";

const Login = () => {
  type loginSchemaType = z.infer<typeof userScema>;

  const { mutate, isPending, isError, error } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<loginSchemaType>({
    resolver: zodResolver(userScema),
  });

  const handleLogin = (data: loginSchemaType) => {
    mutate(data);
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <AuthBrandPanel
        title="Run every store from one dashboard."
        description="Manage stores, products, users and roles in one place, with permissions that keep every team in its lane."
      />

      <div className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm animate-in fade-in-0 slide-in-from-bottom-3 duration-500 ease-out">
          <div className="mb-8 flex flex-col items-center gap-2 lg:hidden">
            <span className="flex size-10 items-center justify-center rounded-lg bg-white p-1.5 shadow-sm ring-1 ring-border">
              <img src="/logo.png" alt="logo" className="size-full object-contain" />
            </span>
          </div>
          <h1 className="font-heading text-2xl font-semibold text-foreground">
            Welcome back
          </h1>
          <p className="mt-1 mb-8 text-sm text-muted-foreground">
            Sign in to continue to your dashboard.
          </p>

          <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
            <InputForm
              register={register}
              icon={<MailIcon />}
              name="email"
              placeholder="Email"
              label="Email"
              errorMessage={errors.email?.message}
            />

            <div>
              <InputForm
                register={register}
                icon={<KeySquareIcon />}
                name="password"
                placeholder="Password"
                label="Password"
                type="password"
                errorMessage={errors.password?.message}
                isPassword={true}
              />
              <Link
                to="/forgot-password"
                className="mt-1.5 flex justify-end text-sm text-muted-foreground underline-offset-4 transition hover:text-foreground hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              variant="default"
              disabled={isPending}
              className="w-full"
              size="lg"
            >
              Sign in
            </Button>
          </form>
          {isError && <ErrorMessage>{error.message}</ErrorMessage>}
          <Link
            to="/register"
            className="mt-6 flex justify-center text-sm text-muted-foreground underline-offset-4 transition hover:text-foreground hover:underline"
          >
            I don't have an account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
