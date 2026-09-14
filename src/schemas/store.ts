import { z } from "zod";
import { addressSchema } from "./user";

const openingHoursSchema = z.object({
  sunday: z.string().min(1, "Sunday hours are required"),
  monday: z.string().min(1, "Monday hours are required"),
  tuesday: z.string().min(1, "Tuesday hours are required"),
  wednesday: z.string().min(1, "Wednesday hours are required"),
  thursday: z.string().min(1, "Thursday hours are required"),
  friday: z.string().min(1, "Friday hours are required"),
  saturday: z.string().min(1, "Saturday hours are required"),
});

export const storeSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Store name is required"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(1, "Phone number is required"),
  website: z.string().min(1, "Website URL is required"),
  image: z.string().min(1, "Image URL is required"),
  address: addressSchema,
  owner: z.string().min(1, "Owner name is required"),
  employees: z.number().min(1, "Number of employees must be at least 1"),
  openingHours: openingHoursSchema,
  rating: z
    .number("Rating must be a number")
    .min(1, "Rating must be at least 1"),
  reviews: z
    .number("Number of reviews must be a number")
    .min(1, "Number of reviews must be at least 1"),
  items: z.number().min(1, "Number of items must be at least 1").optional(),
  categories: z.array(z.string()).min(1, "Please select at least one category"),
});
