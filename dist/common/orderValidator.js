"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderSchema = exports.createOrderSchema = exports.orderSchema = void 0;
const zod_1 = require("zod");
const enums_1 = require("./enums");
exports.orderSchema = zod_1.z.object({
    id: zod_1.z.number().int().positive().optional(),
    bookId: zod_1.z
        .number()
        .int()
        .positive({ message: "Book ID must be a positive integer" }),
    requesterId: zod_1.z
        .number()
        .int()
        .positive({ message: "Requester ID must be a positive integer" }),
    ownerId: zod_1.z
        .number()
        .int()
        .positive({ message: "Owner ID must be a positive integer" }),
    type: enums_1.availabilityTypeEnum,
    offeredBookId: zod_1.z.number().int().positive().nullable().optional(),
    orderStatus: enums_1.orderStatusEnum,
    orderDate: zod_1.z.string().optional(),
    createdAt: zod_1.z.string().optional(),
    updatedAt: zod_1.z.string().optional(),
});
// Derived Schemas
exports.createOrderSchema = exports.orderSchema.omit({
    id: true,
    orderDate: true,
    createdAt: true,
    updatedAt: true,
});
exports.updateOrderSchema = zod_1.z.object({
    id: zod_1.z.number().int().positive(),
    bookId: zod_1.z.number().int().positive().optional(),
    requesterId: zod_1.z.number().int().positive().optional(),
    ownerId: zod_1.z.number().int().positive().optional(),
    orderStatus: enums_1.orderStatusEnum.optional(),
    offeredBookId: zod_1.z.number().int().positive().nullable().optional(),
});
