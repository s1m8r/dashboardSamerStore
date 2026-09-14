import { useAddProduct } from "@/API/product";
import Product from "@/features/product/product";
import { Route } from "@/routes/(protected)/products/addproduct";
import { ProductSchema } from "@/schemas/product";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
// import { useGetStore, useUpdateStore } from "@/API/store";
// import { useEffect, useState } from "react";
type productFormData = z.infer<typeof ProductSchema>;
const AddProduct = () => {
  // const [getStoreId, setGetStoreId] = useState<number>();
  // const { mutate: addItemStore } = useUpdateStore();
  // const { data: getStore } = useGetStore(getStoreId);
  // const updatedStore = async () => {
  //   if (getStore) {
  //     await addItemStore(getStore);
  //   }
  // };
  // useEffect(() => {
  //   if (getStore) {
  //     addItemStore({ getStoreId, getStore });
  //   }
  // }, [getStore]);
  const navigate = useNavigate();
  const search = Route.useSearch();
  const {
    handleSubmit,
    formState: { errors },
    register,
    setValue,
    control,
  } = useForm({
    resolver: zodResolver(ProductSchema),
  });
  const { mutate, isPending } = useAddProduct();
  const onsubmit = (data: productFormData) => {
    mutate(data, {
      onSuccess: () => {
        // setGetStoreId(data?.storeId);
        setTimeout(() => {
          navigate({
            to: search.from || "/",
          });
          toast.success(`${data.name} added to ${data.storeName} successfully`);
        }, 200);
        console.log(data.storeName);
      },
      onError: (err) => {
        toast.error(err.message);
      },
    });
  };

  return (
    <Product
      title="Add Product"
      childrenButton="Add Product"
      onsubmit={onsubmit}
      handleSubmit={handleSubmit}
      errors={errors}
      register={register}
      isPending={isPending}
      setValue={setValue}
      control={control}
    />
  );
};
export default AddProduct;
