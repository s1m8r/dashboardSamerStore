import { roleSchema } from "@/schemas/role";
import z from "zod";
import type {
  FieldErrors,
  UseFormHandleSubmit,
  UseFormRegister,
} from "react-hook-form";

import { usePermissions } from "@/API/permissions";
import ErrorMessage from "@/components/forms/errors";
import { Spinner } from "@/components/ui/spinner";
import InputForm from "@/components/forms/input";
import TextareaForm from "@/components/forms/textarea";
import { UserKey } from "lucide-react";
import TitleContent from "@/components/layout/titleContent";
import { usepermissions } from "@/stores/usePermissions";
import Container from "@/components/layout/container";
import { Button } from "@/components/ui/button";

type roleFormData = z.infer<typeof roleSchema>;

interface Props {
  title: string;
  onsubmit: (data: roleFormData) => void;
  handleSubmit: UseFormHandleSubmit<roleFormData>;
  errors: FieldErrors<roleFormData>;
  register: UseFormRegister<roleFormData>;
  isPending?: boolean;
  isDirty?: boolean;
  childrenButton: string;
  typeForm?: "add" | "edit";
}

export default function Role({
  title,
  handleSubmit,
  onsubmit,
  errors,
  register,
  isPending,
  childrenButton,
  isDirty,
  typeForm = "add",
}: Props) {
  const { data: permissions, isLoading } = usePermissions();
  const translate = {
    [usepermissions.readUser]: "قراءة المستخدمين",
    [usepermissions.createUser]: "إنشاء مستخدم",
    [usepermissions.updateUser]: "تحديث المستخدم",
    [usepermissions.deleteUser]: "حذف المستخدم",

    [usepermissions.readBooks]: "قراءة الكتب",
    [usepermissions.createBooks]: "إنشاء كتاب",
    [usepermissions.updateBooks]: "تحديث كتاب",
    [usepermissions.deleteBooks]: "حذف كتاب",

    [usepermissions.readStores]: "قراءة المتاجر",
    [usepermissions.createStores]: "إنشاء متجر",
    [usepermissions.updateStores]: "تحديث متجر",
    [usepermissions.deleteStores]: "حذف متجر",

    [usepermissions.readOrders]: "قراءة الطلبات",
    [usepermissions.createOrders]: "إنشاء طلب",
    [usepermissions.updateOrders]: "تحديث طلب",
    [usepermissions.deleteOrders]: "حذف طلب",

    [usepermissions.readProducts]: "قراءة المنتجات",
    [usepermissions.createProducts]: "إنشاء منتج",
    [usepermissions.updateProducts]: "تحديث منتج",
    [usepermissions.deleteProducts]: "حذف منتج",

    [usepermissions.readCategories]: "قراءة التصنيفات",
    [usepermissions.createCategories]: "إنشاء تصنيف",
    [usepermissions.updateCategories]: "تحديث تصنيف",
    [usepermissions.deleteCategories]: "حذف تصنيف",

    [usepermissions.readSettings]: "قراءة الإعدادات",
    [usepermissions.createSettings]: "إنشاء إعداد",
    [usepermissions.updateSettings]: "تحديث الإعدادات",
    [usepermissions.deleteSettings]: "حذف الإعدادات",

    [usepermissions.readRoles]: "قراءة الأدوار",
    [usepermissions.createRoles]: "إنشاء دور",
    [usepermissions.updateRoles]: "تحديث دور",
    [usepermissions.deleteRoles]: "حذف دور",

    [usepermissions.readPermissions]: "قراءة الصلاحيات",
    [usepermissions.createPermissions]: "إنشاء صلاحية",
    [usepermissions.updatePermissions]: "تحديث صلاحية",
    [usepermissions.deletePermissions]: "حذف صلاحية",

    [usepermissions.readDashboard]: "عرض لوحة التحكم",

    [usepermissions.usersUpdatePassword]: "تغيير كلمة مرور المستخدم",

    [usepermissions.reportsRead]: "قراءة التقارير",
    [usepermissions.reportsGenerate]: "إنشاء التقارير",
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
        <form onSubmit={handleSubmit(onsubmit)} className="space-y-4">
          <InputForm
            register={register}
            icon={<UserKey size={22} />}
            name="name"
            placeholder="Role Name"
            label="Role Name"
            errorMessage={errors.name?.message}
          />

          <TextareaForm
            register={register}
            name="description"
            placeholder="Description"
            label="Description"
            errorMessage={errors.description?.message}
          />

          <div className="space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Permissions
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {permissions?.map((per) => (
                <label
                  key={per.id}
                  className={`flex items-center gap-2 p-2 rounded-md border cursor-pointer ${
                    errors.permissionIds
                      ? "border-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                      : "border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  <input
                    type="checkbox"
                    value={per.id}
                    {...register("permissionIds")}
                    className="accent-black dark:accent-white"
                  />
                  <span
                    className={`text-sm ${
                      errors.permissionIds
                        ? "text-red-500"
                        : "text-gray-700 dark:text-gray-200"
                    }`}
                  >
                    {translate[per.name]}
                  </span>
                </label>
              ))}
            </div>
            {errors.permissionIds && (
              <ErrorMessage>{errors.permissionIds.message}</ErrorMessage>
            )}
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
