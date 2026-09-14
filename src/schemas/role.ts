import { z } from "zod";

export const roleSchema = z.object({
  name: z.string().min(1, "Role name is required"),
  description: z.string().min(1, "Description is required"),
  permissionIds: z
    .array(z.any())
    .min(1, "Please select at least one permission"),
  permissions: z.array(z.any()).optional(),
  id: z.number().optional(),
  isActive: z.boolean().optional(),
});
