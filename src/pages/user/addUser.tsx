import { useRegister } from "@/API/user";
import RegisterForm from "@/features/register/formRegister/register";
import { registerSchema } from "@/schemas/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { Route } from "@/routes/(protected)/users/adduser";
import { z } from "zod";
import { toast } from "sonner";
type registerFormData = z.infer<typeof registerSchema>;

const AddUser = () => {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const { mutate, isPending } = useRegister();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });
  const handleRegister = (data: registerFormData) => {
    const dataFormat = {
      ...data,
      age: Number(data.age),
      role: "user",
      roleId: 3,
      isActive: true,
    };
    mutate(dataFormat, {
      onSuccess: () => {
        setTimeout(() => {
          navigate({
            to: search.from || "/",
          });
        }, 200);
        toast.success(`${data.firstName} has been created successfully`);
      },
      onError: (err) => {
        toast.error(err?.message);
      },
    });
  };
  return (
    <RegisterForm
      title="Add User"
      handleSubmit={handleSubmit}
      onsubmit={handleRegister}
      errors={errors}
      register={register}
      childrenButton="Add User"
      isPending={isPending}
    />
  );
};

export default AddUser;
