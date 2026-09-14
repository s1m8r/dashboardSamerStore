import { ProductSchema } from "@/schemas/product";
import z from "zod";

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { useState } from "react";
import {
  Control,
  Controller,
  FieldErrors,
  UseFormHandleSubmit,
  UseFormRegister,
  UseFormSetValue,
  useWatch,
} from "react-hook-form";
import { Spinner } from "@/components/ui/spinner";
import { useGetStores } from "@/API/store";
import InputForm from "@/components/forms/input";
import TextareaForm from "@/components/forms/textarea";
import {
  Archive,
  CircleDollarSign,
  Image as ImageIcon,
  Package,
  PlusIcon,
  Star,
  Trash2,
} from "lucide-react";
import TitleContent from "@/components/layout/titleContent";
import Container from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { useGetTypes } from "@/API/types";
import Selected from "@/components/layout/select";
import { Input } from "@/components/ui/input";
import { useGetColors } from "@/API/colors";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ProductFormData = z.infer<typeof ProductSchema>;

interface Props {
  title: string;
  childrenButton: string;
  onsubmit: (data: ProductFormData) => void;
  handleSubmit: UseFormHandleSubmit<ProductFormData>;
  errors: FieldErrors<ProductFormData>;
  register: UseFormRegister<ProductFormData>;
  setValue: UseFormSetValue<ProductFormData>;
  control: Control<ProductFormData>;
  defaultStoreName?: string;
  isPending?: boolean;
  isLoading?: boolean;
  isDirty?: boolean;
  typeForm?: "add" | "edit";
}

