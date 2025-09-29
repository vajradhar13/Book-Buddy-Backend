import { z } from "zod";
import { bookStatusEnum, availabilityTypeEnum } from "./enums";

export const bookSchema = z.object({
  id: z.number().int().positive().optional(),

  title: z.string().min(1, { message: "Title is required" }).max(255),
  author: z.string().min(1, { message: "Author is required" }).max(255),
  genre: z.string().min(1, { message: "Genre is required" }).max(100),
  ageGroup: z.string().min(1, { message: "Age group is required" }).max(50),

  coverImage: z
    .string()
    .url({ message: "Cover image must be a valid URL" })
    .max(500),

  availabilityType: availabilityTypeEnum,
  status: bookStatusEnum,

  ownerId: z.number().int().positive(),

  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const createBookSchema = bookSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  ownerId:true
});

export const updateBookSchema = bookSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  ownerId: true
}).partial();

export type Book = z.infer<typeof bookSchema>;
export type CreateBook = z.infer<typeof createBookSchema>;
export type UpdateBook = z.infer<typeof updateBookSchema>;
