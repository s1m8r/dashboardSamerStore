import InputForm from "@/components/forms/input";
import Container from "@/components/layout/container";
import TitleContent from "@/components/layout/titleContent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { storeSchema } from "@/schemas/store";
import {
  Image,
  Mail,
  Network,
  Phone,
  PlusIcon,
  Star,
  StoreIcon,
  UserRound,
  UsersRound,
} from "lucide-react";
import { useState } from "react";
import {
  FieldErrors,
  UseFormHandleSubmit,
  UseFormRegister,
  Control,
  UseFormSetValue,
  useWatch,
} from "react-hook-form";
import z from "zod";

type storeFormData = z.infer<typeof storeSchema>;

interface Props {
  title: string;
  childrenButton: string;
  control: Control<storeFormData>;
  setValue: UseFormSetValue<storeFormData>;
  onsubmit: (data: storeFormData) => void;
  handleSubmit: UseFormHandleSubmit<storeFormData>;
  errors: FieldErrors<storeFormData>;
  register: UseFormRegister<storeFormData>;
  isPending?: boolean;
  isLoading?: boolean;
  isDirty?: boolean;
  typeForm?: "add" | "edit";
}

export default function Store({
  title,
  control,
  setValue,
  childrenButton,
  onsubmit,
  handleSubmit,
  errors,
  register,
  isPending,
  isLoading,
  isDirty,
  typeForm = "add",
}: Props) {
  const [valueInput, setValueInput] = useState("");

  const categories = useWatch({
    control,
    name: "categories",
    defaultValue: [],
  });

  const addCategory = () => {
    if (valueInput.trim()) {
      setValue("categories", [...categories, valueInput], {
        shouldDirty: true,
      });

      setValueInput("");
    }
  };

  const removeCategory = (index: number) => {
    setValue(
      "categories",
      categories.filter((_, i) => i !== index),
      {
        shouldDirty: true,
      },
    );
  };

  return (
    <Container>
      <TitleContent title={title} />
      {isLoading && (
        <div className="flex justify-center py-6">
          <Spinner />
        </div>
      )}

      {!isLoading && (
        <form onSubmit={handleSubmit(onsubmit)} className="space-y-6">
          <div className="space-y-4">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Basic Information
            </p>

            <div className="space-y-3">
              <InputForm
                register={register}
                icon={<StoreIcon size={22} />}
                name="name"
                placeholder="Store Name"
                label="Store Name"
                errorMessage={errors.name?.message}
              />

              <InputForm
                register={register}
                icon={<Mail size={22} />}
                name="email"
                placeholder="Email"
                label="Email"
                errorMessage={errors.email?.message}
              />

              <InputForm
                register={register}
                icon={<Phone size={22} />}
                name="phone"
                placeholder="Phone"
                label="Phone"
                errorMessage={errors.phone?.message}
              />
              <InputForm
                register={register}
                icon={<Network size={22} />}
                name="website"
                placeholder="Website"
                label="Website"
                errorMessage={errors.website?.message}
              />

              <InputForm
                register={register}
                icon={<Image size={22} />}
                name="image"
                placeholder="Image"
                label="Image"
                errorMessage={errors.image?.message}
              />
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Categories
            </p>

            <div className="flex gap-2">
              <Input
                placeholder="Add category"
                value={valueInput}
                onChange={(e) => setValueInput(e.target.value)}
                aria-invalid={!!errors.categories}
              />
              <Button
                variant="default"
                onClick={(e) => {
                  addCategory();
                  e.preventDefault();
                }}
              >
                <PlusIcon /> Add
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              {categories.map((c, index) => (
                <span
                  key={index}
                  onClick={() => removeCategory(index)}
                  className="cursor-pointer px-3 py-1 text-sm rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  {c} <span className=" text-red-900 font-bold"> X </span>
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Address
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <InputForm
                register={register}
                name="address.country"
                placeholder="Country"
                label="Country"
                errorMessage={errors.address?.country?.message}
              />

              <InputForm
                register={register}
                name="address.city"
                placeholder="City"
                label="City"
                errorMessage={errors.address?.city?.message}
              />

              <InputForm
                register={register}
                name="address.state"
                placeholder="State"
                label="State"
                errorMessage={errors.address?.state?.message}
              />

              <InputForm
                register={register}
                name="address.street"
                placeholder="Street"
                label="Street"
                errorMessage={errors.address?.street?.message}
              />

              <InputForm
                register={register}
                name="address.zipCode"
                placeholder="Zip Code"
                label="Zip Code"
                errorMessage={errors.address?.zipCode?.message}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <InputForm
              register={register}
              icon={<UserRound size={22} />}
              name="owner"
              placeholder="Owner"
              label="Owner"
              errorMessage={errors.owner?.message}
            />
            <InputForm
              register={register}
              icon={<UsersRound size={22} />}
              name="employees"
              placeholder="Employees"
              label="Employees"
              type="number"
              options={{ valueAsNumber: true }}
              errorMessage={errors.employees?.message}
            />
          </div>

          <div className="space-y-4">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
              Opening Hours
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <InputForm
                register={register}
                name="openingHours.sunday"
                placeholder="Sunday"
                label="Sunday"
                errorMessage={errors.openingHours?.sunday?.message}
              />

              <InputForm
                register={register}
                name="openingHours.monday"
                placeholder="Monday"
                label="Monday"
                errorMessage={errors.openingHours?.monday?.message}
              />

              <InputForm
                register={register}
                name="openingHours.tuesday"
                placeholder="Tuesday"
                label="Tuesday"
                errorMessage={errors.openingHours?.tuesday?.message}
              />

              <InputForm
                register={register}
                name="openingHours.wednesday"
                placeholder="Wednesday"
                label="Wednesday"
                errorMessage={errors.openingHours?.wednesday?.message}
              />

              <InputForm
                register={register}
                name="openingHours.thursday"
                placeholder="Thursday"
                label="Thursday"
                errorMessage={errors.openingHours?.thursday?.message}
              />

              <InputForm
                register={register}
                name="openingHours.friday"
                placeholder="Friday"
                label="Friday"
                errorMessage={errors.openingHours?.friday?.message}
              />

              <InputForm
                register={register}
                name="openingHours.saturday"
                placeholder="Saturday"
                label="Saturday"
                errorMessage={errors.openingHours?.saturday?.message}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <InputForm
              register={register}
              icon={<Star size={22} />}
              name="rating"
              placeholder="Rating"
              label="Rating"
              type="number"
              options={{ valueAsNumber: true }}
              errorMessage={errors.rating?.message}
            />
            <InputForm
              register={register}
              icon={<UsersRound size={22} />}
              name="reviews"
              placeholder="Reviews"
              label="Reviews"
              type="number"
              options={{ valueAsNumber: true }}
              errorMessage={errors.reviews?.message}
            />
          </div>
          <Button
            variant="default"
            disabled={isPending || (typeForm === "edit" && !isDirty)}
            className="w-full"
          >
            {childrenButton}
          </Button>
        </form>
      )}
    </Container>
  );
}