export default function Product({
  title,
  childrenButton,
  onsubmit,
  handleSubmit,
  errors,
  register,
  setValue,
  control,
  defaultStoreName = "",
  isPending = false,
  isLoading = false,
  isDirty = false,
  typeForm = "add",
}: Props) {
  const [search, setSearch] = useState("");
  const [inputValue, setInputValue] = useState(defaultStoreName);

  const { data } = useGetStores("rating", "desc", 1, search);

  const stores = data?.data ?? [];

  const { data: types } = useGetTypes();

  const items =
    types?.data.map((item) => ({
      label: item.name,
      value: item.value,
    })) ?? [];

  const images = useWatch({
    control,
    name: "images",
    defaultValue: [],
  });
  const posterImage = useWatch({
    control,
    name: "image",
    defaultValue: "",
  });
  const [valuePath, setValuePath] = useState("");
  const [errPath, setErrPath] = useState(false);
  const addImage = () => {
    if (!valuePath) {
      setErrPath(true);
      return;
    }
    setValue("images", [...images, valuePath], {
      shouldDirty: true,
      shouldValidate: true,
      shouldTouch: true,
    });
    setValuePath("");
  };
  const removeImage = (index: number) => {
    setValue(
      "images",
      images.filter((_, i) => i !== index),
      {
        shouldDirty: true,
      },
    );
  };

  const productColors = useWatch({
    control,
    name: "colors",
    defaultValue: [],
  });
  const [selectedColor, setSelectedColor] = useState("");
  const [errColor, setErrColor] = useState(false);
  const addColor = () => {
    if (!selectedColor) {
      setErrColor(true);
      return;
    }
    setValue("colors", [...productColors, selectedColor], {
      shouldDirty: true,
      shouldValidate: true,
      shouldTouch: true,
    });
    setSelectedColor("");
  };
  const removeColor = (index: number) => {
    setValue(
      "colors",
      productColors.filter((_, i) => i !== index),
      {
        shouldDirty: true,
      },
    );
  };
  const { data: colors } = useGetColors();
  const colorShow = colors?.data.filter(
    (i) => !productColors.includes(i.color),
  );
  const colorName = (value: string) =>
    colors?.data.find((item) => item.color === value)?.path ?? value;

  return (
    <Container>
      <TitleContent title={title} />

      {isLoading && (
        <div className="flex justify-center py-6">
          <Spinner />
        </div>
      )}

      {!isLoading && (
        <form onSubmit={handleSubmit(onsubmit)} className="space-y-4">
          <Field data-invalid={!!errors?.storeId?.message} className="w-full">
            <FieldLabel>Store Name</FieldLabel>
            <Controller
              control={control}
              name="storeId"
              render={({ field }) => (
                <Combobox
                  items={stores}
                  value={field.value ? String(field.value) : ""}
                  onValueChange={(value) => {
                    const selectedStore = stores.find(
                      (item) => item.id === Number(value),
                    );
                    if (!selectedStore) return;
                    field.onChange(selectedStore.id);
                    setInputValue(selectedStore.name);
                    setValue("storeName", selectedStore.name, {
                      shouldDirty: true,
                    });
                  }}
                >
                  <ComboboxInput
                    aria-invalid={!!errors.storeId}
                    placeholder="Select store"
                    value={inputValue}
                    onChange={(event) => {
                      const value = event.target.value;

                      setInputValue(value);
                      setSearch(value);
                    }}
                  />

                  <ComboboxContent>
                    <ComboboxEmpty>No items found.</ComboboxEmpty>

                    <ComboboxList>
                      {(item) => (
                        <ComboboxItem key={item.id} value={String(item.id)}>
                          {item.name}
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              )}
            />
            {errors.storeId?.message && (
              <FieldError>{errors.storeId.message}</FieldError>
            )}
          </Field>

          <InputForm
            register={register}
            name="name"
            placeholder="Name"
            label="Name"
            icon={<Archive />}
            errorMessage={errors.name?.message}
          />

          <TextareaForm
            register={register}
            name="description"
            label="Description"
            errorMessage={errors.description?.message}
            placeholder="Description"
          />

          <InputForm
            register={register}
            type="number"
            name="price"
            placeholder="Price"
            label="Price"
            icon={<CircleDollarSign />}
            errorMessage={errors.price?.message}
            options={{
              valueAsNumber: true,
            }}
          />
          <InputForm
            register={register}
            type="number"
            name="discountPercentage"
            placeholder="Discount Percentage (%)"
            label="Discount Percentage"
            icon={<CircleDollarSign />}
            errorMessage={errors.discountPercentage?.message}
            options={{
              valueAsNumber: true,
            }}
          />

          <Selected
            control={control}
            name="type"
            errorMessage={errors.type?.message}
            items={items}
          />

          <InputForm
            register={register}
            name="image"
            placeholder="Image Poster"
            label="Image"
            icon={<ImageIcon />}
            errorMessage={errors.image?.message}
          />

          {posterImage && (
            <div className="size-32 overflow-hidden rounded-lg border border-border bg-muted">
              <img
                src={posterImage}
                alt="Poster preview"
                className="h-full w-full object-cover"
              />
            </div>
          )}

          <Field
            data-invalid={errPath || !!errors.images?.message}
            className="w-full"
          >
            <FieldLabel>
              Gallery images{images?.length ? ` (${images.length})` : ""}
            </FieldLabel>
            <div className="flex gap-2">
              <Input
                aria-invalid={!!errors.images || errPath}
                value={valuePath}
                onChange={(e) => {
                  setValuePath(e.target.value);
                  setErrPath(false);
                }}
                placeholder="Paste an image URL"
              />
              <Button
                variant="default"
                onClick={(e) => {
                  e.preventDefault();
                  addImage();
                }}
              >
                <PlusIcon />
                Add
              </Button>
            </div>
            {errPath && <FieldError>Enter an image path</FieldError>}
            {errors.images && <FieldError>{errors.images.message}</FieldError>}
          </Field>

          {images && images.length > 0 && (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {images.map((path, index) => (
                <div
                  key={index}
                  className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-muted"
                >
                  <img
                    src={path}
                    alt={`Gallery image ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    aria-label={`Remove image ${index + 1}`}
                    className="absolute top-1 right-1 flex size-6 items-center justify-center rounded-full bg-background/90 text-muted-foreground opacity-0 shadow-sm transition group-hover:opacity-100 focus-visible:opacity-100 hover:bg-destructive hover:text-white"
                  >
                    <Trash2 className="size-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <Field
            data-invalid={errColor || !!errors.colors?.message}
            className="w-full"
          >
            <FieldLabel>
              Colors{productColors?.length ? ` (${productColors.length})` : ""}
            </FieldLabel>
            <div className="flex gap-2">
              <Select
                value={selectedColor}
                onValueChange={(value) => {
                  setSelectedColor(value);
                  setErrColor(false);
                }}
              >
                <SelectTrigger
                  className="flex-1"
                  aria-invalid={!!errors.colors?.message || errColor}
                >
                  <SelectValue placeholder="Select color" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {colorShow?.map((item) => (
                      <SelectItem key={item.color} value={item.color}>
                        <span
                          className="size-3 rounded-full ring-1 ring-border"
                          style={{ backgroundColor: item.color }}
                        ></span>
                        {item.path}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Button
                variant="default"
                onClick={(e) => {
                  e.preventDefault();
                  addColor();
                }}
              >
                <PlusIcon />
                Add
              </Button>
            </div>

            {errColor && <FieldError>Select a color</FieldError>}
            {errors.colors && <FieldError>{errors.colors.message}</FieldError>}
          </Field>

          {productColors && productColors.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {productColors.map((color, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => removeColor(index)}
                  aria-label={`Remove ${colorName(color)}`}
                  className="group inline-flex cursor-pointer items-center gap-2 rounded-full border border-border bg-card py-1 pr-2.5 pl-2.5 text-sm text-foreground transition-colors hover:border-destructive/50 hover:bg-destructive/10 hover:text-destructive"
                >
                  <span
                    className="size-4 shrink-0 rounded-full ring-1 ring-border"
                    style={{ backgroundColor: color }}
                  />
                  <span>{colorName(color)}</span>
                  <Trash2 className="size-3 text-muted-foreground transition-colors group-hover:text-destructive" />
                </button>
              ))}
            </div>
          )}

          <InputForm
            register={register}
            type="number"
            name="rating"
            placeholder="Rating"
            label="Rating"
            icon={<Star />}
            errorMessage={errors.rating?.message}
            options={{
              valueAsNumber: true,
            }}
          />

          <InputForm
            register={register}
            type="number"
            name="badge"
            placeholder="Badge"
            label="Badge"
            icon={<Package />}
            errorMessage={errors.badge?.message}
            options={{
              valueAsNumber: true,
            }}
          />

          <Button
            type="submit"
            variant="default"
            disabled={isPending || (typeForm === "edit" && !isDirty)}
            className="w-full"
          >
            {isPending ? <Spinner /> : childrenButton}
          </Button>
        </form>
      )}
    </Container>
  );
}
