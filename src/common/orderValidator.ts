import { z } from "zod";
import { orderStatusEnum, availabilityTypeEnum } from "./enums";

export const orderSchema = z.object({
  id: z.number().int().positive().optional(),

  bookId: z
    .number()
    .int()
    .positive({ message: "Book ID must be a positive integer" }),

  requesterId: z
    .number()
    .int()
    .positive({ message: "Requester ID must be a positive integer" }),

  ownerId: z
    .number()
    .int()
    .positive({ message: "Owner ID must be a positive integer" }),

  type: availabilityTypeEnum,

  offeredBookId: z.number().int().positive().nullable().optional(),

  orderStatus: orderStatusEnum,

  orderDate: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

// Derived Schemas
export const createOrderSchema = orderSchema.omit({
  id: true,
  orderDate: true,
  createdAt: true,
  updatedAt: true,
});

export const updateOrderSchema = z.object({
  id: z.number().int().positive(),
  bookId: z.number().int().positive().optional(),
  requesterId: z.number().int().positive().optional(),
  ownerId: z.number().int().positive().optional(),
  orderStatus: orderStatusEnum.optional(),
  offeredBookId: z.number().int().positive().nullable().optional(),
});

export type Order = z.infer<typeof orderSchema>;
export type CreateOrder = z.infer<typeof createOrderSchema>;
export type UpdateOrder = z.infer<typeof updateOrderSchema>;
