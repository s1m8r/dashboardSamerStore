import { useAuthStore } from "@/stores/userStore";
import { ProComponent } from "./profileComponent";
import { useNavigate } from "@tanstack/react-router";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import InputForm from "@/components/forms/input";
import { KeyRoundIcon, LogOut } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { changePassword, useResetPassword } from "@/API/user";
import { useState } from "react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import Padding from "@/components/layout/padding";
import Title from "@/components/layout/title";

type changePasswordType = z.infer<typeof changePassword>;

const Profile = () => {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setTimeout(() => {
      navigate({ to: "/login" });
    }, 200);
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<changePasswordType>({
    resolver: zodResolver(changePassword),
  });

  const { mutate, isPending } = useResetPassword();

  const handleChange = (data: changePasswordType) => {
    mutate(data, {
      onSuccess: () => {
        reset();
        setOpen(false);
        toast.success("Password changed");
      },
      onError: (err) => {
        toast.error(err.message);
      },
    });
  };

  const initials = `${user?.firstName?.charAt(0) ?? ""}${
    user?.lastName?.charAt(0) ?? ""
  }`;
  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ");

  return (
    <Padding>
      <Title children="Profile" description="Your account details." />

      <div className="mx-auto w-full max-w-2xl">
        <div className="animate-in fade-in-0 slide-in-from-bottom-3 overflow-hidden rounded-xl border border-border bg-card shadow-sm duration-500 ease-out">
          <div className="flex items-center gap-4 border-b border-border p-6">
            <span className="flex size-16 shrink-0 items-center justify-center rounded-full bg-primary text-2xl font-semibold text-primary-foreground">
              {initials}
            </span>
            <div className="min-w-0">
              <p className="truncate text-lg font-semibold text-foreground">
                {fullName || "Your account"}
              </p>
              <p className="truncate text-sm text-muted-foreground">
                {user?.email}
              </p>
            </div>
          </div>

          <div className="p-6">
            <ProComponent title="First Name" dataInformation={user?.firstName ?? "—"} />
            <ProComponent title="Last Name" dataInformation={user?.lastName ?? "—"} />
            <ProComponent title="Age" dataInformation={user?.age?.toString() ?? "—"} />
            <ProComponent title="Email" dataInformation={user?.email ?? "—"} />
            <ProComponent title="Phone" dataInformation={user?.phone ?? "—"} />
            <ProComponent title="Role" dataInformation={user?.role ?? "—"} />
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-border bg-muted/40 p-4">
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="text-destructive hover:text-destructive"
            >
              <LogOut />
              Log out
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <KeyRoundIcon />
                  Change password
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                  <DialogTitle>Change your password</DialogTitle>
                </DialogHeader>
                <form
                  onSubmit={handleSubmit(handleChange)}
                  className="space-y-4"
                >
                  <InputForm
                    name="password"
                    register={register}
                    type="password"
                    isPassword={true}
                    icon={<KeyRoundIcon />}
                    label="Current password"
                    errorMessage={errors.password?.message}
                    placeholder="Current password"
                  />
                  <InputForm
                    name="newPassword"
                    register={register}
                    type="password"
                    isPassword={true}
                    icon={<KeyRoundIcon />}
                    label="New password"
                    errorMessage={errors.newPassword?.message}
                    placeholder="New password"
                  />
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline" type="button">
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button type="submit" disabled={isPending}>
                      {isPending ? <Spinner /> : "Save changes"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </Padding>
  );
};

export default Profile;
