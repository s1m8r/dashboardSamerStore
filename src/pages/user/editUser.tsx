import { useGetUser, useUpdateUser } from "@/API/user";
import RegisterForm from "@/features/register/formRegister/register";
import { Route } from "@/routes/(protected)/users/edit/$id";
import { registerSchema } from "@/schemas/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
type registerFormData = z.infer<typeof registerSchema>;

const EditUser = () => {
  const search = Route.useSearch();
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { data: getUser, isLoading } = useGetUser(id);
  const { mutate, isPending } = useUpdateUser();
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  useEffect(() => {
    if (getUser) reset(getUser);
  }, [getUser, reset]);
  const onsubmit = (data: registerFormData) => {
    const formatData = {
      ...data,
      isActive: getUser?.isActive,
    };
    mutate(
      {
        id: id,
        data: formatData,
      },
      {
        onSuccess: () => {
          setTimeout(() => {
            navigate({
              to: search.from || "/",
            });
          }, 200);
          toast.success(`User ${formatData.firstName} updated successfully`, {
            style: {
              background: "#16a34a",
              color: "white",
            },
          });
        },
        onError: (err) => {
          toast.error(err.message);
        },
      },
    );
  };
  return (
    <RegisterForm
      title="Edit User"
      handleSubmit={handleSubmit}
      onsubmit={onsubmit}
      errors={errors}
      register={register}
      control={control}
      isPending={isPending}
      childrenButton="Edit"
      isLoading={isLoading}
      hasPassword={false}
      active="edit"
      isDirty={isDirty}
      currentRoleName={getUser?.role}
    />
  );
};

export default EditUser;
