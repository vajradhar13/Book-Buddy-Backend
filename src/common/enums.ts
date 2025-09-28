import { z } from "zod";

// Enum values matching Prisma schema (PascalCase)
export const orderStatusEnum = z.enum([
  "Pending",
  "Approved",
  "Rejected",
  "Completed",
  "Shared",
]);

export const bookStatusEnum = z.enum([
  "Available",
  "Pending",
  "Approved",
  "Rejected",
  "Shared",
]);

export const availabilityTypeEnum = z.enum(["Free", "Exchange"]);

export type OrderStatus = z.infer<typeof orderStatusEnum>;
