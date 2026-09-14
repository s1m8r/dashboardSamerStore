import { useGetProduct, useUpdateProduct } from "@/API/product";
import Container from "@/components/layout/container";
import { Spinner } from "@/components/ui/spinner";
import TitleContent from "@/components/layout/titleContent";
import Product from "@/features/product/product";
import { Route } from "@/routes/(protected)/products/edit/$id";
import { ProductSchema } from "@/schemas/product";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

type productFormData = z.infer<typeof ProductSchema>;

const EditProduct = () => {
  const { id } = Route.useParams();
  const search = Route.useSearch();
  const navigate = useNavigate();
  const {
    handleSubmit,
    formState: { errors, isDirty },
    register,
    reset,
    setValue,
    control,
  } = useForm({
    resolver: zodResolver(ProductSchema),
  });
  const { mutate, isPending } = useUpdateProduct();
  const { data: getStore, isLoading } = useGetProduct(id);

  useEffect(() => {
    reset(getStore);
  }, [reset, getStore]);

  const onsubmit = (data: productFormData) => {
    mutate(
      { id, data },
      {
        onSuccess: () => {
          setTimeout(() => {
            navigate({
              to: search.from || "/",
            });
            toast.success(`Product ${data.name} updated successfully`);
          }, 300);
        },
        onError: (err) => {
          toast.error(err.message);
        },
      },
    );
  };
  return (
    <>
      {isLoading && (
        <Container>
          <TitleContent title="Edit Product" />
          <div className="flex justify-center py-6">
            <Spinner />
          </div>
        </Container>
      )}
      {getStore?.storeName && (
        <Product
          title="Edit Product"
          childrenButton="Save Changes"
          onsubmit={onsubmit}
          handleSubmit={handleSubmit}
          errors={errors}
          register={register}
          isPending={isPending}
          isLoading={isLoading}
          setValue={setValue}
          control={control}
          defaultStoreName={getStore?.storeName}
          isDirty={isDirty}
          typeForm="edit"
        />
      )}
    </>
  );
};

export default EditProduct;
