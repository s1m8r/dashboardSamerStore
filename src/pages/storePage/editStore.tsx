import { useGetStore, useUpdateStore } from "@/API/store";
import Store from "@/features/storePage/store";
import { Route } from "@/routes/(protected)/stores/edit/$id";
import { storeSchema } from "@/schemas/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const EditStore = () => {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const search = Route.useSearch();
  const { mutate, isPending } = useUpdateStore();
  const { data: getStore, isLoading } = useGetStore(id);
  type storeFormData = z.infer<typeof storeSchema>;
  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm({
    resolver: zodResolver(storeSchema),
  });
  const onsubmit = (data: storeFormData) => {
    const formatData = {
      ...data,
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
            toast.success(`${formatData.name} updated successfully`);
          }, 200);
        },
        onError: (err) => {
          toast.error(err.message);
        },
      },
    );
  };
  useEffect(() => {
    if (getStore) reset(getStore);
  }, [getStore, reset]);
  return (
    <Store
      title="Edit Store"
      childrenButton="Edit"
      onsubmit={onsubmit}
      register={register}
      control={control}
      setValue={setValue}
      handleSubmit={handleSubmit}
      errors={errors}
      isPending={isPending}
      isLoading={isLoading}
      isDirty={isDirty}
      typeForm="edit"
    />
  );
};
export default EditStore;
