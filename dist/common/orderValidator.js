"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderSchema = exports.createOrderSchema = exports.orderSchema = void 0;
// import { z } from "zod";
const enums_1 = require("./enums");
const zod_1 = __importDefault(require("zod"));
exports.orderSchema = zod_1.default.object({
    id: zod_1.default.number().int().positive().optional(),
    bookId: zod_1.default
        .number()
        .int()
        .positive({ message: "Book ID must be a positive integer" }),
    requesterId: zod_1.default
        .number()
        .int()
        .positive({ message: "Requester ID must be a positive integer" })
        .optional(),
    ownerId: zod_1.default
        .number()
        .int()
        .positive({ message: "Owner ID must be a positive integer" }),
    type: enums_1.availabilityTypeEnum,
    offeredBookId: zod_1.default.number().int().positive().nullable().optional(),
    orderStatus: enums_1.orderStatusEnum.optional(),
    orderDate: zod_1.default.string().optional(),
    createdAt: zod_1.default.string().optional(),
    updatedAt: zod_1.default.string().optional(),
});
// Derived Schemas
exports.createOrderSchema = exports.orderSchema.omit({
    id: true,
    orderDate: true,
    createdAt: true,
    updatedAt: true,
});
exports.updateOrderSchema = zod_1.default.object({
    id: zod_1.default.number().int().positive(),
    bookId: zod_1.default.number().int().positive().optional(),
    requesterId: zod_1.default.number().int().positive().optional(),
    ownerId: zod_1.default.number().int().positive().optional(),
    orderStatus: enums_1.orderStatusEnum.optional(),
    offeredBookId: zod_1.default.number().int().positive().nullable().optional(),
});
