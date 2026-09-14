import { z } from "zod";
export const ProductSchema = z.object({
  id: z.number().optional(),
  storeId: z.number("Please select a store"),
  discountPercentage: z
    .number("Discount must be a number")
    .min(0, "Discount must be at least 0%")
    .max(99, "Discount cannot exceed 99%"),
  storeName: z.string().min(1, "Store name is required"),
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Description is required"),
  image: z.string().min(1, "Image URL is required"),
  type: z.string().min(1, "Product type is required"),
  price: z.number("Price must be a number").min(0, "Price must be greater than 0"),
  rating: z.number("Rating must be a number").min(0, "Rating must be greater than 0"),
  badge: z.number("Badge must be a number").min(0, "Badge must be greater than 0"),
  images: z
    .array(z.string().min(1), "Please add at least one image")
    .min(1, "At least one image is required"),
  colors: z
    .array(z.string().min(1), "Please add at least one color")
    .min(1, "At least one color is required"),
  createdAt: z.string().optional(),
});
