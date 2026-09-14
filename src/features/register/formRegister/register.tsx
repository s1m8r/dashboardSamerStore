import { useEffect } from "react";
import { z } from "zod";
import type {
  Control,
  ControllerRenderProps,
  FieldErrors,
  UseFormHandleSubmit,
  UseFormRegister,
} from "react-hook-form";
import { Controller } from "react-hook-form";

import { registerSchema } from "@/schemas/user";
import { Spinner } from "@/components/ui/spinner";

import { useGetRoles } from "@/API/role";
import InputForm from "@/components/forms/input";
import {
  Building2,
  Calendar,
  Globe,
  Hash,
  Lock,
  Mail,
  MapPin,
  Phone as PhoneIcon,
  UserRound,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import TitleContent from "@/components/layout/titleContent";
import Container from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type registerFormData = z.infer<typeof registerSchema>;

type Role = {
  id?: number;
  name: string;
};

function RoleSelectField({
  field,
  roles,
  currentRoleName,
}: {
  field: ControllerRenderProps<registerFormData, "roleId">;
  roles?: Role[];
  currentRoleName?: string;
}) {
  const matchedById = roles?.find(
    (role) => String(role.id) === String(field.value),
  );
  const matchedByName = !matchedById
    ? roles?.find((role) => role.name === currentRoleName)
    : undefined;
  const selectedRole = matchedById ?? matchedByName;

  useEffect(() => {
    if (!matchedById && matchedByName) {
      field.onChange(matchedByName.id);
    }
  }, [matchedById, matchedByName, field]);

  return (
    <Select
      value={selectedRole ? String(selectedRole.id) : ""}
      onValueChange={(value) => field.onChange(Number(value))}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select role">
          {selectedRole?.name}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {roles?.map((role) => (
            <SelectItem key={role.id} value={String(role.id)}>
              {role.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

type Props = {
  title: string;
  handleSubmit: UseFormHandleSubmit<registerFormData>;
  onsubmit: (data: registerFormData) => void;
  errors: FieldErrors<registerFormData>;
  register: UseFormRegister<registerFormData>;
  control?: Control<registerFormData>;
  isPending?: boolean;
  childrenButton: string;
  hasPassword?: boolean;
  isLoading?: boolean;
  isDirty?: boolean;
  isRegister?: boolean;
  active?: "add" | "edit";
  hasLogin?: "yes" | "no";
  currentRoleName?: string;
};

export default function RegisterForm({
  title,
  handleSubmit,
  onsubmit,
  errors,
  register,
  control,
  isPending,
  childrenButton,
  hasPassword = true,
  isLoading,
  isDirty,
  active = "add",
  hasLogin = "no",
  isRegister,
  currentRoleName,
}: Props) {
  const { data: roles } = useGetRoles("id", "asc", 1, "", active === "edit");

  return (
    <Container>
      <TitleContent title={title} isRegister={isRegister} />
      {isLoading && (
        <div className="flex justify-center py-6">
          <Spinner />
        </div>
      )}

      {!isLoading && (
        <form onSubmit={handleSubmit(onsubmit)} className="space-y-4">
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-6">
              <InputForm
                register={register}
                icon={<UserRound />}
                name="firstName"
                placeholder="First Name"
                label="First Name"
                errorMessage={errors.firstName?.message}
              />
            </div>
            <div className="col-span-6">
              <InputForm
                register={register}
                icon={<UserRound size={22} />}
                name="lastName"
                placeholder="Last Name"
                label="Last Name"
                errorMessage={errors.lastName?.message}
              />
            </div>
          </div>

          <div>
            <InputForm
              register={register}
              icon={<Mail size={22} />}
              name="email"
              placeholder="Email"
              label="Email"
              errorMessage={errors.email?.message}
            />
          </div>

          {hasPassword && (
            <div>
              <InputForm
                register={register}
                icon={<Lock size={22} />}
                name="password"
                placeholder="Password"
                label="Password"
                type="password"
                errorMessage={errors.password?.message}
                isPassword={true}
              />
            </div>
          )}

          <div>
            <InputForm
              register={register}
              icon={<Calendar size={22} />}
              name="age"
              placeholder="Age"
              label="Age"
              type="number"
              options={{ valueAsNumber: true }}
              errorMessage={errors.age?.message}
            />
          </div>

          <div>
            <InputForm
              register={register}
              icon={<PhoneIcon size={22} />}
              name="phone"
              placeholder="Phone"
              label="Phone"
              errorMessage={errors.phone?.message}
            />
          </div>

          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-6">
              <InputForm
                register={register}
                icon={<MapPin size={22} />}
                name="address.street"
                placeholder="Street"
                label="Street"
                errorMessage={errors.address?.street?.message}
              />
            </div>
            <div className="col-span-6">
              <InputForm
                register={register}
                icon={<Building2 size={22} />}
                name="address.city"
                placeholder="City"
                label="City"
                errorMessage={errors.address?.city?.message}
              />
            </div>
          </div>

          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-4">
              <InputForm
                register={register}
                icon={<Building2 size={22} />}
                name="address.state"
                placeholder="State"
                label="State"
                errorMessage={errors.address?.state?.message}
              />
            </div>
            <div className="col-span-4">
              <InputForm
                register={register}
                icon={<Hash size={22} />}
                name="address.zipCode"
                placeholder="ZIP Code"
                label="ZIP Code"
                errorMessage={errors.address?.zipCode?.message}
              />
            </div>
            <div className="col-span-4">
              <InputForm
                register={register}
                icon={<Globe size={22} />}
                name="address.country"
                placeholder="Country"
                label="Country"
                errorMessage={errors.address?.country?.message}
              />
            </div>
          </div>

          {active === "edit" && control && (
            <div className="space-y-1">
              <label className="text-sm text-muted-foreground">Role</label>

              <Controller
                control={control}
                name="roleId"
                render={({ field }) => (
                  <RoleSelectField
                    field={field}
                    roles={roles?.data}
                    currentRoleName={currentRoleName}
                  />
                )}
              />
            </div>
          )}

          <Button
            variant="default"
            disabled={isPending || (active === "edit" && !isDirty)}
            className="w-full"
          >
            {childrenButton}
          </Button>
        </form>
      )}

      {hasLogin === "yes" && (
        <Link
          to="/login"
          className="mt-2 mb-2 flex justify-center text-sm text-muted-foreground underline-offset-4 transition hover:text-foreground hover:underline"
        >
          Already have an account? Log in
        </Link>
      )}
    </Container>
  );
}
