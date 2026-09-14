import { useAddStores } from "@/API/store";
import Store from "@/features/storePage/store";
import { Route } from "@/routes/(protected)/stores/addstore";
import { storeSchema } from "@/schemas/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const AddStore = () => {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const { mutate, isPending } = useAddStores();
  type storeFormData = z.infer<typeof storeSchema>;
  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(storeSchema),
  });
  const onsubmit = (data: storeFormData) => {
    const formatData = {
      ...data,
      items: 0,
      isActive: true,
    };
    mutate(formatData, {
      onSuccess: () => {
        setTimeout(() => {
          navigate({
            to: search.from || "/",
          });
          toast.success(`${formatData.name} has been created successfully`);
        }, 200);
      },
      onError: (err) => {
        toast.error(err.message);
      },
    });
  };
  return (
    <Store
      title="Add Store"
      childrenButton="Add Store"
      onsubmit={onsubmit}
      register={register}
      control={control}
      setValue={setValue}
      handleSubmit={handleSubmit}
      errors={errors}
      isPending={isPending}
    />
  );
};

export default AddStore;
