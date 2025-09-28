import { z } from "zod";

export const signUpSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(50, { message: "Name cannot exceed 50 characters" }),

  email: z
    .string()
    .email({ message: "Please provide a valid email address" })
    .max(100, { message: "Email cannot exceed 100 characters" }),

  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(100, { message: "Password cannot exceed 100 characters" }),

  avatar: z.string().url({ message: "Avatar must be a valid URL" }).optional(),
});

export const signInSchema = z.object({
  email: z
    .string()
    .email({ message: "Please provide a valid email address" })
    .max(100, { message: "Email cannot exceed 100 characters" }),

  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(100, { message: "Password cannot exceed 100 characters" }),
});

export const updateUserSchema = signUpSchema.omit({
  password: true,
});

export type SignUpUser = z.infer<typeof signUpSchema>;
export type SignInUser = z.infer<typeof signInSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
