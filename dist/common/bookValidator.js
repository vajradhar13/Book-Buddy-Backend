"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBookSchema = exports.createBookSchema = exports.bookSchema = void 0;
const zod_1 = require("zod");
const enums_1 = require("./enums");
exports.bookSchema = zod_1.z.object({
    id: zod_1.z.number().int().positive().optional(),
    title: zod_1.z.string().min(1, { message: "Title is required" }).max(255),
    author: zod_1.z.string().min(1, { message: "Author is required" }).max(255),
    genre: zod_1.z.string().min(1, { message: "Genre is required" }).max(100),
    ageGroup: zod_1.z.string().min(1, { message: "Age group is required" }).max(50),
    coverImage: zod_1.z
        .string()
        .url({ message: "Cover image must be a valid URL" })
        .max(500),
    availabilityType: enums_1.availabilityTypeEnum,
    status: enums_1.bookStatusEnum,
    ownerId: zod_1.z.number().int().positive(),
    createdAt: zod_1.z.string().optional(),
    updatedAt: zod_1.z.string().optional(),
});
exports.createBookSchema = exports.bookSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
exports.updateBookSchema = exports.bookSchema.partial();
