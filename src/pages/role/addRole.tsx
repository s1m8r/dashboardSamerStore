import { useAddRole } from "@/API/role";
import Role from "@/features/role/role";
import { Route } from "@/routes/(protected)/roles/addrole";
import { roleSchema } from "@/schemas/role";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
type roleFormData = z.infer<typeof roleSchema>;

const AddRole = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(roleSchema),
  });
  const navigate = useNavigate();
  const search = Route.useSearch();
  const { mutate, isPending } = useAddRole();
  const onsubmit = (data: roleFormData) => {
    const formatData = {
      ...data,
      permissionIds: data.permissionIds.map((per) => Number(per)),
      isActive: true,
    };
    mutate(formatData, {
      onSuccess: () => {
        setTimeout(() => {
          navigate({
            to: search.from || "/",
          });
          toast.success(`${formatData.name} added successfully`);
        }, 200);
      },
      onError: (err) => {
        toast.error(err.message);
      },
    });
  };
  return (
    <Role
      title="Add Role"
      handleSubmit={handleSubmit}
      errors={errors}
      register={register}
      onsubmit={onsubmit}
      childrenButton="Add Role"
      isPending={isPending}
    />
  );
};
export default AddRole;
