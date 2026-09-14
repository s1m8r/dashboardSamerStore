import { useGetRole, useUpdateRole } from "@/API/role";
import Role from "@/features/role/role";
import { Route } from "@/routes/(protected)/roles/edit/$id";
import { roleSchema } from "@/schemas/role";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
type roleFormData = z.infer<typeof roleSchema>;

const EditRole = () => {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const { id } = Route.useParams();
  const { data: getRole } = useGetRole(id);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(roleSchema),
  });
  const { mutate, isPending } = useUpdateRole();
  const onsubmit = (data: roleFormData) => {
    const formatData = {
      ...data,
      permissionIds: data.permissionIds.map((per) => Number(per)),
      isActive: true,
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
            toast.success(`${formatData.name} Role updated successfully`);
          }, 200);
        },
        onError: (err) => {
          toast.error(err.message);
        },
      },
    );
  };
  useEffect(() => {
    if (getRole)
      reset({
        ...getRole,
        permissionIds: getRole.permissionIds?.map(String) || [],
      });
  }, [reset, getRole]);
  return (
    <Role
      title="Edit Role"
      handleSubmit={handleSubmit}
      errors={errors}
      register={register}
      onsubmit={onsubmit}
      childrenButton="Edit Role"
      isPending={isPending}
      isDirty={isDirty}
      typeForm="edit"
    />
  );
};

export default EditRole;
